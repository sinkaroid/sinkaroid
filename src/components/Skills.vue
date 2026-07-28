<template>
  <section
    id="skills"
    class="section skills-section"
  >
    <div class="section-header">
      <h2
        class="section-title"
        :style="{ backgroundImage: titleGradient }"
      >
        Skills & Capabilities
      </h2>
      <p class="section-subtitle">
        The spellcraft I practice is forged from boundless imagination and disciplined judgment, allowing even the most ambitious ideas to take shape as tangible creations.
      </p>
    </div>

    <div class="bento-grid">
      <!-- Row 1 LEFT: Capability Constellation (radial nodes, no vanity %) -->
      <div class="bento-card col-span-7 dashboard-card">
        <div class="constellation-header">
          <h3 class="card-title-header">
            Capability Constellation
          </h3>
          <div class="constellation-meta">
            <span class="meta-stat"><strong>{{ competencies.length }}</strong> competencies</span>
            <span class="meta-stat"><strong>{{ totalYears }}+</strong> yrs shipping</span>
          </div>
        </div>
        <p class="card-helper">
          Node size = depth of practice. Filter to explore a single domain.
        </p>
        <div
          class="domain-tabs"
          role="tablist"
        >
          <button
            v-for="d in domains"
            :key="d.id"
            class="domain-chip clickable"
            :class="{ 'is-active': activeDomain === d.id }"
            role="tab"
            :aria-selected="activeDomain === d.id"
            @click="activeDomain = d.id"
          >
            <i :class="d.icon" />
            {{ d.label }}
          </button>
        </div>
        <div class="constellation-wrap">
          <svg
            viewBox="0 0 320 320"
            class="constellation-svg"
            aria-hidden="true"
          >
            <g
              v-for="(c, idx) in filteredCompetencies"
              :key="`ring-${c.name}`"
            >
              <circle
                :cx="nodePos(idx, 'x')"
                :cy="nodePos(idx, 'y')"
                :r="radiusFor(c) + 14"
                fill="none"
                stroke="#d4af37"
                stroke-opacity="0.45"
                stroke-width="1"
              />
              <line
                v-if="idx > 0"
                :x1="nodePos(0, 'x')"
                :y1="nodePos(0, 'y')"
                :x2="nodePos(idx, 'x')"
                :y2="nodePos(idx, 'y')"
                stroke="#d4af37"
                stroke-opacity="0.55"
                stroke-dasharray="2 4"
              />
            </g>
            <g
              v-for="(c, idx) in filteredCompetencies"
              :key="`node-${c.name}`"
            >
              <circle
                :cx="nodePos(idx, 'x')"
                :cy="nodePos(idx, 'y')"
                :r="radiusFor(c)"
                :fill="`url(#node-${idx})`"
                :stroke="c.color"
                stroke-width="1.5"
                stroke-opacity="0.6"
                class="constellation-node"
              />
              <defs>
                <radialGradient
                  :id="`node-${idx}`"
                  cx="40%"
                  cy="40%"
                  r="60%"
                >
                  <stop
                    offset="0%"
                    :stop-color="c.color"
                    stop-opacity="0.95"
                  />
                  <stop
                    offset="100%"
                    :stop-color="c.color"
                    stop-opacity="0.35"
                  />
                </radialGradient>
              </defs>
              <text
                :x="nodePos(idx, 'x')"
                :y="nodePos(idx, 'y') + 4"
                text-anchor="middle"
                font-size="11"
                font-weight="700"
                fill="#ffffff"
                style="font-family: var(--font-display);"
              >{{ c.abbrev }}</text>
              <text
                :x="nodePos(idx, 'x')"
                :y="nodePos(idx, 'y') + radiusFor(c) + 16"
                text-anchor="middle"
                font-size="10"
                fill="currentColor"
                fill-opacity="0.7"
                style="font-family: var(--font-display);"
              >{{ c.name }}</text>
            </g>
          </svg>
        </div>
        <ul class="constellation-legend">
          <li
            v-for="c in filteredCompetencies"
            :key="`legend-${c.name}`"
          >
            <span
              class="legend-swatch"
              :style="{ background: c.color }"
            />
            <span class="legend-name">{{ c.name }}</span>
          </li>
        </ul>
      </div>

      <!-- Row 1 RIGHT: single toggleable tech card with logos -->
      <div class="col-span-5 right-stack">
        <div class="bento-card tech-card">
          <!-- Desktop tab bar -->
          <div
            class="tech-tabs desktop-only"
            role="tablist"
          >
            <button
              v-for="(cat, idx) in skills"
              :key="cat.title"
              class="tech-tab clickable"
              :class="{ 'is-active': activeStack === idx }"
              role="tab"
              :aria-selected="activeStack === idx"
              @click="activeStack = idx"
            >
              <i :class="cat.icon || 'fa fa-code'" />
              <span>{{ cat.title }}</span>
            </button>
          </div>

          <!-- Mobile trigger button (mirrors Portfolio tabs-trigger) -->
          <button
            class="tech-trigger clickable"
            aria-label="Open tech selector"
            aria-haspopup="dialog"
            @click="showTechSheet = true"
          >
            <i :class="activeStackSkills.icon || 'fa fa-code'" />
            <span>{{ activeStackSkills.title }}</span>
            <i class="fas fa-chevron-down tech-trigger-caret" />
          </button>

          <Transition
            name="tech-fade"
            mode="out-in"
          >
            <div
              :key="activeStack"
              class="tech-panel"
            >
              <div class="tech-tags">
                <div
                  v-for="tech in activeStackSkills.info"
                  :key="tech"
                  class="tech-tile"
                  :title="tech"
                >
                  <img
                    v-if="deviconUrl(tech)"
                    :src="deviconUrl(tech)"
                    :alt="tech"
                    class="tech-logo"
                    loading="lazy"
                  >
                  <span
                    v-else
                    class="tech-logo-fallback"
                  >{{ tech.charAt(0) }}</span>
                  <span class="tech-tile-label">{{ tech }}</span>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Mobile Action Sheet (Teleport) -->
          <Teleport to="body">
            <Transition name="action-sheet">
              <div
                v-if="showTechSheet"
                class="action-sheet-overlay"
                @click.self="showTechSheet = false"
              >
                <div
                  class="action-sheet"
                  role="dialog"
                  aria-modal="true"
                >
                  <div class="action-sheet-header">
                    <span class="action-sheet-title">Select Stack</span>
                    <button
                      class="action-sheet-close clickable"
                      aria-label="Close"
                      @click="showTechSheet = false"
                    >
                      <i class="fas fa-times" />
                    </button>
                  </div>
                  <ul class="action-sheet-list">
                    <li
                      v-for="(cat, idx) in skills"
                      :key="cat.title"
                      class="action-sheet-item clickable"
                      :class="{ 'is-active': activeStack === idx }"
                      role="option"
                      :aria-selected="activeStack === idx"
                      @click="selectStack(idx)"
                    >
                      <i :class="cat.icon || 'fa fa-code'" />
                      <span>{{ cat.title }}</span>
                      <i
                        v-if="activeStack === idx"
                        class="fas fa-check check-mark"
                      />
                    </li>
                  </ul>
                  <button
                    class="action-sheet-cancel clickable"
                    @click="showTechSheet = false"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import info from "../../ci/mockRepository";
