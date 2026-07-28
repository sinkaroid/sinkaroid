<template>
  <nav class="navbar-glass">
    <div class="navbar-container">
      <!-- Logo branding -->
      <a
        class="navbar-brand clickable"
        href="/"
        @click.prevent="$emit('scroll', 'home')"
      >
        <Logo :night-mode="nightMode" />
      </a>

      <!-- Mobile Hamburger toggle button -->
      <button 
        class="navbar-toggle clickable" 
        :class="{ 'is-active': isMenuOpen }" 
        aria-label="Toggle navigation menu"
        aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <span class="hamburger-bar" />
        <span class="hamburger-bar" />
        <span class="hamburger-bar" />
      </button>

      <!-- Navigation links (Collapse) -->
      <div
        class="navbar-menu"
        :class="{ 'is-open': isMenuOpen }"
      >
        <ul class="navbar-links">
          <li class="nav-item">
            <a 
              class="nav-link clickable" 
              href="/about" 
              @click.prevent="navigate('about')"
            >
              <i class="fa fa-user-circle" /> about
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link clickable" 
              href="/skills" 
              @click.prevent="navigate('skills')"
            >
              <i class="fa fa-bolt" /> skills
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link clickable"
              href="/portfolio"
              @click.prevent="navigate('portfolio')"
            >
              <i class="fa fa-rocket" /> portfolio
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link clickable"
              href="/activity"
              @click.prevent="navigate('activity')"
            >
              <i class="fa fa-chart-line" /> activity
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link clickable"
              href="/contact"
              @click.prevent="navigate('contact')"
            >
              <i class="fa fa-envelope" /> contact
            </a>
          </li>
          <!-- Theme switch button -->
          <li class="nav-item theme-switch-item">
            <button 
              class="theme-toggle clickable" 
              aria-label="Switch visual theme"
              @click="switchMode"
            >
              <i :class="nightMode ? 'fas fa-sun' : 'fas fa-moon'" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import Logo from "./helpers/Logo.vue";

const props = defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["scroll", "nightMode"]);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigate = (section) => {
  isMenuOpen.value = false;
  emit("scroll", section);
};

const switchMode = () => {
  emit("nightMode", !props.nightMode);
};

// use var(--bg-app) on .theme-toggle
</script>

<style scoped>
.navbar-glass {
  position: fixed;
  top: 0;
  inset-inline: 0;
  height: 70px;
  background: var(--bg-app);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  display: flex;
  align-items: center;
  transition: background 0.3s, border-color 0.3s;
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: relative;
}

.hamburger-bar {
  width: 100%;
  height: 2px;
  background: var(--foreground);
  border-radius: var(--radius-full);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-links {
  display: flex;
  list-style: none;
  align-items: center;
  gap: var(--space-6);
}

.nav-link {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: color 0.25s ease;
  text-transform: capitalize;
}

.nav-link i {
  font-size: 0.85rem;
  color: var(--muted-foreground);
  transition: color 0.25s ease;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link:hover i {
  color: var(--accent);
}

.theme-toggle {
  background: var(--bg-app);
  border: 1px solid var(--border);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-toggle:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
  transform: rotate(30deg);
}

/* Mobile responsive menu */
@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }

  .navbar-toggle.is-active .hamburger-bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .navbar-toggle.is-active .hamburger-bar:nth-child(2) {
    opacity: 0;
  }

  .navbar-toggle.is-active .hamburger-bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--modal-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    width: 100vw;
    height: 100vh;
    padding: 100px var(--space-8) var(--space-8);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 999;
  }

  .navbar-menu.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .navbar-links {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-8);
    height: 100%;
  }

  .nav-link {
    font-size: 1.5rem;
  }

  .theme-switch-item {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .theme-toggle {
    width: 56px;
    height: 56px;
    font-size: 1.4rem;
  }
}
</style>
