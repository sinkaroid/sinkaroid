<template>
  <div id="app" :class="{ 'dark-theme': nightMode }">
    <div class="mesh-bg"></div>
    
    <Navbar 
      @scroll="scrollTo" 
      @nightMode="switchMode" 
      :nightMode="nightMode" 
    />
    
    <main class="parent container py-4">
      <Home :nightMode="nightMode" />
      <About id="about" :nightMode="nightMode" />
      <Skills id="skills" :nightMode="nightMode" />
      <Portfolio id="portfolio" :nightMode="nightMode" />
      <Mal id="activity" :nightMode="nightMode" />
      <Footer :nightMode="nightMode" />
    </main>
    
    <!-- Native Vue 3 GoTop component -->
    <GoTop />

    <!-- Native CustomCursor component -->
    <CustomCursor
      :targets="['a', 'button', 'input', 'textarea', '.clickable']"
      :circleColor="nightMode ? '#fff' : '#6366f1'"
      :circleColorHover="nightMode ? '#6366f1' : '#4f46e5'"
      :dotColor="nightMode ? '#fff' : '#312e81'"
      :hoverSize="1.5"
    />

    <!-- Contact Modal -->
    <ContactModal
      :visible="showContactModal"
      @close="showContactModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Skills from "./components/Skills.vue";
import Portfolio from "./components/Portfolio.vue";
import Mal from "./components/Mal.vue";
import Footer from "./components/Footer.vue";
import GoTop from "./components/helpers/GoTop.vue";
import CustomCursor from "./components/helpers/CustomCursor.vue";
import ContactModal from "./components/helpers/ContactModal.vue";
import info from "../mock/mockRepository";

const router = useRouter();
const route = useRoute();
const nightMode = ref(false);
const showContactModal = ref(false);
const config = info.config || {};

// Read and apply theme
const switchMode = (mode) => {
  nightMode.value = mode;
  if (config.use_cookies !== false) {
    localStorage.setItem("nightMode", mode ? "true" : "false");
  }
  
  // Apply globally to document element
  if (mode) {
    document.documentElement.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
  }
};

// Smooth-scroll a section by id, or trigger a side effect for special keys
const scrollToSection = (section) => {
  if (section === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (section === "contact") {
    showContactModal.value = true;
    return;
  }
  const target = document.getElementById(section);
  if (target) {
    const top = target.offsetTop - 75;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

// Initialize nightMode and scroll on first load
onMounted(() => {
  let isNight = false;
  if (config.use_cookies !== false) {
    isNight = localStorage.getItem("nightMode") === "true";
  }
  switchMode(isNight);

  // Initial scroll from either hash or path
  const hashSection = window.location.hash.replace(/^#/, "");
  const pathSection = window.location.pathname.replace(/^\//, "");
  const initial = hashSection || pathSection;
  if (initial && initial !== "home") {
    setTimeout(() => scrollToSection(initial), 500);
  }
});

// React to route changes (covers direct visits, back/forward, and navbar clicks)
watch(
  () => route.path,
  (newPath) => {
    const section = newPath.replace(/^\//, "") || "home";
    scrollToSection(section);
  }
);

// Navigate from navbar (path-based; supports direct visits and back/forward)
const scrollTo = (ele) => {
  if (ele === "home") {
    router.push("/");
  } else if (ele === "contact") {
    showContactModal.value = true;
    router.push("/contact");
  } else {
    router.push(`/${ele}`);
  }
};
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.parent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin-top: 220px; /* offset for floating nav */
}
</style>
