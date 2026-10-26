<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="modal-mask"
        @click.self="close"
      >
        <div class="modal-wrapper">
          <div class="modal-container">
            <button
              class="close-btn clickable"
              aria-label="Close modal"
              @click="close"
            >
              <i class="fas fa-times" />
            </button>

            <!-- Header: capsule/header image as cinematic background banner -->
            <div
              class="game-banner"
              :style="bannerStyle"
            >
              <div class="game-banner-overlay">
                <div class="banner-main-row">
                  <div class="banner-title-area">
                    <h3 class="game-title">
                      <a
                        v-if="storeUrl"
                        :href="storeUrl"
                        target="_blank"
                        class="title-link clickable"
                      >
                        {{ portfolio.name }}
                        <i class="fas fa-external-link-alt title-icon" />
                      </a>
                      <span v-else>{{ portfolio.name }}</span>
                    </h3>

                    <div class="game-meta">
                      <span class="meta-pill">
                        <i class="far fa-clock" /> Last played {{ timeAgo(portfolio.lastPlayed) }}
                      </span>
                      <span
                        v-if="hoursPlayed"
                        class="meta-pill"
                      >
                        <i class="fas fa-hourglass-half" /> {{ hoursPlayed }} lifetime
                      </span>
                      <span
                        v-if="playtime2weeksLabel"
                        class="meta-pill highlight"
                      >
                        <i class="fas fa-fire" /> {{ playtime2weeksLabel }} (2 weeks)
                      </span>
                      <span
                        v-if="achievements && achievements.total > 0"
                        class="meta-pill trophy-pill"
                        :class="{ 'highlight': achievements.percent === 100 }"
                      >
                        <i :class="achievements.percent === 100 ? 'fas fa-award' : 'fas fa-trophy'" />
                        {{ achievements.unlocked }}/{{ achievements.total }} ({{ achievements.percent }}%)
                      </span>
                    </div>
                  </div>

                  <!-- Desktop Hero CTA: direct access without scrolling -->
                  <a
                    v-if="storeUrl"
                    :href="storeUrl"
                    target="_blank"
                    class="btn-steam clickable desktop-cta"
                  >
                    <i class="fab fa-steam" /> Open in Steam
                  </a>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <!-- Game Overview Bento Box (synopsis & genre tags together) -->
              <div
                v-if="displayDescription || (portfolio.tags && portfolio.tags.length)"
                class="game-overview-card"
              >
                <p
                  v-if="displayDescription"
                  class="overview-desc"
                >
                  {{ displayDescription }}
                </p>
                <div
                  v-if="portfolio.tags && portfolio.tags.length"
                  class="genre-list"
                >
                  <span
                    v-for="t in portfolio.tags.slice(0, 6)"
                    :key="t"
                    class="genre-tag"
                  >{{ t }}</span>
                </div>
              </div>

              <!-- Achievements Showcase Section -->
              <div
                v-if="achievements && achievements.total > 0"
                class="achievements-section"
              >
                <div class="ach-header">
                  <div class="ach-title-group">
                    <h4 class="ach-heading">
                      <i class="fas fa-trophy" /> Achievements
                    </h4>
                    <span class="ach-counter">
                      <strong>{{ achievements.unlocked }}</strong> / {{ achievements.total }}
                      <span class="ach-percent-badge">{{ achievements.percent }}%</span>
                    </span>
                  </div>

                  <div class="ach-filter-group">
                    <button
                      class="ach-filter-btn clickable"
                      :class="{ 'active': filterAch === 'all' }"
                      @click="filterAch = 'all'"
                    >
                      All ({{ achievements.total }})
                    </button>
                    <button
                      class="ach-filter-btn clickable"
                      :class="{ 'active': filterAch === 'unlocked' }"
                      @click="filterAch = 'unlocked'"
                    >
                      Unlocked ({{ achievements.unlocked }})
                    </button>
                    <button
                      v-if="achievements.total - achievements.unlocked > 0"
                      class="ach-filter-btn clickable"
                      :class="{ 'active': filterAch === 'locked' }"
                      @click="filterAch = 'locked'"
                    >
                      Locked ({{ achievements.total - achievements.unlocked }})
                    </button>
                  </div>
                </div>

                <!-- Progress bar -->
                <div class="ach-progress-track">
                  <div
                    class="ach-progress-bar"
                    :style="{ width: `${achievements.percent}%` }"
                  />
                </div>

                <!-- Achievement Items Grid with Real Images -->
                <div class="ach-list-container">
                  <div
                    v-for="ach in filteredAchievements"
                    :key="ach.name"
                    class="ach-item"
                    :class="{ 'unlocked': ach.achieved, 'locked': !ach.achieved }"
                  >
                    <div class="ach-icon-wrapper">
                      <img
                        :src="ach.achieved ? ach.icon : (ach.icongray || ach.icon)"
                        :alt="ach.name"
                        class="ach-icon-img"
                        loading="lazy"
                      >
                      <div
                        class="ach-badge-status"
                        :class="{ 'is-achieved': ach.achieved }"
                      >
                        <i :class="ach.achieved ? 'fas fa-check' : 'fas fa-lock'" />
                      </div>
                    </div>
                    <div class="ach-details">
                      <div class="ach-item-title">
                        {{ ach.name }}
                      </div>
                      <div
                        v-if="ach.description"
                        class="ach-item-desc"
                      >
                        {{ ach.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile-only bottom action row -->
              <div class="action-row mobile-only">
                <a
                  v-if="storeUrl"
                  :href="storeUrl"
                  target="_blank"
                  class="btn-primary clickable"
                >
                  <i class="fab fa-steam" /> Open in Steam
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { timeAgo } from "../../composables/useTimeAgo";

const props = defineProps({
    showModal: { type: Boolean, default: false },
    portfolio: { type: Object, required: true },
    nightMode: { type: Boolean, default: false }
});

const emit = defineEmits(["close"]);

const filterAch = ref("all");
const achievements = computed(() => props.portfolio.achievements || null);
const achievementList = computed(() => props.portfolio.achievements?.list || []);

const filteredAchievements = computed(() => {
    if (!achievements.value) return [];
    if (filterAch.value === "unlocked") {
        return achievementList.value.filter((a) => a.achieved);
    }
    if (filterAch.value === "locked") {
        return achievementList.value.filter((a) => !a.achieved);
    }
    return achievementList.value;
});

const storeUrl = computed(() => props.portfolio.storeLink || null);

const hoursPlayed = computed(() => {
    const m = Number(props.portfolio.playtimeForever) || 0;
    if (m <= 0) return null;
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h`;
});

const playtime2weeksLabel = computed(() => {
    const m = Number(props.portfolio.playtime2weeks) || 0;
    if (m <= 0) return null;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
});

const TRUNCATE_LIMIT = 200;
const displayDescription = computed(() => {
    const desc = props.portfolio.shortDescription || props.portfolio.description || "";
    if (desc.length <= TRUNCATE_LIMIT) return desc;
    return `${desc.substring(0, TRUNCATE_LIMIT).trim()}..`;
});

const bannerStyle = computed(() => {
    const url = props.portfolio.header || props.portfolio.capsule || "";
    if (!url) return { background: "var(--accent-gradient)" };
    return {
        backgroundImage: `linear-gradient(180deg, rgba(9,9,11,0.2) 0%, rgba(9,9,11,0.65) 50%, rgba(9,9,11,0.95) 100%), url(${url})`,
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
    background-color: rgba(9, 9, 11, 0.72);
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
}
.modal-wrapper {
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
}
.modal-container {
    width: 100%;
    max-height: 88vh;
    background: var(--modal-bg) !important;
    border: none !important;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35) !important;
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
    min-height: 240px;
    display: flex;
    align-items: flex-end;
    padding: var(--space-6) var(--space-8);
    background-color: var(--bg-app);
}
.game-banner-overlay {
    width: 100%;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}
.banner-main-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
}
.banner-title-area {
    flex: 1;
    min-width: 0;
}
.game-title {
    font-size: 1.85rem;
    font-weight: 800;
    margin: 0 0 var(--space-3) 0;
    line-height: 1.15;
    letter-spacing: -0.02em;
    padding-right: 48px;
}
.title-link {
    color: white;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    transition: color 0.2s ease;
}
.title-link:hover { color: var(--accent); }
.title-icon { font-size: 0.95rem; opacity: 0.8; }

.game-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}
.meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(9, 9, 11, 0.55);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: white;
    padding: 5px 12px;
    border-radius: var(--radius-full);
    font-size: 0.78rem;
    font-weight: 600;
    font-family: var(--font-display);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.meta-pill.highlight {
    background: var(--accent-gradient);
    border-color: transparent;
    box-shadow: 0 2px 12px rgba(var(--accent-rgb), 0.35);
}
.meta-pill.trophy-pill i {
    color: #fbbf24;
}

/* Desktop CTA button inside hero banner */
.btn-steam {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-gradient);
    color: white;
    text-decoration: none;
    padding: 10px 22px;
    border-radius: var(--radius-full);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.88rem;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(var(--accent-rgb), 0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-steam:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(var(--accent-rgb), 0.45);
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
    transform: scale(1.08);
}

/* Modal Body */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6) var(--space-8) var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}
.modal-body::-webkit-scrollbar {
    width: 6px;
}
.modal-body::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: var(--radius-full);
}
.modal-body::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
}

/* Game Overview Section */
.game-overview-card {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: var(--space-2) 0 var(--space-6) 0;
    box-shadow: none;
    backdrop-filter: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}
.overview-desc {
    font-size: 0.92rem;
    color: var(--foreground);
    opacity: 0.9;
    line-height: 1.65;
    margin: 0;
    font-family: var(--font-sans);
}
.genre-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}
.genre-tag {
    display: inline-flex;
    align-items: center;
    background: rgba(var(--accent-rgb), 0.08);
    color: var(--accent);
    border: 1px solid rgba(var(--accent-rgb), 0.2);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    font-size: 0.72rem;
    font-weight: 600;
    font-family: var(--font-display);
    letter-spacing: 0.02em;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.genre-tag:hover {
    background: rgba(var(--accent-rgb), 0.16);
    border-color: rgba(var(--accent-rgb), 0.35);
    transform: translateY(-1px);
}

/* Mobile-only action button */
.mobile-only {
    display: none;
}
.action-row {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-2);
    justify-content: flex-end;
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

/* Achievements Showcase Section */
.achievements-section {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}
.ach-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-3);
}
.ach-title-group {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}
.ach-heading {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    font-family: var(--font-display);
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--foreground);
}
.ach-heading i {
    color: #fbbf24;
}
.ach-counter {
    font-size: 0.92rem;
    font-family: var(--font-display);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    gap: 6px;
}
.ach-counter strong {
    color: var(--foreground);
    font-weight: 700;
}
.ach-percent-badge {
    background: rgba(var(--accent-rgb), 0.12);
    color: var(--accent);
    padding: 2px 9px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    font-family: var(--font-display);
}

.ach-filter-group {
    display: flex;
    gap: 4px;
    background: rgba(125, 125, 125, 0.08);
    padding: 4px;
    border-radius: var(--radius-full);
    border: 1px solid var(--card-border);
}
.ach-filter-btn {
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    font-size: 0.75rem;
    font-weight: 600;
    font-family: var(--font-display);
    padding: 4px 14px;
    border-radius: var(--radius-full);
    transition: all 0.2s ease;
}
.ach-filter-btn.active {
    background: var(--card-bg-solid, #ffffff);
    color: var(--foreground);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.ach-progress-track {
    width: 100%;
    height: 7px;
    background: rgba(125, 125, 125, 0.15);
    border-radius: var(--radius-full);
    overflow: hidden;
}
.ach-progress-bar {
    height: 100%;
    background: var(--accent-gradient);
    border-radius: var(--radius-full);
    box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.35);
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Achievements List Grid */
.ach-list-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
}

.ach-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 12px 14px;
    border-radius: var(--radius-md);
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.2s ease,
                box-shadow 0.2s ease,
                background 0.2s ease;
    backdrop-filter: blur(8px);
}
.ach-item:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--accent-rgb), 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.ach-item.unlocked {
    border-color: rgba(var(--accent-rgb), 0.2);
    background: rgba(var(--accent-rgb), 0.04);
}
.ach-item.locked {
    opacity: 0.6;
    background: rgba(0, 0, 0, 0.02);
}
.ach-item.locked:hover {
    opacity: 0.85;
}

.ach-icon-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.ach-icon-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.ach-badge-status {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 17px;
    height: 17px;
    border-radius: 6px 0 6px 0;
    background: rgba(71, 85, 105, 0.95);
    color: white;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
}
.ach-badge-status.is-achieved {
    background: #10b981;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.ach-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.ach-item-title {
    font-size: 0.85rem;
    font-weight: 600;
    font-family: var(--font-display);
    color: var(--foreground);
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ach-item-desc {
    font-size: 0.74rem;
    font-family: var(--font-sans);
    color: var(--muted-foreground);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Mobile preservation (kept intact per strict instructions) */
@media (max-width: 576px) {
    .modal-mask {
        padding: var(--space-3);
    }
    .modal-wrapper {
        max-width: 100%;
    }
    .modal-container {
        border: none !important;
        border-color: transparent !important;
        outline: none !important;
    }
    .modal-body {
        padding: var(--space-4) var(--space-4) var(--space-6);
        gap: var(--space-4);
    }
    .game-overview-card {
        padding: 0 0 var(--space-3) 0;
        gap: var(--space-3);
    }
    .game-banner {
        min-height: 200px;
        padding: var(--space-4);
    }
    .game-banner-overlay {
        padding: 0;
        background: transparent;
        backdrop-filter: none;
        width: 100%;
    }
    .banner-main-row {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
        width: 100%;
    }
    .banner-title-area {
        width: 100%;
    }
    .game-title {
        font-size: 1.25rem;
        margin-bottom: var(--space-2);
        padding-right: 36px;
    }
    .game-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: var(--space-2);
        width: 100%;
    }
    .title-icon {
        display: none;
    }
    .meta-pill {
        font-size: 0.72rem;
        padding: 4px 9px;
    }
    .close-btn {
        top: var(--space-3);
        right: var(--space-3);
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
    }
    .desktop-cta {
        display: none !important;
    }
    .mobile-only {
        display: flex !important;
    }
    .ach-list-container {
        grid-template-columns: 1fr;
        max-height: 240px;
        overflow-y: auto;
    }
    .ach-header {
        flex-direction: column;
        align-items: flex-start;
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
