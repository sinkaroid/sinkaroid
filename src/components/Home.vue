<template>
  <section class="section home-section" id="home">
    <div class="bento-grid">
      
      <!-- Avatar Bento Card -->
      <div class="bento-card col-span-5 avatar-card text-center">
        <div class="avatar-wrapper">
          <img
            :src="hovered ? picture_x : picture"
            class="avatar-image"
            alt="Sinkaroid Avatar"
            @mouseover="onHover"
            @mouseout="onLeave"
          />
        </div>
        
        <p class="hero-role" :style="{ backgroundImage: roleGradient }">{{ role }}</p>
        
    
      </div>

      <!-- About Info Bento Card -->
      <div class="bento-card col-span-7 info-card">
        <div class="info-content">
          <span class="greeting">sinkaroid here,</span>
          <h2 class="hero-name" :style="{ backgroundImage: nameGradient }">{{ name }}</h2>
          
          <div class="description-body">
            <p class="description-text" v-html="description"></p>
            <p class="synopsis-text">{{ sinopsis }}</p>
          </div>

          <!-- Social Channels Row -->
          <div class="social-channels">
            <button
              class="social-btn clickable"
              @click="open('github')"
              data-tooltip="GitHub"
              aria-label="GitHub Profile"
            >
              <i class="fab fa-github"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('pypi')"
              data-tooltip="PyPI"
              aria-label="PyPI Packages"
            >
              <i class="fab fa-python"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('npm')"
              data-tooltip="npm"
              aria-label="npm Packages"
            >
              <i class="fab fa-npm"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('linkedin')"
              data-tooltip="LinkedIn"
              aria-label="LinkedIn Profile"
            >
              <i class="fab fa-linkedin"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('steam')"
              data-tooltip="Steam"
              aria-label="Steam Profile"
            >
              <i class="fab fa-steam"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('twitter')"
              data-tooltip="Twitter"
              aria-label="Twitter Profile"
            >
              <i class="fab fa-twitter"></i>
            </button>

            <button
              class="social-btn clickable"
              @click="open('patreon')"
              data-tooltip="Patreon"
              aria-label="Patreon Campaign"
            >
              <i class="fab fa-patreon"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import info from "../../mock/mockRepository";
import { randomGradient } from "../composables/useRandomGradient";

const props = defineProps({
  nightMode: {
    type: Boolean,
    default: false
  }
});

const role = ref("Software Developer");
const hovered = ref(false);

const nameGradient = ref(randomGradient());
const roleGradient = ref(randomGradient());

watch(() => props.nightMode, () => {
  nameGradient.value = randomGradient();
  roleGradient.value = randomGradient();
});

const picture = info.flat_picture;
const picture_x = info.shadow;
const description = info.description;
const sinopsis = info.sinopsis_by_sinkaroid;
const name = info.name;

const links = info.links || {};

const onHover = () => {
  hovered.value = true;
  role.value = "Chicken Slaughterer";
};

const onLeave = () => {
  hovered.value = false;
  role.value = "Software Developer";
};

const open = (platform) => {
  const target = links[platform];
  if (target) {
    window.open(target, "_blank");
  }
};
</script>

<style scoped>
.home-section {
  padding-top: 100px;
}

/* Custom grid layouts for hero */
.col-span-5 {
  grid-column: span 5;
}
.col-span-7 {
  grid-column: span 7;
}

@media (max-width: 992px) {
  .col-span-5, .col-span-7 {
    grid-column: span 12;
  }
}

/* Avatar Card styles */
.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8) !important;
}

.avatar-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--card-border);
  box-shadow: var(--card-shadow);
  transform: translate3d(0, 0, 0);
  animation: float 4s ease-in-out infinite;
  background: var(--bg-app);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
 
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}



.sponsor-wrapper {
  margin-top: var(--space-2);
}

/* Info card styles */
.info-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: var(--space-4) var(--space-6) !important;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.greeting {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-name {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  background: var(--hero-name-gradient, var(--accent-gradient));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.04em;
}

.hero-role {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.4;
  background: var(--hero-role-gradient, var(--accent-gradient));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
}

.description-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.description-text {
  font-size: 1.15rem;
  line-height: 1.5;
  color: var(--foreground);
  text-align: left;
}

.synopsis-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--muted-foreground);
  text-align: left;
}

.social-channels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.social-btn {
  background: var(--card-border);
  border: 1px solid var(--card-border);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  color: var(--foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-btn:hover {
  background: var(--accent-gradient);
  border-color: transparent;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.35);
}
</style>
