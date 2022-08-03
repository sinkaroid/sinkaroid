<template>

  <div
    class="py-4 p-st"
    :class="{
      'bg-light': !nightMode,
      'bg-dark2': nightMode,
      'text-light': nightMode,
    }"
  >
  
    <div class="container">
      
      <div class="text-center" data-aos="fade" data-aos-once="true" data-aos-duration="1000">
        
        <span
          class="title text-center"
          :class="{ pgray: !nightMode, 'text-light': nightMode }"
        >Pronouns & codename</span><br>
        <h3><code>He/him 🌺 Sinkaroid/indra 🌺 インドラ</code></h3><br>
        
      </div>
      
      <hr width="50%" :class="{ pgray: !nightMode, 'bg-secondary': nightMode }" />
      <div class="row">
        
        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12">
          <Timeline :data="education" :nightMode="nightMode" />
        </div>
        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12">
          <Timeline :data="experience" :nightMode="nightMode" />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>

import Timeline from "./helpers/Timeline";
import info from "../../info";

export default {
  name: "About",
  components: {
    Timeline,
  },
  props: {
    nightMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      education: {
        title: "Education",
        data: info.education,
      },
      experience: {
        title: "Experiences",
        data: info.experience,
      },
    };
  },
};

</script>

<style scoped>
.title {
  font-size: 30px;
  font-weight: 500;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
  font-family: arial;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

a {
  text-decoration: none;
  font-size: 22px;
  color: black;
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>
