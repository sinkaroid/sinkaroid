<template>
  <div class="timeline-container">
    <h3 class="timeline-header">
      {{ data.title }}
    </h3>
    
    <div class="timeline-list">
      <div 
        v-for="(item, idx) in data.data" 
        :key="item.name" 
        class="timeline-item"
        :style="{ animationDelay: `${idx * 0.15}s` }"
      >
        <!-- Timeline track line indicator -->
        <div class="timeline-marker">
          <div class="marker-dot" />
          <div class="marker-line" />
        </div>
        
        <!-- Timeline Bento Glass Card -->
        <div class="timeline-card bento-card">
          <div class="card-header">
            <div>
              <h4 class="card-title">
                {{ item.name }}
              </h4>
              <span class="card-location">{{ item.place }}</span>
            </div>
            
            <a 
              v-if="item.link" 
              :href="item.link" 
              target="_blank" 
              class="learn-more-link"
              aria-label="Learn more about this experience"
            >
              <i class="fas fa-external-link-alt" />
            </a>
          </div>
          
          <div class="card-sub-header">
            <span class="card-degree">{{ item.degree || item.position }}</span>
            <span class="card-date"><i class="far fa-calendar-alt" /> {{ item.date }}</span>
          </div>

          <p class="card-description">
            {{ item.description }}
          </p>
          
          <div class="card-tags">
            <span 
              v-for="skill in item.skills" 
              :key="skill" 
              class="badge"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  },
  nightMode: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.timeline-header {
  font-size: 1.5rem;
  font-family: var(--font-display);
  margin-bottom: var(--space-4);
  color: var(--foreground);
}

.timeline-list {
  display: flex;
  flex-direction: column;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: var(--space-6);
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-up-fade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.marker-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-gradient);
  border: 3px solid var(--bg-app);
  box-shadow: 0 0 0 1px var(--card-border);
  z-index: 2;
  transition: transform 0.25s ease;
}

.timeline-item:hover .marker-dot {
  transform: scale(1.3);
}

.marker-line {
  flex: 1;
  width: 2px;
  background: var(--card-border);
  margin: 4px 0;
  z-index: 1;
}

.timeline-item:last-child .marker-line {
  display: none;
}

.timeline-card {
  flex: 1;
  margin-bottom: var(--space-6);
  padding: var(--space-4) var(--space-6) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--foreground);
}

.card-location {
  font-size: 0.8rem;
  color: var(--muted-foreground);
}

.learn-more-link {
  color: var(--muted-foreground);
  font-size: 0.9rem;
  padding: 4px;
  transition: color 0.2s ease, transform 0.2s ease;
}

.learn-more-link:hover {
  color: var(--accent);
  transform: scale(1.1);
}

.card-sub-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: var(--space-3);
  gap: var(--space-2);
}

.card-degree {
  font-weight: 500;
  color: var(--accent);
}

.card-date {
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.card-description {
  font-size: 0.9rem;
  color: var(--foreground);
  opacity: 0.95;
  margin-bottom: var(--space-4);
  text-align: left;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

@media (max-width: 576px) {
  .timeline-item {
    gap: var(--space-3);
  }
}
</style>
