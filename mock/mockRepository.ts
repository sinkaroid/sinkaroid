import dataJson from "./data_oss.json" with { type: "json" };
import dataSasJson from "./data_oss_sas.json" with { type: "json" };
import flatPicture from "../src/assets/sinkaroid.png";
import shadowPicture from "../src/assets/darin.png";

// Visual design artwork
import imgLivium from "../src/assets/designs/livium.jpg";
import imgLivium2 from "../src/assets/designs/livium2.jpg";
import imgMS from "../src/assets/designs/MS.png";
import imgWorld from "../src/assets/designs/world_by_sinkaroid_dcyjvod.png";
import imgTobi from "../src/assets/designs/tobi_by_sinkaroid_dcyjvuh.png";
import imgSca from "../src/assets/designs/sca.png";
import imgDog from "../src/assets/designs/dog.gif";
import imgJoker from "../src/assets/designs/joker_by_sinkaroid_dcyjvhx.png";
import imgBatavia from "../src/assets/designs/batavia.jpg";
import imgCrewet from "../src/assets/designs/crewet_by_sinkaroid_dcyjw22-fullview.jpg";
import imgSc0Heroine from "../src/assets/designs/sc0-heroine.png";
import imgSlemanboysSc0 from "../src/assets/designs/slemanboys-x-sc0.png";
import imgSjSc0 from "../src/assets/designs/sj-sc0.png";
import imgSlemangetar from "../src/assets/designs/slemangetar.png";
import imgSc0 from "../src/assets/designs/sc0.png";
import imgStupidcode from "../src/assets/designs/stupidcode.png";
import imgThePg from "../src/assets/designs/the-pg.png";

// Standalone software project images
import imgScathachbot from "../src/assets/standalone/scathachbot.png";
import imgScathachapi from "../src/assets/standalone/scathachapi.png";

const { data, sha_commit } = dataJson;
const { data: dataSas } = dataSasJson;

interface Picture {
    img: string;
    title?: string;
}

interface PortfolioItem {
    name: string;
    title?: string;
    pictures: Picture[];
    technologies: string[];
    category: string;
    github: string;
    date: string;
    visit: string;
    description: string;
}

