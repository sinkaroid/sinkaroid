<template>
  <section class="section skills-section" id="skills">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">Skills & Capabilities</h2>
      <p class="section-subtitle">
        The spellcraft I practice is forged from boundless imagination and disciplined judgment, allowing even the most ambitious ideas to take shape as tangible creations.
      </p>
    </div>

    <div class="bento-grid">
      <!-- Row 1 LEFT: Core Competencies -->
      <div class="bento-card col-span-7 dashboard-card">
        <h3 class="card-title-header">Core Competencies</h3>
        <div class="progress-bars-container">
          <div v-for="bar in skillBars" :key="bar.name" class="skill-bar-wrapper">
            <div class="bar-labels">
              <span class="bar-name">{{ bar.name }}</span>
              <span class="bar-percent">{{ bar.percent }}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: `${bar.percent}%`, background: bar.color }"></div>
            </div>
            <p v-if="bar.note" class="bar-note">{{ bar.note }}</p>
          </div>
        </div>
      </div>

      <!-- Row 1 RIGHT: stacked tech cards -->
      <div class="col-span-5 right-stack">
        <div v-for="(skill, idx) in skills" :key="skill.title" class="bento-card tech-card" :style="{ animationDelay: `${idx * 0.1}s` }">
          <div class="tech-header">
            <span class="tech-icon-circle"><i :class="skill.icon || 'fa fa-code'"></i></span>
            <h4 class="tech-title">{{ skill.title }}</h4>
          </div>
          <hr class="tech-divider" />
          <div class="tech-tags">
            <span v-for="tech in skill.info" :key="tech" class="badge">{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import info from "../../mock/mockRepository";
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

// Custom styled progress bars
const skillBars = [
  { name: "Backend", percent: 85, color: "linear-gradient(90deg, #3b82f6, #8b5cf6)" },
  { name: "Scalable, efficiency, vertical scaling", percent: 80, color: "linear-gradient(90deg, #10b981, #3b82f6)" },
  { name: "Teamwork & Collaborative Syncs", percent: 80, color: "linear-gradient(90deg, #10b981, #059669)", note: "A single flower can make me strong, imagine a bunch of flowers?" },
  { name: "API Development & Integrations", percent: 70, color: "linear-gradient(90deg, #f59e0b, #ef4444)" },
  { name: "CI/CD & Delivery Automation", percent: 60, color: "linear-gradient(90deg, #8b5cf6, #ec4899)" },
  { name: "Solo Projects (Self-Reliant Delivery)", percent: 60, color: "linear-gradient(90deg, #6366f1, #3b82f6)", note: "A fullstack developer doing it all by themselves." },
  { name: "Frontend", percent: 40, color: "linear-gradient(90deg, #3b82f6, #06b6d4)" },
  { name: "Leadership", percent: 25, color: "linear-gradient(90deg, #6b7280, #4b5563)", note: "I prefer building to leading." }
];
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

/* Dashboard progress bars */
.dashboard-card {
  padding: var(--space-6) !important;
}

.progress-bars-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.skill-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--foreground);
}

.bar-percent {
  font-weight: 700;
  color: var(--accent);
}

.bar-track {
  height: 8px;
  background: var(--card-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  width: 0;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bar-note {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--muted-foreground);
  margin-top: 2px;
}

/* Right sidebar stacked cards */
.right-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Tech Category Cards */
.tech-card {
  padding: var(--space-4) var(--space-6) !important;
}

.tech-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.tech-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.tech-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--foreground);
}

.tech-divider {
  border: 0;
  height: 1px;
  background: var(--card-border);
  margin: var(--space-3) 0;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
