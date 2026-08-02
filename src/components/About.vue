<template>
  <section
    id="about"
    class="section about-section"
  >
    <div class="section-header">
      <h2
        class="section-title"
        :style="{ backgroundImage: titleGradient }"
      >
        Sigil & Codename
      </h2>
      <p class="section-subtitle">
        Every rune tells a story. The name I bear and the craft I wield. Where identity meets craftsmanship, and every quest leaves its mark.
      </p>
    </div>

    <!-- Bento layout for Bio Tags & Timelines -->
    <div class="bento-grid">
      <!-- Profile tags / Pronouns Card -->
      <div class="bento-card col-span-12 pronouns-card">
        <div class="pronouns-list">
          <div
            class="pronoun-tag green-tag clickable"
            @click="openModal('trueself')"
          >
            <img
              src="/assets/icon/Metamorphosis_icon.webp"
              alt=""
              class="emoji-icon"
            >
            <div class="pronoun-info">
              <span class="label">TRUE SELF</span>
              <span
                class="value"
                style="font-weight: 900;"
              >@Indrawan I.</span>
            </div>
          </div>

          <div
            class="pronoun-tag crimson-tag clickable"
            @click="openModal('conjureimage')"
          >
            <img
              src="/assets/icon/Conjure_Image_icon.webp"
              alt=""
              class="emoji-icon"
            >
            <div class="pronoun-info">
              <span class="label">CONJURE IMAGE</span>
              <span
                class="value"
                style="font-weight: 900;"
              >@sinkaroid</span>
            </div>
          </div>

          <div
            class="pronoun-tag purple-tag clickable"
            @click="openModal('reflection')"
          >
            <img
              src="/assets/icon/Reflection_icon.webp"
              alt=""
              class="emoji-icon"
            >
            <div class="pronoun-info">
              <span class="label">REFLECTION</span>
              <span
                class="value"
                style="font-weight: 900;"
              >@darin</span>
            </div>
          </div>

          <div
            class="pronoun-tag orange-tag clickable"
            @click="openModal('sunder')"
          >
            <img
              src="/assets/icon/Sunder_icon.webp"
              alt=""
              class="emoji-icon"
            >
            <div class="pronoun-info">
              <span class="label">SUNDER</span>
              <span
                class="value"
                style="font-weight: 900;"
              >ꦏꦼꦭꦶꦭꦺꦥ꧀</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div
            v-if="modalData.show"
            class="pronoun-modal-mask"
            @click.self="closeModal"
          >
            <div class="pronoun-modal-wrapper">
              <div
                class="pronoun-modal-card bento-card"
                :class="modalData.colorClass"
              >
                <!-- Close Button in Corner -->
                <button
                  class="card-close-btn clickable"
                  aria-label="Close modal"
                  @click="closeModal"
                >
                  <i class="fas fa-times" />
                </button>

                <!-- Profile Info Group -->
                <div class="card-hero">
                  <img
                    :src="modalData.icon"
                    alt=""
                    class="card-avatar"
                  >
                  <div class="card-meta">
                    <span class="card-label">{{ modalData.title }}</span>
                    <span class="card-value">{{ modalData.value }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p class="card-desc">
                  {{ modalData.description }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Education Timeline -->
      <div class="col-span-6 timeline-column">
        <Timeline
          :data="education"
          :night-mode="nightMode"
        />
      </div>

      <!-- Experience Timeline -->
      <div class="col-span-6 timeline-column">
        <Timeline
          :data="experience"
          :night-mode="nightMode"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import Timeline from "./helpers/Timeline.vue";
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

const education = {
  title: "Education",
  data: info.education || []
};

const experience = {
  title: "Experiences",
  data: info.experience || []
};

const modalData = ref({
    show: false,
    title: "",
    value: "",
    icon: "",
    colorClass: "",
    description: ""
});

const openModal = (type) => {
    if (type === "trueself") {
        modalData.value = {
            show: true,
            title: "TRUE SELF",
            value: "@Indrawan I.",
            icon: "/assets/icon/Metamorphosis_icon.webp",
            colorClass: "green-tag",
            description: "Indrawan I."
        };
    } else if (type === "conjureimage") {
        modalData.value = {
            show: true,
            title: "CONJURE IMAGE",
            value: "@sinkaroid",
            icon: "/assets/icon/Conjure_Image_icon.webp",
            colorClass: "crimson-tag",
            description: "🧠 CONJURE IMAGE (BRAIN):\n\nThe cognitive realm where ideas awaken, problems dissolve, and solutions are forged. Proficient and pragmatic - @sinkaroid"
        };
    } else if (type === "reflection") {
        modalData.value = {
            show: true,
            title: "REFLECTION",
            value: "@darin",
            icon: "/assets/icon/Reflection_icon.webp",
            colorClass: "purple-tag",
            description: "❤️ REFLECTION (HEART):\n\nThe sanctuary where empathy, intuition, and conscience guide the choices I make. Maybe fool and stupid - @darin"
        };
    } else if (type === "sunder") {
        modalData.value = {
            show: true,
            title: "SUNDER",
            value: "ꦏꦼꦭꦶꦭꦺꦥ꧀",
            icon: "/assets/icon/Sunder_icon.webp",
            colorClass: "orange-tag",
            description: "SUNDER: ~ꦏꦼꦭꦶꦭꦺꦥ꧀"
        };
    }
    document.body.style.overflow = "hidden";
};

const closeModal = () => {
    modalData.value.show = false;
    document.body.style.overflow = "";
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
.pronoun-tag.green-tag:hover { background: rgba(34,197,94,0.08); border-color: var(--tag-color); }
.green-tag .emoji-icon,
.green-tag .label,
.green-tag .value { color: var(--tag-color); }

.purple-tag  { --tag-color: #a855f7; border-color: var(--tag-color); }
.pronoun-tag.purple-tag:hover { background: rgba(168,85,247,0.08); border-color: var(--tag-color); }
.purple-tag .emoji-icon,
.purple-tag .label,
.purple-tag .value { color: var(--tag-color); }

.crimson-tag  { --tag-color: #dc2626; border-color: var(--tag-color); }
.pronoun-tag.crimson-tag:hover { background: rgba(220,38,38,0.08); border-color: var(--tag-color); }
.crimson-tag .emoji-icon,
.crimson-tag .label,
.crimson-tag .value { color: var(--tag-color); }

.orange-tag  { --tag-color: #f97316; border-color: var(--tag-color); }
.pronoun-tag.orange-tag:hover { background: rgba(249,115,22,0.08); border-color: var(--tag-color); }
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

/* Pronoun Modal CSS */
.pronoun-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(9, 9, 11, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
}

.pronoun-modal-wrapper {
  width: 100%;
  max-width: 500px;
}

.pronoun-modal-card {
  background: var(--card-bg-solid);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6) !important;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: relative;
  overflow: hidden;
  backdrop-filter: var(--card-blur);
}

.pronoun-modal-card:hover {
  border-color: var(--card-border) !important;
}

.card-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.card-close-btn:hover {
  color: var(--foreground);
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.card-hero {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-1);
}

.card-avatar {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-label {
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tag-color, var(--accent));
}

.card-value {
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--foreground);
}

.card-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--foreground);
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  opacity: 0.95;
}

/* Modal POP Pop-in and POP-out Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .pronoun-modal-card {
  animation: modal-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .pronoun-modal-card {
  animation: modal-pop-out 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-pop-in {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes modal-pop-out {
  from {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  to {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
