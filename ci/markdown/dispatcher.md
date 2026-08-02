Bun first & high-performance Discord REST API workers (70k guilds msg scheduler that sits on <4GiB VMs).

A stateless, distributed microservice and scheduler architecture built on the Bun runtime. Engineered for massive-scale bot operations, it runs as a multi-client deployment (Primary and Ascension instances) packaged into isolated, highly optimized Docker images. The system distributes interval-based messages to over 70,000+ guilds with an ultra-low memory footprint, comfortably operating on sub-4GiB virtual machines without WebSocket or gateway overhead.

## Architecture

```
+---------------------------------------------------------------------------------+
|                                  Bun Runtime                                    |
|                                                                                 |
|  +----------------------+      Reads Config      +---------------------------+  |
|  |     MongoDB          |----------------------->|   JobDistributor          |  |
|  |     ("jsons" coll)   |                        |   (Scheduled Intervals)   |  |
|  +----------------------+                        +-------------+-------------+  |
|                                                                |                |
|  +----------------------+     Checks Premium                   |                |
|  |     Redis            |<-------------------------------------+                |
|  |     (Legacy Votes)   |                                      |                |
|  +----------------------+                                      v                |
|                                                  +-------------+-------------+  |
|  +----------------------+     Acquires Lock      |   SQLite Lock Manager     |  |
|  |     SQLite.db        |<-----------------------|   (Synchronous Ephemeral) |  |
|  |     (Local DB File)  |                        +-------------+-------------+  |
|  +----------------------+                                      |                |
|                                                                v                |
|  +----------------------+     Exposes Metrics    +-------------+-------------+  |
|  |     Bun.serve()      |<-----------------------|   Centralized Limiter     |  |
|  |     (:4060/metrics)  |                        |   (Global 45 RPS Window)  |  |
|  +----------------------+                        +-------------+-------------+  |
|                                                                |                |
|                                                                v                |
|                                                  +-------------+-------------+  |
|                                                  |   Discord API REST v10    |  |
|                                                  |   (Direct Native Fetch)   |  |
|                                                  +-------------+-------------+  |
|                                                                |                |
+----------------------------------------------------------------+----------------+
                                                                 |
                                                                 v
                                                       +-------------------+
                                                       |    Discord API    |
                                                       | (Channel Message) |
                                                       +-------------------+
```

## The Problems

Scaling a stateful, gateway-connected **Discord.js** monolithic architecture to over 70,000+ guilds introduces severe resource bottlenecks and performance challenges, particularly when the bot's primary role is simply scheduled/interval-based image messaging:

1. **Monolithic Single-Bot Constraint**:
   The legacy architecture operates as a single monolithic bot instance. Splitting scheduled workloads, custom intervals, or scaling delivery across multiple hosts is highly complex due to stateful Gateway connection constraints and lack of instance orchestration.
2. **Massive Memory Footprint (RAM Bloat)**:
   Discord.js is designed as an Object-Oriented Programming (OOP) library that maintains persistent caches in-memory for all visible objects—guilds, roles, channels, members, and presences. At a scale of 70k+ guilds, keeping millions of JavaScript objects cached on the Node.js V8 heap quickly balloons memory usage to **16+ GB**, making it impossible to host the bot on cost-effective, low-spec VPS/VM environments.
3. **Stop-the-World Garbage Collection (GC) Loops**:
   As memory consumption increases, the V8 garbage collector is forced to trigger heavy, synchronous GC sweeps (like mark-sweep-compact) to reclaim memory. Because the Node.js/V8 event loop is single-threaded, these sweeps completely block execution. The blocked event loop causes websocket heartbeat timeouts, resulting in persistent gateway disconnection loops.
4. **Extreme Network & CPU Overhead**:
   A gateway-connected bot must continuously ingest thousands of events per second (e.g. typing events, presence changes, member updates) even if the bot is completely passive between scheduled interval deliveries. This results in continuous high CPU usage and hundreds of gigabytes of wasted network bandwidth.
5. **Local Mutex/Cooldown Limitations**:
   Using simple in-memory trackers (`Set` or `setTimeout`) for delivery locks and guild strikes creates race conditions when scaling, triggers memory fragmentation, and causes duplicate deliveries.

