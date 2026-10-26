# ScathachGrip/tune

[tune.scathachbot.xyz](https://tune.scathachbot.xyz/) is the official high-performance, real-time web audio controller and visual dashboard client for **Scathach Bot**, engineered on top of Lavalink audio infrastructure (specifically interfacing with [`@ScathachGrip/lavafork`](https://lavafork.scathach.id) and [`@ScathachGrip/scathach-next`](https://github.com/ScathachGrip)). Built to provide an interactive, zero-latency control plane, Scathach Tune decouples music playback interaction from Discord's chat interface, empowering users across 70,000+ communities to manage and manipulate live audio sessions directly from their browsers.

Operating in tandem with Scathach's distributed microservices mesh, Tune translates browser-driven commands—such as seek operations, real-time volume adjustments, queue reorganizations, and multi-band DSP filter configurations—directly into Lavalink audio frame manipulations without placing overhead on Discord's REST API rate limits.

---

## The Problems

Traditional Discord music bots rely entirely on text-based chat commands (`/play`, `/skip`, `/volume`, `/filter`), creating significant operational bottlenecks and poor user experience:

1. **Chat Clutter & Gateway Bottlenecks**: Executing repetitive actions (like skipping, adjusting volume, or seeking tracks) via Discord slash commands floods text channels with transient embeds and consumes Discord REST API rate limits (strictly capped at 5 requests per 5 seconds per channel).
2. **Lack of Visual Scrubbing & Seek Feedback**: Discord text interfaces offer zero visual representation of audio progress. Seeking to a specific timestamp requires calculating seconds manually (`/seek 02:45`) rather than dragging an interactive slider.
3. **Complex Audio DSP Configuration**: Configuring advanced Lavalink audio equalizers (e.g., Nightcore, 8D audio, Tremolo, Vaporwave, Bass Boost) via CLI commands requires cumbersome syntax flags, making rich audio transformations inaccessible to non-technical listeners.
4. **Authorization & Remote Hijacking Risks**: Typical web dashboards either lack strict Discord voice-state verification or expose unprotected controls, allowing users outside the active voice channel to disrupt sessions or manipulate playback without permission.
5. **Client-Side Progress Drift**: Keeping web client playback indicators synchronized with Lavalink's internal buffer positions across fluctuating network latencies often results in jittery, inaccurate seekbars.

---

## The Solutions

**Scathach Tune** solves these challenges by providing a dedicated, reactive web application that bridges browser interactions directly into the backend audio cluster:

1. **Direct Web-to-Lavalink Control Plane**:
   Player interactions (pause, resume, skip, destroy, volume, seek, filter) are routed over an optimized HTTP API (`/api/player/:guildId/command`), bypassing Discord's chat pipeline entirely. Commands execute with millisecond latency directly against the active Lavalink audio node.

2. **Discord OAuth2 & Voice State Verification**:
   Features a dual-mode access model:
   - **Guest Mode**: Anyone can inspect current playback metadata, queue lists, and audio statuses in read-only mode.
   - **Controller Mode**: Authenticated via Discord OAuth2 (`/api/auth/login`). The backend verifies that the user currently resides in the same voice channel as Scathach Bot before releasing interactive controls, preventing unauthorized playback tampering.

3. **Sub-Frame Audio Interpolation (`requestAnimationFrame`)**:
   Instead of polling the backend constantly or suffering from static timer jumps, the progress seekbar calculates dynamic time deltas via a high-frequency `requestAnimationFrame` loop synced to Lavalink playback state snapshots, delivering fluid 60 FPS seekbar movement without server load.

4. **Curated 48-Filter DSP Audio Equalizer**:
   Includes an extensive suite of 48 real-time audio filters organized into logical categories (Standard, Audio Filters 1, Audio Filters 2). Users can switch between presets like _Nightcore Gaming_, _Daycore_, _8D Music_, _Sound Horeg_, _Dirty Phonk_, _Tokyo Karaoke Bar_, and _Gym Bass_ with a single click.

5. **Multi-Guild Session Multiplexing**:
   Users who share multiple servers with Scathach Bot can seamlessly toggle between active playback sessions across distinct guilds via an integrated server selector with instant search filtering.

6. **Apple-Grade Modern UI with Dual Theming**:
   Built with a clean glassmorphism aesthetic featuring dynamic backdrop blur, tailored HSL color tokens, responsive mobile drawer sheets, real-time toast feedback notifications, and smooth Light/Dark mode toggling.

---

## Key Capabilities

- **Interactive Transport Controls**: Immediate play, pause, skip, stop/destroy, volume level slider (0–100%), and precision track seeking.
- **Rich Track Metadata**: High-resolution artwork display, live elapsed/total timestamps, track titles, and artist credentials.
- **Live Queue Management**: Real-time queue inspection with track removal capabilities and completion triggers.
- **Audio Equalizer Profiles**: Instant one-tap activation across 48 digital signal processing (DSP) filters.
- **Contextual Notification System**: Non-intrusive toast messages reporting track transitions, volume updates, server switches, and filter engagements.
- **Light & Dark Theme Engine**: System-preferred or user-selected theme persistence stored locally with instant CSS token switching.
