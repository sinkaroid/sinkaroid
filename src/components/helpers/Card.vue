<template>
  <div class="card-wrapper">
    <div class="bento-card card-component">
      <!-- Image cover area -->
      <div class="card-image-container">
        <img
          class="card-img"
          :src="portfolio.pictures && portfolio.pictures[0] ? portfolio.pictures[0].img : '/icon.png'"
          :alt="portfolio.name || portfolio.title"
          loading="lazy"
        />
        
        <!-- Score/Rating overlay (for Anime/Manga) -->
        <div v-if="portfolio.score" class="score-badge">
          <i class="fas fa-star"></i> {{ portfolio.score }}
        </div>

        <!-- Language icon overlay (for Repositories) -->
        <img v-if="portfolio.bahasa" class="lang-icon" :src="portfolio.bahasa" alt="language" />
      </div>

      <!-- Content area -->
      <div class="card-content">
        <h4 class="card-title">{{ portfolio.name || portfolio.title }}</h4>
        
        <!-- Tags/Tech Pills -->
        <div class="card-tags-scroll">
          <span
            class="badge"
            v-for="tech in tags"
            :key="tech"
          >
            {{ tech }}
          </span>
        </div>

        <p class="card-description">
          {{ truncatedDescription }}
        </p>

        <!-- Actions -->
        <div class="card-actions">
          <button
            class="btn-secondary clickable"
            @click.prevent="showModal"
          >
            <i class="fas fa-search"></i> Details
          </button>
          
          <a
            v-if="visitUrl"
            :href="visitUrl"
            target="_blank"
            class="btn-primary clickable"
            style="font-size: 0.8rem; padding: 6px 12px;"
          >
            <i class="fas fa-external-link-alt"></i> Go
          </a>
        </div>
      </div>

      <!-- Card footer (Commit/Release) -->
      <div v-if="portfolio.release || portfolio.timeago" class="card-footer-info">
        <a 
          v-if="portfolio.link_commit" 
          :href="portfolio.link_commit" 
          target="_blank"
          class="commit-link clickable"
        >
          <i class="fas fa-code-branch"></i> {{ portfolio.release || 'Commit' }}
        </a>
        <span v-else class="timeago-info">
          <i class="far fa-clock"></i> {{ portfolio.timeago || portfolio.date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  portfolio: {
    type: Object,
    required: true
  },
  nightMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["show"]);

const tags = computed(() => {
  return props.portfolio.technologies || props.portfolio.tag || [];
});

const visitUrl = computed(() => {
  return props.portfolio.visit || props.portfolio.link || null;
});

const truncatedDescription = computed(() => {
  const desc = props.portfolio.synopsis || props.portfolio.description || "";
  return desc.length > 70 ? desc.substring(0, 67) + "..." : desc;
});

const showModal = () => {
  emit("show", props.portfolio);
};
</script>

<style scoped>
.card-wrapper {
  height: 100%;
}

.card-component {
  height: 420px;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  border-radius: var(--radius-md) !important;
}

.card-image-container {
  position: relative;
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.06);
  line-height: 0;
}

.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-theme .card-image-container {
  background: rgba(255, 255, 255, 0.04);
}

.card-component:hover .card-img {
  transform: scale(1.05);
}

.score-badge {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  background: rgba(9, 9, 11, 0.7);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fbbf24; /* Star Yellow */
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.lang-icon {
  position: absolute;
  bottom: -20px;
  right: var(--space-3);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.5s ease, bottom 0.3s ease;
  background: var(--bg-app);
  z-index: 2;
}

.card-component:hover .lang-icon {
  transform: rotate(360deg) scale(1.1);
  bottom: -16px;
}

.card-content {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  overflow: hidden;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.3;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-tags-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
  margin-bottom: var(--space-1);
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.card-tags-scroll::-webkit-scrollbar {
  display: none;
}

.card-description {
  font-size: 0.85rem;
  color: var(--muted-foreground);
  line-height: 1.4;
  text-align: left;
  flex: 1;
  overflow: hidden;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: var(--space-2);
}

.card-actions button, .card-actions a {
  flex: 1;
}

.card-footer-info {
  border-top: 1px solid var(--card-border);
  padding: var(--space-2) var(--space-4);
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.dark-theme .card-footer-info {
  background: rgba(255, 255, 255, 0.01);
}

.commit-link {
  color: var(--muted-foreground);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.commit-link:hover {
  color: var(--accent);
}
</style>
