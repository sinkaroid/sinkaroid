<template>
  <div
    :class="{ 'bg-white': !nightMode, 'bg-dark': nightMode }"
    class="pt-5 p-st"
  >
    <div
      class="container"
      data-aos="fade"
      data-aos-once="true"
      data-aos-duration="1000"
    >
      <!-- <vue-particles color="#dedede"></vue-particles> -->

      <div class="row align-items-center">
        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12 text-center">
          <!-- <a>
<img :src="picture"
onmouseover="this.src='https://cdn.discordapp.com/attachments/952117487166705747/994153838741307422/kek.png'"
onmouseout="this.src='https://cdn.discordapp.com/attachments/952117487166705747/993670266448265227/sinkaroid.png'"
border="0" alt=""/></a> -->

          <img
            :src="hovered ? picture_x : picture"
            @mouseover="(hovered = true), (role = 'Digital Illustrator')"
            @mouseout="(hovered = false), (role = 'Software Developer')"
          />

          <br /><br />
          <h4>{{ role }}</h4>
          <iframe
            src="https://github.com/sponsors/sinkaroid/button"
            title="Sponsor sinkaroid"
            height="35"
            width="116"
            style="border: 0"
          ></iframe>
        </div>

        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12 pt-5">
          <vue-particles
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="80"
            shapeType="circle"
            :particleSize="4"
            linesColor="#dedede"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
          >
          </vue-particles>
          <span
            class="home-title"
            :class="{ pgray: !nightMode, 'text-light': nightMode }"
            >Sinkaroid here,</span
          ><br />

          <div>
            <p v-html="description"></p>
            {{ sinopsis }}
            <br /><br />
          </div>

          <div class="text-center pb-4">
            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('github')"
              v-tooltip.bottom="'Sinkaroid Github'"
            >
              <i class="fab fa-github"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('pypi')"
              v-tooltip.bottom="'Sinkaroid Pypi'"
            >
              <i class="fab fa-python"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('npm')"
              v-tooltip.bottom="'Sinkaroid Npm'"
            >
              <i class="fab fa-js"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('linkedin')"
              v-tooltip.bottom="'Sinkaroid LinkedIn'"
            >
              <i class="fab fa-linkedin"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('steam')"
              v-tooltip.bottom="'Sinkaroid Steam'"
            >
              <i class="fab fa-steam"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('twitter')"
              v-tooltip.bottom="'Sinkaroid Twitter'"
            >
              <i class="fab fa-twitter"></i>
            </button>

            <button
              class="btn btn-outline-secondary mx-2"
              @click="open('patreon')"
              v-tooltip.bottom="'Sinkaroid Patreon'"
            >
              <i class="fab fa-patreon"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js"></script>
<script>
import info from "../../mock/mockRepository";

export default {
  name: "Home",
  props: {
    nightMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      role: "Software Developer",
      hovered: false,
      picture: info.flat_picture,
      picture_x: info.shadow,
      description: info.description,
      sinopsis: info.sinopsis,
      name: info.name,
      linkedin: info.links.linkedin,
      github: info.links.github,
      npm: info.links.npm,
      pypi: info.links.pypi,
      docker: info.links.docker,
      patreon: info.links.patreon,
      paypal: info.links.paypal,
      twitter: info.links.twitter,
      instagram: info.links.instagram,
      steam: info.links.steam,
      resume: info.links.resume,
    };
  },
  methods: {
    open(link) {
      switch (link) {
        case "linkedin":
          window.open(this.linkedin, "_blank");
          break;
        case "github":
          window.open(this.github, "_blank");
          break;
        case "npm":
          window.open(this.npm, "_blank");
          break;
        case "pypi":
          window.open(this.pypi, "_blank");
          break;
        case "docker":
          window.open(this.docker, "_blank");
          break;
        case "paypal":
          window.open(this.paypal, "_blank");
          break;
        case "patreon":
          window.open(this.patreon, "_blank");
          break;
        case "steam":
          window.open(this.steam, "_blank");
          break;
        case "twitter":
          window.open(this.twitter, "_blank");
          break;
        case "instagram":
          window.open(this.instagram, "_blank");
          break;
        case "resume":
          window.open(this.resume, "_blank");
          break;
      }
    },
  },
};
</script>

<style scoped>
.test {
  text-align: center;
  position: absolute;
}

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
}

@keyframes float {
  0% {
    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
  50% {
    box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.2);
    transform: translatey(-20px);
  }
  100% {
    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
    transform: translatey(0px);
  }
}

.home-title {
  font-size: 28px;
  font-weight: 500;
}

img {
  /** border: 1px solid #4a4847; **/
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  transform: translatey(0px);
  max-width: 280px;
  margin-top: 60px;
  box-sizing: border-box;
  overflow: hidden;
  transform: translatey(0px);
  animation: float 3s ease-in-out infinite;
}

@media only screen and (max-width: 580px) {
  img {
    object-fit: cover;
    border-radius: 50%;
    height: 200px;
    width: 200px;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 2px solid rgb(44, 35, 35);
  }
}

.img-wrapper {
  display: inline-block;
  background-image: url(https://www.w3schools.com/w3images/fjords.jpg);
}

.img-wrapper > img {
  vertical-align: top;
}

.img-wrapper > img:hover {
  opacity: 0;
}

.fa {
  font-size: 15px;
}

.btn {
  border-radius: 10%;
  position: relative;
  z-index: 9999;
  border-color: #ee44da;
  color: #8f9def;
}

.btn:hover {
  background-color: #41eb41;
  border-color: #41eb41;
  color: white;
}

.btn:focus {
  background-color: #41eb41;
  border-color: #41eb41;
  color: white;
}

.btn:focus {
  outline: none !important;
}

p {
  text-align: justify;
  font-weight: 400;
}

/* LEAVES */
</style>
