<template>
  <div>
    <div class="mx-3 mt-3 mb-5">
      <div class="row">
        <div class="col-xl-12 col-bg-12 col-md-12 col-sm-12">
          <p
            class="title1"
            data-aos="fade"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-duration="1000"
          >
            {{ data.title }}
          </p>
          <ul
            class="timeline m-0 pt-1"
            v-for="(e, idx) in data.data"
            :key="e.name"
            :style="{ 'transition-delay': idx / 4.2 + 's' }"
            data-aos="fade-up"
            data-offset="10"
            data-aos-once="true"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-duration="500"
          >
            <li class="m-0 pb-2">
              <div :style="{ 'border-radius' : '20px', border : '1px solid ' + (nightMode ? '#fa5c5c' : 'lightgreen'), 'margin-bottom' : '30px' }">
                <a :href="e.link" :style="{ 'color' : nightMode ? 'lightgreen' : 'orange' }" target="_blank" style="font-weight: bold"
                  ><i class="fas fa-external-link-alt fa-lg" style="padding: 5px; margin-top: 10px"></i> Learn more.</a
                >
                <div class="px-2 title2">{{ e.name }}, {{ e.place }}</div>
                <div class="px-2 title3">
                  {{ e.degree || e.position }}
                  {{ e.gpa ? "(" + e.gpa + ")" : "" }}
                </div>
                <div class="px-2 date">{{ e.date }}</div>
                <div class="px-2 pb-2 pt-2" style="flex: 1">
                  <!-- <img align="left" :src="e.photo" width="100"> -->
                  {{ e.description }}
                </div>
                <span
                  style="border-radius: 10px; padding: 5px;"
                  class="mx-2 badge p-2 mb-2"
                  v-for="s in e.skills"
                  :key="s"
                  :class="{ 'bg-dark2': nightMode }"
                  >{{ s }}</span
                >
                <p class="m-2"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    data: {
      type: Object,
    },
    nightMode: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
.title1 {
  font-size: 24px;
  font-weight: 500;
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
}

.date {
  font-size: 14px;
  font-weight: 300;
}

ul.timeline {
  list-style-type: none;
  position: relative;
}
ul.timeline:before {
  content: " ";
  background: #d4d9df;
  display: inline-block;
  position: absolute;
  left: 29px;
  width: 2px;
  height: 93%;
  margin-top: 20px;
  z-index: 400;
}
ul.timeline > li {
  margin: 20px 0;
  padding-left: 20px;
}
ul.timeline > li:before {
  content: " ";
  background: rgb(212, 149, 97);
  display: inline-block;
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgb(236, 159, 117);
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 400;
}

.bg-dark2 {
  background-color: #5a606a !important;
}

.garis {
  border: 1px solid #89cff0;
  border-radius: 10px;
}
</style>
