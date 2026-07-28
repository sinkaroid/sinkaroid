<template>
  <Transition name="slide-down">
    <div
      v-if="showSnackbar"
      class="snackbar"
      :style="{ borderLeftColor: snackbarColor }"
    >
      <div class="snackbar-content">
        <i
          class="fas fa-info-circle"
          :style="{ color: snackbarColor }"
        />
        <span>{{ snackbarMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  showSnackbar: {
    type: Boolean,
    default: false
  },
  snackbarMessage: {
    type: String,
    default: ""
  },
  snackbarColor: {
    type: String,
    default: "#3b82f6"
  }
});

const emit = defineEmits(["close"]);

watch(() => props.showSnackbar, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit("close", false);
    }, 2500);
  }
});
</script>

<style scoped>
.snackbar {
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  min-width: 300px;
  max-width: 90%;
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.snackbar-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--foreground);
  font-size: 0.95rem;
  font-weight: 500;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
