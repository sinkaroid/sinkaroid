<template>
  <div class="my-3 mx-3">
    <div
      class="pcard smcard"
      :class="{
        'pcard-dark': nightMode,
        pcard: !nightMode,
        'bg-dark3': nightMode,
      }"
    >
      <div style="height: 180px">
        <img
          class="card-img-top"
          :src="portfolio.pictures[0].img"
          alt="Card image cap"
        />
        
        <img class="lang" :src="portfolio.bahasa" />
        
        
      </div>
      <div class="card-body"> <!--  pborder-top | bajingan -->
        <h5 class="title2"><b>{{ portfolio.name }}</b> </h5>
        <div>
          <div class="pb-1 bheight">
            <span
              class="badge mr-2 mb-2"
              v-for="tech in portfolio.technologies"
              :key="tech"
              :class="{ 'bg-dark4': nightMode }"
              >{{ tech }}</span
            >
          </div>
          <p
            class="title3 m-0 pb-2"
            v-html="
              portfolio.description.length > 40
                ? portfolio.description.substring(0, 45) + '...'
                : portfolio.description
            "
          >
        </p>
       
        </div>
        <div class="text-center mt-2">
          <button
          style="border-radius: 10px;"
            href=""
            class="btn-sm btn btn-outline-secondary no-outline"
            @click.prevent="showModal"
          >
          <i class="fas fa-search"></i> read more
          </button>
          <button
          style="border-radius: 10px;"
            href="#"
            class="btn-sm btn btn-outline-secondary no-outline ml-4"
            v-if="portfolio.visit"
            @click.prevent="open(portfolio.visit)"
          >
          <i class="fas fa-external-link-alt"></i> visit website
          </button>
        </div>
      </div>
      <p style="text-align: center; margin-top: -10px;">
          <button class="btn-sm btn btn-outline-secondary no-outline" @click="open(portfolio.link_commit)"
          style="border-radius: 10px;">
              <i class="fas fa-code-commit"></i> {{ portfolio.release }}
            </button>
          </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    portfolio: {
      type: Object,
    },
    nightMode: {
      type: Boolean,
    },
  },
  methods: {
    open(url) {
      window.open(url, "_blank");
    },
    showModal() {
      this.$emit("show", this.portfolio);
    },
  },
};
</script>

<style scoped>
.lang {
  display: block;
  margin-left: auto;
  margin-top: -40px;
  margin-right: 10px;
  width: 20%;
  border-radius: 50%;
  transition: transform .7s ease-in-out;
}

.lang:hover {
  transform: rotate(720deg);
}

img {
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}


.img-div img {
  /* object-fit: cover;
    overflow: hidden; */
  margin-left: auto;
  margin-right: auto;
  display: block;
  /* object-position: 50% 120%;
    max-width: 300px !important; */
}


.bheight {
  height: 65px;
  overflow: auto;
}

.pheight {
  height: 110px;
  max-height: 130px;
  overflow: auto;
  text-align: justify;
}

div.img-div {
  position: absolute;
  width: 100%;
  height: 100%;
}
.pborder-top {
  border-top: 1px solid rgb(193, 193, 193);
}

.pcard:hover {
  border-radius: 10px;
  border: none;

  height: 460px;
  border: 2px solid rgb(68, 12, 235);
  transform: scale(1.1); 
}

.pcard {
  transition: all .2s ease-in-out;
  border-radius: 10px;
  border: none;
  height: 460px;
  border: 2px solid rgb(186, 167, 243);

}

.pcard-dark:hover {
  border-radius: 10px;
  border: none;
  height: 460px;
  border: 2px solid #bbff00;
}

.pcard-dark {
  border-radius: 10px;
  border: none;
  height: 460px;
  border: 2px solid #fa5c5c;
  
  box-shadow: 1px 1px 12px rgb(53, 53, 53);
}

.pcard-body {
  border-top: 1px solid rgb(220, 220, 220);
  z-index: -1;
  background-color: rgb(253, 254, 255);
}

.title {
  font-size: 30px;
  font-weight: 500;
}
.title1 {
  font-size: 24px;
  font-weight: 400;
}

.title2 {
  font-size: 20px;
  font-weight: 400;
}

.title3 {
  font-size: 16px;
  font-weight: 400;
}

.badge {
  background-color: rgb(211, 227, 233);
  transition: all 0.5s;
  font-weight: 500;
  font-size: 13px;
}

.btn {
  border-color: #669db3ff;
  color: #669db3ff;
}

.btn:hover {
  background-color: #669db3ff;
  border-color: #669db3ff;
  color: white;
}

.btn:focus {
  background-color: #669db3ff;
  border-color: #669db3ff;
  color: white;
}

.bg-dark3 {
  background-color: rgb(82, 82, 82);
}

.bg-dark4 {
  background-color: #494e55 !important;
}
</style>
