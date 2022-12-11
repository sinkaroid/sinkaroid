const { data, sha_commit } = require("./data.json");

let info = {
  name: "Sinkaroid",
  logo_name: "sinkaroid",
  flat_picture: require("./src/assets/sinkaroid.png"),
  shadow: require("./src/assets/daryun.png"),
  config: {
    use_cookies: true,
    navbar: {
      blur: false
    }
  },
  description:
    "19yr old part time software dev mostly open-source also by trade. ",
  sinopsis: "I have no degree alias never go to formal college education, so keep in mind that if you want to hire me, I might not remember the complexity of interpolation search algorithm, but I'm pretty good and patient enough in searching and experimenting for it! All I learn this way with patience 💗",
  links: {
    linkedin: "https://www.linkedin.com/in/sinkaroid/",
    github: "https://github.com/sinkaroid",
    npm: "https://www.npmjs.com/~sinkaroid",
    pypi: "https://pypi.org/user/sinkaroid/",
    docker: "https://github.com/sinkaroid?tab=packages",
    paypal: "https://paypal.me/sinkaroid",
    patreon: "https://www.patreon.com/scathach_bot",
    twitter: "https://twitter.com/sinkaroid",
    steam: "https://steamcommunity.com/id/sinkaroid",
    instagram: "https://instagram.com/sinkaroid",
    latest_commit: sha_commit,
    resume:
      "https://github.com/sinkaroid"
  },
  education: [
    {
      name: "SMK Nasional Berbah Yogyakarta",
      place: "ID",
      date: "2017 - 2021",
      degree: "Computer and Network Engineering",
      description:
        "6F55+J2V, Jl. Tanjungtirto, Kali Pentung, Kalitirto, Kec. Berbah, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55573",
      skills: [
        "Internet Protocols",
        "OS",
        "Network",
        "Linux",
        "HighSchool"
      ]
    },
    {
      name: "SMPN 3 Kalasan Yogyakarta",
      place: "ID",
      date: "2014 - 2017",
      degree: "Junior High School",
      description:
        "6CRX+RFR, Jl. Sidokerto, Kel. Purwomartani, Kec. Kalasan, Sidokerto, Purwomartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
      skills: [
        "Junior High School"
      ]
    }
  ],
  experience: [
    {
      name: "ScathachGrip",
      link: "https://github.com/ScathachGrip",
      photo: "https://cdn.discordapp.com/attachments/952117487166705747/1006890840762884096/scathachgrip.png",
      place: "Indonesia - Thailand",
      date: "Jun, 2021 - Present",
      position: "Software Engineer - Developer Relations",
      description:
        "Focused on micro products like discord, telegram, and other automated and scraping bots, tools, libraries for It's services mostly dealing with NSFW stuff related actionable data as it over-engineering which makes daily use easily. We created a successful product that over 25.000 server invites, and over with 3M users on Discord. Part of the biggest Discord products that created by Indonesian.",
      skills: ["JavaScript/TypeScript", "NodeJS", "Rust", "Python", "Embedded Software", "Microservices", "Restful API"]
    },
    {
      name: "PT. Telekomunikasi Indonesia (Telkom) Tbk",
      link: "https://www.telkom.co.id/",
      photo: "https://cdn.discordapp.com/attachments/952117487166705747/1006890841232650291/telkom.png",
      place: "Yogyakarta, Indonesia",
      date: "2018 - 2019",
      position: "	Industrial Solutions & Services",
      description:
        "Jl. Yos Sudarso No.9, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55224",
      skills: ["Problem solve", "Teamwork", "Communication", "Networking"]
    },
    {
      name: "Redsplit LTD",
      link: "https://github.com/Redsplit",
      photo: "https://cdn.discordapp.com/attachments/952117487166705747/1006890840226017401/redsplitorg.png",
      place: "Yogyakarta, Indonesia",
      date: "2018 - 2021",
      position: "Self-taught Programmer",
      description:
        "It tooks me 3 years before I know enough related proper software development, because basically my skills are deface and hack, It's tooks me 3 years to become real programmer instead just \"script kiddies\"",
      skills: ["Software Development", "CRUD", "Infrastructure", "API", "Test Driven Development", "Best Practices", "Stacks", "Interpolation", "Message broker", "Microservice", "Backend"]
    },
    {
      name: "Angelz.space LTD",
      link: "https://web.facebook.com/undefined",
      photo: "https://cdn.discordapp.com/attachments/952117487166705747/1006892590496485386/angeldotid.png",
      place: "Jakarta, Indonesia",
      date: "2015 - 2018",
      position: "Defacer - Exploiter",
      description:
        "A limited company and is completely Blackhat for it's services. After pwned the targets, We just collected a webshells & root data and contanstly sell it them to foreigners end users, chinese spammer was rely on us.",
      skills: ["Backdoor", "Mailers", "Scampage", "CSRF-Vulnerability", "RCE Vulnerability", "PHP"]
    },
    {
      name: "Sanjungan Jiwa Team",
      link: "https://web.facebook.com/undefined",
      photo: "https://cdn.discordapp.com/attachments/952117487166705747/1006894707961507840/sj.png",
      place: "Indonesia",
      date: "2013 - 2016",
      position: "Defacer - Hacker Relations",
      vendor: ["abc", "def"],
      description:
        "When I was in elementary school until junior school, I started my computer career by doing Blackhat stuff, mostly defacing and social engineering actions. Me and my team pwned a fuckton website arround the world. I've been on many teams and met proficient underground people with great mindset.",
      skills: ["CSRF-Vulnerability", "RCE Vulnerability", "Joomla", "WordPress", "PHP", "Exploiter", "Rooting server"]
    }
  ],
  skills: [
    {
      title: "Languages",
      info: [
        "Python",
        "Javascript/TypeScript",
        "PHP",
        "Rust",
      ],
      icon: "fa fa-code"
    },
    {
      title: "Libraries & framework",
      info: [
        "Express",
        "Cheerio",
        "Flask",
        "Vue.js",
        "Sequelize",
        "Django",
        "Nest.js",
        "Nuxt.js",
        "RabbitMQ"
      ],
      icon: "fa fa-cubes"
    },
    {
      title: "Runtime",
      info: ["Python", "NodeJS", "Deno"],
      icon: "fas fa-laptop-code"
    },
    {
      title: "Databases",
      info: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Memcache", "Redis"],
      icon: "fa fa-database"
    },
    {
      title: "Tools",
      info: [
        "GitHub Actions",
        "Travis CI",
        "Jest",
        "Mocha",
        "Poetry",
        "JSDoc",
        "TypeDoc",
        "Pdoc",
        "Sphinx",
      ],
      icon: "fas fa-tools"
    },
    {
      title: "Design",
      info: ["Adobe Photoshop", "Gimp", "Sketch drawing"],
      icon: "fa fa-pencil-square-o"
    },
    {
      title: "Other abilities",
      info: ["Reverse Engineering", "Penetration Testing", "Social Engineering", "Doxxing", "Dota 2 Unprofessional Player"],
      icon: "fa fa-cat"
    },
    {
      title: "The Surplus of me",
      info: ["Patient", "Can work under pressure", "Can work at crucial time", "Strong imagination", "Big heart"],
      icon: "fa fa-heart"
    },
    {
      title: "The Lacks of me",
      info: ["No degree", "No formal college education", "A bit grumpy", "Habit of working at crucial time"],
      icon: "fa fa-ban"
    }
  ],
  portfolio: data,
  portfolio_design: [
    {
      name: "Project Livium",
      title: "Darkness Livium Requiem",
      pictures: [
        {
          img: require("./src/assets/designs/livium.jpg"),
          title: "Royal Commander | Tanya degurechaff assets by @CasulCasulCasul"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2022",
      visit: "",
      description:
      "I won't be tolerating even to the tiniest threat."
    },
    {
      name: "Project Livium",
      title: "A God's Puppet",
      pictures: [
        {
          img: require("./src/assets/designs/livium2.jpg"),
          title: "Royal Commander | Tanya degurechaff assets by @CasulCasulCasul"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2022",
      visit: "",
      description:
      "Royal Commander became puppets"
    },
    {
      name: "WPU CHESS",
      title: "WPU Moonlight Shadow",
      pictures: [
        {
          img: require("./src/assets/designs/MS.png"),
          title: "Moonlight Shadow"
        }
      ],
      technologies: ["Adobe Photoshop"],
      category: "Visual Design - Vector",
      github: "",
      date: "2022",
      visit: "",
      description:
        "I participated in the UNPAS WEB Programming competition to design in the chess division, unfortunately I lost to this design"
    },
    {
      name: "Fuck Corona",
      title: "Decaying of world",
      pictures: [
        {
          img: require("./src/assets/designs/world_by_sinkaroid_dcyjvod.png"),
          title: "Fuck Corona"
        }
      ],
      technologies: ["Adobe Photoshop", "Gimp"],
      category: "Visual Design - Vector",
      github: "",
      date: "2020 - 2021",
      visit: "",
      description:
        "This work depicts the decay of the world this year, Covid-19 and the war that never ends, I illustrate myself using a half-broken mask which means that I am half crazy because of this situation."
    },
  
    {
      name: "Tobi",
      title: "Daryun Uchiha",
      pictures: [
        {
          img: require("./src/assets/designs/tobi_by_sinkaroid_dcyjvuh.png"),
          title: "Daryun Uchiha"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design - Vector",
      github: "",
      date: "2020",
      visit: "",
      description:
        "Illustation of me when i became Obito uchiha"
    },
    {
      name: "ScathachGrip",
      title: "ScathachGrip",
      pictures: [
        {
          img: require("./src/assets/designs/sca.png"),
          title: "ScathachGrip"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2021",
      visit: "",
      description:
        "https://github.com/ScathachGrip"
    },
    {
      name: "Heroes",
      title: "The Fallen Heroes",
      pictures: [
        {
          img: require("./src/assets/designs/dog.gif"),
          title: "Heroes"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2020",
      visit: "",
      description:
        "Fuck the w0rld, The price they must to pay! Left to Right: Ouma shu (The guilty crown) - Lelouch vi Britannia (Code geass) - Itachi Uchiha (Naruto) - Emiya Kiritsugu (Fate/Zero) - Okabe Rintarou (STEINS;GATE)"
    },
    {
      name: "Joker",
      title: "The Joker",
      pictures: [
        {
          img: require("./src/assets/designs/joker_by_sinkaroid_dcyjvhx.png"),
          title: "The Joker"
        }
      ],
      technologies: ["XD", "Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2018",
      visit: "",
      description:
        "Stupidc0de's destruction, End of era, But the joker is always watching"
    },
    {
      name: "Batavia",
      title: "The Batavia",
      pictures: [
        {
          img: require("./src/assets/designs/batavia.jpg"),
          title: "Batavia"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design & Vector",
      github: "",
      date: "2017",
      visit: "",
      description:
        "Batavia, Dutch East Indies"
    },
    {
      name: "Nyocot",
      title: "Urepmu kakean Quotes!",
      pictures: [
        {
          img: require("./src/assets/designs/crewet_by_sinkaroid_dcyjw22-fullview.jpg"),
          title: "Nyocot"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design & Vector",
      github: "",
      date: "2017",
      visit: "",
      description:
        ""
    },
    {
      name: "Stupidc0de",
      title: "The Beautiful Heroine",
      pictures: [
        {
          img: require("./src/assets/designs/sc0-heroine.png"),
          title: "The Beautiful Heroine"
        }
      ],
      technologies: ["XD", "Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2017",
      visit: "",
      description:
        ""
    },
    {
      name: "Sc0 X Slemanboys",
      title: "Slemanboys vs. The Stupidc0de",
      pictures: [
        {
          img: require("./src/assets/designs/slemanboys-x-sc0.png"),
          title: "Slemanboys"
        }
      ],
      technologies: ["Adobe Photoshop"],
      category: "Visual Design",
      github: "",
      date: "2016",
      visit: "",
      description:
        "The First Collaboration and Event Gathering with Stupidc0de and SlemanBoys in Real Life"
    },
    {
      name: "Sc0 X Sj",
      title: "Stupidc0de - Sanjungan Jiwa",
      pictures: [
        {
          img: require("./src/assets/designs/sj-sc0.png"),
          title: "Sc0 X Sj"
        }
      ],
      technologies: ["Adobe Photoshop"],
      category: "Visual Design",
      github: "",
      date: "2015",
      visit: "",
      description:
        "Collaboration with Stupidc0de to create a visual identity for Sanjungan Jiwa, a micro-community that dedicated with defacements and exploits."
    },
    {
      name: "SlemanBoys",
      title: "SlemanGetar",
      pictures: [
        {
          img: require("./src/assets/designs/slemangetar.png"),
          title: "SlemanGetar"
        }
      ],
      technologies: ["Adobe Photoshop"],
      category: "Visual Design",
      github: "",
      date: "2015",
      visit: "",
      description:
        "We Are Cyber Generation for our Citizen"
    },
    {
      name: "No Leader We Just Laugh Together",
      title: "No Leader We Just Laugh Together",
      pictures: [
        {
          img: require("./src/assets/designs/sc0.png"),
          title: "Stupidc0de"
        }
      ],
      technologies: ["Adobe Photoshop", "Adobe Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2014",
      visit: "",
      description:
        "Stay young Stay Dumb"
    },
    {
      name: "Stupidc0de",
      title: "The sixth shadow",
      pictures: [
        {
          img: require("./src/assets/designs/stupidcode.png"),
          title: "Stupidc0de"
        }
      ],
      technologies: ["XD", "Illustrator"],
      category: "Visual Design",
      github: "",
      date: "2014",
      visit: "",
      description:
        "Stupidc0de Family"
    },
    {
      name: "PhantomGhost",
      title: "PhantomGhost Hacker Team",
      pictures: [
        {
          img: require("./src/assets/designs/the-pg.png"),
          title: "PhantomGhost"
        }
      ],
      technologies: ["Adobe Photoshop"],
      category: "Visual Design",
      github: "",
      date: "2014",
      visit: "",
      description:
        "Visual Design for PhantomGhost Hacker Team"
    },
  ],
  portfolio_standalone: [
    {
      name: "Scathach",
      title: "Scathach Bot Discord",
      pictures: [
        {
          img: require("./src/assets/standalone/scathachbot.png"),
          title: "Scathach Bot - www.scathach.id - patreon.com/scathach_bot"
        }
      ],
      technologies: ["Discord Bot", "Discord API", "Fate/Grand Order"],
      category: "Discord Bot",
      github: "https://github.com/ScathachGrip",
      date: "Jun, 2021 - Present",
      visit: "https://scathach.dev/",
      description:
        "Scathach bot is a Lewd bot featuring wide range of nsfw, doujinshi aggregator, tons of a wet minigames, and sexy music players. Scathach bot has successfully reached 25.000 servers and more than 2M users. Part of the largest Discord bot developed by Indonesian creators."
    },
  
    {
      name: "Scathach API",
      title: "Scathach API - Microservices",
      pictures: [
        {
          img: require("./src/assets/standalone/scathachapi.png"),
          title: "https://www.patreon.com/join/scathach_bot/checkout?rid=7767699"
        }
      ],
      technologies: ["Restful API", "Microservice", "NSFW"],
      category: "Restful API",
      github: "",
      date: "Dec, 2021 - Present",
      visit: "",
      description:
        "Provide a high quality NSFW contents with low effort, this microservice opens all endpoint parts, instead of free version of scathach-api"
    },


  ],
  recommendations: [
    {
      title:
        "Always keep moving forward. Does not have a degree or a high education, but his patience and perseverance skip those things. Never disappoints, always totality.",
      author: "Jordy Setyo Budi",
      position: "Student, B. E",
      company: "University of Amikom",
      location: "Yogyakarta",
      flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
      picture: "https://cdn.discordapp.com/attachments/938964058735013899/942798599966822410/kekw.png",
      score: 5
    },
    {
      title:
        "He learn progamming by himself but his skills is quite impressive. He was able to complete his assignment ahead of time.",
      author: "Rizky Bayu Aji",
      position: "Architectural engineer",
      company: "State University of Malang",
      location: "Surabaya",
      flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
      picture: "https://pbs.twimg.com/profile_images/1139071374331244544/zReFXXiO_400x400.jpg",
      score: 5
    },
    {
      title:
        "Cukup oke, tetapi.. Tidak santuy dan terbilang selalu ngegas, bintang 3 dulu :v",
      author: "Rinda P Rabsani",
      position: "Community Manager",
      company: "Somewhere in Discord",
      location: "Jakarta",
      flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
      picture: "https://cdn.discordapp.com/attachments/959246543314096138/999331069646098523/bd009b5732be94fc41d3b1e2060b33dc.webp",
      score: 3
    },
    {
      title:
        "Strong decision maker. Always prepares a good infrastructure from the start and if the progress suddenly scale up I need no make changes.",
      author: "@soujiokita",
      position: "Programmer",
      company: "ScathachGrip",
      location: "Udon Thani",
      flag: "https://iconarchive.com/download/i109313/wikipedia/flags/TH-Thailand-Flag.ico",
      picture: "https://avatars.githubusercontent.com/u/47995444?v=4",
      score: 4
    },
  ],
};

export default info;
