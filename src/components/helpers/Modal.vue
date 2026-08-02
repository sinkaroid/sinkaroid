<template>
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
                <a 
                  v-if="visitUrl" 
                  :href="visitUrl" 
                  target="_blank" 
                  class="title-link clickable"
                >
                  {{ portfolio.name || portfolio.title }} <i class="fas fa-external-link-alt title-icon" />
                </a>
                <span v-else>{{ portfolio.name || portfolio.title }}</span>
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
              <!-- Meta/Subheader (date only) -->
              <div class="modal-meta">
                <span
                  v-if="dateLabel"
                  class="meta-item"
                >
                  <i class="far fa-calendar-alt" /> {{ isRepo ? "Last update: " : "" }}{{ dateLabel }}
                </span>
              </div>

              <!-- Tags / Technologies removed -->

              <!-- Description -->
              <div class="modal-description">
                {{ portfolio.description || portfolio.synopsis }}
              </div>

              <!-- Image Gallery -->
              <div
                v-if="portfolio.pictures && portfolio.pictures.length"
                class="modal-gallery-section"
              >
                <h5 class="gallery-title">
                  Gallery & Media
                </h5>
                <Gallery :images="portfolio.pictures" />
              </div>
            </div>

            <hr class="modal-divider">

            <!-- Modal Footer -->
            <div class="modal-footer">
              <a 
                v-if="portfolio.github" 
                :href="portfolio.github" 
                target="_blank" 
                class="btn-primary clickable"
              >
                <i class="fab fa-github" /> Repository
              </a>
              <a 
                v-if="portfolio.visit && portfolio.visit !== visitUrl" 
                :href="portfolio.visit" 
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
import { timeAgo } from "../../composables/useTimeAgo";

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

const visitUrl = computed(() => {
  return props.portfolio.visit || props.portfolio.link || null;
});

const dateLabel = computed(() => {
  return (
    props.portfolio.date ||
    props.portfolio.timeago ||
    timeAgo(props.portfolio.last_commit_date)
  );
});

const isRepo = computed(() => !!props.portfolio.last_commit_date);

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

.title-link {
  color: var(--foreground);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.title-link:hover {
  color: var(--accent);
}

.title-icon {
  font-size: 0.9rem;
  opacity: 0.6;
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

.text-star {
  color: #fbbf24;
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
  white-space: pre-line;
}

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
