import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/main.css"; // Global styling, tokens and bento configurations

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: { render: () => null } },
    { path: "/:catchAll(.*)", redirect: "/" }
  ]
});

const app = createApp(App);
app.use(router);

// Hide loader once app is mounted
router.isReady().then(() => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 500);
  }
  app.mount("#app");
});
