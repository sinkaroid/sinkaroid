# ScathachGrip/tristan

High-performance Discord REST API worker in Rust (70k guilds msg scheduler that sits on <4GiB VMs).

A stateless, distributed microservice and scheduler written in **Rust** (tokio), ported 1:1 from the legacy Bun dispatcher. It runs interval-based image messaging across 70,000+ guilds with no WebSocket gateway, no JavaScript runtime, and no garbage collector — a single static binary that boots once, arms 34 scheduled jobs, and drains queued embeds against the Discord REST API through a centralized rate limiter and per-channel lock serialization.

## The Problems

The previous generations of this service (the Discord.js monolith, then the Bun dispatcher) were bottlenecked by the JavaScript runtime itself, not the workload:

1. **Garbage-Collection Overhead**: Both V8 (Node.js) and JavaScriptCore (Bun) manage memory with a tracing GC. At 70k+ guilds, the heap churns through millions of objects, forcing stop-the-world mark-sweep-compact cycles that freeze the single-threaded event loop mid-burst.
2. **Massive Memory Footprint**: discord.js caches every visible guild, role, channel, member, and presence in memory — 4.6 GiB RSS at scale. Even the "lean" Bun rewrite still idles at ~121 MiB and spikes to 77% CPU during delivery bursts.
3. **JIT Warmup & Compiler Overhead**: JavaScript engines burn CPU on baseline compilation, tier-up optimization, and GC bookkeeping — pure overhead for a workload that is 99% HTTP fan-out.
4. **Single-Threaded Event Loop**: One synchronous hiccup (GC sweep, heavy JSON parse) stalls every in-flight request, manifesting as delayed ticks and rate-limit misses under burst load.
5. **Gateway Inefficiency**: The monolith streamed thousands of gateway events per second even while completely idle, wasting hundreds of gigabytes of network bandwidth on events nobody consumed.

## The Solutions

**Tristan** eliminates the entire class of problems by removing the JavaScript runtime altogether — a full 1:1 port of the TypeScript/Bun dispatcher to Rust:

1. **100% Rust, No GC, No JIT**: A single static binary with deterministic, ownership-based memory management. No stop-the-world pauses, no compiler warmup, no hidden allocation churn.
2. **tokio Async Runtime**: Multi-threaded, work-stealing async scheduler that spreads load across CPU cores instead of pinning everything to one event loop.
3. **REST-only, Zero Gateway**: Same architecture as the dispatcher — no WebSocket, no sharding, no caches. Direct `reqwest` calls through a centralized sliding-window rate limiter (45 RPS cap) and per-channel lock serialization (5 req / 5s per channel).
4. **Silent Startup & Non-Blocking Scheduler**: Jobs arm as spawned tokio tasks with random jitter; no interval fires synchronously at boot, and ticks never block the timer.
5. **Native Telemetry**: Prometheus `/metrics` served by axum with `tristan_*`-prefixed gauges mirroring the legacy samplers 1:1.

## Benchmarks

Below is a resource usage comparison between the three generations of this service: the legacy monolithic Discord.js bot, the Bun-based dispatcher, and the Rust-based tristan. All three were benchmarked under identical production workloads (handling interval deliveries across **70,000+ guilds**) on identical host environments over a sustained 3-day (72-hour) uptime window.

### Before

[ScathachGrip/ScathachAuto](https://github.com/ScathachGrip/ScathachAuto) - @discordjs/discord.js

```
CONTAINER ID   NAME               CPU %     MEM USAGE / LIMIT     MEM %    NET I/O          BLOCK I/O         PIDS
c1d835493855   competent_shirley  231.93%   4.624GiB / 7.751GiB   59.66%   182GB / 44.2GB   190MB / 2.11MB    117
```

### After (Second Ascension TS + Bun)

[ScathachGrip/dispatcher](https://github.com/ScathachGrip/dispatcher) - Pure worker + Native Bun

```
CONTAINER ID   NAME                CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O        PIDS
a14e4210179a   dispatcher          77.00%  121.3MiB / 7.751GiB   1.53%   7.24GB / 2.25GB  56.8MB / 389MB  10
```

### After (Third Ascension Rust)

[ScathachGrip/tristan](https://github.com/ScathachGrip/tristan) - Rust

```
CONTAINER ID   NAME         CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O       PIDS
ef48150afb3f   tristan      0.14%     55.53MiB / 7.751GiB   1.67%     1.08GB / 239MB    45.1kB / 52.6MB   10
```

### Key Performance Conclusion (Reduction Rates)

| Metrics          | Discord.js (monolith) | dispatcher (Bun) | tristan (Rust) | JS → Bun   | Bun → Rust | JS → Rust   |
| ---------------- | --------------------- | ---------------- | -------------- | ---------- | ---------- | ----------- |
| **CPU**          | 231.93%               | 77.00%           | 0.14%          | **-66.8%** | **-99.8%** | **-99.9%**  |
| **Memory**       | 4.624 GiB             | 121.3 MiB        | 55.53 MiB      | **-97.4%** | **-54.2%** | **-98.8%**  |
| **NET I/O (RX)** | 182 GB                | 7.24 GB          | 1.08 GB        | **-96.0%** | **-85.1%** | **-99.4%**  |
| **PIDS**         | 117                   | 10               | 10             | **-91.5%** | 0%         | **-91.5%**  |
| **Block I/O**    | 190 MB                | 56.8 MB          | 45.1 kB        | **-70.1%** | **-99.9%** | **-99.98%** |

Takeaways per migration hop:

- **JS → Bun**: The runtime swap alone (V8 + discord.js caches → JavaScriptCore) cut memory by **~97.4%** and network volume by **~96%** — gateway fan-out and full guild caching were dropped first. CPU still hit **77%** on burst because the single-threaded event loop and GC remain.
- **Bun → Rust**: Removing the JavaScript runtime entirely halves memory again (**-54.2%**), crushes CPU to **0.14%** (**-99.8%**) via tokio's multi-threaded work-stealing scheduler with zero GC pauses, and trims network RX to **1.08 GB** (**-85.1%**) while keeping **PIDS at 10**.
- **Overall (JS → Rust)**: Memory **-98.8%**, CPU **-99.9%**, network RX **-99.4%** (182 GB → 1.08 GB), threads **-91.5%** (117 → 10).
