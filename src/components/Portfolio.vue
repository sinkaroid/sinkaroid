<template>
  <section
    id="portfolio"
    class="section portfolio-section"
  >
    <div class="section-header">
      <h2
        class="section-title"
        :style="{ backgroundImage: titleGradient }"
      >
        Artifacts & Chronicles
      </h2>
      <p class="section-subtitle">
        Relics forged through countless quests, each carrying a story of its own. {{ all_info.length }} open-source projecst, {{ standalone_info.length }} SaS (standalone), {{ sas_info.length }} SaS (closed-source), & {{ design_info.length }} illustrations and repository branding.
      </p>
    </div>

    <!-- Capsule Tabs Switcher (Desktop) -->
    <div class="tabs-container tabs-desktop">
      <div class="capsule-tabs">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          class="tab-btn clickable"
          :class="{ 'active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon" /> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Mobile Action Sheet Trigger -->
    <div class="tabs-container tabs-mobile">
      <button
        class="tabs-trigger clickable"
        aria-label="Open tab selector"
        @click="showActionSheet = true"
      >
        <i :class="currentTab.icon" />
        <span>{{ currentTab.label }}</span>
        <i class="fas fa-chevron-down trigger-chevron" />
      </button>
    </div>

    <!-- Action Sheet (mobile alternative) -->
    <Teleport to="body">
      <Transition name="action-sheet">
        <div
          v-if="showActionSheet"
          class="action-sheet-overlay"
          @click.self="showActionSheet = false"
        >
          <div
            class="action-sheet"
            role="dialog"
            aria-modal="true"
          >
            <div class="action-sheet-header">
              <span class="action-sheet-title">Select Category</span>
              <button
                class="action-sheet-close clickable"
                aria-label="Close"
                @click="showActionSheet = false"
              >
                <i class="fas fa-times" />
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
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
                <i
                  v-if="activeTab === tab.id"
                  class="fas fa-check check-mark"
                />
              </li>
            </ul>
            <button
              class="action-sheet-cancel clickable"
              @click="showActionSheet = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tab 1: Opensource Projects -->
    <div
      v-if="activeTab === 'opensource'"
      class="tab-content"
    >
      <div class="row">
        <div
          v-for="(portfolio, idx) in displayedOpenSource"
          :key="portfolio.name"
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="portfolio"
            :night-mode="nightMode"
            @show="showModalFn"
          />
        </div>
      </div>
      <div
        v-if="hasMoreOpenSource"
        class="text-center py-4"
      >
        <button
          class="btn-secondary clickable btn-enter"
          @click="showMore"
        >
          Load More
        </button>
      </div>
    </div>

    <!-- Tab 2: Standalone Projects -->
    <div
      v-if="activeTab === 'standalone'"
      class="tab-content"
    >
      <div class="row">
        <div
          v-for="(project, idx) in standalone_info"
          :key="idx"
          class="col-xl-6 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Bento-style Project Glass Card -->
          <div class="bento-card project-slider-card">
            <div
              class="slider-image-preview"
              @click="showDesignModalFn(project)"
            >
              <img 
                :src="project.pictures && project.pictures[0] ? project.pictures[0].img : '/public/icon.png'" 
                class="preview-img" 
                alt="Project preview" 
              >
              <div class="slider-overlay">
                <span><i class="fas fa-search-plus" /> View Details</span>
              </div>
            </div>
            
            <div class="project-details">
              <div class="details-text">
                <h4 class="project-title">
                  {{ project.title }}
                </h4>
                <div class="project-meta">
                  <span class="project-date"><i class="far fa-calendar" /> {{ project.date }}</span>
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

              <div class="card-actions">
                <button 
                  class="btn-secondary clickable"
                  @click.prevent="showDesignModalFn(project)"
                >
                  <i class="fas fa-search" /> Details
                </button>
                <a
                  v-if="project.visit || project.link"
                  :href="project.visit || project.link"
                  target="_blank"
                  class="btn-primary clickable"
                >
                  <i class="fas fa-external-link-alt" /> Go
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: SaS (closed source) -->
    <div
      v-if="activeTab === 'sas'"
      class="tab-content"
    >
      <div class="row">
        <div
          v-for="(repo, idx) in sas_info"
          :key="repo.name"
          class="col-xl-4 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <Card
            :portfolio="repo"
            :night-mode="nightMode"
            @show="showModalFn"
          />
        </div>
      </div>
    </div>

    <!-- Tab 4: Illustrations -->
    <div
      v-if="activeTab === 'illustrations'"
      class="tab-content"
    >
      <div class="row">
        <div
          v-for="(artwork, idx) in design_info"
          :key="idx"
          class="col-xl-6 col-md-6 col-12 mb-4 card-enter"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          <!-- Bento-style Artwork Glass Card -->
          <div class="bento-card project-slider-card">
            <div
              class="slider-image-preview"
              @click="showDesignModalFn(artwork)"
            >
              <img 
                :src="artwork.pictures && artwork.pictures[0] ? artwork.pictures[0].img : '/public/icon.png'" 
                class="preview-img" 
                alt="Artwork preview" 
              >
              <div class="slider-overlay">
                <span><i class="fas fa-search-plus" /> View Artwork</span>
              </div>
            </div>
            
            <div class="project-details">
              <div class="details-text">
                <h4 class="project-title">
                  {{ artwork.title }}
                </h4>
                <div class="project-meta">
                  <span class="project-date"><i class="far fa-calendar" /> {{ artwork.date }}</span>
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

              <div class="card-actions">
                <button 
                  class="btn-secondary clickable"
                  @click.prevent="showDesignModalFn(artwork)"
                >
                  <i class="fas fa-search" /> Details
                </button>
                <a
                  v-if="artwork.visit || artwork.link"
                  :href="artwork.visit || artwork.link"
                  target="_blank"
                  class="btn-primary clickable"
                >
                  <i class="fas fa-external-link-alt" /> Go
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal components -->
    <Modal
      v-if="showModal"
      :show-modal="showModal"
      :portfolio="modal_info"
      :night-mode="nightMode"
      @close="closeModal"
    />

    <DesignModal
      v-if="showDesignModal"
      :show-modal="showDesignModal"
      :portfolio="design_modal_info"
      :night-mode="nightMode"
      @close="closeModal"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Card from "./helpers/Card.vue";
import Modal from "./helpers/Modal.vue";
import DesignModal from "./helpers/DesignModal.vue";
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

// Mock data integration
const all_info = info.portfolio || [];
const design_info = info.portfolio_design || [];
const standalone_info = info.portfolio_standalone || [];
const sas_info = info.portfolio_sas || [];

// Custom Tab State
const activeTab = ref("opensource");
const showActionSheet = ref(false);
const tabItems = [
  { id: "opensource", label: "Open Source", icon: "fa fa-code-branch" },
  { id: "standalone", label: "SaS (Standalone)", icon: "fa fa-laptop-code" },
  { id: "sas", label: "SaS (Closed source)", icon: "fa fa-lock" },
  { id: "illustrations", label: "Illustrations", icon: "fa fa-palette" }
];

const currentTab = computed(() => {
  return tabItems.find((t) => t.id === activeTab.value) || tabItems[0];
});

const selectTab = (id) => {
  activeTab.value = id;
  showActionSheet.value = false;
};

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

/* Action Sheet overlay & panel */
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

/* Slide-up transition */
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

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: var(--space-2);
  width: 100%;
}

.card-actions button,
.card-actions a {
  flex: 1;
  font-size: 0.8rem;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
