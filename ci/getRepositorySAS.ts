import fs from "fs";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const ghFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`${response.status} ${response.statusText} ${body.slice(0, 200)}`);
    }
    const ct = response.headers.get("content-type") || "";
    return ct.includes("application/json") ? response.json() : response.arrayBuffer();
};
const ghFetchBuffer = async (url: string, options: RequestInit = {}): Promise<ArrayBuffer> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.arrayBuffer();
};

// Force a fresh, valid Poppins TTF: if local copy is missing or suspiciously small, re-download from Google Fonts.
const POPPINS_TTF_PATH = "./ci/poppins.ttf";
const POPPINS_FALLBACK_SRC = "./assets/fonts/poppins.ttf";

if (fs.existsSync(POPPINS_FALLBACK_SRC) && (!fs.existsSync(POPPINS_TTF_PATH) || fs.statSync(POPPINS_TTF_PATH).size < 50000)) {
    if (fs.existsSync(POPPINS_TTF_PATH)) fs.unlinkSync(POPPINS_TTF_PATH);
    fs.copyFileSync(POPPINS_FALLBACK_SRC, POPPINS_TTF_PATH);
}

let poppinsBase64 = "";
const ensurePoppinsTtf = async () => {
    try {
        if (fs.existsSync(POPPINS_TTF_PATH)) {
            const localStats = fs.statSync(POPPINS_TTF_PATH);
            if (localStats.size < 50000) {
                console.log(`[Font Check] Local poppins.ttf looks too small (${localStats.size} bytes). Re-downloading from Google Fonts...`);
                fs.unlinkSync(POPPINS_TTF_PATH);
            } else {
                poppinsBase64 = fs.readFileSync(POPPINS_TTF_PATH).toString("base64");
                console.log(`[Font Check] Using local poppins.ttf (${localStats.size} bytes, base64 ${poppinsBase64.length} chars).`);
                return;
            }
        }
        if (!poppinsBase64) {
            console.log("[Font Check] Downloading Poppins-SemiBold (600) and Poppins-Black (900) from Google Fonts GitHub...");
            const baseUrl = "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/";
            const fontFilesList = [
                { file: "Poppins-SemiBold.ttf", weight: 600, role: "secondary" },
                { file: "Poppins-Black.ttf", weight: 900, role: "primary" }
            ];
            for (const w of fontFilesList) {
                const buffer = await ghFetchBuffer(baseUrl + w.file);
                const b = Buffer.from(buffer);
                if (b.length < 50000) throw new Error(`Downloaded ${w.file} suspiciously small (${b.length} bytes)`);
                const out = POPPINS_TTF_PATH.replace(/\.ttf$/, `_${w.weight}.ttf`);
                fs.writeFileSync(out, b);
                console.log(`  + ${w.file} (weight ${w.weight}, ${b.length} bytes)`);
                if (w.role === "primary") {
                    fs.writeFileSync(POPPINS_TTF_PATH, b);
                    poppinsBase64 = b.toString("base64");
                }
            }
            console.log("[Font Check] Downloaded 2 Poppins weights (600 SemiBold, 900 Black).");
        }
    } catch (err) {
        console.error("[Font Check] Failed to obtain a valid Poppins TTF:", (err as Error).message);
    }
};
await ensurePoppinsTtf();

const today = moment().format("YYYY-MM-DD");
const time = moment().format("HH:mm:ss");

let GH_TOKEN: string | undefined;
if (!process.argv.slice(2)[0]) GH_TOKEN = process.env.GH_TOKEN;
else GH_TOKEN = process.argv.slice(2)[0];

async function pendingSebentar(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

const convertDate = (date: string): string => {
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
        "December"
    ];

    let monthName = monthArray[parseInt(month, 10) - 1];
    let dateString = `${monthName} ${day}, ${year}`;
    return dateString;
};

