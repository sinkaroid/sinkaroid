<template>
  <div
    id="app"
    :class="{ 'dark-theme': nightMode }"
  >
    <div class="mesh-bg" />
    
    <Navbar 
      :night-mode="nightMode" 
      @scroll="scrollTo" 
      @night-mode="switchMode" 
    />
    
    <main class="parent container py-4">
      <Home :night-mode="nightMode" />
      <About
        id="about"
        :night-mode="nightMode"
      />
      <Skills
        id="skills"
        :night-mode="nightMode"
      />
      <Portfolio
        id="portfolio"
        :night-mode="nightMode"
      />
      <Mal
        id="activity"
        :night-mode="nightMode"
      />
      <Footer :night-mode="nightMode" />
    </main>
    
    <!-- Native Vue 3 GoTop component -->
    <GoTop />

    <!-- Native CustomCursor component -->
    <CustomCursor
      :targets="['a', 'button', 'input', 'textarea', '.clickable']"
      :circle-color="nightMode ? '#fff' : '#6366f1'"
      :circle-color-hover="nightMode ? '#6366f1' : '#4f46e5'"
      :dot-color="nightMode ? '#fff' : '#312e81'"
      :hover-size="1.5"
    />

    <!-- Contact Modal -->
    <ContactModal
      :visible="showContactModal"
      @close="showContactModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
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
import info from "../ci/mockRepository";

const router = useRouter();
const route = useRoute();
const nightMode = ref(false);
const showContactModal = ref(false);
const config = info.config || {};

// Read and apply theme
const switchMode = (mode, event) => {
  const updateTheme = () => {
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

  if (!event || !document.startViewTransition || config.use_transition_theme === false) {
    updateTheme();
    return;
  }

  let x = event.clientX;
  let y = event.clientY;

  if (event.clientX === 0 && event.clientY === 0) {
    const rect = event.target.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  document.documentElement.classList.add("vt-active");
  const transition = document.startViewTransition(async () => {
    updateTheme();
    await nextTick();
    // Force a reflow to ensure styles are updated synchronously before the snapshot is taken
    document.documentElement.offsetHeight;
  });

  transition.finished.then(() => {
    document.documentElement.classList.remove("vt-active");
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];

    document.documentElement.animate(
      {
        clipPath: mode ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
        pseudoElement: mode
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)"
      }
    );
  });
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
  overflow-x: hidden;
}

.parent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  margin-top: 220px; /* offset for floating nav */
}
</style>
