# ScathachGrip/lavafork

ScathachGrip/lavafork is an enterprise-grade, **fault-tolerant**, and **adaptive** fork of Lavalink, providing a production orchestration stack, build toolchain, and observability infrastructure engineered for high-availability audio deployments. Specifically architected to eliminate notorious YouTube playback blocking issues—such as `Clients failed to load`, `400 Bad Request`, and `403 Forbidden`—Lavafork decouples core audio delivery from continuous challenge resolution across four tightly cooperating microservices on an isolated container mesh.

By leveraging an **adaptive** runtime architecture, the system dynamically synthesizes BotGuard Proof-of-Origin (PO) tokens and solves player decipher challenges on-the-fly. Paired with proactive health observation and automated infrastructure verification, the stack guarantees resilient, interruption-free audio streaming for mission-critical bot fleets and distributed media networks.

## The Problems

Deploying and maintaining modern Lavalink clusters against YouTube's evolving anti-bot infrastructure has become severely fragmented and operationally exhausting:

1. **Repetitive & Fragile Manual Workflows**: Orchestrating dynamic PO token generation and cipher deciphering traditionally required manually cloning multiple disparate repositories, configuring detached scripts, and juggling scattered microservices across servers.
2. **Language & Toolchain Mismatch**: For engineers whose primary stacks are **JavaScript/TypeScript, Go, and cloud-native infrastructure**, wrangling JVM ecosystems is a major operational friction point. Managing multi-version JDK environments (JDK 17 build tools vs. JRE 21 runtimes), debugging Gradle wrapper scripts (`./gradlew assemble`), and resolving Kotlin plugin compilation errors introduces unnecessary complexity and host pollution.
3. **Upstream Remote Build Failures (JitPack 404s)**: Relying on runtime plugin downloads via JitPack frequently crashes during cluster initialization. Because JitPack's isolated build sandbox blocks outbound network requests to YouTube during test suites, builds fail remotely and leave operators stranded with runtime `FileNotFoundException` crashes.
4. **Runtime Dependency Sprawl**: Running multiple heterogeneous runtimes (Node.js for `webpo-generator`, Deno for `yt-cipher`, Java for Lavalink) directly on host machines leads to dependency conflicts, unstandardized `.env` file proliferation, and zero centralized observability.

## The Solutions

ScathachGrip/lavafork replaces manual, brittle procedures with an automated, immutable container infrastructure designed for Go-centric operators:

1. **Zero-JVM Build Toolchain**: All Java/Kotlin compilation (Gradle multi-stage builds), Node.js bundling, and Deno static compiling are fully containerized into multi-stage Dockerfiles orchestrated by a native Go toolchain (`main.go`) and GitHub Actions. Operators never need Java, Gradle, Node, or Deno installed on their local machines or production VPS.
2. **Pre-Baked Immutable Artifacts**: The patched YouTube source plugin ([PR #229](https://github.com/lavalink-devs/youtube-source/pull/229) with SABR support from [`ashton045/youtube-source:feat/sabr-support`](https://github.com/ashton045/youtube-source/tree/feat/sabr-support)) is pre-compiled and baked directly into the final `ghcr.io/scathachgrip/lavafork` container alongside the Lavalink binary. No dynamic runtime plugin downloads, no network-dependent startup delays, and zero JitPack failures.
3. **Hardcoded Zero-Env Docker Mesh**: All four microservices communicate over an isolated Docker bridge network (`lavafork-net`) using strictly hardcoded container names and ports in `infrastructure/docker-compose.yml`, eliminating `.env` file sprawl, variable misconfigurations, and secret leakage.
4. **Go-Native Observability & Verification**: Provides an automated Go node verification gatekeeper (`task verify` / `infrastructure/main.go`) that validates DNS mappings, TCP connectivity, and HTTP responses before deployment, paired with a lightweight distroless daemon (`lavafork-nodes`) serving real-time cluster health and a live glassmorphism monitoring dashboard.
