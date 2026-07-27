import moment from "moment";
import fs from "fs";
import { XMLParser } from "fast-xml-parser";

const isAutoRefresh = false;

async function pendingSebentar(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

const convertTime = (tgl: string): string => {
    let dateUpdate = new Date(tgl);
    let timeago = moment(dateUpdate).fromNow();
    return timeago;
};

interface RssItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

const fetchRss = async (url: string): Promise<RssItem[]> => {
    let response = await fetch(url);
    let xml = await response.text();
    const parser = new XMLParser();
    let jObj = parser.parse(xml);
    console.log(jObj.rss.channel.item.length);

    return jObj.rss.channel.item;
};

interface JikanImages {
    jpg: {
        large_image_url: string;
    };
}

interface JikanGenre {
    name: string;
}

interface JikanDetails {
    images: JikanImages;
    genres: JikanGenre[];
    synopsis: string;
    score: number;
}

const jikan = async (id: number): Promise<JikanDetails | null> => {
    let url = `https://api.jikan.moe/v4/manga/${id}`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`jikan ${id} status ${response.status}`);
    }
    let body = await response.json();
    return body.data;
};

interface MangaItemInfo {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    timeago: string;
    id: string;
    image: string | null;
    tag: string[];
    synopsis: string | null;
    pictures: { img: string }[];
    score: number | null;
}

if (!isAutoRefresh) {
    console.log("[getManga] isAutoRefresh=false, skipping Jikan sync.");
} else {
    fetchRss("https://myanimelist.net/rss.php?type=rm&u=sinkaroid").then(
        async (res: RssItem[]) => {
            let info: MangaItemInfo[] = [];
            for (let i = 0; i < res.length; i++) {
                let item = res[i];
                let title = item.title;
                let link = item.link;
                let description = item.description;
                let pubDate = item.pubDate;
                let timeago = convertTime(pubDate);
                let id = link.split("/")[4];

                await pendingSebentar(2000);
                let image: string | null = null;
                let tag: string[] = [];
                let synopsis: string | null = null;
                let score: number | null = null;
                let pictures: { img: string }[] = [];

                try {
                    let details = await jikan(Number(id));
                    if (!details || !details.images || !details.images.jpg) {
                        throw new Error(`jikan ${id} missing images`);
                    }
                    console.log(`[${id}] image=${details.images.jpg.large_image_url}`);
                    console.log("Saved..", title);
                    image = details.images.jpg.large_image_url;
                    tag = details.genres.map((item) => item.name);
                    synopsis = details.synopsis;
                    score = details.score;
                    pictures = [{ img: details.images.jpg.large_image_url }];
                } catch (err) {
                    console.warn(`Skip ${id} (${(err as Error).message})`);
                    info.push({
                        title,
                        link,
                        description,
                        pubDate,
                        timeago,
                        id,
                        image: null,
                        tag: [],
                        synopsis: null,
                        pictures: [],
                        score: null,
                    });
                    continue;
                }

                let itemInfo: MangaItemInfo = {
                    title,
                    link,
                    description,
                    pubDate,
                    timeago,
                    id,
                    image,
                    tag,
                    synopsis,
                    pictures,
                    score,
                };

                info.push(itemInfo);
            }
            fs.writeFileSync(
                "ci/data_manga.json",
                JSON.stringify({ data_manga: info }, null, 4)
            );
        }
    );
}