import { randomGradient } from "../composables/useRandomGradient";

const titleGradient = ref(randomGradient());

const props = defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

watch(() => props.nightMode, () => {
  titleGradient.value = randomGradient();
});

const skills = info.skills || [];

const domains = [
    { id: "all", label: "All", icon: "fa fa-layer-group" },
    { id: "build", label: "Build", icon: "fa fa-hammer" },
    { id: "scale", label: "Scale", icon: "fa fa-bolt" },
    { id: "people", label: "People", icon: "fa fa-people-group" },
    { id: "ship", label: "Ship", icon: "fa fa-rocket" }
];

// depth = relative experience strength (not vanity %)
const competencies = [
    { name: "Backend",       abbrev: "BE", domain: "build",  depth: 9, color: "#6366f1" },
    { name: "Frontend",      abbrev: "FE", domain: "build",  depth: 5, color: "#06b6d4" },
    { name: "Microservices", abbrev: "MI", domain: "scale",  depth: 8, color: "#8b5cf6" },
    { name: "Performance",   abbrev: "PF", domain: "scale",  depth: 7, color: "#10b981" },
    { name: "Teamwork",      abbrev: "TW", domain: "people", depth: 7, color: "#ec4899" },
    { name: "Leadership",    abbrev: "LD", domain: "people", depth: 4, color: "#f59e0b" },
    { name: "Solo Delivery", abbrev: "SD", domain: "ship",   depth: 9, color: "#3b82f6" },
    { name: "CI/CD",         abbrev: "CI", domain: "ship",   depth: 6, color: "#ef4444" }
];

