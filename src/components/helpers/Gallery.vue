<template>
  <div class="gallery-container">
    <div class="gallery-grid">
      <div
        v-for="(image, idx) in images"
        :key="image.title || idx"
        class="gallery-item-wrapper"
        :class="{ 'full-width': design || images.length === 1 }"
      >
        <div
          class="gallery-image-card"
          :class="{ 'single-image': images.length === 1 }"
          @click="openLightbox(idx)"
        >
          <img
            :src="image.img"
            :alt="image.title"
            class="gallery-image clickable"
            loading="lazy"
          >
          <div
            v-if="image.title"
            class="gallery-caption-overlay"
          >
            <span class="gallery-image-title">{{ image.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxOpen"
          class="lightbox-overlay"
          @click.self="closeLightbox"
        >
          <button
            class="lightbox-close clickable"
            aria-label="Close lightbox"
            @click="closeLightbox"
          >
            <i class="fas fa-times" />
          </button>
          
          <button 
            v-if="images.length > 1" 
            class="lightbox-nav prev clickable" 
            aria-label="Previous image"
            @click="prevImage"
          >
            <i class="fas fa-chevron-left" />
          </button>

          <div class="lightbox-content">
            <img 
              :src="images[activeIdx].img" 
              :alt="images[activeIdx].title" 
              class="lightbox-image" 
            >
            <p
              v-if="images[activeIdx].title"
              class="lightbox-caption"
            >
              {{ images[activeIdx].title }}
            </p>
          </div>

          <button 
            v-if="images.length > 1" 
            class="lightbox-nav next clickable" 
            aria-label="Next image"
            @click="nextImage"
          >
            <i class="fas fa-chevron-right" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  design: {
    type: Boolean,
    default: false
  }
});

const lightboxOpen = ref(false);
const activeIdx = ref(0);

const openLightbox = (idx) => {
  activeIdx.value = idx;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
};

const nextImage = () => {
  activeIdx.value = (activeIdx.value + 1) % props.images.length;
};

const prevImage = () => {
  activeIdx.value = (activeIdx.value - 1 + props.images.length) % props.images.length;
};
</script>

<style scoped>
.gallery-container {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.gallery-item-wrapper.full-width {
  grid-column: span 2;
}

@media (max-width: 576px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  .gallery-item-wrapper.full-width {
    grid-column: span 1;
  }
}

.gallery-image-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--card-border);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  cursor: pointer;
  aspect-ratio: 16/10;
  background: rgba(0, 0, 0, 0.05);
}

.gallery-image-card.single-image {
  aspect-ratio: auto;
  background: transparent;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: block;
}

.gallery-image-card.single-image .gallery-image {
  height: auto;
  object-fit: contain;
}

.gallery-image-card:hover .gallery-image {
  transform: scale(1.04);
}

.gallery-caption-overlay {
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  background: linear-gradient(to top, rgba(9, 9, 11, 0.8) 0%, rgba(9, 9, 11, 0) 100%);
  padding: var(--space-3);
  color: white;
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-image-card:hover .gallery-caption-overlay {
  opacity: 1;
}

.gallery-image-title {
  font-size: 0.85rem;
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.lightbox-content {
  position: relative;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.lightbox-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
}

.lightbox-caption {
  color: #fafafa;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: none;
  color: #fafafa;
  font-size: 1.8rem;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s;
  z-index: 100001;
}

.lightbox-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100001;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.15);
  scale: 1.05;
}

.lightbox-nav.prev { left: 2rem; }
.lightbox-nav.next { right: 2rem; }

@media (max-width: 768px) {
  .lightbox-nav {
    display: none; /* Hide nav arrows on touch devices (user can tap or click easily) */
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
