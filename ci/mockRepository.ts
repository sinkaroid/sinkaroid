import dispatcherDescription from "./markdown/dispatcher.md?raw";
import scathachNextDescription from "./markdown/scathach_next.md?raw";
import scathachNextProDescription from "./markdown/scathach_next_pro.md?raw";
import teivaxDescription from "./markdown/teivax.md?raw";
import tristanDescription from "./markdown/tristan.md?raw";

import dataJson from "./data_oss.json" with { type: "json" };
import dataSasJson from "./data_oss_sas.json" with { type: "json" };
import flatPicture from "../src/assets/darin.png";
import shadowPicture from "../src/assets/sinkaroid.png";

// Visual design artwork
import imgLivium from "../src/assets/designs/livium.jpg";
import imgLivium2 from "../src/assets/designs/livium2.jpg";
import imgMS from "../src/assets/designs/MS.png";
import imgWorld from "../src/assets/designs/world_by_sinkaroid_dcyjvod.png";
import imgTobi from "../src/assets/designs/tobi_by_sinkaroid_dcyjvuh.png";
import imgSca from "../src/assets/designs/sca.png";
import imgDog from "../src/assets/designs/chaos.webp";
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

import imgMirrorContainer from "../src/assets/designs/mirror_container.webp";
import imgPrinceLaut from "../src/assets/designs/prince_laut.webp";
import imgAkufultitel from "../src/assets/designs/aku_full_title.webp";
import imgEnikkRockCounter from "../src/assets/designs/enikk_rock_counter.webp";
import imgDieselHeart from "../src/assets/designs/diesel_heart.webp";
import imgUnionMerge from "../src/assets/designs/union_merge.webp";
import imgUrusansusu from "../src/assets/designs/urusan_susu.webp";

import imgRepoBrandJigoku from "../src/assets/designs/jigoku.webp";
import imgRepoBrandJanda from "../src/assets/designs/janda.png";
import imgRepoBrandBooru from "../src/assets/designs/booru.png";
import imgRepoBrandEiyuu from "../src/assets/designs/eiyuu.webp";
import imgRepoBrandTomoe from "../src/assets/designs/tomoe.png";

import imgRepoBrandMatoi from "../src/assets/designs/matoi.png";
import imgRepoBrandTeivax from "../src/assets/designs/teivax.png";
import imgRepoBrandPixivHono from "../src/assets/designs/pixivhono.png";
import imgRepoBrandShiftypad from "../src/assets/designs/shiftypad_extension.png";
import imgRepoBrandNikkePwned from "../src/assets/designs/nikkepwned.webp";
import imgRepoBrandLustpress from "../src/assets/designs/lustpress.webp";
import imgRepoBrandJandapress from "../src/assets/designs/jandapress.png";

// Standalone software project images
import imgTristan from "../src/assets/standalone/standalone_tristan.webp";
import imgScathachNextPro from "../src/assets/standalone/standalone_scathach-next-pro.webp";
import imgScathachNext from "../src/assets/standalone/standalone_scathach-next.webp";
import imgDispatcher from "../src/assets/standalone/standalone_dispatcher.webp";
import imgDavinci from "../src/assets/standalone/standalone_davinci.webp";
import imgTeivax from "../src/assets/standalone/standalone_teivax.webp";
import imgShiftypad from "../src/assets/standalone/standalone_shiftypad.webp";
import imgEnikk from "../src/assets/standalone/standalone_enikk.webp";
import imgCharon from "../src/assets/standalone/standalone_charon.webp";
import imgNikkePwned from "../src/assets/standalone/standalone_nikkepwned.webp";
import imgMerahPutihMoe from "../src/assets/standalone/standalone_merahputihmoe.webp";
import imgStatusFlare from "../src/assets/standalone/standalone_statusflare.webp";
import imgScathachCustomBranding from "../src/assets/standalone/standalone_custom_branding.webp";
import imgScathachbot from "../src/assets/standalone/standalone_scathach_bot.webp";
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
    isMarkdown?: boolean;
}

