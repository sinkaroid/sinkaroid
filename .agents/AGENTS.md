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
- **Typography**: Sleek, modern font family pairings (e.g., Outfit/Inter/BlinkMacSystemFont).
- **Animations**: CSS-driven micro-interactions, smooth scroll-into-view triggers, and magnetic hover effects.

## Code Standards & Best Practices
- **Vue 3 Components**: Use the Composition API (specifically `<script setup>`) for clean, reactive component code.
- **No Extra Dependencies**: Re-implement simple utility plugins (like go-top button, particles, smooth-scroll, cookie-handling) directly in Vue 3/Vanilla JS to keep the bundle size small and performance peak.
- **Data Integration**: Load mock/generated repository and anime/manga metadata from `/mock` sources.
- **SEO & Accessibility**: Use semantic HTML5 structures, single `<h1>` tag on main views, descriptive title/meta elements, and descriptive `aria-` labels.
