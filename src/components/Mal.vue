<template>
  <section class="section mal-section" id="activity">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">No Code Activity</h2>
      <p class="section-subtitle">
  Away from the workshop, I answer a different calling—exploring mythical worlds in
  <a href="https://steamcommunity.com/id/sinkaroid/" target="_blank" rel="noopener noreferrer">gaming</a>,
  following legendary heroes through
  <a href="https://myanimelist.net/profile/sinkaroid" target="_blank" rel="noopener noreferrer">anime</a>,
  and collecting forgotten tales from
  <a href="https://myanimelist.net/profile/sinkaroid" target="_blank" rel="noopener noreferrer">manga</a>.
</p>
    </div>

    <!-- Capsule Tabs Switcher (Desktop) -->
    <div class="tabs-container tabs-desktop">
      <div class="capsule-tabs">
        <button
          class="tab-btn clickable"
          :class="{ 'active': activeTab === 'game' }"
          @click="activeTab = 'game'"
        >
          <i class="fas fa-gamepad"></i> Playing
        </button>
        <button
          class="tab-btn clickable"
          :class="{ 'active': activeTab === 'anime' }"
          @click="activeTab = 'anime'"
        >
          <i class="fas fa-tv"></i> Watching
        </button>
        <button
          class="tab-btn clickable"
          :class="{ 'active': activeTab === 'manga' }"
          @click="activeTab = 'manga'"
        >
          <i class="fas fa-book-open"></i> Reading
        </button>
      </div>
    </div>

    <!-- Mobile Action Sheet Trigger -->
    <div class="tabs-container tabs-mobile">
      <button
        class="tabs-trigger clickable"
        @click="showActionSheet = true"
        aria-label="Open tab selector"
      >
        <i :class="currentTab.icon"></i>
        <span>{{ currentTab.label }}</span>
        <i class="fas fa-chevron-down trigger-chevron"></i>
      </button>
    </div>

    <!-- Action Sheet (mobile alternative) -->
    <Teleport to="body">
      <Transition name="action-sheet">
        <div v-if="showActionSheet" class="action-sheet-overlay" @click.self="showActionSheet = false">
          <div class="action-sheet" role="dialog" aria-modal="true">
            <div class="action-sheet-header">
              <span class="action-sheet-title">Select Category</span>
              <button class="action-sheet-close clickable" @click="showActionSheet = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <ul class="action-sheet-list">
              <li
                v-for="tab in tabItems"
                :key="tab.id"
                class="action-sheet-item clickable"
                :class="{ 'is-active': activeTab === tab.id }"
                @click="selectTab(tab.id)"
              >
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
                <i v-if="activeTab === tab.id" class="fas fa-check check-mark"></i>
              </li>
            </ul>
            <button class="action-sheet-cancel clickable" @click="showActionSheet = false">
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tab 0: Last Played (Steam) -->
    <div v-if="activeTab === 'game'" class="tab-content">
      <div class="row">
        <div
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          v-for="(item, idx) in displayedGame"
          :key="item.appID"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="item"
            @show="showModalFn"
            :nightMode="nightMode"
          />
        </div>
      </div>
      <div class="text-center py-4" v-if="hasMoreGame">
        <button class="btn-secondary clickable btn-enter" @click="showMore">
          Load More
        </button>
      </div>
    </div>

    <!-- Tab 1: Anime List -->
    <div v-if="activeTab === 'anime'" class="tab-content">
      <div class="row">
        <div
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          v-for="(item, idx) in displayedAnime"
          :key="item.title"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="item"
            @show="showModalFn"
            :nightMode="nightMode"
          />
        </div>
      </div>
      <div class="text-center py-4" v-if="hasMoreAnime">
        <button class="btn-secondary clickable btn-enter" @click="showMore">
          Load More
        </button>
      </div>
    </div>

    <!-- Tab 2: Manga List -->
    <div v-if="activeTab === 'manga'" class="tab-content">
      <div class="row">
        <div
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          v-for="(item, idx) in displayedManga"
          :key="item.title"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="item"
            @show="showModalFn"
            :nightMode="nightMode"
          />
        </div>
      </div>
      <div class="text-center py-4" v-if="hasMoreManga">
        <button class="btn-secondary clickable btn-enter" @click="showMore">
          Load More
        </button>
      </div>
    </div>

    <!-- Details Modal: Game uses GameModal, Anime/Manga use MalModal -->
    <GameModal
      v-if="activeTab === 'game' && showModal"
      :showModal="showModal"
      :portfolio="modal_info"
      :nightMode="nightMode"
      @close="closeModal"
    />
    <MalModal
      v-else-if="showModal"
      :showModal="showModal"
      :portfolio="modal_info"
      :nightMode="nightMode"
      @close="closeModal"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Card from "./helpers/Card.vue";