const info = {
    name: "Sinkaroid",
    logo_name: "sinkaroid",
    flat_picture: flatPicture,
    shadow: shadowPicture,
    config: {
        use_cookies: true,
        navbar: {
            blur: false,
        },
    },
    description: "23yr old wandering code rogue and open-sourcerer",
    sinopsis: "I have no degree alias never go to formal college education, so keep in mind that if you want to hire me, I might not remember the complexity of interpolation search algorithm, but I'm pretty good and patient enough in searching and experimenting for it! All I learn this way with patience 💗",
    sinopsis_by_sinkaroid: "I never trained beneath the banners of a grand academy, so don't expect me to recite every ancient algorithm from memory. Hand me the grimoire instead—I have the patience to study, experiment, and forge the right spell until the quest is complete. Every lesson in my tome was earned through curiosity, unwavering perseverance, and the courage to learn from every failed spell.",
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
        resume: "https://github.com/sinkaroid",
    },
    education: [
        {
            name: "SMK Nasional Berbah Yogyakarta",
            place: "ID",
            date: "2017 - 2021",
            degree: "Computer and Network Engineering",
            description: "6F55+J2V, Jl. Tanjungtirto, Kali Pentung, Kalitirto, Kec. Berbah, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55573",
            skills: ["Internet Protocols", "OS", "Network", "Linux", "HighSchool"],
        },
        {
            name: "SMPN 3 Kalasan Yogyakarta",
            place: "ID",
            date: "2014 - 2017",
            degree: "Junior High School",
            description: "6CRX+RFR, Jl. Sidokerto, Kel. Purwomartani, Kec. Kalasan, Sidokerto, Purwomartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
            skills: ["Junior High School"],
        },
    ],
    experience: [
        {
            name: "PT. Fasa Centra Artajaya",
            link: "https://www.fasapay.co.id",
            place: "Yogyakarta, Indonesia",
            date: "2022 - 2025",
            position: "Backend Engineer",
            description: "Grha Karya Jody Lt. 1, Jl. Cempaka Baru No. 9, Karangasem, Condongcatur, Depok, Sleman, Yogyakarta 55283.",
            skills: ["Backend Engineering", "Payment Gateway", "API Integration"],
        },
        {
            name: "ScathachGrip",
            link: "https://scathachbot.xyz",
            place: "Indonesia - Thailand",
            date: "2021 - Present",
            position: "Developer Relations - CTO",
            description: "Microservices product. Scathach bot - Imagine a lewd bot 70K servers, 8M+ users. https://scathachbot.xyz",
            skills: ["Embedded Software", "Microservices", "Software as a service"],
        },
        {
            name: "PT. Telekomunikasi Indonesia (Telkom) Tbk",
            link: "https://www.telkom.co.id/",
            place: "Yogyakarta, Indonesia",
            date: "2018 - 2019",
            position: "Industrial Solutions",
            description: "Jl. Yos Sudarso No.9, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55224",
            skills: ["Internships", "Problem solve", "Networking"],
        }
    ],
    skills: [
        {
            title: "Languages",
            info: ["JavaScript", "TypeScript", "Vue", "Python", "Go", "Rust", "Astro", "Bash"],
            icon: "fa fa-code",
        },
        {
            title: "Stack",
            info: [
                "Docker", "Kubernetes", "Eslint", "Hono", "Graphql", "Elysiajs", "Gofiber",
                "Axum", "Express", "Cheerio", "Flask", "beautifulsoup4", "Vue.js", "Nuxt.js",
                "React", "Next.js", "Prisma", "Redis", "Sequelize", "RabbitMQ", "PostgreSQL",
                "MongoDB", "SQLite", "Grafana", "Prometheus", "Bun", "NodeJS"
            ],
            icon: "fa fa-cubes",
        },
        {
            title: "Tools",
            info: [
                "Visual Studio Code", "Antigravity", "Gemini CLI", "Claude Code", "Docker",
                "GitHub Actions", "Travis CI", "Jest", "Mocha", "Gotest", "Poetry", "JSDoc",
                "TypeDoc", "Swagger", "Qlty"
            ],
            icon: "fas fa-tools",
        },
    ],
    portfolio: data,
    portfolio_sas: dataSas,
    portfolio_design: [
        {
            name: "Project Livium",
            title: "Darkness Livium Requiem",
            pictures: [{ img: imgLivium, title: "Royal Commander | Tanya degurechaff assets by @CasulCasulCasul" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2022",
            visit: "",
            description: "I won't be tolerating even to the tiniest threat.",
        },
        {
            name: "Project Livium",
            title: "A God's Puppet",
            pictures: [{ img: imgLivium2, title: "Royal Commander | Tanya degurechaff assets by @CasulCasulCasul" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2022",
            visit: "",
            description: "Royal Commander became puppets",
        },
        {
            name: "WPU CHESS",
            title: "WPU Moonlight Shadow",
            pictures: [{ img: imgMS }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2018",
            visit: "",
            description: "WPU - Adudu Tactics Sendiri, editor bekicot, attack lama, pacaran disakiti - akhirnya ketemu jodoh",
        },
        {
            name: "World",
            title: "Gate of Steiner",
            pictures: [{ img: imgWorld }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design & Vector",
            github: "",
            date: "2018",
            visit: "",
            description: "Steiner World of The Gate",
        },
        {
            name: "Tobi (Chill)",
            title: "WPU - I AM A HACKER",
            pictures: [{ img: imgTobi }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "Tobi Chill - Showing some appreciation to the Legends",
        },
        {
            name: "Scathach",
            title: "Scathach Design",
            pictures: [{ img: imgSca }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "The Legendary Irish Warrior",
        },
        {
            name: "The DOGE",
            title: "The Dog",
            pictures: [{ img: imgDog }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "Move along, nothing to hack here",
        },
        {
            name: "Batavia",
            title: "Batavia Kali Code Project",
            pictures: [{ img: imgBatavia }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "Batavia - Kali Code Identity for Kali Linux Underground Community Yogyakarta",
        },
        {
            name: "Joker",
            title: "Joker 2017",
            pictures: [{ img: imgJoker, title: "Joker X Stupidc0de" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "Joker Commission",
        },
        {
            name: "Nyocot",
            title: "Urepmu kakean Quotes!",
            pictures: [{ img: imgCrewet, title: "Nyocot" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design & Vector",
            github: "",
            date: "2017",
            visit: "",
            description: "",
        },
        {
            name: "Stupidc0de",
            title: "The Beautiful Heroine",
            pictures: [{ img: imgSc0Heroine, title: "The Beautiful Heroine" }],
            technologies: ["XD", "Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2017",
            visit: "",
            description: "",
        },
        {
            name: "Sc0 X Slemanboys",
            title: "Slemanboys vs. The Stupidc0de",
            pictures: [{ img: imgSlemanboysSc0, title: "Slemanboys" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2016",
            visit: "",
            description: "The First Collaboration and Event Gathering with Stupidc0de and SlemanBoys in Real Life",
        },
        {
            name: "Sc0 X Sj",
            title: "Stupidc0de - Sanjungan Jiwa",
            pictures: [{ img: imgSjSc0, title: "Sc0 X Sj" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2016",
            visit: "",
            description: "Collaboration with Stupidc0de to create a visual identity for Sanjungan Jiwa, a micro-community that dedicated with defacements and exploits.",
        },
        {
            name: "SlemanBoys",
            title: "SlemanGetar",
            pictures: [{ img: imgSlemangetar, title: "SlemanGetar" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2016",
            visit: "",
            description: "We Are Cyber Generation for our Citizen",
        },
        {
            name: "No Leader We Just Laugh Together",
            title: "No Leader We Just Laugh Together",
            pictures: [{ img: imgSc0, title: "Stupidc0de" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2016",
            visit: "",
            description: "Stay young Stay Dumb",
        },
        {
            name: "Stupidc0de",
            title: "The sixth shadow",
            pictures: [{ img: imgStupidcode, title: "Stupidc0de" }],
            technologies: ["XD", "Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2016",
            visit: "",
            description: "Stupidc0de Family",
        },
        {
            name: "PhantomGhost",
            title: "PhantomGhost Hacker Team",
            pictures: [{ img: imgThePg, title: "PhantomGhost" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2015",
            visit: "",
            description: "Visual Design for PhantomGhost Hacker Team",
        },
    ] as PortfolioItem[],
    portfolio_standalone: [
        {
            name: "Scathach",
            title: "Scathach Bot Discord",
            pictures: [{ img: imgScathachbot, title: "Scathach Bot - www.scathach.id - patreon.com/scathach_bot" }],
            technologies: ["Discord Bot", "Discord API", "Fate/Grand Order"],
            category: "Discord Bot",
            github: "https://github.com/ScathachGrip",
            date: "Jun, 2021 - Present",
            visit: "https://scathach.dev/",
            description: "Scathach bot is a Lewd bot featuring wide range of nsfw, doujinshi aggregator, tons of a wet minigames, and sexy music players. Scathach bot has successfully reached 25.000 servers and more than 2M users. Part of the largest Discord bot developed by Indonesian creators.",
        },
        {
            name: "Scathach API",
            title: "Scathach API - Microservices",
            pictures: [{ img: imgScathachapi, title: "https://www.patreon.com/join/scathach_bot/checkout?rid=7767699" }],
            technologies: ["Restful API", "Microservice", "NSFW"],
            category: "Restful API",
            github: "",
            date: "Dec, 2021 - Present",
            visit: "",
            description: "Provide a high quality NSFW contents with low effort, this microservice opens all endpoint parts, instead of free version of scathach-api",
        },
    ] as PortfolioItem[],
    recommendations: [
        {
            title: "Always keep moving forward. Does not have a degree or a high education, but his patience and perseverance skip those things. Never disappoints, always totality.",
            author: "Jordy Setyo Budi",
            position: "Student, B. E",
            company: "University of Amikom",
            location: "Yogyakarta",
            flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
            picture: "https://cdn.discordapp.com/attachments/938964058735013899/942798599966822410/kekw.png",
            score: 5,
        },
        {
            title: "He learn progamming by himself but his skills is quite impressive. He was able to complete his assignment ahead of time.",
            author: "Rizky Bayu Aji",
            position: "Architectural engineer",
            company: "State University of Malang",
            location: "Surabaya",
            flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
            picture: "https://pbs.twimg.com/profile_images/1139071374331244544/zReFXXiO_400x400.jpg",
            score: 5,
        },
        {
            title: "Cukup oke, tetapi.. Tidak santuy dan terbilang selalu ngegas, bintang 3 dulu :v",
            author: "Rinda P Rabsani",
            position: "Community Manager",
            company: "Discord User",
            location: "Jakarta",
            flag: "https://iconarchive.com/download/i109166/wikipedia/flags/ID-Indonesia-Flag.ico",
            picture: "https://cdn.discordapp.com/attachments/959246543314096138/999331069646098523/bd009b5732be94fc41d3b1e2060b33dc.webp",
            score: 3,
        },
        {
            title: "Strong decision maker. Always prepares a good infrastructure from the start and if the progress suddenly scale up I need no make changes.",
            author: "@soujiokita",
            position: "Programmer",
            company: "ScathachGrip",
            location: "Udon Thani",
            flag: "https://iconarchive.com/download/i109313/wikipedia/flags/TH-Thailand-Flag.ico",
            picture: "https://avatars.githubusercontent.com/u/47995444?v=4",
            score: 4,
        },
    ],
};

export default info;
