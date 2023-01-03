<template>
  <div id="app" :class="{ 'text-dark': !nightMode, 'text-light': nightMode }">
    <Navbar @scroll="scrollTo" @nightMode="switchMode" :nightMode="nightMode" />
    <div class="parent">
      <Home :nightMode="nightMode" />
      <About id="about" :nightMode="nightMode" />
      <Skills id="skills" :nightMode="nightMode" />
      <Portfolio id="portfolio" :nightMode="nightMode" />
      <Mal id="myanimelist" :nightMode="nightMode" />
      <Recommendation :nightMode="nightMode" />
     
      <Contact id="contact" :nightMode="nightMode" />
      <Footer :nightMode="nightMode" />
      <go-top :size="59" bg-color="red" :right="45" />

      <custom-cursor
        :targets="['a', 'button', 'input', 'textarea']"
        :circleColor="nightMode ? '#fff' : 'red'"
        :circleColorHover="nightMode ? '#fff' : '#000'"
        :dotColor="nightMode ? '#fff' : '#000'"
        :dotColorHover="nightMode ? '#fff' : '#000'"
        :hoverSize="1.5"
      />

      <!-- <cursor-fx :color="nightMode ? '#fff' : '#000'" /> -->
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Mal from "./components/Mal";
import Recommendation from "./components/Recommendation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import GoTop from "@inotom/vue-go-top";
import CustomCursor from "./components/CustomCursor.vue";
import info from "../mock/mockRepository";

export default {
  name: "App",
  components: {
    Navbar,
    Home,
    About,
    Skills,
    Portfolio,
    Recommendation,
    Contact,
    Footer,
    GoTop,
    CustomCursor,
    Mal,
  },
  data() {
    return {
      nightMode: false,
      config: info.config,
    };
  },
  created() {
    if (this.config.use_cookies) {
      this.nightMode = this.$cookie.get("nightMode") === "true" ? true : false;
    }
  },
  mounted() {
    [
      "about",
      "contact",
      "skills",
      "portfolio",
      "myanimelist",
      "contact",
    ].forEach((l) => {
      if (window.location.href.includes(l)) {
        var elementPosition = document.getElementById(l).offsetTop;
        window.scrollTo({ top: elementPosition - 35, behavior: "smooth" });
      }
    });
  },
  methods: {
    switchMode(mode) {
      if (this.config.use_cookies) {
        this.$cookie.set("nightMode", mode);
      }
      this.nightMode = mode;
    },
    scrollTo(ele) {
      if (ele == "home") {
        this.$router.push("/");
        window.scrollTo({ top: -80, behavior: "smooth" });
      } else {
        var elementPosition = document.getElementById(ele).offsetTop;
        window.scrollTo({ top: elementPosition - 35, behavior: "smooth" });
        if (this.$router.history.current.path !== `/${ele}`)
          this.$router.push(`/${ele}`);
      }
    },
  },
};
</script>

<style>

@font-face {
  font-family: "Wotfard";
  src: url("./../assets/fonts/wotfard-regular-webfont.ttf");
}

/*
elek asu
#app {
  font-family: -apple-system, system-ui, BlinkMacSystemFont;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

*/

#app {
  font-family: "Wotfard";

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

@media screen and (max-width: 580px) {
  #app {
    width: fit-content;
  }
}

.parent {
  margin-top: 38px;
  padding-top: 40px;
  position: relative;
}

.pgray {
  color: #535a5e;
}

.pblue {
  color: #669db3ff;
}

.bg-dark2 {
  background-color: #262c30 !important;
}

.text-light {
  color: #d3d2d2 !important;
}

.p-st {
  transition: all 0.5s !important;
}

/* To set scrollbar width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9px;
  border: 2px solid white; /* Use your background color instead of White */
  background-clip: content-box;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(18, 17, 17);
  border-radius: 9px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: rgb(212, 149, 97);
  color: white;
  border-radius: 8px;
  font-size: 10px;
  /* padding: 5px 10px 4px; */
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: rgb(212, 149, 97);
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 10px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s, visibility 0.5s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s;
}

