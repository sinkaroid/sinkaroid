# Project Rules: Sinkaroid Portfolio

This document outlines the coding standards, styling conventions, and architecture rules for the Sinkaroid Portfolio project migration and redesign.

## Core Tech Stack
- **Framework**: Vue 3 (Latest)
- **Runtime & Package Manager**: Bun
- **Bundler**: Vite
- **Styling**: Vanilla CSS with custom CSS variables (3-layer Design Token architecture)
- **State/Routing**: Vue Router 4 (Latest)

## Design & Aesthetics (Modern 2026 Style)
- **Layout**: Bento Grid structure for portfolio items, skills, anime list, and contact sections.
- **Visuals**: Glassmorphism, smooth gradients, subtle drop shadows, custom CSS transitions.
- **Theme**: Premium light/dark modes with cohesive HSL-based color palettes.
- **Typography**: Sleek, modern font family (Poppins).
- **Animations**: CSS-driven micro-interactions, smooth scroll-into-view triggers, and magnetic hover effects.

## Code Standards & Best Practices
- **Vue 3 Components**: Use the Composition API (specifically `<script setup>`) for clean, reactive component code.
- **No Extra Dependencies**: Re-implement simple utility plugins (like go-top button, particles, smooth-scroll, cookie-handling) directly in Vue 3/Vanilla JS to keep the bundle size small and performance peak.
- **Data Integration**: Load ci/generated repository and anime/manga metadata from `/mock` sources.
- **SEO & Accessibility**: Use semantic HTML5 structures, single `<h1>` tag on main views, descriptive title/meta elements, and descriptive `aria-` labels.
- **JavaScript Formatting (ESLint Compliance)**:
  - **Strings**: Always use **double quotes (`"`)** for standard string literals. Only use template literals (backticks) when string interpolation is actually needed. Avoid single quotes (`'`).
  - **Indentation**: 
    - Standard indentation throughout the project is **4 spaces**.
    - For `switch-case` statements in JavaScript, indent the `case` blocks exactly to the same level as the `switch` statement (e.g., 8 spaces if switch is at 8 spaces, rather than 12 spaces).
    - For `.vue` files, the ESLint `indent` rule is explicitly set to `"off"` to avoid linting conflicts.
  - **Semicolons**: Always end statements with semicolons (enforced by `semi: ["error", "always"]`).
  - **Verification**: Whenever any code changes are made, you **MUST** run the lint verification command (`bun run lint`) to ensure ESLint compliance.
- **Directory Layouts & Image Logic**:
  - OSS assets go to `assets/oss` / `public/assets/oss`, outputs save to `ci/data_oss.json`.
  - SAS assets go to `assets/sas` / `public/assets/sas`, outputs save to `ci/data_oss_sas.json`. Exclude `stargazers_count`.
  - Private repositories must skip Open Graph downloads to preserve local images (as GitHub's CDN returns a generic logo anonymously).
  - If a private repository lacks a local image, dynamically generate an SVG preview card (featuring custom background gradients, name, wrapped description, private badge, and language indicator) and convert it to WebP via `sharp`.
- **API Rate Limiting**:
  - Include `2.5s` delay between sequential loop steps.
  - Implement progressive backoff (starting at `5s`) on 429 errors.
- **Command Execution Constraints**:
  - AI/Coder agents are **ONLY** allowed to run linting commands (such as `bun run lint`) to verify ESLint compliance. AI agents are **NOT ALLOWED** to run any other terminal commands (such as data sync scripts, dev servers, or build commands); these must be run by the USER.

## Agent Behavior Rules (Lessons Learned)

> [!IMPORTANT]
> These rules exist because the AI agent repeatedly wasted time and annoyed the user. Read and obey.

- **Trust user-provided URLs blindly**. If the user pastes an image URL, an API endpoint, or any asset link, use it directly. NEVER re-validate with HEAD/curl to "confirm 200". The user already tested it. Re-validating wastes tokens and signals distrust.
- **Favicons are HTML-discoverable, not path-conventional**. When hunting for a brand icon (logo, mark, favicon), DO NOT guess paths like `/favicon.ico`, `/logo.svg`, `/assets/logo.png`. Real-world favicons live in `<link rel="icon">`, `<link rel="apple-touch-icon">`, or `<meta property="og:image">` inside the HTML head. Use `curl` to fetch raw HTML and parse these tags. Tools that convert HTML to markdown (e.g. `read_url_content`) silently DROP these tags, so they are useless for favicon hunting.
- **Read root project files first, before acting**. Before editing code in a workspace, check for `AGENTS.md`, `README.md`, `package.json`, and any config files at the workspace root. The user already pointed at "AGENTS.md" multiple times — locate it before asking where it lives.
- **Stop counter-proposing when the user gives a direct command**. If the user says "hapus ini" / "kosongin value" / "pakai URL ini" — execute immediately. Do not propose alternatives ("bagusnya empty atau data URI?"), do not validate ("tapi gw cek 200 dulu ya"), do not revert-then-reapply. One-shot edit, move on.
- **Diagnose the runtime, not the script**. When scripts fail with HTTP errors that `curl`/native `fetch` do NOT produce, suspect the HTTP client adapter. In Bun, `axios` CJS adapter triggers 504 Gateway Timeout on Jikan API even though the same URL returns 200 via `fetch` or `curl`. **Use Bun native `fetch()` instead of `axios`** in any data-sync script running under Bun. Wasted hours chasing flaky Jikan responses that were actually axios-vs-fetch transport differences.
