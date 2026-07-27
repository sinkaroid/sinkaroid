<template>
  <section class="section about-section" id="about">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">Sigil & Codename</h2>
      <p class="section-subtitle">
        Every rune tells a story. The name I bear and the craft I wield. Where identity meets craftsmanship, and every quest leaves its mark.
      </p>
    </div>

    <!-- Bento layout for Bio Tags & Timelines -->
    <div class="bento-grid">
      
      <!-- Profile tags / Pronouns Card -->
      <div class="bento-card col-span-12 pronouns-card">
        <div class="pronouns-list">
          <div class="pronoun-tag green-tag clickable" @click="showToast('🍀 TRUE SELF: ~@Indrawan I.')">
            <img src="/assets/icon/Metamorphosis_icon.webp" alt="" class="emoji-icon" />
            <div class="pronoun-info">
              <span class="label">TRUE SELF</span>
              <span class="value" style="font-weight: 900;">@Indrawan I.</span>
            </div>
          </div>

          <div class="pronoun-tag crimson-tag clickable" @click="showToast('🧠 CONJURE IMAGE (BRAIN Focused): The cognitive realm where ideas awaken, problems dissolve, and solutions are forged. Proficient and Pragmatic ~@sinkaroid')">
            <img src="/assets/icon/Conjure_Image_icon.webp" alt="" class="emoji-icon" />
            <div class="pronoun-info">
              <span class="label">CONJURE IMAGE</span>
              <span class="value" style="font-weight: 900;">@sinkaroid</span>
            </div>
          </div>

          <div class="pronoun-tag purple-tag clickable" @click="showToast('❤️ REFLECTION (HEART Focused): The sanctuary where empathy, intuition, and conscience guide the choices I make. Maybe fool and stupid ~@darin')">
            <img src="/assets/icon/Reflection_icon.webp" alt="" class="emoji-icon" />
            <div class="pronoun-info">
              <span class="label">REFLECTION</span>
              <span class="value" style="font-weight: 900;">@darin</span>
            </div>
          </div>

          <div class="pronoun-tag orange-tag clickable" @click="showToast('SUNDER: ~ꦏꦼꦭꦶꦭꦺꦥ꧀')">
            <img src="/assets/icon/Sunder_icon.webp" alt="" class="emoji-icon" />
            <div class="pronoun-info">
              <span class="label">SUNDER</span>
              <span class="value" style="font-weight: 900;">ꦏꦼꦭꦶꦭꦺꦥ꧀</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <Teleport to="body">
        <Transition name="toast-fade">
          <div v-if="toastMessage" class="pronoun-toast" role="status" aria-live="polite">
            {{ toastMessage }}
          </div>
        </Transition>
      </Teleport>

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

const toastMessage = ref("");
let toastTimer = null;
const showToast = (msg) => {
    toastMessage.value = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastMessage.value = "";
    }, 5000);
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
  flex: 1 1 200px;
  max-width: 100%;
}

@media (max-width: 576px) {
  .pronoun-tag {
    min-width: 0;
    flex: 1 1 100%;
    padding: var(--space-3) var(--space-4);
  }
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

img.emoji-icon {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  display: block;
  border-radius: 10px;
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

.pronoun-tag {
  cursor: pointer;
}

.pronoun-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: var(--card-bg);
  color: var(--foreground);
  border: 1px solid var(--card-border);
  padding: 12px 22px;
  border-radius: var(--radius-full);
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-blur);
  z-index: 9998;
  pointer-events: none;
  max-width: min(92vw, 480px);
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
}

@media (max-width: 576px) {
  .pronoun-toast {
    border-radius: var(--radius-md);
    bottom: 16px;
    font-size: 0.85rem;
    padding: 10px 16px;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