const activeDomain = ref("all");

const filteredCompetencies = computed(() => {
    if (activeDomain.value === "all") return competencies;
    return competencies.filter((c) => c.domain === activeDomain.value);
});

const totalYears = new Date().getFullYear() - 2020;

const activeStack = ref(0);
const activeStackSkills = computed(() => skills[activeStack.value] || skills[0]);
const showTechSheet = ref(false);
const selectStack = (idx) => {
    activeStack.value = idx;
    showTechSheet.value = false;
};

// Devicon slug map (brand name -> devicon slug, optional variant)
const DEVICON_MAP = {
    "TypeScript": "https://skillicons.dev/icons?i=ts",
    "JavaScript": "https://skillicons.dev/icons?i=js",
    "Python": "https://skillicons.dev/icons?i=py",
    "Vue": "https://skillicons.dev/icons?i=vue",
    "Go": "https://skillicons.dev/icons?i=go",
    "Rust": "https://skillicons.dev/icons?i=rust",
    "Docker": "https://skillicons.dev/icons?i=docker",
    "Express": "https://skillicons.dev/icons?i=express",
    "Fastify": "https://skillicons.dev/icons?i=fastify",
    "Cheerio": "https://skillicons.dev/icons?i=js",
    "Flask": "https://skillicons.dev/icons?i=flask",
    "beautifulsoup4": "https://skillicons.dev/icons?i=python",
    "Vue.js": "https://skillicons.dev/icons?i=vuejs",
    "Nuxt.js": "https://skillicons.dev/icons?i=nuxtjs",
    "Reactjs": "https://skillicons.dev/icons?i=react",
    "React": "https://skillicons.dev/icons?i=react",
    "React.js": "https://skillicons.dev/icons?i=react",
    "Next.js": "https://skillicons.dev/icons?i=nextjs",
    "Prisma": "https://skillicons.dev/icons?i=prisma",
    "Sequelize": "https://skillicons.dev/icons?i=sequelize",
    "Django": "https://skillicons.dev/icons?i=django",
    "Nest.js": "https://skillicons.dev/icons?i=nestjs",
    "RabbitMQ": "https://skillicons.dev/icons?i=rabbitmq",
    "GitHub Actions": "https://skillicons.dev/icons?i=githubactions",
    "Travis CI": "travis",
    "Mocha": "https://skillicons.dev/icons?i=ts",
    "Poetry": "https://skillicons.dev/icons?i=python",
    "JSDoc": "https://skillicons.dev/icons?i=js",
    "TypeDoc": "https://skillicons.dev/icons?i=ts",
    "Dockerfile": "https://skillicons.dev/icons?i=docker",
    "Kubernetes": "https://skillicons.dev/icons?i=kubernetes",
    "Bash": "https://skillicons.dev/icons?i=bash",
    "Eslint": "eslint",
    "Hono": "https://hono.dev/images/logo.svg",
    "Graphql": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
    "Elysiajs": "https://elysiajs.com/assets/elysia.svg",
    "Gofiber": "https://skillicons.dev/icons?i=go",
    "Axum": "https://skillicons.dev/icons?i=rust",
    "Redis": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-plain.svg",
    "PostgreSQL": "postgresql",
    "MongoDB": "mongodb",
    "SQLite": "sqlite",
    "Grafana": "grafana",
    "Prometheus": "prometheus",
    "Bun": "bun",
    "NodeJS": "nodejs",
    "Astro": "https://skillicons.dev/icons?i=astro",
    "Jest": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg",
    "Gotest": "go",
    "Swagger": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg",
    "Visual Studio Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
    "Qlty": "https://cdn.prod.website-files.com/689adecfee0272629d1e2767/68a5535e2e68fb7c90d0ed6d_qlty-favicon.png",
    "Antigravity": "https://antigravity.google/favicon.ico",
    "Gemini CLI": "https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg",
    "Claude Code": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/120px-Claude_AI_symbol.svg.png"
};