---

## The Solutions

**Scathach Dispatcher** resolves these scaling issues by stripping away the stateful websocket gateway architecture and replacing it with a specialized, event-loop-friendly scheduler built on the high-performance **Bun runtime**:

1. **Microservices & Multi-Bot Architecture**:
   The dispatcher is designed from the ground up as a decentralized microservice deploying multiple bot client instances (Primary and Ascension clients). This allows for dynamic workload distribution across independent Docker containers, letting you scale horizontal instances seamlessly without duplicate message delivery. The system is inherently future-proof, allowing for the effortless integration of new bot types and expanded client fleets
2. **100% Stateless & Gateway-less Execution**:
   The bot no longer connects to the Discord Gateway or maintains any WebSocket connections. By entirely eliminating sharding, gateway heartbeats, and in-memory caches, the memory footprint is reduced to a bare minimum.
3. **High-Throughput Burst Scheduler (`JobDistributor`)**:
   Instead of listening for gateway events, a centralized distributor reads scheduled interval configurations and target channels from MongoDB (via a lightweight, native `MongoSmol` driver to query the `"jsons"` collection). Pending delivery tasks are distributed as high-velocity batch operations upon interval triggers.
4. **Centralized Global Rate Limiter**:
   To safely send message bursts across 70,000+ guilds without getting blacklisted or banned by Discord, the outbound REST proxy executes requests through a sliding-window rate limiter. This ensures the dispatcher stays strictly under the global threshold (45 RPS vs Discord's 50 RPS limit) and handles per-route bucket limits dynamically.
5. **SQLite-Backed Ephemeral Lock Manager**:
   A synchronous SQLite-backed database (`sqlite.db` using Bun's native `bun:sqlite`) manages channel-level locks, rate limit cooldowns, and strike tracking. This prevents concurrent delivery anomalies and replaces unstable in-memory or Redis-based timeout locks.
6. **Native Bun Prometheus Telemetry**:
   A lightweight, zero-overhead `/metrics` endpoint is exposed directly via native `Bun.serve()` on port 4060. It tracks CPU usage, RAM allocations (RSS/Heap/ArrayBuffers), Event Loop lag, rate limiter queues, and real-time delivery success/failure statistics.

## RateLimiter & Sequential Channel Queueing

To prevent parallel request bursts on the same Discord channel (violating Discord's strict channel rate limit of **5 requests per 5 seconds per channel**), the outbound REST client uses a sequential lock queue per channel ID.

### Why this is necessary (The 5 requests / 5 seconds rule):

Discord enforces a strict rate limit bucket of **5 requests per 5 seconds** for sending messages (`POST /channels/{channel.id}/messages`).

- **The Issue**: Under a concurrent execution model (`Promise.all`), if multiple jobs (e.g. 10 jobs) trigger simultaneously for the same channel, they all send requests in the same millisecond. Because the first request hasn't finished, the limiter has no bucket headers yet, meaning all 10 requests bypass the rate limiter checks and hit Discord at once. This triggers an immediate HTTP 429 Rate Limit error.
- **The Solution**: By enforcing a lock per `channelId` (`globalLimiter.acquireChannelLock`), we serialize requests targeting the same channel. Subsequent requests wait for the preceding request to finish and parse the updated `x-ratelimit-remaining` headers, ensuring no request is sent if the bucket is exhausted.

### Sequential Request Workflow:

```text
GenshinJob (Job A)          NarutoJob (Job B)             RateLimiter                 Discord API
      |                           |                            |                           |
      |-- sendMessage() --------->|                            |                           |
      |-- acquireChannelLock() ------------------------------->|                           |
      |   (Lock Acquired)         |                            |                           |
      |                           |-- sendMessage() ---------->|                           |
      |                           |-- acquireChannelLock() --->|                           |
      |                           |   (Queued, waiting...)     |                           |
      |                           |                            |                           |
      |-- POST /messages ----------------------------------------------------------------->|
      |<------------------------------------------------------------- HTTP 200 (Remaining: 4)
      |-- noteDiscordHeaders() ------------------------------->|                           |
      |-- Release Lock --------------------------------------->|                           |
      |                           |                            |                           |
      |                           |<-- (Released from Queue) --|                           |
      |                           |-- waitRouteBucket() ------>|                           |
      |                           |   (Reads remaining: 4)     |                           |
      |                           |                            |                           |
      |                           |-- POST /messages ------------------------------------->|
```

### Detailed Workflow Steps:

1. **Acquiring Channel Lock**: When a job dispatches a message, it requests a lock for the target `channelId` through `globalLimiter.acquireChannelLock(channelId)`.
2. **Serialization**: If another request for the same `channelId` is already in flight, subsequent requests await the previous request's completion Promise. Different channels execute completely in parallel.
3. **Executing Request**: The active request waits for the route-specific bucket slots (`waitRouteBucket`) and global slots, then sends the HTTP fetch request to Discord.
4. **Header Annotation & Release**: Upon receiving a response, the Discord rate limit headers (such as `x-ratelimit-remaining` and `x-ratelimit-reset-after`) are parsed and recorded via `noteDiscordHeaders`. The lock is then released, freeing the next queued task for that channel.
5. **Throttling Queue**: The next task wakes up, checks the newly updated bucket status, sleeps if the remaining requests count is 0, and then executes its request safely.

---

## Benchmarks

Below is a resource usage comparison between the legacy monolithic Discord.js bot and the new lightweight Bun-based dispatcher service. Both setups were benchmarked under identical production workloads (handling interval deliveries across **70,000+ guilds**) on identical host environments over a sustained 3-day (72-hour) uptime window.

### Before

[ScathachGrip/ScathachAuto](https://github.com/ScathachGrip/ScathachAuto) - @discordjs/discord.js

```
CONTAINER ID   NAME               CPU %     MEM USAGE / LIMIT     MEM %    NET I/O          BLOCK I/O         PIDS
c1d835493855   competent_shirley  231.93%   4.624GiB / 7.751GiB   59.66%   182GB / 44.2GB   190MB / 2.11MB    117
```

### After

[ScathachGrip/dispatcher](https://github.com/ScathachGrip/dispatcher) - Pure worker + Native Bun

```
CONTAINER ID   NAME                CPU %   MEM USAGE / LIMIT     MEM %   NET I/O          BLOCK I/O        PIDS
a14e4210179a   dispatcher          77.00%  121.3MiB / 7.751GiB   1.53%   7.24GB / 2.25GB  56.8MB / 389MB  10
```

### Key Performance Conclusion (Reduction Rates)

By migrating from the monolithic Discord.js client to the Bun-based dispatcher:

- **Memory (RAM) Usage dropped by ~97.38%** (decreasing from **4.624 GiB** to **121.3 MiB**, freeing up **4.50 GiB** of VM memory).
- **CPU Overhead dropped by ~66.80%** (decreasing from **231.93%** to **77.00%** load during peak burst delivery, while remaining idle at ~0% between interval cycles).
- **Network I/O Volume dropped by ~96.02%** (decreasing from **182 GB** to **7.24 GB** by eliminating heavy gateway event streaming and cache synchronizations).
- **Process Threads (PIDS) dropped by ~91.45%** (reducing from **117** to **10** active threads, eliminating thread context-switching overhead).

---

### Component Breakdown

1. **Job Distributor (`src/queue/jobDistributor.ts`)**:
   - Manages execution schedules for all 30+ active jobs (Free, Premium, and Imageboard).
   - Polls MongoDB configurations and queues tasks without immediate execution on startup (silent startup).
2. **Central Rate Limiter (`src/discord/limiter.ts`)**:
   - Coordinates outbound HTTP requests to match Discord's rate-limiting buckets and global limits.
   - Enforces a centralized 45 RPS window for stable high-throughput bursts.
3. **SQLite Lock Manager (`src/discord/limiter.ts` & SQLite)**:
   - Uses a local SQLite table to synchronously acquire ephemeral locks for active delivery channels.
   - Saves delivery status and automatically flags non-premium or non-vote channel failures to avoid duplicate attempts.
4. **MongoSmol Database Layer (`src/utils/mongosmol.ts`)**:
   - A lightweight, zero-dependency official MongoDB driver wrapper.
   - Explicitly targets the `"jsons"` collection to retrieve configurations safely with aggressive reconnection handling.
5. **Observability Endpoint (`src/metrics/`)**:
   - Bundles native CPU, RAM, GC, and Event Loop Lag metrics into a Prometheus-compatible endpoint.
   - Exposed natively via `Bun.serve()` at port `4060/metrics`.

## Decentralized Premium across all clients

To prevent direct database-level polling and eliminate the need to share main MongoDB Atlas (`cluster0.obqpe.mongodb.net`) credentials across all containerized microservice nodes, premium status verification is served via a decentralized API layer:

- **Centralized Status API**: The production MongoDB Atlas cluster exposes user/server statuses through a central, secure API endpoint (`https://scathachbot.xyz/api/<redacted>`).
- **Async Multi-Client Hydration**: All active client instances (`primary`, `second_ascension`, and `third_ascension` running in separate Docker containers) fetch this JSON payload periodically via asynchronous HTTP GET requests.
- **In-Memory TTL Caching**: The resolved premium lists (containing basic donators, strong donators, and premium server IDs) are cached locally inside each microservice's memory with a 5-minute TTL to ensure zero database lookup latency during rapid interval ticks.

```text
   +-------------------------------------------------------------+
   |                        MongoDB Atlas                        |
   |                (cluster0.obqpe.mongodb.net)                 |
   +------------------------------+------------------------------+
                                 |
                                 | (Database Source)
                                 v
   +-------------------------------------------------------------+
   |                         API Endpoint                        |
   |           (https://scathachbot.xyz/api/<redacted>)          |
   +-------------------------------------------------------------+
             |                   |                   |
         (HTTP GET)          (HTTP GET)          (HTTP GET)
             v                   v                   v
   +-----------------+   +-----------------+   +-----------------+
   |     primary     |   |     second_     |   |     third_      |
   |                 |   |    ascension    |   |    ascension    |
   |   (Port 4060)   |   |   (Port 4061)   |   |   (Port 4062)   |
   +-----------------+   +-----------------+   +-----------------+
```

## Runtime isolation

Instances are dynamically optimized at container startup based on the `ENABLE_METRICS` flag to balance memory and CPU:

- **Primary Instance (`ENABLE_METRICS=true` / Big Bot)**:
  - Optimized for **Memory Efficiency**.
  - Automatically disables JIT compilers (`BUN_JSC_useJIT=0`) and Gigacage to minimize internal compiler memory allocation.
  - Executed with Bun's `--smol` runtime option, forcing JavaScriptCore to run in a memory-constrained mode with aggressive Garbage Collection (GC) cycles.
  - Minimizes RAM usage to **~39MB RSS** at the expense of higher CPU interpretation overhead.

- **Ascension Instances (`ENABLE_METRICS=false` / Small Bots)**:
  - Runs with standard JSC JIT compiler enabled.
  - Executed without the `--smol` flag to utilize default JSC heap allocations and normal GC pacing.
  - Prioritizes performance and raw execution speed, keeping CPU usage extremely low (**<1.5% idle**) with a standard memory footprint (**~50MB RSS**).

```text
                  +---------------------------+
                  |    Container Startup      |
                  +-------------+-------------+
                                |
                  +---------------------------+
                  |   Client ENABLE_METRICS   |
                  +-------------+-------------+
                     /                     \
            (true)  /                       \  (false)
                   /                         \
   +-----------------------+         +-----------------------+
   |   Primary (Big Bot)   |         | Ascension (Small Bot) |
   +-----------------------+         +-----------------------+
   | - JIT Compilers: OFF  |         | - JIT Compilers: ON   |
   | - Gigacage: OFF       |         | - Gigacage: Default   |
   | - /metrics: Active    |         | - /metrics: Disabled  |
   +-----------+-----------+         +-----------+-----------+
               |                                 |
               v                                 v
   +-----------------------+         +-----------------------+
   |   Memory-Optimized    |         |     Non-Optimized     |
   |  ~39MB RAM / ~89% CPU |         | ~50MB RAM / <1.5% CPU |
   +-----------------------+         +-----------------------+
```
