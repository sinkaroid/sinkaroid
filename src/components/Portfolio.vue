<template>
  <section class="section portfolio-section" id="portfolio">
    <div class="section-header">
      <h2 class="section-title" :style="{ backgroundImage: titleGradient }">Artifacts & Chronicles</h2>
      <p class="section-subtitle">
        Relics forged through countless quests, each carrying a story of its own. {{ all_info.length }} OSS projects, {{ standalone_info.length }} standalone projects, & {{ design_info.length }} illustrations.
      </p>
    </div>

    <!-- Capsule Tabs Switcher -->
    <div class="tabs-container">
      <div class="capsule-tabs">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          class="tab-btn clickable"
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab 1: Opensource Projects -->
    <div v-if="activeTab === 'opensource'" class="tab-content">
      <div class="row">
        <div
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          v-for="(portfolio, idx) in displayedOpenSource"
          :key="portfolio.name"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="portfolio"
            @show="showModalFn"
            :nightMode="nightMode"
          />
        </div>
      </div>
      <div class="text-center py-4" v-if="hasMoreOpenSource">
        <button class="btn-secondary clickable btn-enter" @click="showMore">
          Load More
        </button>
      </div>
    </div>

    <!-- Tab 2: Standalone Projects -->
    <div v-if="activeTab === 'standalone'" class="tab-content">
      <div class="row">
        <div
          v-for="(project, idx) in standalone_info"
          :key="idx"
          class="col-xl-6 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Bento-style Project Glass Card -->
          <div class="bento-card project-slider-card">
            <div class="slider-image-preview" @click="showDesignModalFn(project)">
              <img 
                :src="project.pictures && project.pictures[0] ? project.pictures[0].img : '/public/icon.png'" 
                class="preview-img" 
                alt="Project preview" 
              />
              <div class="slider-overlay">
                <span><i class="fas fa-search-plus"></i> View Details</span>
              </div>
            </div>
            
            <div class="project-details">
              <div class="details-text">
                <h4 class="project-title">{{ project.title }}</h4>
                <div class="project-meta">
                  <span class="project-date"><i class="far fa-calendar"></i> {{ project.date }}</span>
                </div>
              </div>

              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech" 
                  class="badge"
                >
                  {{ tech }}
                </span>
              </div>

              <button 
                class="btn-secondary clickable view-more-btn"
                @click.prevent="showDesignModalFn(project)"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Illustrations -->
    <div v-if="activeTab === 'illustrations'" class="tab-content">
      <div class="row">
        <div
          v-for="(artwork, idx) in design_info"
          :key="idx"
          class="col-xl-6 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Bento-style Artwork Glass Card -->
          <div class="bento-card project-slider-card">
            <div class="slider-image-preview" @click="showDesignModalFn(artwork)">
              <img 
                :src="artwork.pictures && artwork.pictures[0] ? artwork.pictures[0].img : '/public/icon.png'" 
                class="preview-img" 
                alt="Artwork preview" 
              />
              <div class="slider-overlay">
                <span><i class="fas fa-search-plus"></i> View Artwork</span>
              </div>
            </div>
            
            <div class="project-details">
              <div class="details-text">
                <h4 class="project-title">{{ artwork.title }}</h4>
                <div class="project-meta">
                  <span class="project-date"><i class="far fa-calendar"></i> {{ artwork.date }}</span>
                </div>
              </div>

              <div class="project-tech">
                <span 
                  v-for="tech in artwork.technologies" 
                  :key="tech" 
                  class="badge"
                >
                  {{ tech }}
                </span>
              </div>

              <button 
                class="btn-secondary clickable view-more-btn"
                @click.prevent="showDesignModalFn(artwork)"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal components -->
    <Modal
      v-if="showModal"
      :showModal="showModal"
      :portfolio="modal_info"
      :nightMode="nightMode"
      @close="closeModal"
    />

    <DesignModal
      v-if="showDesignModal"
      :showModal="showDesignModal"
      :portfolio="design_modal_info"
      :nightMode="nightMode"
      @close="closeModal"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Card from "./helpers/Card.vue";
import Modal from "./helpers/Modal.vue";
import DesignModal from "./helpers/DesignModal.vue";
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

// Mock data integration
const all_info = info.portfolio || [];
const design_info = info.portfolio_design || [];
const standalone_info = info.portfolio_standalone || [];

// Custom Tab State
const activeTab = ref("opensource");
const tabItems = [
  { id: "opensource", label: "Open Source", icon: "fa fa-code-branch" },
  { id: "standalone", label: "Standalone / Trade", icon: "fa fa-laptop-code" },
  { id: "illustrations", label: "Illustrations", icon: "fa fa-palette" }
];

// Open Source Load More state
const itemsCount = ref(3);
const displayedOpenSource = computed(() => {
  return all_info.slice(0, itemsCount.value);
});
const hasMoreOpenSource = computed(() => {
  return itemsCount.value < all_info.length;
});

const showMore = () => {
  itemsCount.value = Math.min(itemsCount.value + 3, all_info.length);
};

// Modal Control State
const showModal = ref(false);
const showDesignModal = ref(false);
const modal_info = ref({});
const design_modal_info = ref({});

const showModalFn = (item) => {
  modal_info.value = item;
  showModal.value = true;
};

const showDesignModalFn = (item) => {
  design_modal_info.value = item;
  showDesignModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  showDesignModal.value = false;
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
    flex-shrink: 0;
    width: max-content;
  }
  .tab-btn {
    flex-direction: column;
    padding: 6px 10px;
    font-size: 0.65rem;
    line-height: 1.2;
    gap: var(--space-1);
  }
}

/* Standalone & Illustrations Cards */
.project-slider-card {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  height: 380px;
  overflow: hidden;
  border-radius: var(--radius-md) !important;
}

.slider-image-preview {
  height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.slider-overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 9, 11, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: var(--font-display);
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.slider-image-preview:hover .preview-img {
  transform: scale(1.03);
}

.slider-image-preview:hover .slider-overlay {
  opacity: 1;
}

.project-details {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-title {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--foreground);
}

.project-meta {
  font-size: 0.8rem;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.project-tech {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 48px;
  margin: var(--space-2) 0;
}

.view-more-btn {
  font-size: 0.8rem;
  width: 100%;
  margin-top: auto;
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