import MalModal from "./helpers/MalModal.vue";
import GameModal from "./helpers/GameModal.vue";
import { randomGradient } from "../composables/useRandomGradient";

// Import locally generated metadata
import animeData from "../../mock/data_anime.json";
import mangaData from "../../mock/data_manga.json";
import gameData from "../../mock/data_game.json";

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

const animeList = animeData.data || [];
const mangaList = mangaData.data_manga || [];
const gameList = (gameData.data || []).map((game) => ({
    ...game,
    title: game.name,
    link: game.storeLink,
    image: game.header,
    pictures: [{ img: game.header }],
    description: game.shortDescription || game.description,
    tag: [
        `${Math.floor(game.playtimeForever / 60)}h played`,
        `last ${game.timeago}`
    ]
}));

const activeTab = ref("game");
const showActionSheet = ref(false);
const tabItems = [
    { id: "game", label: "Last played", icon: "fas fa-gamepad" },
    { id: "anime", label: "Anime", icon: "fas fa-tv" },
    { id: "manga", label: "Manga", icon: "fas fa-book-open" }
];

const currentTab = computed(() => {
  return tabItems.find((t) => t.id === activeTab.value) || tabItems[0];
});

const selectTab = (id) => {
  activeTab.value = id;
  showActionSheet.value = false;
};

// Load More State
const animeLimit = ref(3);
const mangaLimit = ref(3);
const gameLimit = ref(3);

const displayedAnime = computed(() => {
    return animeList.slice(0, animeLimit.value);
});

const displayedManga = computed(() => {
    return mangaList.slice(0, mangaLimit.value);
});

const displayedGame = computed(() => {
    return gameList.slice(0, gameLimit.value);
});

const hasMoreAnime = computed(() => {
    return animeLimit.value < animeList.length;
});

const hasMoreManga = computed(() => {
    return mangaLimit.value < mangaList.length;
});

const hasMoreGame = computed(() => {
    return gameLimit.value < gameList.length;
});

const showMore = () => {
    if (activeTab.value === "anime") {
        animeLimit.value = Math.min(animeLimit.value + 3, animeList.length);
    } else if (activeTab.value === "manga") {
        mangaLimit.value = Math.min(mangaLimit.value + 3, mangaList.length);
    } else if (activeTab.value === "game") {
        gameLimit.value = Math.min(gameLimit.value + 3, gameList.length);
    }
};

// Modal Handling
const showModal = ref(false);
const modal_info = ref({});

const showModalFn = (item) => {
  modal_info.value = item;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* Tabs controls */
.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.capsule-tabs {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 6px;
  border-radius: var(--radius-full);
  display: inline-flex;
  gap: 4px;
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-blur);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  color: var(--foreground);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.tab-btn i {
  color: var(--muted-foreground);
}

.tab-btn:hover {
  color: var(--accent);
}

.tab-btn.active {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.25);
}

.tab-btn.active i {
  color: white;
}

/* Mobile-specific: swap capsule-tabs with trigger + action sheet */
.tabs-mobile {
  display: none;
}

@media (max-width: 576px) {
  .tabs-desktop {
    display: none;
  }
  .tabs-mobile {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-6);
  }
}

.tabs-trigger {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 12px 22px;
  border-radius: var(--radius-full);
  color: var(--foreground);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-blur);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tabs-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.tabs-trigger .trigger-chevron {
  color: var(--muted-foreground);
  font-size: 0.75rem;
}

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

.card-enter {
  opacity: 0;
  animation: card-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.btn-enter {
  opacity: 0;
  animation: btn-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

@keyframes card-fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes btn-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
