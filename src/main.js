import Vue from "vue";
import App from "./App.vue";

import AOS from "aos";
import "aos/dist/aos.css";
import VueScrollTo from "vue-scrollto";
import VueRouter from "vue-router";
import VTooltip from "v-tooltip";
import VueParticles from "vue-particles";
var VueCookie = require("vue-cookie");
import axios from "axios";
Vue.prototype.$http = axios;

Vue.use(VTooltip);
Vue.use(VueRouter);
Vue.use(VueScrollTo);
Vue.use(VueCookie);
Vue.use(VueParticles);


Vue.config.productionTip = false;

const routes = [
  { path: "/"}
];

const router = new VueRouter({
  mode:"history",
  routes
});

new Vue({
  created () {
    AOS.init();
  },
  router,
  render: h => h(App),
}).$mount("#app");
