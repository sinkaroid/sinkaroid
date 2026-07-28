<template>
  <div
    v-if="isVisible"
    class="custom-cursor"
  >
    <div
      ref="circleRef"
      class="custom-cursor__circle"
      :style="circleStyle"
    />
    <div
      ref="dotRef"
      class="custom-cursor__dot"
      :style="dotStyle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  targets: {
    type: Array,
    default: () => ["a", "button", "input", "textarea"]
  },
  circleColor: {
    type: String,
    default: "#3b82f6"
  },
  circleColorHover: {
    type: String,
    default: "#3b82f6"
  },
  dotColor: {
    type: String,
    default: "#1e3a8a"
  },
  dotColorHover: {
    type: String,
    default: "#1e3a8a"
  },
  hoverSize: {
    type: Number,
    default: 1.5
  }
});

const isVisible = ref(false);
const scale = ref(1);
const circleRef = ref(null);
const dotRef = ref(null);

const isHovered = ref(false);

const circleStyle = computed(() => ({
  borderColor: isHovered.value ? props.circleColorHover : props.circleColor
}));

const dotStyle = computed(() => ({
  backgroundColor: isHovered.value ? props.dotColorHover : props.dotColor
}));

const handleMouseMove = (e) => {
  if (!isVisible.value) isVisible.value = true;

  const x = e.clientX;
  const y = e.clientY;

  // Check if hovering on targets
  let targetHover = false;
  if (props.targets.length > 0) {
    const targetTag = e.target.tagName?.toLowerCase();
    const targetClass = e.target.className;
    
    const isTagMatch = props.targets.includes(targetTag);
    const isClassMatch = typeof targetClass === "string" && props.targets.some(c => targetClass.includes(c));
    
    // Also match elements with cursor: pointer style
    const isPointer = window.getComputedStyle(e.target).cursor === "pointer";

    if (isTagMatch || isClassMatch || isPointer) {
      targetHover = true;
    }
  }

  isHovered.value = targetHover;
  scale.value = targetHover ? props.hoverSize : 1;

  if (circleRef.value && dotRef.value) {
    const circleWidth = circleRef.value.clientWidth;
    const dotWidth = dotRef.value.clientWidth;

    circleRef.value.style.transform = `translate3d(${x - circleWidth / 2}px, ${y - circleWidth / 2}px, 0) scale(${scale.value})`;
    dotRef.value.style.transform = `translate3d(${x - dotWidth / 2}px, ${y - dotWidth / 2}px, 0)`;
  }
};

onMounted(() => {
  // Disable custom cursor on mobile / touch devices
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    isVisible.value = true;
    window.addEventListener("mousemove", handleMouseMove);
  }
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
}

.custom-cursor__circle {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.25s ease;
  transform: translate3d(-100px, -100px, 0);
}

.custom-cursor__dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--accent);
  pointer-events: none;
  will-change: transform;
  transition: transform 0.05s linear, background-color 0.25s ease;
  transform: translate3d(-100px, -100px, 0);
}
</style>
