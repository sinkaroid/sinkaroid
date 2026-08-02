<template>
  <!-- eslint-disable vue/no-v-html -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="modal-mask"
        @click.self="close"
      >
        <div class="modal-wrapper">
          <div class="modal-container bento-card">
            <!-- Modal Header -->
            <div class="modal-header">
              <h3 class="modal-title">
                {{ portfolio.name || portfolio.title }}
              </h3>
              <button
                class="close-btn clickable"
                aria-label="Close modal"
                @click="close"
              >
                <i class="fas fa-times" />
              </button>
            </div>
            
            <hr class="modal-divider">

            <!-- Modal Body -->
            <div class="modal-body">
              <!-- Meta/Subheader -->
              <div class="modal-meta">
                <span class="meta-item">
                  <i class="fas fa-rocket" /> {{ portfolio.category || 'Illustration & Design' }}
                </span>
                <span
                  v-if="portfolio.date"
                  class="meta-item"
                >
                  <i class="far fa-calendar-alt" /> {{ portfolio.date }}
                </span>
              </div>

              <!-- Tags / Technologies -->
              <div class="modal-tags">
                <span 
                  v-for="tech in tags" 
                  :key="tech" 
                  class="badge"
                >
                  {{ tech }}
                </span>
              </div>

              <!-- Description -->
              <div
                v-if="portfolio.isMarkdown"
                class="modal-description"
                v-html="parsedDescription"
              />
              <div
                v-else
                class="modal-description"
              >
                {{ portfolio.description }}
              </div>

              <!-- Image Gallery (Full Width design layout) -->
              <div
                v-if="portfolio.pictures && portfolio.pictures.length"
                class="modal-gallery-section"
              >
                <h5 class="gallery-title">
                  Artwork Gallery
                </h5>
                <Gallery
                  :images="portfolio.pictures"
                  :design="true"
                />
              </div>
            </div>

            <hr class="modal-divider">

            <!-- Modal Footer -->
            <div class="modal-footer">
              <a 
                v-if="portfolio.visit || portfolio.link" 
                :href="portfolio.visit || portfolio.link" 
                target="_blank" 
                class="btn-primary clickable"
              >
                <i class="fas fa-rocket" /> Preview
              </a>
              <button
                class="btn-secondary clickable"
                @click="close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import Gallery from "./Gallery.vue";
import { parseMarkdown } from "../../composables/useMarkdown";

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  portfolio: {
    type: Object,
    required: true
  },
  nightMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

const tags = computed(() => {
  return props.portfolio.technologies || [];
});

const parsedDescription = computed(() => {
  return parseMarkdown(props.portfolio.description);
});

const close = () => {
  emit("close");
};

// Lock body scrolling when modal is open
onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 9, 11, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-wrapper {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  width: 100%;
  max-height: 85vh;
  background: var(--modal-bg) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: var(--card-shadow) !important;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) !important;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 1.3rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, transform 0.2s;
}

.close-btn:hover {
  color: var(--foreground);
  transform: scale(1.1);
}

.modal-divider {
  border: 0;
  height: 1px;
  background: var(--card-border);
  margin: 0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: calc(85vh - 160px);
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-size: 0.85rem;
  color: var(--muted-foreground);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.modal-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--foreground);
  text-align: left;
}

.modal-description :deep(p) {
  margin-bottom: var(--space-3);
}

.modal-description :deep(p:last-child) {
  margin-bottom: 0;
}

.modal-description :deep(ul),
.modal-description :deep(ol) {
  margin-bottom: var(--space-3);
  padding-left: var(--space-5);
}

.modal-description :deep(ul) {
  list-style-type: disc;
}

.modal-description :deep(ol) {
  list-style-type: decimal;
}

.modal-description :deep(li) {
  margin-bottom: var(--space-1);
}

.modal-description :deep(pre) {
  background: rgba(0, 0, 0, 0.2);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  margin-bottom: var(--space-3);
  border: 1px solid var(--card-border);
}

.modal-description :deep(code) {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.modal-description :deep(pre code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
}

/* Light Mode Overrides (when .dark-theme is absent) */
html:not(.dark-theme) .modal-description :deep(pre) {
  background: rgba(9, 9, 11, 0.04);
}

html:not(.dark-theme) .modal-description :deep(code) {
  background: rgba(9, 9, 11, 0.06);
  color: #e01e5a;
}

html:not(.dark-theme) .modal-description :deep(pre code) {
  background: transparent;
  color: inherit;
}

.modal-description :deep(.markdown-link) {
  color: var(--accent);
  text-decoration: underline;
  transition: opacity 0.2s;
}

.modal-description :deep(.markdown-link:hover) {
  opacity: 0.8;
}

.modal-description :deep(h1),
.modal-description :deep(h2),
.modal-description :deep(h3),
.modal-description :deep(h4) {
  font-weight: 700;
  margin-top: var(--space-4);
  margin-bottom: var(--space-2);
  color: var(--foreground);
}

.modal-description :deep(h1) { font-size: 1.4rem; }
.modal-description :deep(h2) { font-size: 1.25rem; }
.modal-description :deep(h3) { font-size: 1.1rem; }
.modal-description :deep(h4) { font-size: 1rem; }

.modal-gallery-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.gallery-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
}

.modal-footer .btn-primary,
.modal-footer .btn-secondary {
  min-width: 100px;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-container {
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
