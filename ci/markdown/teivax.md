## The Problems

Managing tag registries across multiple Discord bots is a maintenance nightmare. When a new character-series drops, every bot project must be edited individually — update the list, rebuild, redeploy. Teams maintaining 5, 10, or 20 bots end up copy-pasting the same 100+ character array across repos, creating drift between deployments. One bot gets `"sandrone_(genshin_impact)"`, `"lauma_(genshin_impact)"`, `"anis_(star)_(nikke)"`, and etc.. with correct formatting, another uses a stale alias. There is no single source of truth, no centralized versioning, and no way to propagate updates without touching each codebase by hand.

## The Solutions

@ScathachGrip/teivax decouples the tag registry from all bot code. Instead of embedding character lists in every project, point all your bots at a single HTTP endpoint. Add or update tags in one place — teivax — and every bot picks up the change on its next request. The registry is compile-time constant, served with sub-millisecond latency, and needs no database, no cache warming, and no runtime synchronization. One `cargo build` propagates new characters to every consumer.
