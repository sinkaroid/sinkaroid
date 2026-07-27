import moment from "moment";
import fs from "fs";

const isAutoRefresh = true;

const STEAM_ID = "76561198812914519";
const STEAM_API_KEY = process.env.STEAM_API_KEY ?? "";
const STEAM_API_BASE = "https://api.steampowered.com";
const STEAM_STORE_API = "https://store.steampowered.com/api/appdetails";

const MAX_RETRIES = 3;

const pendingSebentar = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

interface RecentlyPlayed {
    appid: number;
    name: string;
    playtime_2weeks: number;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
    last_playtime: number;
}

interface OwnedGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
    img_icon_url: string;
    img_logo_url: string;
    rtime_last_played: number;
}

interface OwnedGamesResponse {
    response: {
        game_count: number;
        games: OwnedGame[];
    };
}

interface RecentlyPlayedResponse {
    response: {
        total_count: number;
        games: RecentlyPlayed[];
    };
}

interface AppDetails {
    [appid: string]: {
        success: boolean;
        data?: {
            name: string;
            about_the_game: string;
            header_image: string;
            capsule_image: string;
            short_description: string;
            genres: { id: string; description: string }[];
            categories: { id: number; description: string }[];
        };
    };
}

const fetchOwnedGames = async (): Promise<OwnedGame[]> => {
    const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=1&include_played_free_games=1&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`GetOwnedGames status ${response.status}`);
    }
    const body = (await response.json()) as OwnedGamesResponse;
    return body.response.games ?? [];
};

