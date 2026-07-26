<template>
  <section class="section mal-section" id="myanimelist">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">MyAnimeList Activity</h2>
      <p class="section-subtitle">
        I track my anime and manga journey. 
        Synchronized with <a href="https://myanimelist.net/profile/sinkaroid" target="_blank" class="clickable">@sinkaroid</a> using Jikan API.
      </p>
    </div>

    <!-- Capsule Tabs Switcher -->
    <div class="tabs-container">
      <div class="capsule-tabs">
        <button
          class="tab-btn clickable"
          :class="{ 'active': activeTab === 'anime' }"
          @click="activeTab = 'anime'"
        >
          <i class="fas fa-tv"></i> Anime
        </button>
        <button
          class="tab-btn clickable"
          :class="{ 'active': activeTab === 'manga' }"
          @click="activeTab = 'manga'"
        >
          <i class="fas fa-book-open"></i> Manga
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

    <!-- Details Modal (Newspaper style for MAL) -->
    <MalModal
      v-if="showModal"
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
import { randomGradient } from "../composables/useRandomGradient";

// Import locally generated metadata
import animeData from "../../mock/_anime.json";
import mangaData from "../../mock/_manga.json";

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

const activeTab = ref("anime");

// Load More State
const animeLimit = ref(3);
const mangaLimit = ref(3);

const displayedAnime = computed(() => {
  return animeList.slice(0, animeLimit.value);
});

const displayedManga = computed(() => {
  return mangaList.slice(0, mangaLimit.value);
});

const hasMoreAnime = computed(() => {
  return animeLimit.value < animeList.length;
});

const hasMoreManga = computed(() => {
  return mangaLimit.value < mangaList.length;
});

const showMore = () => {
  if (activeTab.value === "anime") {
    animeLimit.value = Math.min(animeLimit.value + 3, animeList.length);
  } else {
    mangaLimit.value = Math.min(mangaLimit.value + 3, mangaList.length);
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

@media (max-width: 576px) {
  .tabs-container {
    justify-content: flex-start;
    overflow-x: auto;
    padding: 4px var(--space-4);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs-container::-webkit-scrollbar {
    display: none;
  }
  .capsule-tabs {
    display: flex;
    width: max-content;
  }
  .tab-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
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
