<template>
  <div :class="{ 'bg-white': !nightMode, 'bg-dark': nightMode }" class="p-st">
    <div class="container py-4">
      <div class="text-center" data-aos="fade" data-aos-once="true" data-aos-duration="1000">
        <span class="title text-center" :class="{ pgray: !nightMode, 'text-light': nightMode }"><b>Skills</b></span><br>
        <center>
          <i>
            <blockquote>As a person with delusional disorder,
              I have strong imagination and proper decision making when building stuff.
            </blockquote>
          </i>
        </center>
        <!-- 
         I'm a passionate build scalable applications and does not reinventing the wheel.
        <code>If it's someone implementing "Flying Elephant", I will not trying to make another again,<br>
        But I'll add a nuke to the elephant's leg to make it even scarier when it stomps on its enemies
        </code>
        <br><br>
        <code>Wouldn't that be insane? An elephant that could fly, and have nuclear bomb reactions in its legs?</code>
      -->
      </div>
      <hr width="50%" :class="{ pgray: !nightMode, 'bg-secondary': nightMode }" />

      <br />
      <center>
        <font :class="{ pgray: !nightMode, 'text-light': nightMode }">
          <div class="skill-bar-container">
            <span class="skill-name">Backend development</span>
            <span class="skill-percent"><b>70%</b></span>
            <span class="skill-bar level7"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Frontend development</span>
            <span class="skill-percent"><b>30%</b></span>
            <span class="skill-bar level3"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Mobile development</span>
            <span class="skill-percent"><b>10%</b></span>
            <span class="skill-bar level1"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Module & libraries development</span>
            <span class="skill-percent"><b>75%</b></span>
            <span class="skill-bar level8"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">API development</span>
            <span class="skill-percent"><b>70%</b></span>
            <span class="skill-bar level7"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Infrastructure & software design</span>
            <span class="skill-percent"><b>50%</b></span>
            <span class="skill-bar level5"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Scalable application</span>
            <span class="skill-percent"><b>90%</b></span>
            <span class="skill-bar level9"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">CI/CD delivery automation</span>
            <span class="skill-percent"><b>60%</b></span>
            <span class="skill-bar level6"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Unit testing & documentation</span>
            <span class="skill-percent"><b>65%</b></span>
            <span class="skill-bar level7x"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Illustration & artwork design</span>
            <span class="skill-percent"><b>40%</b></span>
            <span class="skill-bar level_levelan"></span>
          </div>
          <br><br>

          <div class="skill-bar-container">
            <span class="skill-name">Solo</span>
            <span class="skill-percent"><i>A fullstack dev always doing it all by themselves</i> <b>60%</b> I think
              humble</span>
            <span class="skill-bar level_solo"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Teamwork</span>
            <span class="skill-percent"><i>A single flower can make me strong, Imagine if it's was a bunch of flowers?
                You can expect for </i> <b>80%</b></span>
            <span class="skill-bar level_team"></span>
          </div>

          <div class="skill-bar-container">
            <span class="skill-name">Leadership</span> <!-- I'm not kind to leading people -->
            <span class="skill-percent"><i>Crap, A leadership skills? I'm not kind of that, I leave it for</i>
              <b>25%</b> though</span>
            <span class="skill-bar level_leadership"></span>
          </div>

        </font>

        <br /><br />
      </center>
      <div class="row">
        <!-- get clocked bajingan
        background-image: url('https://cdn.discordapp.com/attachments/1046495201176334467/1052037176617091145/bg.png');
        -->
        <div class="col-xl-4 col-bg-4 col-md-6 col-sm-12 text-center pb-5 px-4" v-for="(skill, idx) in skills" style="padding: 20px; flex-wrap: wrap; border-radius: 10px; max-width: 360px; 
        margin: 0 auto; margin-bottom: 20px;" :key="skill.title" data-aos="fade-up" data-aos-offset="10"
          data-aos-delay="30"
          :style="{ 'transition-delay': idx / 4.2 + 's', border: '1px solid ' + (nightMode ? '#fa5c5c' : 'rgb(186, 167, 243)') }"
          data-aos-mirror="true" data-aos-once="true">
          <div class="bg-div"><i :class="skill.icon"></i></div>
          <div class="title2 pt-2">{{ skill.title }}</div>
          <hr width="50%" :class="{ pgray: !nightMode, 'bg-secondary': nightMode }" />
          <span class="title3">{{ skill.info.join(", ") }}</span>
        </div>
      </div>
      <center>
        <p>
          <img :src="
            nightMode
              ? 'https://raw.githubusercontent.com/sinkaroid/sinkaroid/stats/profile-summary-card-output/dracula/3-stats.svg'
              : 'https://raw.githubusercontent.com/sinkaroid/sinkaroid/stats/profile-summary-card-output/vue/3-stats.svg'
          " />
          <img :src="
  nightMode
    ? 'https://raw.githubusercontent.com/sinkaroid/sinkaroid/stats/profile-summary-card-output/dracula/2-most-commit-language.svg'
    : 'https://raw.githubusercontent.com/sinkaroid/sinkaroid/stats/profile-summary-card-output/vue/2-most-commit-language.svg'
          " />
        </p>
      </center>
    </div>
  </div>