const info = {
    name: "Sinkaroid",
    logo_name: "sinkaroid",
    flat_picture: flatPicture,
    shadow: shadowPicture,
    config: {
        use_cookies: true,
        use_transition_theme: true,
        navbar: {
            blur: false,
        },
    },
    description: "23yr old wandering code rogue and open-sourcerer",
    sinopsis: "I have no degree alias never go to formal college education, so keep in mind that if you want to hire me, I might not remember the complexity of interpolation search algorithm, but I'm pretty good and patient enough in searching and experimenting for it! All I learn this way with patience 💗",
    sinopsis_by_sinkaroid: "I never trained beneath the banners of a grand academy, so don't expect me to recite every ancient algorithm from memory. Hand me the grimoire instead—I have the patience to study, experiment, and forge the right spells. Every lesson in my tome was earned through curiosity, unwavering perseverance, and the courage to learn from every failed spells.",
    links: {
        linkedin: "https://www.linkedin.com/in/sinkaroid/",
        github: "https://github.com/sinkaroid",
        npm: "https://www.npmjs.com/~sinkaroid",
        pypi: "https://pypi.org/user/sinkaroid/",
        docker: "https://github.com/sinkaroid?tab=packages",
        paypal: "https://paypal.me/sinkaroid",
        telegram: "https://t.me/sinksink",
        twitter: "https://twitter.com/sinkaroid",
        steam: "https://steamcommunity.com/id/sinkaroid",
        instagram: "https://instagram.com/sinkaroid",
        latest_commit: sha_commit,
        resume: "https://github.com/sinkaroid",
        myanimelist: "https://myanimelist.net/profile/sinkaroid",
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
            position: "CTO, Developer Relations",
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
            info: ["JavaScript", "TypeScript", "Vue", "Go", "Python", "Rust", "Astro", "Bash"],
            icon: "fa fa-code",
        },
        {
            title: "Stack",
            info: [
                "Git", "Docker", "Kubernetes", "Eslint", "Hono", "Graphql", "Elysiajs", "Gofiber",
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
                "Kubernetes", "GitHub Actions", "Qlty", "Travis CI", "Jest", "Mocha", "Gotest", 
                "Poetry", "JSDoc", "TypeDoc", "Swagger", "Adobe Photoshop", "Figma", 
                "Adobe After Effects", "Capcut"
            ],
            icon: "fas fa-tools",
        },
    ],
    portfolio: data,
    portfolio_sas: dataSas,
    portfolio_design: [
        {
            name: "Repository branding",
            title: "@ScathachGrip/shiftypad-extension",
            pictures: [{ img: imgRepoBrandShiftypad, title: "https://github.com/ScathachGrip/shiftypad-extension" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2026",
            visit: "",
            description: "https://github.com/ScathachGrip/shiftypad-extension",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/matoi",
            pictures: [{ img: imgRepoBrandMatoi, title: "https://github.com/sinkaroid/matoi" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2026",
            visit: "",
            description: "https://github.com/sinkaroid/eiyuu",
        },
        {
            name: "Repository branding",
            title: "@ScathachGrip/teivax",
            pictures: [{ img: imgRepoBrandTeivax, title: "https://github.com/ScathachGrip/teivax" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2026",
            visit: "",
            description: "https://github.com/ScathachGrip/teivax",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/pixivHono",
            pictures: [{ img: imgRepoBrandPixivHono, title: "https://github.com/sinkaroid/pixivHono" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2025",
            visit: "",
            description: "https://github.com/sinkaroid/pixivHono",
        },
        {
            name: "Repository branding",
            title: "@ScathachGrip/nikkePwned",
            pictures: [{ img: imgRepoBrandNikkePwned, title: "https://github.com/ScathachGrip/nikkePwned" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2025",
            visit: "",
            description: "https://github.com/ScathachGrip/nikkePwned",
        },

        {
            name: "NIKKE",
            title: "Union Merge",
            pictures: [{ img: imgUnionMerge, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "NIKKE",
            title: "Diesel Heart",
            pictures: [{ img: imgDieselHeart, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "ENIKK",
            title: "Enikk rock counter",
            pictures: [{ img: imgEnikkRockCounter, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "Enikk rock counter",
        },
        {
            name: "NIKKE",
            title: "aku ful titel",
            pictures: [{ img: imgAkufultitel, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "NIKKE",
            title: "prince laut",
            pictures: [{ img: imgPrinceLaut, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "NIKKE",
            title: "urusan susu",
            pictures: [{ img: imgUrusansusu, title: "itulah my" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "NIKKE",
            title: "mirror container",
            pictures: [{ img: imgMirrorContainer, title: "Mirror Container" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design",
            github: "",
            date: "2024",
            visit: "",
            description: "itulah my",
        },
        {
            name: "Project Livium",
            title: "Darkness Livium Requiem",
            pictures: [{ img: imgLivium, title: "Royal Commander | Tanya degurechaff assets by @CasulCasulCasul" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2023",
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
            date: "2023",
            visit: "",
            description: "Royal Commander became puppets",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/lustpress",
            pictures: [{ img: imgRepoBrandLustpress, title: "https://github.com/sinkaroid/lustpress" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/lustpress",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/jandapress",
            pictures: [{ img: imgRepoBrandJandapress, title: "https://github.com/sinkaroid/jandapress" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/jandapress",
        },

        {
            name: "Repository branding",
            title: "@sinkaroid/tomoe",
            pictures: [{ img: imgRepoBrandTomoe, title: "https://github.com/sinkaroid/tomoe" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/tomoe",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/eiyuu",
            pictures: [{ img: imgRepoBrandEiyuu, title: "https://github.com/sinkaroid/eiyuu" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/eiyuu",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/jigoku",
            pictures: [{ img: imgRepoBrandJigoku, title: "https://github.com/sinkaroid/jigoku" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/jigoku",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/janda",
            pictures: [{ img: imgRepoBrandJanda, title: "https://github.com/sinkaroid/janda" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/janda",
        },
        {
            name: "Repository branding",
            title: "@sinkaroid/booru",
            pictures: [{ img: imgRepoBrandBooru, title: "https://github.com/sinkaroid/booru" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design",
            github: "",
            date: "2023",
            visit: "",
            description: "https://github.com/sinkaroid/booru",
        },
        {
            name: "WPU CHESS",
            title: "WPU Moonlight Shadow",
            pictures: [{ img: imgMS, title: "Moonlight Shadow" }],
            technologies: ["Adobe Photoshop"],
            category: "Visual Design - Vector",
            github: "",
            date: "2022",
            visit: "",
            description: "CHESS WEB Programming UNPAS - Moonlight Shadow",
        },
        {
            name: "Decaying of world",
            title: "Fuck Corona",
            pictures: [{ img: imgWorld, title: "Fuck Corona" }],
            technologies: ["GNU Image Manipulation Program"],
            category: "Visual Design - Vector",
            github: "",
            date: "2021",
            visit: "",
            description: "This work depicts the decay of the world this year, Covid-19 and the war that never ends, I illustrate myself using a half-broken mask which means that I am half crazy because of this situation.",
        },
        {
            name: "ScathachGrip",
            title: "ScathachGrip",
            pictures: [{ img: imgSca, title: "ScathachGrip" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2021",
            visit: "",
            description: "https://github.com/ScathachGrip",
        },
        {
            name: "Tobi",
            title: "Indra Uchiha",
            pictures: [{ img: imgTobi, title: "Indrawan" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design - Vector",
            github: "",
            date: "2020",
            visit: "",
            description: "Illustation of me when i became Obito uchiha",
        },
        {
            name: "Heroes",
            title: "The Fallen Heroes",
            pictures: [{ img: imgDog, title: "Heroes" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2020",
            visit: "",
            description: "Fuck the w0rld, The price they must to pay! Left to Right: Ouma shu (The guilty crown) - Lelouch vi Britannia (Code geass) - Itachi Uchiha (Naruto) - Emiya Kiritsugu (Fate/Zero) - Okabe Rintarou (STEINS;GATE)",
        },
        {
            name: "Joker",
            title: "The Joker",
            pictures: [{ img: imgJoker, title: "The Joker" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design",
            github: "",
            date: "2018",
            visit: "",
            description: "Stupidc0de's destruction, End of era, But the joker is always watching",
        },
        {
            name: "Batavia",
            title: "The Batavia",
            pictures: [{ img: imgBatavia, title: "Batavia" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design & Vector",
            github: "",
            date: "2018",
            visit: "",
            description: "Batavia, Dutch East Indies",
        },
        {
            name: "Nyocot",
            title: "Urepmu kakean Quotes!",
            pictures: [{ img: imgCrewet, title: "Nyocot" }],
            technologies: ["Adobe Photoshop", "Adobe Illustrator"],
            category: "Visual Design & Vector",
            github: "",
            date: "2018",
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
            date: "2016",
            visit: "",
            description: "Visual Design for PhantomGhost Hacker Team",
        },
    ] as PortfolioItem[],
    portfolio_standalone: [
        {
            name: "ScathachGrip",
            title: "@ScathachGrip/tristan",
            pictures: [{ img: imgTristan, title: "tristan" }],
            technologies: ["Microservices"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://github.com/ScathachGrip/tristan",
            description: tristanDescription,
            isMarkdown: true,
        },
        {
            name: "ScathachGrip",
            title: "@ScathachGrip/scathach-next-pro",
            pictures: [{ img: imgScathachNextPro, title: "scathach-next-pro" }],
            technologies: ["Microservices"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://next-pro.scathach.id/",
            description: scathachNextProDescription,
            isMarkdown: true,
        },
        {
            name: "ScathachGrip",
            title: "@ScathachGrip/scathach-next",
            pictures: [{ img: imgScathachNext, title: "scathach-next" }],
            technologies: ["Microservices"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://next.scathach.id/",
            description: scathachNextDescription,
            isMarkdown: true,
        },
        {
            name: "ScathachGrip",
            title: "@ScathachGrip/dispatcher",
            pictures: [{ img: imgDispatcher, title: "Dispatcher" }],
            technologies: ["Microservices"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://dispatcher.scathach.id/",
            description: dispatcherDescription,
            isMarkdown: true,
        },
        {
            name: "ScathachGrip",
            title: "DaVinci",
            pictures: [{ img: imgDavinci, title: "DaVinci" }],
            technologies: ["Continuous Integration", "Github Actions", "Github App"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://davinci.scathach.id/",
            description: "Github Actions app to automate PR and Issues workflows",
        },
        {
            name: "ScathachGrip",
            title: "teivax",
            pictures: [{ img: imgTeivax, title: "teivax" }],
            technologies: ["Continuous Integration"],
            category: "App",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://github.com/ScathachGrip/teivax",
            description: teivaxDescription,
            isMarkdown: true,
        },
        {
            name: "ScathachGrip",
            title: "ShiftyPad Extension",
            pictures: [{ img: imgShiftypad, title: "ShiftyPad" }],
            technologies: ["Browser Extension", "Nikke"],
            category: "Browser Extension",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://shiftypad.scathach.id/",
            description: "Blablalink Extension — Pull Union Raid data with ease. interactive visualizations, clarity to every metrics, season-aware cache, and one-click export.",
        },
        {
            name: "ScathachGrip",
            title: "Charon: Abyss Companion",
            pictures: [{ img: imgCharon, title: "Charon" }],
            technologies: ["Android", "Mobile"],
            category: "Apps",
            github: "https://github.com/ScathachGrip",
            date: "2026 - Present",
            visit: "https://play.google.com/store/apps/details?id=com.scathachgrip.charon",
            description: "DNA companion app. An utility, tools, and guide for DUET NIGHT ABYSS",
        },
        {
            name: "ScathachGrip",
            title: "ENIKK: NIKKE Assistant",
            pictures: [{ img: imgEnikk, title: "ENIKK" }],
            technologies: ["Android", "Mobile"],
            category: "Apps",
            github: "https://github.com/ScathachGrip",
            date: "2024 - Present",
            visit: "https://play.google.com/store/apps/details?id=com.scathachgrip.enikk",
            description: "NIKKE guide & assistant in mind. An utility tools for GODDESS OF VICTORY: NIKKE",
        },
        {
            name: "ScathachGrip",
            title: "nikkePwned",
            pictures: [{ img: imgNikkePwned, title: "nikkePwned" }],
            technologies: ["Windows App", "NIKKE"],
            category: "Apps",
            github: "https://github.com/ScathachGrip",
            date: "2025 - Present",
            visit: "https://github.com/ScathachGrip/nikkePwned",
            description: "Password Manager for NIKKE",
        },
        {
            name: "ScathachGrip",
            title: "merahputih.moe",
            pictures: [{ img: imgMerahPutihMoe, title: "merahputih.moe" }],
            technologies: ["Cloudflare DNS", "Cloudflare Pages", "Custom Domains"],
            category: "Microservices",
            github: "https://github.com/ScathachGrip",
            date: "2023 - Present",
            visit: "https://github.com/ScathachGrip/merahputih.moe",
            description: "Are you weeb developer looking for free webspace to host your project? Get free subdomain merahputih.moe UwU",
        },
        {
            name: "ScathachGrip",
            title: "StatusFlare",
            pictures: [{ img: imgStatusFlare, title: "Statusflare" }],
            technologies: ["Monitors", "HTTP Check", "HTTP Response"],
            category: "Microservices",
            github: "https://github.com/ScathachGrip",
            date: "2023 - Present",
            visit: "https://status.scathachbot.xyz/",
            description: "Cloudflare Workers + Astro status page with KV monitoring",
        },
        {
            name: "ScathachGrip",
            title: "Scathach bot - custom branding",
            pictures: [{ img: imgScathachCustomBranding, title: "Scathach custom branding" }],
            technologies: ["Discord Bot", "Discord API", "Microservices"],
            category: "Discord Bot",
            github: "https://github.com/ScathachGrip",
            date: "2024 - Present",
            visit: "https://scathachbot.xyz/custom-branding",
            description: "Your own bots. Create your own custom branding for Scathach bot, with your own avatar, name, and more customizations",
        },
        {
            name: "ScathachGrip",
            title: "Scathach bot",
            pictures: [{ img: imgScathachbot, title: "Scathach Bot" }],
            technologies: ["Discord Bot", "Discord API", "Microservices"],
            category: "Discord Bot",
            github: "https://github.com/ScathachGrip",
            date: "2021 - Present",
            visit: "https://scathachbot.xyz/",
            description: "Scathach bot is a Lewd bot featuring wide range of nsfw, doujinshi aggregator, tons of a wet minigames, and sexy music players. Scathach bot has successfully reached 70.000 servers and more than 6M users.",
        },
        {
            name: "ScathachGrip",
            title: "Scathach API",
            pictures: [{ img: imgScathachapi, title: "https://www.patreon.com/join/scathach_bot/checkout?rid=7767699" }],
            technologies: ["Microservice", "API"],
            category: "Microservices",
            github: "",
            date: "2021 - 2024",
            visit: "",
            description: "Provide a high quality NSFW contents with low effort, this microservice opens all endpoint parts, instead of free version of scathach-api",
        },
    ] as PortfolioItem[],
    recommendations: []
};

export default info;