const convertTime = (tgl: string): string => {
    let dateArray = tgl.split("-");
    let year = dateArray[0];
    let month = dateArray[1];
    let day = dateArray[2].split("T")[0];
    let time = dateArray[2].split("T")[1].split("Z")[0];
    let timeArray = time.split(":");
    let hour = timeArray[0];
    let minute = timeArray[1];
    let second = timeArray[2];
    let dateUpdate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
    let timeago = moment(dateUpdate).fromNow();
    return timeago;
};

const languageColors: Record<string, string> = {
    "JavaScript": "hsl(53, 93%, 54%)",
    "TypeScript": "hsl(211, 60%, 48%)",
    "Python": "hsl(207, 44%, 49%)",
    "Vue": "hsl(153, 49%, 47%)",
    "Go": "hsl(192, 100%, 42%)",
    "Rust": "hsl(20, 48%, 51%)",
    "HTML": "hsl(12, 77%, 52%)",
    "CSS": "hsl(205, 79%, 40%)",
    "C++": "hsl(205, 50%, 31%)",
    "C#": "hsl(120, 100%, 26%)",
    "Java": "hsl(35, 75%, 40%)",
    "Shell": "hsl(93, 71%, 60%)",
    "PHP": "hsl(232, 31%, 45%)",
    "Dockerfile": "hsl(200, 20%, 28%)",
    "Markdown": "hsl(220, 90%, 34%)",
    "Astro": "hsl(22, 100%, 50%)"
};

const wrapText = (text: string, maxChars: number): string[] => {
    if (!text) return ["No description provided."];
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
        if ((currentLine + " " + word).length > maxChars) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine += " " + word;
        }
    }
    if (currentLine) {
        lines.push(currentLine.trim());
    }
    return lines.slice(0, 3);
};

const escapeXml = (unsafe: string): string => {
    if (!unsafe) return "";
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case "\"": return "&quot;";
        default: return c;
        }
    });
};

const generatePrivateCardSvg = (name: string, description: string, language: string, owner = "private", languages: string[] = []): string => {
    const descLines = wrapText(description || "An unreleased project. Access restricted.", 38);
    const safeName = (name || "untitled").slice(0, 28);
    const safeOwner = (owner || "private").slice(0, 20);

    return `
<svg width="600" height="315" viewBox="0 0 600 315" xmlns="http://www.w3.org/2000/svg">
    <style type="text/css">
        @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 100 900;
            src: url('data:font/ttf;base64,${poppinsBase64}') format('truetype');
        }
        .h1 { font-family: 'Poppins'; font-weight: 800; letter-spacing: -0.035em; }
        .meta { font-family: 'Poppins'; font-weight: 900; letter-spacing: 0.02em; }
        .desc { font-family: 'Poppins'; font-weight: 600; letter-spacing: -0.005em; }
    </style>

    <rect width="600" height="315" rx="22" fill="#ffffff"/>
    <rect x="0.75" y="0.75" width="598.5" height="313.5" rx="21.25" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>

    <text class="meta" x="40" y="46" font-size="15" fill="#111827">@${escapeXml(safeOwner)}<tspan fill="#9ca3af"> / </tspan>${escapeXml(safeName)}</text>

    <text class="h1" x="40" y="120" font-size="44" fill="#000000">${escapeXml(safeName)}</text>

    <rect x="40" y="138" width="64" height="2" rx="1" fill="#000000"/>

    <g transform="translate(40, 168)">
        <text class="desc" x="0" y="0" font-size="16" fill="#6b7280">
            ${descLines.map((line, idx) => "<tspan x=\"0\" dy=\"" + (idx === 0 ? 0 : 26) + "\">" + escapeXml(line) + "</tspan>").join("")}
        </text>
    </g>

    ${(() => {
        const knownLangs = (languages || []).filter((l) => languageColors[l]);
        const out: string[] = [];
        let chipX = 40;
        for (let i = 0; i < Math.min(3, knownLangs.length); i++) {
            const lang = knownLangs[i];
            out.push(`<g transform="translate(${chipX}, 252)">
                <circle cx="6" cy="6" r="4" fill="#111827"/>
                <text class="meta" x="22" y="10" font-size="14" fill="#374151">${escapeXml(lang)}</text>
            </g>`);
            chipX += lang.length * 8 + 16 + 22;
        }
        return out.join("");
    })()}

    <g transform="translate(540, 60)">
        <rect x="-32" y="-14" width="64" height="28" rx="6" fill="#111827"/>
        <text class="meta" x="0" y="6" font-size="11" fill="#ffffff" text-anchor="middle">PRIVATE</text>
    </g>
</svg>
    `.trim();
};

