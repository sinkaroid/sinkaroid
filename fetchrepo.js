const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const today = moment().format("YYYY-MM-DD");
const time = moment().format("HH:mm:ss");
const GH_TOKEN = process.argv.slice(2)[0];

async function pendingSebentar(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
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
      name: "eiyuu",
      branch: "master",
    },
    {
      name: "booru",
      branch: "master",
    },
    {
      name: "tomoe",
      branch: "master",
    },
    {
      name: "scathach-api",
      branch: "master",
    },
    {
      name: "jandapress",
      branch: "master",
    },
    {
      name: "disgrowth",
      branch: "master",
    },
    {
      name: "hensuki",
      branch: "master",
    },
    {
      name: "jalter",
      branch: "master",
    },
    {
      name: "janda",
      branch: "master",
    },
    {
      name: "badut",
      branch: "master",
    },
    {
      name: "cabul",
      branch: "master",
    },
    {
      name: "cabul",
      branch: "proxy",
    },
    {
      name: "disgrow",
      branch: "master",
    },
    {
      name: "disgrow",
      branch: "api",
    },
    {
      name: "simpleocr",
      branch: "master",
    },
    {
      name: "umarun",
      branch: "master",
    },
    {
      name: "shielder",
      branch: "master",
    },
    {
      name: "pururin",
      branch: "master",
    },
    {
      name: "jandabooru",
      branch: "main",
    },
    {
      name: "strygwyr",
      branch: "main",
    },
    {
      name: "behoifer",
      branch: "main",
    },
    {
      name: "illustrator-tracker",
      branch: "master",
    },
    {
      name: "dotabuff",
      branch: "master",
    },
    {
      name: "Simple-logbait",
      branch: "master",
    },
    {
      name: "Blackjasmine",
      branch: "master",
    },
    {
      name: "Blackseroja",
      branch: "master",
    },
    {
      name: "HiddenFlower",
      branch: "master",
    },
    {
      name: "webNovelCrawler",
      branch: "master",
    },
    {
      name: "antk",
      branch: "master",
    },
    {
      name: "weevcrot",
      branch: "master",
    },
    {
      name: "Shell-Checker",
      branch: "master",
    },
    {
      name: "Stupidc0de-Shell-2016",
      branch: "master",
    }
  ]
};


const getInfo = async () => {
  let info = [];

  for (let i = 0; i < project.repo.length; i++) {
    let res = await axios.get(`https://api.github.com/repos/sinkaroid/${project.repo[i].name}`, 
      { headers: { "Authorization": `token ${GH_TOKEN}` } });

    await pendingSebentar(2000);
    let resSha = await axios.get(`https://api.github.com/repos/sinkaroid/${project.repo[i].name}/commits/${project.repo[i].branch}`,
      { headers: { "Authorization": `token ${GH_TOKEN}` } });

    let topics = res.data.topics;
    topics.unshift(res.data.language);

    info.push({
      name: res.data.name,
      pictures: [
        {
          img: `https://raw.githubusercontent.com/sinkaroid/sinkaroid/master/assets/oss/${project.repo[i].name}_${project.repo[i].branch}.webp`,
        }
      ],
      technologies: topics,
      category: res.data.language,
      date: `${convertDate(res.data.created_at)} (Updated: ${convertTime(res.data.updated_at)})`,
      github: res.data.html_url,
      visit: res.data.homepage ? res.data.homepage : res.data.html_url,
      description: res.data.description,
      //sha: resSha.data.sha,
    });
    console.log(`Pushing ${project.repo[i].name} #${project.repo[i].branch} to portfolio data`);
    
    await axios({
      method: "get",
      url: `https://opengraph.githubassets.com/${resSha.data.sha}/${res.data.full_name}`,
      responseType: "stream"
    }).then(function (response) {
      response.data.pipe(fs.createWriteStream(`./assets/oss/${project.repo[i].name}_${project.repo[i].branch}.webp`));
    }).catch(err => console.log(err));

    await pendingSebentar(2000);
  }
  return info;
};

const save = async () => {
  let getLatestCommit = await axios.get("https://api.github.com/repos/sinkaroid/sinkaroid/commits/master", 
    { headers: { "Authorization": `token ${GH_TOKEN}` } });
    
  let info = await getInfo();
  let data = {
    last_sync: `${today}, ${time}`,
    data: info,
    sha_commit: getLatestCommit.data.sha
  };
  fs.writeFileSync("data.json", JSON.stringify(data, null, 4));
};

save().then(() => {
  console.log("done");
}).catch(err => {
  console.log(err);
});

