const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const today = moment().format("YYYY-MM-DD");
const time = moment().format("HH:mm:ss");
require('dotenv').config()

let GH_TOKEN;
if (!process.argv.slice(2)[0]) GH_TOKEN = process.env.GH_TOKEN;
else GH_TOKEN = process.argv.slice(2)[0];



async function pendingSebentar(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const convertDate = (date) => {
  let dateArray = date.split("-");
  let year = dateArray[0];
  let month = dateArray[1];
  let day = dateArray[2].split("T")[0];
  let monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthName = monthArray[month - 1];
  let dateString = `${monthName} ${day}, ${year}`;
  return dateString;
};

//create function to convert date to timeago format, example "2022-06-21T02:29:44Z" to "2 months ago"
const convertTime = (tgl) => {
  let dateArray = tgl.split("-");
  let year = dateArray[0];
  let month = dateArray[1];
  let day = dateArray[2].split("T")[0];
  let time = dateArray[2].split("T")[1].split("Z")[0];
  let timeArray = time.split(":");
  let hour = timeArray[0];
  let minute = timeArray[1];
  let second = timeArray[2];
  let dateUpdate = new Date(year, month - 1, day, hour, minute, second);
  let timeago = moment(dateUpdate).fromNow();
  return timeago;
};

const project = {
  repo: [
    {
      user: "sinkaroid",
      name: "booru",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "scathach-api",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "jandapress",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "jigoku",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "tomoe",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "eiyuu",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "janda",
      branch: "master",
    },
    {
      user: "scathachgrip",
      name: "da-vinci",
      branch: "master",
    },
    {
      user: "ScathachGrip",
      name: "jikan4snek",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "jalter",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "cabul",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "disgrowth",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "disgrow",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "sinkaroid",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "hensuki",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "badut",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "cabul",
      branch: "proxy",
    },
    {
      user: "sinkaroid",
      name: "disgrow",
      branch: "api",
    },
    {
      user: "sinkaroid",
      name: "simpleocr",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "umarun",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "shielder",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "pururin",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "strygwyr",
      branch: "main",
    },
    {
      user: "sinkaroid",
      name: "behoifer",
      branch: "main",
    },
    {
      user: "sinkaroid",
      name: "illustrator-tracker",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "dotabuff",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "Simple-logbait",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "Blackjasmine",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "Blackseroja",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "HiddenFlower",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "webNovelCrawler",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "antk",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "weevcrot",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "Shell-Checker",
      branch: "master",
    },
    {
      user: "sinkaroid",
      name: "Stupidc0de-Shell-2016",
      branch: "master",
    },
  ],
};

const getInfo = async () => {
  let info = [];

  for (let i = 0; i < project.repo.length; i++) {
    let res = await axios.get(
      `https://api.github.com/repos/${project.repo[i].user}/${project.repo[i].name}`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    );

    await pendingSebentar(2000);
    let resSha = await axios.get(
      `https://api.github.com/repos/${project.repo[i].user}/${project.repo[i].name}/commits/${project.repo[i].branch}`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    );

    await pendingSebentar(2000);
    let tagsData = await axios.get(
      `https://api.github.com/repos/${project.repo[i].user}/${project.repo[i].name}/tags`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    );

    let release;
    if (tagsData.data.length == 0) release = "pre-release";
    else release = tagsData.data[0].name;

    let topics = res.data.topics;
    topics.unshift(res.data.language);

    let bahasa;
    if (res.data.language == "JavaScript") bahasa = "https://skillicons.dev/icons?i=js";
    else if (res.data.language == "TypeScript") bahasa = "https://skillicons.dev/icons?i=typescript";
    else if (res.data.language == "Python") bahasa = "https://skillicons.dev/icons?i=python";
    else if (res.data.language == "Vue") bahasa = "https://skillicons.dev/icons?i=vuejs";
    else if (res.data.language == "Shell") bahasa = "https://skillicons.dev/icons?i=bash";
    else if (res.data.language == "PHP") bahasa = "https://skillicons.dev/icons?i=php";
    else if (res.data.language == "HTML") bahasa = "https://skillicons.dev/icons?i=html";
    else if (res.data.language == "CSS") bahasa = "https://skillicons.dev/icons?i=css";
    else if (res.data.language == "C++") bahasa = "https://skillicons.dev/icons?i=cpp";
    else if (res.data.language == "C#") bahasa = "https://skillicons.dev/icons?i=cs";
    else if (res.data.language == "C") bahasa = "https://skillicons.dev/icons?i=c";
    else if (res.data.language == "Java") bahasa = "https://skillicons.dev/icons?i=java";
    else if (res.data.language == "Ruby") bahasa = "https://skillicons.dev/icons?i=ruby";
    else if (res.data.language == "Go") bahasa = "https://skillicons.dev/icons?i=go";
    else if (res.data.language == "Rust") bahasa = "https://skillicons.dev/icons?i=rust";
    else if (res.data.language == "Dart") bahasa = "https://skillicons.dev/icons?i=dart";
    else if (res.data.language == "Kotlin") bahasa = "https://skillicons.dev/icons?i=kotlin";
    else if (res.data.language == "R") bahasa = "https://skillicons.dev/icons?i=r";
    else if (res.data.language == "Julia") bahasa = "https://skillicons.dev/icons?i=julia";

    else bahasa = "https://skillicons.dev/icons?i=github";



    info.push({
      name: res.data.name,
      pictures: [
        { // https://raw.githubusercontent.com | though
          img: `https://cdn.statically.io/gh/sinkaroid/sinkaroid/master/assets/oss/${project.repo[i].name}_${project.repo[i].branch}.webp`,
        },
      ],
      technologies: topics,
      category: res.data.language,
      date: `${convertDate(res.data.created_at)} (Updated: ${convertTime(
        res.data.updated_at
      )})`,
      github: res.data.html_url,
      bahasa: bahasa,
      visit: res.data.homepage ? res.data.homepage : res.data.html_url,
      description: res.data.description,
      commit: resSha.data.sha,
      link_commit: `https://github.com/${project.repo[i].user}/${project.repo[i].name}/commit/${resSha.data.sha}`,
      release: release,

    });
    console.log(
      `Pushing ${project.repo[i].name} #${project.repo[i].branch} to portfolio data`
    );

    await axios({
      method: "get",
      url: `https://opengraph.githubassets.com/${resSha.data.sha}/${res.data.full_name}`,
      responseType: "stream",
    })
      .then(function (response) {
        response.data.pipe(
          fs.createWriteStream(
            `./assets/oss/${project.repo[i].name}_${project.repo[i].branch}.webp`
          )
        );
      })
      .catch((err) => console.log(err));

    await pendingSebentar(2000);
  }
  return info;
};

const save = async () => {
  let getLatestCommit = await axios.get(
    "https://api.github.com/repos/sinkaroid/sinkaroid/commits/master",
    { headers: { Authorization: `token ${GH_TOKEN}` } }
  );

  let info = await getInfo();
  let data = {
    last_sync: `${today}, ${time}`,
    data: info,
    sha_commit: getLatestCommit.data.sha,
  };
  fs.writeFileSync("mock/_data.json", JSON.stringify(data, null, 4));
};

save()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