const fetchRecentlyPlayed = async (): Promise<RecentlyPlayed[]> => {
    const url = `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`GetRecentlyPlayedGames status ${response.status}`);
    }
    const body = (await response.json()) as RecentlyPlayedResponse;
    return body.response.games ?? [];
};

const fetchAppDetails = async (
    appid: number
): Promise<AppDetails[string]["data"] | null> => {
    const url = `${STEAM_STORE_API}?appids=${appid}&l=english`;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const response = await fetch(url);
        if (response.status === 429) {
            const backoff = 5000 * (attempt + 1);
            console.warn(
                `[getGame] 429 on ${appid}, backoff ${backoff}ms`
            );
            await pendingSebentar(backoff);
            continue;
        }
        if (!response.ok) {
            throw new Error(`appdetails ${appid} status ${response.status}`);
        }
        const body = (await response.json()) as AppDetails;
        const entry = body[String(appid)];
        if (entry?.success && entry.data) {
            return entry.data;
        }
        return null;
    }
    return null;
};

const TAG_LIMIT = 20;
const fetchUserTags = async (appid: number): Promise<string[]> => {
    const url = `https://store.steampowered.com/app/${appid}?l=english`;
    try {
        const response = await fetch(url, {
            headers: {
                Cookie: "birthtime=0; wants_mature_content=1; lastagecheckage=1-0-1990"
            }
        });
        if (!response.ok) return [];
        const html = await response.text();
        // Steam embeds the user-tag list as JSON inside a <script> block.
        const match = html.match(
            /\[\s*\{\s*"tagid"\s*:\s*\d+\s*,\s*"name"\s*:\s*"[^"]+"[\s\S]*?\}\s*\]/
        );
        if (!match) return [];
        const parsed = JSON.parse(match[0]) as Array<{
            tagid: number;
            name: string;
        }>;
        return parsed.slice(0, TAG_LIMIT).map((t) => t.name);
    } catch (err) {
        console.warn(
            `[getGame] user-tags scrape failed for ${appid}: ${(err as Error).message}`
        );
        return [];
    }
};

const stripHtml = (html: string): string =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const convertTime = (unixSeconds: number): string => {
    if (!unixSeconds) {
        return "never";
    }
    const date = new Date(unixSeconds * 1000);
    return moment(date).fromNow();
};

interface GameItemInfo {
    appID: number;
    name: string;
    icon: string;
    logo: string;
    capsule: string;
    header: string;
    description: string;
    shortDescription: string;
    tags: string[];
    storeLink: string;
    playtime2weeks: number;
    playtimeForever: number;
    lastPlayed: number;
    timeago: string;
}

// Categories to skip (meta/utility, not gameplay-defining).
const SKIP_CATEGORIES = new Set([
    "Steam Cloud",
    "Steam Achievements",
    "Steam Trading Cards",
    "Steam Workshop",
    "Steam Leaderboards",
    "SteamVR Collectibles",
    "Steam Timeline",
    "Shared/Split Screen",
    "Cross-Platform Multiplayer",
    "In-App Purchases",
    "Partial Controller Support",
    "Family Sharing",
    "HDR available",
    "Includes Source SDK",
    "Commentary available",
    "Stats",
    "Captions available",
    "Valve Anti-Cheat enabled"
]);

if (!isAutoRefresh) {
    console.log("[getGame] isAutoRefresh=false, skipping Steam sync.");
} else if (!STEAM_API_KEY) {
    console.error("[getGame] STEAM_API_KEY missing. Set env before running.");
} else {
    (async () => {
        try {
            const [owned, recent] = await Promise.all([
                fetchOwnedGames(),
                fetchRecentlyPlayed(),
            ]);

            const played = owned.filter((game) => game.playtime_forever > 0);
            console.log(
                `[getGame] owned=${owned.length} played=${played.length} recent=${recent.length}`
            );

            const lastPlayedByApp = new Map<number, number>();
            const playtime2weeksByApp = new Map<number, number>();
            for (const game of recent) {
                lastPlayedByApp.set(game.appid, game.last_playtime);
                playtime2weeksByApp.set(game.appid, game.playtime_2weeks);
            }

            const CONCURRENCY = 5;
            const CHUNK_GAP_MS = 1000;
            const detailsByApp = new Map<
                number,
                AppDetails[string]["data"] | null
            >();
            const userTagsByApp = new Map<number, string[]>();

            for (let i = 0; i < played.length; i += CONCURRENCY) {
                const chunk = played.slice(i, i + CONCURRENCY);
                const [detailResults, tagResults] = await Promise.all([
                    Promise.allSettled(
                        chunk.map((game) => fetchAppDetails(game.appid))
                    ),
                    Promise.allSettled(
                        chunk.map((game) => fetchUserTags(game.appid))
                    )
                ]);
                chunk.forEach((game, idx) => {
                    const detailRes = detailResults[idx];
                    const tagRes = tagResults[idx];
                    if (detailRes.status === "fulfilled") {
                        detailsByApp.set(game.appid, detailRes.value);
                    } else {
                        detailsByApp.set(game.appid, null);
                    }
                    if (tagRes.status === "fulfilled") {
                        userTagsByApp.set(game.appid, tagRes.value);
                    } else {
                        userTagsByApp.set(game.appid, []);
                    }
                });
                console.log(
                    `[getGame] fetched ${Math.min(i + CONCURRENCY, played.length)}/${played.length}`
                );
                if (i + CONCURRENCY < played.length) {
                    await pendingSebentar(CHUNK_GAP_MS);
                }
            }

            const info: GameItemInfo[] = played.map((game) => {
                const details = detailsByApp.get(game.appid);
                const description = details
                    ? stripHtml(details.about_the_game)
                    : "";
                const shortDescription = details
                    ? details.short_description
                    : "";
                const capsule = details?.capsule_image ?? "";
                const header = details?.header_image ?? "";
                const userTags = userTagsByApp.get(game.appid) ?? [];
                const genreNames = (details?.genres ?? []).map(
                    (g) => g.description
                );
                // Prefer Steam user-tags (Souls-like, Difficult, etc).
                // Fallback to genres + filtered categories.
                const tags = userTags.length
                    ? userTags
                    : [
                        ...genreNames,
                        ...(details?.categories ?? [])
                            .map((c) => c.description)
                            .filter((c) => !SKIP_CATEGORIES.has(c))
                    ];

                const recentLast = lastPlayedByApp.get(game.appid) ?? 0;
                const lastPlayed =
                    recentLast || game.rtime_last_played || 0;
                const playtime2weeks =
                    playtime2weeksByApp.get(game.appid) ?? 0;
                const timeago = convertTime(lastPlayed);

                return {
                    appID: game.appid,
                    name: details?.name ?? game.name,
                    icon: game.img_icon_url,
                    logo: game.img_logo_url,
                    capsule,
                    header,
                    description,
                    shortDescription,
                    tags,
                    storeLink: `https://store.steampowered.com/app/${game.appid}`,
                    playtime2weeks,
                    playtimeForever: game.playtime_forever,
                    lastPlayed,
                    timeago,
                };
            });

            info.sort((a, b) => b.lastPlayed - a.lastPlayed);

            fs.writeFileSync(
                "ci/data_game.json",
                JSON.stringify({ data: info }, null, 4)
            );
        } catch (err) {
            console.error(`[getGame] failed: ${(err as Error).message}`);
        }
    })();
}