const project: { repo: any[] } = {
    repo: [
        { user: "sinkaroid", name: "enikk", branch: "master" },
        { user: "sinkaroid", name: "charon", branch: "master" },
        { user: "ScathachGrip", name: "scathachbot.xyz", branch: "master" },
        { user: "ScathachGrip", name: "scathach-next", branch: "master" },
        { user: "ScathachGrip", name: "scathach-next-pro", branch: "master" },
        { user: "sinkaroid", name: "dna-autofarm", branch: "master" },
        { user: "sinkaroid", name: "enikk_rock_counter", branch: "master" },
        { user: "sinkaroid", name: "jawpy", branch: "master" },
        { user: "sinkaroid", name: "megumiAi", branch: "master" },
        { user: "sinkaroid", name: "Scathachgram", branch: "main" },
        { user: "sinkaroid", name: "Makise", branch: "master" },
        { user: "ScathachGrip", name: "dispatcher", branch: "master" },
        { user: "ScathachGrip", name: "statusflare", branch: "master" },
        { user: "ScathachGrip", name: "buster", branch: "master" },
        { user: "ScathachGrip", name: "dispatcher-telemetry", branch: "master" },
        { user: "ScathachGrip", name: "XPixivBookmarkScrape", branch: "master" },
        { user: "ScathachGrip", name: "XTwitterFavScrape", branch: "master" },
        { user: "ScathachGrip", name: "SSHfier", branch: "master" },
        { user: "ScathachGrip", name: "Caster", branch: "master" },
        { user: "ScathachGrip", name: "enikk-webhook", branch: "master" },
        { user: "ScathachGrip", name: "aiserver", branch: "master" },
        { user: "ScathachGrip", name: "archer", branch: "master" },
        { user: "ScathachGrip", name: "spellblock", branch: "main" },
        { user: "ScathachGrip", name: "scathach.redsplit.org", branch: "master" }
    ],
};
const getInfo = async (useToken: boolean): Promise<any[]> => {
    const sharp = (await import("sharp")).default;
    const { Resvg } = await import("@resvg/resvg-js");
    let info: any[] = [];
    const outputDir = "./public/assets/sas";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const headers = useToken ? { Authorization: `token ${GH_TOKEN}` } : {};

    console.log("Fetching repository metadata in batches using Promise.all...");

    const results: any[] = [];
    const batchSize = 5;
    for (let i = 0; i < project.repo.length; i += batchSize) {
        const batch = project.repo.slice(i, i + batchSize);
        console.log(`Fetching metadata batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(project.repo.length / batchSize)}...`);
        const batchPromises = batch.map(async (repoInfo) => {
            try {
                const [res, resSha, tagsData, languagesData] = await Promise.all([
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}`, { headers }),
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/commits/${repoInfo.branch}`, { headers }),
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/tags`, { headers }),
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/languages`, { headers })
                ]);
                return { repoInfo, res: { data: res }, resSha: { data: resSha }, tagsData: { data: tagsData }, languagesData: { data: languagesData } };
            } catch (err) {
                console.error(`Error fetching metadata for ${repoInfo.name}:`, (err as Error).message);
                return null;
            }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        if (i + batchSize < project.repo.length) {
            await pendingSebentar(1000);
        }
    }

    console.log("Finished fetching repository metadata. Now processing and optimizing images sequentially...");

    for (const item of results) {
        if (!item) continue;
        const { repoInfo, res, resSha, tagsData, languagesData } = item;

        try {
            let release;
            if (tagsData.data.length == 0) release = "pre-release";
            else release = tagsData.data[0].name;

            let languages = Object.keys(languagesData.data || {});
            let topics = [...new Set([...languages, ...(res.data.topics || [])])];

            let bahasa: string;
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
            else if (res.data.language == "Markdown") bahasa = "https://skillicons.dev/icons?i=markdown";
            else if (res.data.language == "Dockerfile") bahasa = "https://skillicons.dev/icons?i=docker";
            else if (res.data.language == "Astro") bahasa = "https://skillicons.dev/icons?i=astro";
            else bahasa = "https://skillicons.dev/icons?i=github";

            const localImgPath = `/assets/sas/${repoInfo.name}_${repoInfo.branch}.webp`;

            info.push({
                name: res.data.name,
                pictures: [{ img: localImgPath }],
                technologies: topics,
                category: res.data.language,
                date: `${convertDate(res.data.created_at)} (Updated: ${convertTime(res.data.updated_at)})`,
                github: res.data.html_url,
                bahasa: bahasa,
                visit: res.data.homepage ? res.data.homepage : res.data.html_url,
                description: res.data.description,
                commit: resSha.data.sha,
                link_commit: `https://github.com/${repoInfo.user}/${repoInfo.name}/commit/${resSha.data.sha}`,
                release: release,
                last_commit_date: resSha.data.commit.committer.date,
            });

            console.log(`Pushing ${repoInfo.name} #${repoInfo.branch} to portfolio data`);

            const oldAssetPath = `./assets/sas/${repoInfo.name}_${repoInfo.branch}.webp`;
            const outputPath = `${outputDir}/${repoInfo.name}_${repoInfo.branch}.webp`;

            let imageBuffer: Buffer | undefined;
            const isPrivate = res.data.private;
            let downloaded = false;

            if (!isPrivate) {
                const targetUrl = `https://opengraph.githubassets.com/${resSha.data.sha}/${res.data.full_name}`;
                const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}`;

                try {
                    console.log(`Downloading Open Graph image for ${res.data.full_name} via image proxy...`);
                    const buffer = await ghFetchBuffer(proxyUrl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                        }
                    });

                    imageBuffer = Buffer.from(buffer);
                    downloaded = true;
                    console.log(`Successfully downloaded image for ${repoInfo.name} via proxy`);
                } catch (err) {
                    const is429 = (err as Error).message && (err as Error).message.startsWith("429");
                    if (is429) {
                        console.warn(`Proxy rate limit (429) hit for ${repoInfo.name}. Sleeping 5s...`);
                        await pendingSebentar(5000);
                    } else {
                        console.warn(`Proxy download failed for ${repoInfo.name} (${(err as Error).message}). Trying direct download...`);
                    }
                }

                if (!downloaded) {
                    let retries = 3;
                    let delay = 5000;
                    while (retries > 0 && !downloaded) {
                        try {
                            console.log(`Downloading fresh Open Graph image directly for ${res.data.full_name}...`);
                            const buffer = await ghFetchBuffer(targetUrl, {
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                                    "Accept": "image/webp,image/apng,image/png,image/*,*/*;q=0.8"
                                }
                            });

                            imageBuffer = Buffer.from(buffer);
                            downloaded = true;
                            console.log(`Successfully downloaded fresh image directly for ${repoInfo.name}`);
                        } catch (err) {
                            const is429 = (err as Error).message && (err as Error).message.startsWith("429");
                            retries--;
                            if (is429 && retries > 0) {
                                console.warn(`Got 429 for ${repoInfo.name}. Retrying direct in ${delay / 1000}s... (${retries} retries left)`);
                                await pendingSebentar(delay);
                                delay += 5000;
                            } else {
                                console.warn(`Failed to download fresh image directly for ${repoInfo.name} (${(err as Error).message}).`);
                                break;
                            }
                        }
                    }
                }
            } else {
                console.log(`Repository ${repoInfo.name} is private. Skipping download to preserve local assets.`);
            }

            if (!downloaded && fs.existsSync(oldAssetPath)) {
                try {
                    imageBuffer = fs.readFileSync(oldAssetPath);
                    console.log(`Loaded fallback local image from assets/sas for ${repoInfo.name}`);
                } catch (err) {
                    console.error(`Failed to read fallback local image for ${repoInfo.name}:`, (err as Error).message);
                }
            }

            if (!imageBuffer) {
                try {
                    console.log(`Generating a beautiful custom SVG preview card for private repo ${repoInfo.name}...`);
                    const svgString = generatePrivateCardSvg(res.data.name, res.data.description, res.data.language, repoInfo.user, languages);
                    const poppinsBuf = poppinsBase64 ? Buffer.from(poppinsBase64, "base64") : null;
                    console.log(`[Render] poppinsBase64 length=${poppinsBase64.length} | buffer bytes=${poppinsBuf ? poppinsBuf.length : 0} | magic=${poppinsBuf ? poppinsBuf.slice(0, 4).toString("hex") : "n/a"} | target=${repoInfo.name}`);
                    const resvg = new Resvg(svgString, {
                        fitTo: { mode: "width", value: 600 },
                        font: {
                            fontFiles: poppinsBase64 ? [POPPINS_TTF_PATH.replace(/\.ttf$/, "_600.ttf"), POPPINS_TTF_PATH] : [],
                            fontDirs: ["./mock", "./assets/fonts"],
                            loadSystemFonts: false,
                            defaultFontFamily: "Poppins"
                        }
                    });
                    const pngData = resvg.render();
                    imageBuffer = pngData.asPng();
                    console.log(`Successfully rendered SVG card via resvg-js for ${repoInfo.name}`);
                } catch (err) {
                    console.error(`Failed to generate custom SVG for ${repoInfo.name}:`, (err as Error).message);
                }
            }

            if (imageBuffer) {
                try {
                    await sharp(imageBuffer)
                        .resize({ width: 600 })
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    console.log(`Saved optimized WebP to ${outputPath}`);
                } catch (err) {
                    console.error(`Failed to optimize image for ${repoInfo.name} using sharp:`, (err as Error).message);
                }
            }

            await pendingSebentar(2500);
        } catch (err) {
            console.error(`Error processing repository ${repoInfo.name}:`, (err as Error).message);
        }
    }
    return info;
};

const save = async () => {
    let useToken = false;
    if (GH_TOKEN) {
        try {
            console.log("Checking if GH_TOKEN is valid...");
            await ghFetch("https://api.github.com/user", {
                headers: { Authorization: `token ${GH_TOKEN}` }
            });
            useToken = true;
            console.log("GH_TOKEN is valid.");
        } catch (err) {
            console.warn("GH_TOKEN is invalid or expired. Running without token (might trigger rate limit). Error:", (err as Error).message);
        }
    }

    const headers = useToken ? { Authorization: `token ${GH_TOKEN}` } : {};
    let getLatestCommit = await ghFetch(
        "https://api.github.com/repos/sinkaroid/sinkaroid/commits/master",
        { headers }
    );

    let info = await getInfo(useToken);

    info.sort((a: any, b: any) => {
        const dateA = new Date(a.last_commit_date || 0).getTime();
        const dateB = new Date(b.last_commit_date || 0).getTime();
        return dateB - dateA;
    });

    let data = {
        last_sync: `${today}, ${time}`,
        data: info,
        sha_commit: getLatestCommit.sha,
    };
    fs.writeFileSync("ci/data_oss_sas.json", JSON.stringify(data, null, 4));
};

save()
    .then(() => {
        console.log("done");
    })
    .catch((err) => {
        console.error("Save process failed:", (err as Error).message);
    });
