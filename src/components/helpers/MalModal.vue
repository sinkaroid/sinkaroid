<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-mask" @click.self="close">
        <div class="modal-wrapper">
          <div class="modal-container bento-card">
            <!-- Header -->
            <div class="modal-header">
              <h3 class="modal-title">
                <a v-if="visitUrl" :href="visitUrl" target="_blank" class="title-link clickable">
                  {{ portfolio.title }} <i class="fas fa-external-link-alt title-icon"></i>
                </a>
                <span v-else>{{ portfolio.title }}</span>
              </h3>
              <button class="close-btn clickable" @click="close" aria-label="Close modal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <hr class="modal-divider" />

            <!-- Body: newspaper style -->
            <div class="modal-body">
              <div class="meta-line">
                <span class="pub-date">Sinkaroid {{ portfolio.pubDate }} — {{ portfolio.timeago }}</span>
              </div>
              <div class="tag-line">
                <span class="badge" v-for="tech in portfolio.tag" :key="tech">{{ tech }}</span>
                <mark class="score"><i class="fa fa-star"></i>{{ portfolio.score }}</mark>
              </div>

              <div class="content newspaper">
                <img :src="portfolio.image" class="foto" />
                {{ portfolio.synopsis }}
              </div>

              <p class="footer-note">
                <b>Sinkaroid {{ portfolio.description }}, {{ portfolio.timeago }}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  showModal: { type: Boolean, default: false },
  portfolio: { type: Object, required: true },
  nightMode: { type: Boolean, default: false }
});

const emit = defineEmits(["close"]);

const visitUrl = computed(() => props.portfolio.link || props.portfolio.visit || null);

const close = () => emit("close");

onMounted(() => { document.body.style.overflow = "hidden"; });
onUnmounted(() => { document.body.style.overflow = ""; });
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

/* Header */
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
.title-link:hover { color: var(--accent); }
.title-icon { font-size: 0.9rem; opacity: 0.6; }
.close-btn {
  background: transparent; border: none;
  color: var(--muted-foreground); font-size: 1.3rem;
  cursor: pointer; padding: 4px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, transform 0.2s;
}
.close-btn:hover { color: var(--foreground); transform: scale(1.1); }
.modal-divider {
  border: 0; height: 1px;
  background: var(--card-border); margin: 0;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.meta-line { font-size: 0.85rem; color: var(--muted-foreground); }
.tag-line { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
.tag-line .badge {
  background-color: var(--accent-muted, #d3e3e9);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
.tag-line .score {
  font-size: 1.1rem;
  font-weight: 700;
  padding: 2px 10px;
  background: #fff3cd;
  border-radius: 4px;
}

/* Newspaper content: image right, text wrap */
.content.newspaper {
  text-align: left;
}
.content.newspaper .foto {
  float: right;
  width: 40%;
  height: auto;
  border-radius: 10px;
  border: 2px solid #fc4d64;
  margin: 0 0 10px 10px;
}

.footer-note { font-size: 0.9rem; color: var(--muted-foreground); }

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-container {
  animation: modal-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-leave-active .modal-container {
  animation: modal-pop-out 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modal-pop-in {
  from { transform: scale(0.95) translateY(10px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes modal-pop-out {
  from { transform: scale(1) translateY(0); opacity: 1; }
  to   { transform: scale(0.95) translateY(10px); opacity: 0; }
}
</style>
