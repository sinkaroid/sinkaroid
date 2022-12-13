<template>
  <div class="bg-secondary">
    <div class="container py-3">
      <div class="row pt-1 align-items-center">
        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12 pbelow" style="color: white">
          <span>
             <button class="btn-sm btn btn-outline-secondary no-outline" @click="open('base_repo')">
              <i class="fas fa-code-branch"></i> {{ latest_commit }}
            </button>
          </span>
        </div>

        <div class="col-xl-6 col-bg-6 col-md-6 col-sm-12">
          <div class="text-center">
            <button class="btn btn-outline-secondary mx-2" @click="open('linkedin')">
              <i class="fab fa-linkedin"></i>
            </button>
            <button class="btn btn-outline-secondary mx-2" @click="open('github')">
              <i class="fab fa-github"></i>
            </button>

            <button class="btn btn-outline-secondary mx-2" @click="open('twitter')">
              <i class="fab fa-twitter"></i>
            </button>

            <button class="btn btn-outline-secondary mx-2" @click="open('resume')">
              <i class="fa fa-file"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import info from "../../mock/mockRepository";
import lscache from "lscache";

export default {
  name: "Footer",
  data() {
    return {
      linkedin: info.links.linkedin,
      github: info.links.github,
      angellist: info.links.angellist,
      resume: info.links.resume,
      latest_commit: null,
      base_repo: null,
    };
  },
  async created() {
    if (!lscache.get("latest_commit")) {
      try {
        let response = await axios.get(
          "https://api.github.com/repos/sinkaroid/sinkaroid/commits/master"
        );
        this.latest_commit = response.data.sha;
        this.base_repo = `https://github.com/sinkaroid/sinkaroid/commit/${this.latest_commit}`;
        lscache.set("latest_commit", response.data.sha, 300);
        // alert("api fetched");
      } catch (err) {
        alert(err.message);
      }
    } else {
      // alert("api not fetch");
      this.latest_commit = lscache.get("latest_commit");
      this.base_repo = `https://github.com/sinkaroid/sinkaroid/commit/${this.latest_commit}`;
    }
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
        case "angellist":
          window.open(this.angellist, "_blank");
          break;
        case "resume":
          window.open(this.resume, "_blank");
          break;
        case "base_repo":
          window.open(this.base_repo, "_blank");
          break;
      }
    },
  },
};
</script>

<style scoped>
#link {
  color: #c1c4c6;
}

span {
  font-weight: 500;
}

.btn {
  border-color: white;
  color: white;
}

.btn:hover {
  background-color: white;
  border-color: white;
  color: gray;
}

.btn:focus {
  background-color: white;
  border-color: white;
  color: gray;
}

@media screen and (max-width: 580px) {
  .pbelow {
    padding-bottom: 20px;
    text-align: center;
  }
}
</style>
