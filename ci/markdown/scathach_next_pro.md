A stateless, highly distributed microservice built on top of the [@disgoorg/disgo](https://github.com/disgoorg/disgo). Designed for high availability and low overhead, it is packaged as a secure, distroless container and leverages Lavalink as its robust audio streaming backend to deliver seamless concurrent performance at scale.

## Architecture

```
+--------------------------------------------------------------------+
|                   Go Runtime (disgoorg/disgo)                      |
|                                                                    |
|  +--------------------+        +--------------------+              |
|  |   Config Loader    |------->|    Bot Instance    |              |
|  |  (Global+Instance) |        | (Auth Bifurcated)  |              |
|  +--------------------+        +---------+----------+              |
|                                          |                         |
|  +--------------------+                  v                         |
|  |  Database (Redis   |        +---------+----------+              |
|  |    + MongoDB)      |<------>|   Command Router   |              |
|  +--------------------+        +---------+----------+              |
|                                          |                         |
|  +--------------------+                  v                         |
|  |  Metrics/Metrics   |        +---------+----------+              |
|  |  (:4012 / :4013)   |        |   Music Manager    |              |
|  +--------------------+        | (Queue + Lavalink) |              |
|                                +---------+----------+              |
|                                          |                         |
|  +--------------------+                  v                         |
|  |   Lavalink Node    |<-----------------+                         |
|  |  (Disgolink/v4)    |                                            |
|  +--------------------+                                            |
|                                                                    |
+----------------------------------+---------------------------------+
                                   |
                +------------------+------------------+
                |                                     |
                v                                     v
  +---------------------------+         +---------------------------+
  |     second_ascension      |         |      third_ascension      |
  | Port 4012                 |         | Port 4013                 |
  | Full Pro check            |         | Strong/True only          |
  | (checks basic, strong, &  |         | (checks strong & server   |
  |  server tiers + redis)    |         |  tiers + redis, no basic) |
  +---------------------------+         +---------------------------+
                |                                     |
                +------------------+------------------+
                                   |
                                   v
                         +--------------------+
                         |    Discord API     |
                         | (Gateway + Voice)  |
                         +--------------------+
```

## Instance Layering (Config Merge)

```
config.global.json          config.{instance}.json
+--------------------------+  +------------------+
| MongoDB URI              |  | BOT_TOKEN        |
| Redis URIs               |  +------------------+
| Lavalink Nodes           |         |
| Emojis & Messages        |         |
| UI Strings               |         v
+--------------------------+  Overlay (non-zero wins)
            |                       |
            +----------->-----------+
                          |
                          v
                   Final Config
```

## The Problems

Porting a legacy Node.js premium Discord bot (ScathachBot_Pro_2 & Pro 3) to a modern Go codebase introduced several architectural challenges:

1. **Monolithic Single-Bot Constraint**:
   The legacy architecture operates as a single monolithic bot instance. Splitting scheduled workloads, custom intervals, or scaling delivery across multiple hosts is highly complex due to stateful Gateway connection constraints and lack of instance orchestration.

2. **Coupled Premium Tiers in a Single Binary**:
   The original Node.js bots had two separate instances ("Pro 2" for full premium, "Pro 3" for strong/truestrike-only), but the Go rewrite shared a single auth function. Without a bifurcation mechanism, the third instance would incorrectly authorize basic `ngocok` tier users.

3. **Lavalink Metadata Loss on Track Start**:
   Erela.js (legacy) preserved track metadata through the play lifecycle, but `disgolink/v4` re-decodes tracks from an encoded string on `TrackStart` events. Any in-memory modifications (title, artwork URL, ASMR metadata) are lost, requiring external metadata storage.

4. **Configuration Drift Between Environments**:
   Legacy bots used environment variables with JSON config files, creating inconsistency between development, staging, and production. Tokens and infra settings were mixed, risking credential leaks.

5. **Hardened Container Security for Distroless**:
   Distroless images lack shells (`wget`/`curl`/`nc`) and writable filesystems. The Go runtime requires a writable `/tmp`, standard healthcheck approaches fail, and dropping all capabilities with `cap_drop: ALL` breaks familiar deployment patterns.

6. **Multi-Stage Docker Build with Variable Substitution**:
   Alpine's BusyBox `grep` lacks `-P`/`-oP` flags used by GNU grep, so version extraction in `-ldflags` failed silently. BuildKit's ARG scope rules in multi-stage builds require explicit per-stage redeclaration.

7. **Cross-Instance Binary Management**:
   A single Dockerfile must produce two separate images from a shared codebase, each containing only its own binary. The ENTRYPOINT must be a fixed path (`/app/run`) for compose-driven dispatch, yet JSON form does not support `${VAR}` substitution.

## The Solutions

**Scathach Next Pro** resolves these issues with a Go-native, dual-instance architecture:

1. **Microservices & Multi-Bot Architecture**:
   The dispatcher is designed from the ground up as a decentralized microservice deploying multiple bot client instances (Primary and Ascension clients). This allows for dynamic workload distribution across independent Docker containers, letting you scale horizontal instances seamlessly without duplicate message delivery. The system is inherently future-proof, allowing for the effortless integration of new bot types and expanded client fleets.

2. **Instance-Aware Auth Bifurcation**:
   The `Bot` struct carries an `IsThirdAscension` flag that drives `IsPremiumUserOrGuild()`. Third Ascension skips the `ngocok` check within the premium status flow, authorizing only Redis free upgrades, and the `strong`/`truestrike` tiers returned by the remote API. Auth flows are bifurcated at the command route level by propagating `r.bot.IsThirdAscension` as `skipNgocok`.

3. **External Track Metadata Store**:
   A `MusicManager.TrackASMRMeta map[string]*ASMRTrack` keyed by Lavalink track URI preserves ASMR metadata (rating, circle, circle, type, tags, poster, language) across `TrackStart` re-decode. `ResolveTrackTitle()` reads this map for "ASMR Part N - Title" formatting.

4. **Global + Instance Config Merge**:
   Config split into `config.global.json` (shared infra: MongoDB, Redis, Lavalink, emojis, UI strings) and `config.{instance}.json` (only `BOT_TOKEN`). `LoadConfig()` recursively merges: non-zero instance fields override global; zero/empty stays from global. No token mix, no drift.

5. **Security-Hardened Container Deployment**:
   - Multi-stage build produces a `gcr.io/distroless/static-debian12:nonroot` image
   - Read-only rootfs (`read_only: true`) with `tmpfs: /tmp` for Go runtime writes
   - `cap_drop: ALL` + `no-new-privileges:true` for zero-extra-capability execution
   - `json-file` logging driver with rotation (10 MB, 3 files)
   - No healthcheck (distroless lacks `wget`/`curl`/`nc` — monitor via external port probes)

6. **BuildKit-Compatible Dockerfile**:
   - Version extraction uses `grep -oE` + `cut` instead of GNU-only `grep -oP`
   - ARG is re-declared in each stage (`ARG TARGET=second_ascension`) with explicit default
   - Runtime stage copies only the built binary (`COPY --from=builder /out/${TARGET} /app/run`)
   - `ENTRYPOINT ["/app/run"]` in JSON form (no substitution; compose `command:` passes the config path)

7. **CI/CD with Parallel Matrix Builds**:
   - GitHub Actions workflow in `.github/workflows/dockerized.yml`
   - Matrix parallelism: `second_ascension` and `third_ascension` build simultaneously
   - Tags: semver, latest (master only), short-commit SHA
   - GHCR push via `docker/build-push-action@v6` with GHA cache backend

---

## Benchmarks

Below is a resource usage comparison between the legacy monolithic [@discordjs/discord.js](https://github.com/discordjs/discord.js) implementation and its replacement, [@disgoorg/disgo](https://github.com/disgoorg/disgo). Both setups were benchmarked under identical production workloads on identical host environments over a sustained 7-day (168-hour+) uptime window, with metrics collected via `docker stats` covering CPU, memory, network I/O, block I/O, and process count. The goal was to measure real-world steady-state behavior under long-running production load, rather than synthetic or cold-start figures.

### Before

[ScathachGrip/bot2](https://github.com/ScathachGrip/bot2) - @discordjs/discord.js  
[ScathachGrip/bot3](https://github.com/ScathachGrip/bot3) - @discordjs/discord.js

```

CONTAINER ID     NAME                 CPU %    MEM USAGE / LIMIT      MEM %    NET I/O          BLOCK I/O        PIDS
be4c9aa416d1     wizardly_ritchie     0.16%    219.6MiB / 15.61GiB    1.37%    980MB / 103MB    39.4MB / 2.48MB   62
425bb418463bc    interesting_shamir   0.27%    232.5MiB / 15.61GiB    1.45%    1.08GB / 108MB   94.9MB / 2.47MB   62
```

### After

[ScathachGrip/scathach-next-pro](https://github.com/ScathachGrip/scathach-next-pro) - @disgoorg/disgo

```
CONTAINER ID   NAME                        CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O        PIDS
f64c3a288388   scathach-third_ascension    0.14%     10.53MiB / 15.61GiB   0.07%     487MB / 104MB     28.7kB / 0B       12
ed3ee6a10405   scathach-second_ascension   0.10%     11.99MiB / 15.61GiB   0.08%     616MB / 196MB     344kB / 0B        12
```

### Key Performance Conclusion (Reduction Rates)

By migrating from the monolithic Discord.js client to the [@disgoorg/disgo](https://github.com/disgoorg/disgo) Go runtime:

- **Memory (RAM) dropped by ~95.02%** — from **452.1 MiB** (two Node.js instances) to **22.52 MiB** (two Go instances), freeing ~430 MiB of VM memory.
- **CPU (7-day sustained avg) dropped by ~44.19%** — from **0.43%** to **0.24%**, with no gateway event parsing overhead.
- **Network I/O (7-day cumulative) dropped by ~38.22%** — from **2.27 GB** to **1.40 GB**, reducing gateway and REST traffic via Disgo's lightweight transport.
- **Process threads (PIDS) dropped by ~80.65%** — from **124** to **24**, eliminating thread context-switching overhead from Node.js event loop workers.
- **Block I/O (7-day cumulative) dropped by ~99.73%** — from **139.25 MB** to **0.37 MB**, a side effect of distroless static binaries with no filesystem chatter.

---

### Component Breakdown

1. **Bot Instance** (`internal/bot/bot.go`): Manages Disgo client lifecycle, event routing, guild join/leave. Initializes Lavalink voice forwarding, slash command registration, and the Prometheus `/metrics` handler.

2. **Config Loader** (`internal/config/config.go`): Two-file merge. Loads `config.global.json` first, then `config.{instance}.json` from the same directory. Non-zero instance fields override global; zero/empty keeps global value.

3. **Database** (`internal/database/db.go`): Redis for premium upgrade checks and 24/7 key lookups; MongoDB for command prefix persistence, command usage stats, and automation arrays. Premium user/guild validation is handled via the remote API.

4. **Command Router** (`internal/commands/commands.go`): Central dispatcher with custom `IsPremiumUserOrGuild(ctx, userID, guildID, skipNgocok)` permission check. Routes to Music (`music.go`) and General (`general.go`, Help).

5. **Music / Lavalink** (`internal/music/lavalink.go`): Disgolink-v4 integration with queue manager, now-playing embed lifecycle, event handlers (`onTrackStart`, `onTrackEnd`), and per-guild state. ASMR metadata injected via `TrackASMRMeta` map.

6. **Audio Filters** (`internal/music/filters.go`): Translates custom commands (Nightcore, 8D, Daycore, Bass Boost, Vaporwave, etc.) into Lavalink equalizer/filter payloads.

7. **ASMR Station** (`internal/music/asmr.go` + `asmr_data.json`): Station selector, paginated browse, metadata injection for 126 KB of embedded station data (titles, files, posters, tags, languages).

8. **Metrics** (`internal/metrics/metrics.go`): Prometheus counters for tracks played, skipped, filters applied, and command usage. Exposed on port 4012/4013 at `/metrics`.