@-webkit-keyframes badbounce {
  0%,
  100% {
    -webkit-transform: translateY(0px);
  }
  10% {
    -webkit-transform: translateY(6px);
  }
  30% {
    -webkit-transform: translateY(-4px);
  }
  70% {
    -webkit-transform: translateY(3px);
  }
  90% {
    -webkit-transform: translateY(-2px);
  }
}
@-moz-keyframes badbounce {
  0%,
  100% {
    -moz-transform: translateY(0px);
  }
  10% {
    -moz-transform: translateY(6px);
  }
  30% {
    -moz-transform: translateY(-4px);
  }
  70% {
    -moz-transform: translateY(3px);
  }
  90% {
    -moz-transform: translateY(-2px);
  }
}
@keyframes badbounce {
  0%,
  100% {
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
    -ms-transform: translateY(0px);
    -o-transform: translateY(0px);
    transform: translateY(0px);
  }
  10% {
    -webkit-transform: translateY(6px);
    -moz-transform: translateY(6px);
    -ms-transform: translateY(6px);
    -o-transform: translateY(6px);
    transform: translateY(6px);
  }
  30% {
    -webkit-transform: translateY(-4px);
    -moz-transform: translateY(-4px);
    -ms-transform: translateY(-4px);
    -o-transform: translateY(-4px);
    transform: translateY(-4px);
  }
  70% {
    -webkit-transform: translateY(3px);
    -moz-transform: translateY(3px);
    -ms-transform: translateY(3px);
    -o-transform: translateY(3px);
    transform: translateY(3px);
  }
  90% {
    -webkit-transform: translateY(-2px);
    -moz-transform: translateY(-2px);
    -ms-transform: translateY(-2px);
    -o-transform: translateY(-2px);
    transform: translateY(-2px);
  }
}

.ss_animate {
  -webkit-animation: badbounce 1s linear;
  -moz-animation: badbounce 1s linear;
  animation: badbounce 1s linear;
}

#ss_menu {
  bottom: 30px;
  width: 60px;
  height: 60px;
  color: #fff;
  position: fixed;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  right: 45px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

#ss_menu > .menu {
  display: block;
  position: absolute;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
  color: #fff;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
}

#ss_menu > .menu .share {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
}

#ss_menu > .menu .share .circle {
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  top: 50%;
  margin-top: -6px;
  left: 12px;
  opacity: 1;
}

#ss_menu > .menu .share .circle:after,
#ss_menu > .menu .share .circle:before {
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  content: "";
  opacity: 1;
  display: block;
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
}

#ss_menu > .menu .share .circle:after {
  left: 20.78461px;
  top: 12px;
}

#ss_menu > .menu .share .circle:before {
  left: 20.78461px;
  top: -12px;
}

#ss_menu > .menu .share .bar {
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  width: 24px;
  height: 3px;
  background: #fff;
  position: absolute;
  top: 50%;
  margin-top: -1.5px;
  left: 18px;
  -webkit-transform-origin: 0% 50%;
  -moz-transform-origin: 0% 50%;
  -ms-transform-origin: 0% 50%;
  -o-transform-origin: 0% 50%;
  transform-origin: 0% 50%;
  -webkit-transform: rotate(30deg);
  -moz-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  -o-transform: rotate(30deg);
  transform: rotate(30deg);
}

#ss_menu > .menu .share .bar:before {
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  transition: all 1s ease;
  content: "";
  width: 24px;
  height: 3px;
  background: #fff;
  position: absolute;
  left: 0px;
  -webkit-transform-origin: 0% 50%;
  -moz-transform-origin: 0% 50%;
  -ms-transform-origin: 0% 50%;
  -o-transform-origin: 0% 50%;
  transform-origin: 0% 50%;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
}

#ss_menu > .menu .share.close .circle {
  opacity: 0;
}

#ss_menu > .menu .share.close .bar {
  top: 50%;
  margin-top: -1.5px;
  left: 50%;
  margin-left: -12px;
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  -o-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  -webkit-transform: rotate(405deg);
  -moz-transform: rotate(405deg);
  -ms-transform: rotate(405deg);
  -o-transform: rotate(405deg);
  transform: rotate(405deg);
}

#ss_menu > .menu .share.close .bar:before {
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  -o-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  -webkit-transform: rotate(-450deg);
  -moz-transform: rotate(-450deg);
  -ms-transform: rotate(-450deg);
  -o-transform: rotate(-450deg);
  transform: rotate(-450deg);
}

#ss_menu > .menu.ss_active {
  background: #f11f30;
  -webkit-transform: scale(0.7);
  -moz-transform: scale(0.7);
  -ms-transform: scale(0.7);
  -o-transform: scale(0.7);
  transform: scale(0.7);
}

#ss_menu > div {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  width: 60px;
  height: 60px;
  font-size: 30px;
  text-align: center;
  background: #6161f8;
  border-radius: 50%;
  display: table;
}

#ss_menu > div i {
  display: table-cell;
  vertical-align: middle;
}

#ss_menu > div:hover {
  background: #009688;
  cursor: pointer;
}

#ss_menu div:nth-child(1) {
  top: 0px;
  left: -182px;
}

#ss_menu div:nth-child(2) {
  top: -65px;
  left: -160.56406px;
}

#ss_menu div:nth-child(5) {
  top: -120px;
  left: -121px;
}

#ss_menu div:nth-child(3) {
  top: -158.56406px;
  left: -65px;
}

#ss_menu div:nth-child(4) {
  top: -180px;
  left: 0px;
}

blockquote {
  width: 50%;
  
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C" "\201D" "\2018" "\2019";
}

blockquote:before {

  content: open-quote;
  font-size: 4em;
  line-height: 0.1em;
  margin-right: 0.25em;
  vertical-align: -0.4em;
}

blockquote p {
  display: inline;
}
</style>
