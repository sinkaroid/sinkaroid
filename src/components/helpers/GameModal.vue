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
            <button
              class="close-btn clickable"
              aria-label="Close modal"
              @click="close"
            >
              <i class="fas fa-times" />
            </button>
            <!-- Header: capsule image as background banner -->
            <div
              class="game-banner"
              :style="bannerStyle"
            >
              <div class="game-banner-overlay">
                <h3 class="game-title">
                  <a
                    v-if="storeUrl"
                    :href="storeUrl"
                    target="_blank"
                    class="title-link clickable"
                  >
                    {{ portfolio.name }} <i class="fas fa-external-link-alt title-icon" />
                  </a>
                  <span v-else>{{ portfolio.name }}</span>
                </h3>
                <div class="game-meta">
                  <span class="meta-pill">
                    <i class="far fa-clock" /> Last played {{ portfolio.timeago }}
                  </span>
                  <span
                    v-if="hoursPlayed"
                    class="meta-pill"
                  >
                    <i class="fas fa-hourglass-half" /> {{ hoursPlayed }}h lifetime
                  </span>
                  <span
                    v-if="playtime2weeksLabel"
                    class="meta-pill highlight"
                  >
                    <i class="fas fa-fire" /> {{ playtime2weeksLabel }} (2 weeks)
                  </span>
                </div>
              </div>
            </div>

            <hr class="modal-divider">
            <div
              v-if="portfolio.tags && portfolio.tags.length"
              class="genre-list"
            >
              <span
                v-for="t in portfolio.tags.slice(0, 5)"
                :key="t"
                class="genre-tag"
              >{{ t }}</span>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <p
                v-if="displayDescription"
                class="long-desc"
              >
                {{ displayDescription }}
              </p>

             

              <div class="action-row">
                <a
                  v-if="storeUrl"
                  :href="storeUrl"
                  target="_blank"
                  class="btn-primary clickable"
                >
                  <i class="fas fa-external-link-alt" /> Open in Steam
                </a>
              </div>
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

const storeUrl = computed(() => props.portfolio.storeLink || null);

const hoursPlayed = computed(() => {
    const m = Number(props.portfolio.playtimeForever) || 0;
    return Math.floor(m / 60);
});

const playtime2weeksLabel = computed(() => {
    const m = Number(props.portfolio.playtime2weeks) || 0;
    if (m <= 0) return null;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
});

const TRUNCATE_LIMIT = 250;
const displayDescription = computed(() => {
    const desc = props.portfolio.description || "";
    if (desc.length <= TRUNCATE_LIMIT) return desc;
    return `${desc.substring(0, TRUNCATE_LIMIT)}..`;
});

const bannerStyle = computed(() => {
    const url = props.portfolio.header || props.portfolio.capsule || "";
    if (!url) return { background: "var(--accent-gradient)" };
    return {
        backgroundImage: `linear-gradient(180deg, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.85) 100%), url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
    };
});

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
    padding: var(--space-6);
}
.modal-wrapper {
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
}
.modal-container {
    width: 100%;
    max-height: 88vh;
    background: var(--modal-bg) !important;
    border: 1px solid var(--card-border) !important;
    box-shadow: var(--card-shadow) !important;
    display: flex;
    flex-direction: column;
    padding: 0 !important;
    overflow: hidden;
    border-radius: var(--radius-lg);
    position: relative;
}

/* Banner header */
.game-banner {
    position: relative;
    min-height: 260px;
    display: flex;
    align-items: flex-end;
    padding: var(--space-8);
    background-color: var(--bg-app);
}
.game-banner-overlay {
    width: 100%;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}
.game-title {
    font-size: 1.75rem;
    font-weight: 900;
    margin: 0 0 var(--space-4) 0;
    line-height: 1.1;
    padding-right: 48px;
}
.title-link {
    color: white;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
}
.title-link:hover { color: var(--accent); }
.title-icon { font-size: 0.9rem; opacity: 0.8; }
.game-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
}
.meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(9, 9, 11, 0.55);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    font-weight: 600;
}
.meta-pill.highlight {
    background: var(--accent-gradient);
    border-color: transparent;
}
.close-btn {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    z-index: 10;
    background: rgba(9, 9, 11, 0.65);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1rem;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
.close-btn:hover {
    background: rgba(9, 9, 11, 0.85);
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
    padding: var(--space-6) var(--space-8) var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}
.long-desc {
    font-size: 0.9rem;
    color: var(--muted-foreground);
    line-height: 1.65;
    white-space: pre-line;
    margin: 0;
}
.action-row {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-4);
    justify-content: flex-end;
}
.genre-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: rgba(var(--accent-rgb), 0.04);
    border: 1px solid rgba(var(--accent-rgb), 0.1);
    border-radius: var(--radius-md);
}
.genre-tag {
    display: inline-flex;
    align-items: center;
    background: rgba(var(--accent-rgb), 0.12);
    color: var(--accent);
    border: 1px solid rgba(var(--accent-rgb), 0.25);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    font-family: var(--font-display);
    letter-spacing: 0.02em;
    transition: transform 0.2s ease, background 0.2s ease;
}
.genre-tag:hover {
    background: rgba(var(--accent-rgb), 0.2);
    transform: translateY(-1px);
}
.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-gradient);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: var(--radius-full);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.25);
}
.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.35);
}

/* Mobile tweaks only */
@media (max-width: 576px) {
    .modal-mask {
        padding: var(--space-3);
    }
    .game-banner {
        min-height: 180px;
        padding: var(--space-5) calc(var(--space-5) + 36px + var(--space-3)) var(--space-5) var(--space-5);
    }
    .game-title {
        font-size: 1.15rem;
        margin-bottom: var(--space-3);
        padding-right: var(--space-3);
    }
    .game-banner-overlay {
        padding: var(--space-3) var(--space-4);
        background: rgba(9, 9, 11, 0.45);
        backdrop-filter: blur(10px);
        border-radius: var(--radius-md);
    }
    .game-meta {
        gap: 6px;
        margin-top: var(--space-2);
    }
    .title-icon {
        display: none;
    }
    .meta-pill {
        font-size: 0.7rem;
        padding: 4px 9px;
    }
    .close-btn {
        top: var(--space-3);
        right: var(--space-3);
        width: 30px;
        height: 30px;
        font-size: 0.9rem;
    }
}

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
