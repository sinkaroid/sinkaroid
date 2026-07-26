<template>
  <section class="section about-section" id="about">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">Sigil & True Name & 真の卍解</h2>
      <p class="section-subtitle">
        Every rune tells a story. The name I bear and the craft I wield. Where identity meets craftsmanship, and every quest leaves its mark.
      </p>
    </div>

    <!-- Bento layout for Bio Tags & Timelines -->
    <div class="bento-grid">
      
      <!-- Profile tags / Pronouns Card -->
      <div class="bento-card col-span-12 pronouns-card">
        <div class="pronouns-list">
          <div class="pronoun-tag green-tag">
            <i class="fas fa-leaf emoji-icon"></i>
            <div class="pronoun-info">
              <span class="label">TRUE_SELF</span>
              <span class="value">Indrawan I.</span>
            </div>
          </div>

          <div class="pronoun-tag crimson-tag">
            <i class="fas fa-brain emoji-icon"></i>
            <div class="pronoun-info">
              <span class="label">SELF_BRAIN</span>
              <span class="value">sinkaroid</span>
            </div>
          </div>
          
          <div class="pronoun-tag purple-tag">
            <i class="fas fa-heart emoji-icon"></i>
            <div class="pronoun-info">
              <span class="label">SELF_HEART</span>
              <span class="value">darin</span>
            </div>
          </div>

          <div class="pronoun-tag orange-tag">
            <span class="emoji-icon">🗾</span>
            <div class="pronoun-info">
              <span class="label">CORS_ORIGIN</span>
              <span class="value">ꦏꦼꦭꦶꦭꦺꦥ꧀</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Education Timeline -->
      <div class="col-span-6 timeline-column">
        <Timeline :data="education" :nightMode="nightMode" />
      </div>

      <!-- Experience Timeline -->
      <div class="col-span-6 timeline-column">
        <Timeline :data="experience" :nightMode="nightMode" />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import Timeline from "./helpers/Timeline.vue";
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

const education = {
  title: "Education",
  data: info.education || []
};

const experience = {
  title: "Experiences",
  data: info.experience || []
};
</script>

<style scoped>
.about-section {
  padding-top: 0 !important;
}
.col-span-12 {
  grid-column: span 12;
}
.col-span-6 {
  grid-column: span 6;
}

@media (max-width: 992px) {
  .col-span-6 {
    grid-column: span 12;
  }
}

/* Pronouns tag styles */
.pronouns-card {
  padding: var(--space-6) !important;
}

.pronouns-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.pronoun-tag {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  min-width: 200px;
}

.pronoun-tag:hover {
  background: rgba(var(--accent-rgb), 0.05);
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* Color variants */
.green-tag  { --tag-color: #22c55e; border-color: var(--tag-color); }
.green-tag:hover { background: rgba(34,197,94,0.08); border-color: var(--tag-color); }
.green-tag .emoji-icon,
.green-tag .label,
.green-tag .value { color: var(--tag-color); }

.purple-tag  { --tag-color: #a855f7; border-color: var(--tag-color); }
.purple-tag:hover { background: rgba(168,85,247,0.08); border-color: var(--tag-color); }
.purple-tag .emoji-icon,
.purple-tag .label,
.purple-tag .value { color: var(--tag-color); }

.crimson-tag  { --tag-color: #dc2626; border-color: var(--tag-color); }
.crimson-tag:hover { background: rgba(220,38,38,0.08); border-color: var(--tag-color); }
.crimson-tag .emoji-icon,
.crimson-tag .label,
.crimson-tag .value { color: var(--tag-color); }

.orange-tag  { --tag-color: #f97316; border-color: var(--tag-color); }
.orange-tag:hover { background: rgba(249,115,22,0.08); border-color: var(--tag-color); }
.orange-tag .emoji-icon,
.orange-tag .label,
.orange-tag .value { color: var(--tag-color); }

.emoji-icon {
  font-size: 1.5rem;
  color: var(--accent);
}

.pronoun-info {
  display: flex;
  flex-direction: column;
}

.pronoun-info .label {
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pronoun-info .value {
  font-size: 1rem;
  font-weight: 600;
}

.timeline-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