// Returns full image URL (devicon slug or absolute URL)
const deviconUrl = (name) => {
    const v = DEVICON_MAP[name];
    if (!v) return "";
    if (v.startsWith("http") || v.startsWith("data:")) return v;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${v}/${v}-original.svg`;
};

// radial layout: index 0 = center, others orbit
const nodePos = (idx, axis) => {
    const cx = 160;
    const cy = 160;
    if (idx === 0) return axis === "x" ? cx : cy;
    const orbit = 120;
    const angle = ((idx - 1) / Math.max(1, filteredCompetencies.value.length - 1)) * Math.PI * 2 - Math.PI / 2;
    return axis === "x" ? cx + Math.cos(angle) * orbit : cy + Math.sin(angle) * orbit;
};

const radiusFor = (c) => {
    // map depth 1..10 -> radius 14..28
    return 14 + Math.min(10, Math.max(1, c.depth)) * 1.4;
};


</script>

<style scoped>
.col-span-12 { grid-column: span 12; }
.col-span-7 { grid-column: span 7; }
.col-span-5 { grid-column: span 5; }

@media (max-width: 992px) {
  .col-span-7, .col-span-5 {
    grid-column: span 12;
  }
}

.card-title-header {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: var(--space-6);
}

/* Override grid stretch: prevent cards from matching column heights */
.bento-grid {
  align-items: start;
}

/* Capability Constellation */
.constellation-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
}

.constellation-header .card-title-header {
    margin-bottom: 0;
}

.constellation-meta {
    display: flex;
    gap: var(--space-3);
}

.meta-stat {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.meta-stat strong {
    color: var(--foreground);
    font-weight: 700;
    font-size: 0.95rem;
}

.card-helper {
    font-size: 0.82rem;
    color: var(--muted-foreground);
    margin: 0 0 var(--space-4);
}

.domain-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
}

.domain-chip {
    background: rgba(var(--accent-rgb), 0.06);
    border: 1px solid var(--card-border);
    color: var(--muted-foreground);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.78rem;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.25s ease;
}

.domain-chip:hover {
    color: var(--foreground);
    border-color: rgba(var(--accent-rgb), 0.3);
}

.domain-chip.is-active {
    background: var(--accent);
    color: #ffffff;
    border-color: var(--accent);
    box-shadow: 0 4px 14px rgba(var(--accent-rgb), 0.35);
}

.constellation-wrap {
    display: flex;
    justify-content: center;
    padding: var(--space-3) 0;
}

.constellation-svg {
    width: 100%;
    max-width: 340px;
    height: auto;
    color: var(--foreground);
    animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
}

.constellation-node {
    transition: transform 0.3s ease;
    cursor: pointer;
    transform-origin: center;
    transform-box: fill-box;
}

.constellation-node:hover {
    transform: scale(1.12);
}

.constellation-legend {
    list-style: none;
    margin: var(--space-4) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-2);
}

.constellation-legend li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-size: 0.82rem;
    color: var(--foreground);
    padding: 6px 10px;
    background: rgba(var(--accent-rgb), 0.04);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-md);
}

.legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.legend-name {
    font-weight: 600;
}

/* Single toggleable tech card */
.right-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tech-card {
  padding: var(--space-6) !important;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-height: 420px;
}

.tech-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  background: rgba(var(--accent-rgb), 0.04);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  margin: 0 var(--space-2);
}

.tech-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.25s ease;
  white-space: nowrap;
  min-width: 0;
}

.tech-tab i {
  font-size: 0.85rem;
}

.tech-tab:hover {
  color: var(--foreground);
}

.tech-tab.is-active {
  background: var(--accent);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
}

.tech-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tech-fade-enter-active,
.tech-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.tech-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tech-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Mobile trigger (mirrors Portfolio.vue tabs-trigger) */
.tech-trigger {
  display: none;
  width: 100%;
  justify-content: space-between;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 12px 22px;
  border-radius: var(--radius-full);
  color: var(--foreground);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-blur);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tech-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.tech-trigger .tech-trigger-caret {
  color: var(--muted-foreground);
  font-size: 0.75rem;
}

/* Responsive: trigger on mobile, tabs on desktop */
@media (max-width: 768px) {
    .tech-tabs { display: none; }
    .tech-trigger { display: inline-flex; }
}

/* Action sheet overlay & panel (matches Portfolio.vue) */
.action-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.action-sheet {
  width: 100%;
  max-width: 480px;
  background: var(--bg-app);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 1px solid var(--card-border);
  border-bottom: none;
  padding: var(--space-4);
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  opacity: 1;
}

.action-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-2);
  color: var(--muted-foreground);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.action-sheet-close {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 1.1rem;
  padding: 4px 8px;
  cursor: pointer;
}

.action-sheet-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.04);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--card-border);
}

.action-sheet-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 14px 16px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--foreground);
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid var(--card-border);
}

.action-sheet-item:last-child {
  border-bottom: none;
}

.action-sheet-item:active {
  background: rgba(var(--accent-rgb), 0.08);
}

.action-sheet-item.is-active {
  color: var(--accent);
}

.action-sheet-item .check-mark {
  margin-left: auto;
  color: var(--accent);
}

.action-sheet-cancel {
  width: 100%;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid var(--card-border);
  color: var(--foreground);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-sheet-cancel:hover {
  background: rgba(255, 0, 0, 0.08);
  color: #ef4444;
}

/* Slide-up transition (matches Portfolio.vue) */
.action-sheet-enter-active,
.action-sheet-leave-active {
  transition: opacity 0.25s ease;
}
.action-sheet-enter-active .action-sheet,
.action-sheet-leave-active .action-sheet {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.action-sheet-enter-from,
.action-sheet-leave-to {
  opacity: 0;
}
.action-sheet-enter-from .action-sheet,
.action-sheet-leave-to .action-sheet {
  transform: translateY(100%);
}

.desktop-only { display: flex; }
.mobile-only { display: none; }

@media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: flex !important; }
}

.tech-tags {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
  gap: var(--space-2);
}

.tech-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 6px;
  background: rgba(var(--accent-rgb), 0.04);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  color: var(--foreground);
  text-align: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
  min-height: 76px;
}

.tech-tile:hover {
  background: rgba(var(--accent-rgb), 0.1);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(var(--accent-rgb), 0.15);
}

.tech-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
}

.tech-logo-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.tech-tile-label {
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
}
</style>
