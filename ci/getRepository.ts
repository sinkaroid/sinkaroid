import fs from "fs";
import moment from "moment";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config();

const ghFetch = async (url: string, options: RequestInit = {}): Promise<unknown> => {
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
        "December",
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

interface RepoInfo {
    user: string;
    name: string;
    branch: string;
}

const project: { repo: RepoInfo[] } = {
    repo: [
        { user: "sinkaroid", name: "jandapress", branch: "master" },
        { user: "sinkaroid", name: "lustpress", branch: "master" },
        { user: "sinkaroid", name: "pixivhono", branch: "master" },
        { user: "sinkaroid", name: "matoi", branch: "master" },
        { user: "scathachgrip", name: "teivax", branch: "master" },
        { user: "scathachgrip", name: "shiftypad-extension", branch: "master" },
        { user: "scathachgrip", name: "nikkePwned", branch: "master" },
        { user: "scathachgrip", name: "davinci", branch: "master" },
        { user: "scathachgrip", name: "jikan4snek", branch: "master" },
        { user: "sinkaroid", name: "sinkaroid", branch: "master" },
        { user: "sinkaroid", name: "jalter", branch: "master" },
        { user: "sinkaroid", name: "eiyuu", branch: "master" },
        { user: "sinkaroid", name: "jigoku", branch: "master" },
        { user: "sinkaroid", name: "booru", branch: "master" },
        { user: "sinkaroid", name: "scathach-api", branch: "master" },
        { user: "sinkaroid", name: "tomoe", branch: "master" },
        { user: "sinkaroid", name: "Nhentai-Stealer", branch: "master" },
        { user: "sinkaroid", name: "janda", branch: "master" },
        { user: "sinkaroid", name: "scathach-api.py", branch: "main" },
        { user: "scathachgrip", name: "merahputih.moe", branch: "master" },
        { user: "scathachgrip", name: "gaebolg", branch: "master" },
        { user: "scathachgrip", name: "reddit-proxy", branch: "master" },
        { user: "pokemilf", name: "discord-canvas", branch: "master" },
        { user: "sinkaroid", name: "cabul", branch: "master" },
        { user: "sinkaroid", name: "disgrowth", branch: "master" },
        { user: "sinkaroid", name: "disgrow", branch: "master" },
        { user: "sinkaroid", name: "hensuki", branch: "master" },
        { user: "sinkaroid", name: "badut", branch: "master" },
        { user: "sinkaroid", name: "cabul", branch: "proxy" },
        { user: "sinkaroid", name: "disgrow", branch: "api" },
        { user: "sinkaroid", name: "simpleocr", branch: "master" },
        { user: "sinkaroid", name: "shiguresh", branch: "master" },
        { user: "sinkaroid", name: "umarun", branch: "master" },
        { user: "sinkaroid", name: "shielder", branch: "master" },
        { user: "sinkaroid", name: "pururin", branch: "master" },
        { user: "sinkaroid", name: "strygwyr", branch: "main" },
        { user: "sinkaroid", name: "behoifer", branch: "main" },
        { user: "sinkaroid", name: "illustrator-tracker", branch: "master" },
        { user: "sinkaroid", name: "dotabuff", branch: "master" },
        { user: "sinkaroid", name: "Simple-logbait", branch: "master" },
        { user: "sinkaroid", name: "Blackseroja", branch: "master" },
        { user: "sinkaroid", name: "HiddenFlower", branch: "master" },
        { user: "sinkaroid", name: "webNovelCrawler", branch: "master" },
        { user: "sinkaroid", name: "antk", branch: "master" },
        { user: "sinkaroid", name: "weevcrot", branch: "master" },
        { user: "sinkaroid", name: "Shell-Checker", branch: "master" },
        { user: "sinkaroid", name: "localroot", branch: "master" },
        { user: "sinkaroid", name: "ereg_replace-decoder", branch: "master" },
        { user: "slemanboys", name: "Magento-Grabber", branch: "master" },
        { user: "slemanboys", name: "Tevolution-Exploiter", branch: "master" },
        { user: "sinkaroid", name: "Blackjasmine", branch: "master" },
        { user: "sinkaroid", name: "Stupidc0de-Shell-2016", branch: "master" },
        { user: "slemanboys", name: "pasirmerah", branch: "sc0" }
    ],
};

interface GhRepoData {
    name: string;
    full_name: string;
    html_url: string;
    homepage: string;
    description: string;
    language: string;
    created_at: string;
    updated_at: string;
    topics: string[];
    stargazers_count: number;
}

interface GhCommitData {
    sha: string;
    commit: {
        committer: {
            date: string;
        };
    };
}

interface GhTagData {
    name: string;
}

interface GhApiResponse<T> {
    data: T;
}

const getInfo = async (useToken: boolean): Promise<unknown[]> => {
    let info: unknown[] = [];
    const outputDir = "./public/assets/oss";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const headers = useToken ? { Authorization: `token ${GH_TOKEN}` } : {};

    console.log("Fetching repository metadata in batches using Promise.all...");

    const results: unknown[] = [];
    const batchSize = 5;
    for (let i = 0; i < project.repo.length; i += batchSize) {
        const batch = project.repo.slice(i, i + batchSize);
        console.log(`Fetching metadata batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(project.repo.length / batchSize)}...`);
        const batchPromises = batch.map(async (repoInfo) => {
            try {
                const [res, resSha, tagsData, languagesData] = await Promise.all([
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}`, { headers }) as Promise<GhRepoData>,
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/commits/${repoInfo.branch}`, { headers }) as Promise<GhCommitData>,
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/tags`, { headers }) as Promise<GhTagData[]>,
                    ghFetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.name}/languages`, { headers }) as Promise<Record<string, number>>
                ]);
                return {
                    repoInfo,
                    res: { data: res } as GhApiResponse<GhRepoData>,
                    resSha: { data: resSha } as GhApiResponse<GhCommitData>,
                    tagsData: { data: tagsData } as GhApiResponse<GhTagData[]>,
                    languagesData: { data: languagesData } as GhApiResponse<Record<string, number>>
                };
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
        const { repoInfo, res, resSha, tagsData, languagesData } = item as { repoInfo: RepoInfo; res: GhApiResponse<GhRepoData>; resSha: GhApiResponse<GhCommitData>; tagsData: GhApiResponse<GhTagData[]>; languagesData: GhApiResponse<Record<string, number>> };

        try {
            let release: string;
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

            const localImgPath = `/assets/oss/${repoInfo.name}_${repoInfo.branch}.webp`;

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
                stargazers_count: res.data.stargazers_count,
                last_commit_date: resSha.data.commit.committer.date,
            });

            console.log(`Pushing ${repoInfo.name} #${repoInfo.branch} to portfolio data`);

            const oldAssetPath = `./assets/oss/${repoInfo.name}_${repoInfo.branch}.webp`;
            const outputPath = `${outputDir}/${repoInfo.name}_${repoInfo.branch}.webp`;

            let imageBuffer: Buffer | undefined;
            let downloaded = false;

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
                console.warn(`Proxy download failed for ${repoInfo.name} (${(err as Error).message}). Trying direct download...`);
            }

            if (!downloaded) {
                let retries = 2;
                let delay = 3000;
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
                            console.warn(`Got 429 for ${repoInfo.name}. Retrying direct in ${delay / 1000}s...`);
                            await pendingSebentar(delay);
                            delay *= 2;
                        } else {
                            console.warn(`Failed to download fresh image directly for ${repoInfo.name} (${(err as Error).message}).`);
                            break;
                        }
                    }
                }
            }

            if (!downloaded && fs.existsSync(oldAssetPath)) {
                try {
                    imageBuffer = fs.readFileSync(oldAssetPath);
                    console.log(`Loaded fallback local image from assets/oss for ${repoInfo.name}`);
                } catch (err) {
                    console.error(`Failed to read fallback local image for ${repoInfo.name}:`, (err as Error).message);
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
            } else {
                console.warn(`No image source available for ${repoInfo.name}, skipped image generation.`);
            }

            await pendingSebentar(1000);
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
    ) as GhCommitData;

    let info = await getInfo(useToken);

    info.sort((a: unknown, b: unknown) => {
        const dateA = new Date((a as { last_commit_date?: string }).last_commit_date || 0);
        const dateB = new Date((b as { last_commit_date?: string }).last_commit_date || 0);
        return dateB.getTime() - dateA.getTime();
    });

    let data = {
        last_sync: `${today}, ${time}`,
        data: info,
        sha_commit: getLatestCommit.sha,
    };
    fs.writeFileSync("ci/data_oss.json", JSON.stringify(data, null, 4));
};

save()
    .then(() => {
        console.log("done");
    })
    .catch((err) => {
        console.error("Save process failed:", (err as Error).message);
    });
