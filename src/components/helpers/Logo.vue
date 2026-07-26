<template>
  <div class="logo-div">
    <span class="logo-title-name">{{ name }}</span>
    <span class="logo-title-dot">.</span>
  </div>
</template>

<script setup>
import info from "../../../mock/mockRepository";

defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

const name = info.logo_name || "sinkaroid";
</script>

<style scoped>
.logo-div {
  display: flex;
  align-items: baseline;
  cursor: pointer;
  user-select: none;
}

.logo-title-name {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.03em;
  transition: all 0.3s ease;
}

.logo-div:hover .logo-title-name {
  color: var(--accent);
}

.logo-title-dot {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--accent);
  line-height: 0;
}
</style>
