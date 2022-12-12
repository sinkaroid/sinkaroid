<template>
  <div :class="{ 'bg-white': !nightMode, 'bg-dark': nightMode }" class="p-st">
    <div class="container py-4">
      <div
        class="text-center"
        data-aos="fade"
        data-aos-once="true"
        data-aos-duration="1000"
      >
        <span
          class="title text-center"
          :class="{ pgray: !nightMode, 'text-light': nightMode }"
          >Recommendations</span
        >
      </div>
      <hr
        width="50%"
        :class="{ pgray: !nightMode, 'bg-secondary': nightMode }"
      />
      <div class="row">
        <div
          class="col-xl-6 col-bg-6 col-md-6 col-sm-12 py-3 px-5"
          :style="{
            border: `1px solid ${nightMode ? '#908a8a' : '#8a8383d5'}`,
          }"
          v-for="d in data"
          :key="d.author"
        >
          <!-- for loop and give stars icon based on d.score value -->

          <div
            class="title2"
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
          >
            <span>"{{ d.title }}"</span>
          </div>
          <div
            class="title3 float-right py-2 pl-5"
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
          >
            <span>
              <img
                :src="d.picture"
                class="rounded-circle"
                width="50px"
                height="50px"
                data-aos="fade-up"
                data-aos-once="true"
                data-aos-easing="ease-in-out"
                data-aos-mirror="true"
              />
              – {{ d.author }}, {{ d.position }}, {{ d.company }},
              {{ d.location }}</span
            >
            <img :src="d.flag" width="20px" height="20px" class="ml-2" />
            <br />
            <span class="ml-2">
              <i
                class="fas fa-star"
                :class="{ 'text-warning': d.score >= 1 }"
              ></i>
              <i
                class="fas fa-star"
                :class="{ 'text-warning': d.score >= 2 }"
              ></i>
              <i
                class="fas fa-star"
                :class="{ 'text-warning': d.score >= 3 }"
              ></i>
              <i
                class="fas fa-star"
                :class="{ 'text-warning': d.score >= 4 }"
              ></i>
              <i
                class="fas fa-star"
                :class="{ 'text-warning': d.score >= 5 }"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import info from "../../mock/mockRepository";

export default {
  name: "Recommendation",
  props: {
    nightMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      data: info.recommendations,
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 30px;
  font-weight: 500;
}
.title1 {
  font-size: 24px;
  font-weight: 400;
}

.title2 {
  font-size: 18px;
  font-weight: 400;
  font-style: italic;
  text-align: justify;
}

.title3 {
  opacity: 0.7;
  font-size: 16px;
  font-weight: 400;
  text-align: right;
}
</style>
