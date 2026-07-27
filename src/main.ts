import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/main.css";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "Home", component: { render: () => null } },
        { path: "/about", name: "About", component: { render: () => null } },
        { path: "/skills", name: "Skills", component: { render: () => null } },
        { path: "/portfolio", name: "Portfolio", component: { render: () => null } },
        { path: "/activity", name: "Activity", component: { render: () => null } },
        { path: "/contact", name: "Contact", component: { render: () => null } },
        { path: "/:catchAll(.*)", redirect: "/" }
    ]
});

const app = createApp(App);
app.use(router);

router.isReady().then(() => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 500);
    }
    app.mount("#app");
});