</template>

<script>
import info from "../../mock/mockRepository";

export default {
  name: "Skills",
  props: {
    nightMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      mdskill: "github",
      skills: info.skills,
    };
  },
};
</script>

<style lang="scss" scoped>
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
  font-weight: 500;
}

.title3 {
  font-size: 16px;
  font-weight: 400;
}

.fa {
  color: rgb(212, 149, 97);
  font-size: 40px;
  transition: all 0.5s;
}

.fas {
  color: rgb(212, 149, 97);
  font-size: 40px;
  /* font-weight: bold; */
  transition: all 0.5s;
}

$skillcolor: #b09af378;
$skillcolor2: #e0526078;

.skill-bar-container {
  position: relative;
  text-align: left;
  width: 80%;
  border-radius: 4px;
  background-color: transparent;
  margin-bottom: 0.5em;

  .skill-bar {
    display: block;
    border-radius: 10px;
    height: 30px;

    &.level_solo {
      width: 60%;
      background-color: $skillcolor2;
    }

    &.level_team {
      width: 80%;
      background-color: $skillcolor2;
    }

    &.level_leadership {
      width: 25%;
      background-color: $skillcolor2;
    }

    //background-color: $skillColor; //#d7edfa
    &.level_void {
      width: 5%;
      background-color: $skillcolor;
    }

    &.level_levelan {
      width: 35%;
      background-color: $skillcolor;
    }

    &.level1 {
      width: 10%;
      background-color: $skillcolor;
    }

    &.level2 {
      width: 20%;
      background-color: $skillcolor;
    }

    &.level3 {
      width: 30%;
      background-color: $skillcolor;
    }

    &.level4 {
      width: 40%;
      background-color: $skillcolor;
    }

    &.level5 {
      width: 50%;
      background-color: $skillcolor;
    }

    &.level6 {
      width: 60%;
      background-color: $skillcolor;
    }

    &.level7 {
      width: 70%;
      background-color: $skillcolor;
    }

    &.level7x {
      width: 65%;
      background-color: $skillcolor;
    }

    &.level8 {
      width: 80%;
      background-color: $skillcolor;
    }

    &.level9 {
      width: 90%;
      background-color: $skillcolor;
    }
  }

  .skill-name {
    position: absolute;
    top: 5px;
    left: 10px;

    //font-weight: 600;
  }

  .skill-percent {
    position: absolute;
    top: 5px;
    right: 10px;
  }

  #kontol {
    /* Background pattern from Toptal Subtle Patterns */
    background-image: url("https://amymhaddad.s3.amazonaws.com/morocco-blue.png");

  }

}
</style>
