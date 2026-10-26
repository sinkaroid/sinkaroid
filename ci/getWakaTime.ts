import fs from "fs";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY ?? "";
const WAKATIME_API_BASE = "https://wakatime.com/api/v1";
const DAYS_SPAN = 60;
const MAX_RETRIES = 3;

const pendingSebentar = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const get60DaysRange = (): { start: string; end: string } => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - DAYS_SPAN);
    return {
        start: formatDate(past),
        end: formatDate(today)
    };
};

const formatSecondsToText = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours === 0 && minutes === 0) return "0 mins";
    if (hours === 0) return `${minutes} min${minutes === 1 ? "" : "s"}`;
    if (minutes === 0) return `${hours} hr${hours === 1 ? "" : "s"}`;
    return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`;
};

const formatSecondsToDigital = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}:${String(minutes).padStart(2, "0")}`;
};

const formatCompactNumber = (n: number): string => {
    if (n >= 1_000_000) {
        const val = n / 1_000_000;
        return `${Number(val.toFixed(1))}M`;
    }
    if (n >= 1_000) {
        const val = n / 1_000;
        return `${Number(val.toFixed(1))}K`;
    }
    return String(Math.round(n));
};

const formatCurrency = (usd: number): string => {
    return `$${usd.toFixed(2)}`;
};

interface WakaEntity {
    name: string;
    total_seconds: number;
    percent?: number;
    digital?: string;
    text?: string;
}

interface WakaProjectDay {
    name: string;
    total_seconds: number;
    ai_additions?: number;
    ai_deletions?: number;
    human_additions?: number;
    human_deletions?: number;
    ai_input_tokens?: number;
    ai_output_tokens?: number;
    ai_prompt_events_total?: number;
    ai_sessions?: number;
    ai_model_total_cost?: number;
    ai_model_line_changes?: Record<string, number>;
    ai_model_costs?: Record<string, number>;
    percent?: number;
    digital?: string;
    text?: string;
}

interface WakaDaySummary {
    grand_total: {
        digital: string;
        hours: number;
        minutes: number;
        seconds: number;
        text: string;
        total_seconds: number;
    };
    languages: WakaEntity[];
    editors: WakaEntity[];
    operating_systems: WakaEntity[];
    projects: WakaProjectDay[];
    range: {
        date: string;
        start: string;
        end: string;
        text: string;
    };
}

interface WakaSummariesResponse {
    data: WakaDaySummary[];
    start: string;
    end: string;
    cumulative_total?: {
        seconds: number;
        text: string;
        digital: string;
    };
    daily_average?: {
        seconds: number;
        text: string;
    };
}

interface ProcessedEntity {
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
}

interface ProcessedProject {
    name: string;
    total_seconds: number;
    percent: number;
    digital: string;
    text: string;
    primary_language: string;
    languages: ProcessedEntity[];
    ai_percent: number;
    human_percent: number;
    total_line_changes: number;
    ai_line_changes: number;
    human_line_changes: number;
    line_changes_text: string;
    ai_changes_text: string;
    human_changes_text: string;
    ai_prompts: number;
    ai_sessions: number;
    total_tokens: number;
    tokens_text: string;
    ai_spend: number;
    ai_spend_text: string;
    ai_models: string[];
}

interface DailyActivityItem {
    date: string;
    total_seconds: number;
    text: string;
    languages?: ProcessedEntity[];
}

interface ProcessedWakaTimeData {
    range: {
        start: string;
        end: string;
        days: number;
    };
    cumulative_total: {
        seconds: number;
        text: string;
        digital: string;
    };
    daily_average: {
        seconds: number;
        text: string;
    };
    ai_overview: {
        total_spend: number;
        total_spend_text: string;
        total_tokens: number;
        total_tokens_text: string;
        total_prompts: number;
        total_sessions: number;
        total_line_changes: number;
        ai_line_changes: number;
        human_line_changes: number;
        ai_percent: number;
        human_percent: number;
    };
    projects: ProcessedProject[];
    languages: ProcessedEntity[];
    editors: ProcessedEntity[];
    operating_systems: ProcessedEntity[];
    daily_summaries: DailyActivityItem[];
}

const aggregateEntities = (
    days: WakaDaySummary[],
    key: "languages" | "editors" | "operating_systems",
    totalSecondsOverall: number
): ProcessedEntity[] => {
    const map = new Map<string, number>();

    for (const day of days) {
        const items = day[key] ?? [];
        for (const item of items) {
            const current = map.get(item.name) ?? 0;
            map.set(item.name, current + (item.total_seconds || 0));
        }
    }

    const result: ProcessedEntity[] = [];
    for (const [name, seconds] of map.entries()) {
        const percent =
            totalSecondsOverall > 0
                ? Number(((seconds / totalSecondsOverall) * 100).toFixed(2))
                : 0;
        result.push({
            name,
            total_seconds: Math.round(seconds),
            percent,
            digital: formatSecondsToDigital(seconds),
            text: formatSecondsToText(seconds)
        });
    }

    result.sort((a, b) => b.total_seconds - a.total_seconds);
    return result;
};

interface ProjectAcc {
    seconds: number;
    ai_lines: number;
    human_lines: number;
    tokens: number;
    prompts: number;
    sessions: number;
    cost: number;
    models: Set<string>;
}

const aggregateProjects = (
    days: WakaDaySummary[],
    totalSecondsOverall: number
): {
    projects: ProcessedProject[];
    ai_overview: ProcessedWakaTimeData["ai_overview"];
} => {
    const map = new Map<string, ProjectAcc>();

    let overallAiLines = 0;
    let overallHumanLines = 0;
    let overallTokens = 0;
    let overallPrompts = 0;
    let overallSessions = 0;
    let overallCost = 0;

    for (const day of days) {
        const projects = day.projects ?? [];
        for (const p of projects) {
            let acc = map.get(p.name);
            if (!acc) {
                acc = {
                    seconds: 0,
                    ai_lines: 0,
                    human_lines: 0,
                    tokens: 0,
                    prompts: 0,
                    sessions: 0,
                    cost: 0,
                    models: new Set<string>()
                };
                map.set(p.name, acc);
            }

            const dayAiLines = (p.ai_additions || 0) + (p.ai_deletions || 0);
            const dayHumanLines = (p.human_additions || 0) + (p.human_deletions || 0);
            const dayTokens = (p.ai_input_tokens || 0) + (p.ai_output_tokens || 0);
            const dayPrompts = p.ai_prompt_events_total || 0;
            const daySessions = p.ai_sessions || 0;
            const dayCost = p.ai_model_total_cost || 0;

            acc.seconds += p.total_seconds || 0;
            acc.ai_lines += dayAiLines;
            acc.human_lines += dayHumanLines;
            acc.tokens += dayTokens;
            acc.prompts += dayPrompts;
            acc.sessions += daySessions;
            acc.cost += dayCost;

            overallAiLines += dayAiLines;
            overallHumanLines += dayHumanLines;
            overallTokens += dayTokens;
            overallPrompts += dayPrompts;
            overallSessions += daySessions;
            overallCost += dayCost;

            if (p.ai_model_line_changes) {
                for (const m of Object.keys(p.ai_model_line_changes)) {
                    acc.models.add(m);
                }
            }
        }
    }

    const projects: ProcessedProject[] = [];
    for (const [name, acc] of map.entries()) {
        const totalLines = acc.ai_lines + acc.human_lines;
        const aiPercent = totalLines > 0 ? Math.round((acc.ai_lines / totalLines) * 100) : 0;
        const humanPercent = totalLines > 0 ? 100 - aiPercent : 0;
        const timePercent =
            totalSecondsOverall > 0
                ? Number(((acc.seconds / totalSecondsOverall) * 100).toFixed(2))
                : 0;

        projects.push({
            name,
            total_seconds: Math.round(acc.seconds),
            percent: timePercent,
            digital: formatSecondsToDigital(acc.seconds),
            text: formatSecondsToText(acc.seconds),
            primary_language: "Other",
            languages: [],
            ai_percent: aiPercent,
            human_percent: humanPercent,
            total_line_changes: totalLines,
            ai_line_changes: acc.ai_lines,
            human_line_changes: acc.human_lines,
            line_changes_text: `${formatCompactNumber(acc.ai_lines)} of ${formatCompactNumber(totalLines)} line changes`,
            ai_changes_text: `${formatCompactNumber(acc.ai_lines)} (${aiPercent}%)`,
            human_changes_text: `${formatCompactNumber(acc.human_lines)} (${humanPercent}%)`,
            ai_prompts: acc.prompts,
            ai_sessions: acc.sessions,
            total_tokens: acc.tokens,
            tokens_text: formatCompactNumber(acc.tokens),
            ai_spend: Number(acc.cost.toFixed(2)),
            ai_spend_text: formatCurrency(acc.cost),
            ai_models: Array.from(acc.models)
        });
    }

    projects.sort((a, b) => b.total_seconds - a.total_seconds);

    const overallTotalLines = overallAiLines + overallHumanLines;
    const overallAiPercent =
        overallTotalLines > 0 ? Number(((overallAiLines / overallTotalLines) * 100).toFixed(2)) : 0;
    const overallHumanPercent =
        overallTotalLines > 0 ? Number((100 - overallAiPercent).toFixed(2)) : 0;

    const aiOverview = {
        total_spend: Number(overallCost.toFixed(2)),
        total_spend_text: formatCurrency(overallCost),
        total_tokens: overallTokens,
        total_tokens_text: formatCompactNumber(overallTokens),
        total_prompts: overallPrompts,
        total_sessions: overallSessions,
        total_line_changes: overallTotalLines,
        ai_line_changes: overallAiLines,
        human_line_changes: overallHumanLines,
        ai_percent: overallAiPercent,
        human_percent: overallHumanPercent
    };

    return { projects, ai_overview: aiOverview };
};

const fetchWakaTimeSummaries = async (
    start: string,
    end: string
): Promise<WakaSummariesResponse> => {
    const url = `${WAKATIME_API_BASE}/users/current/summaries?start=${start}&end=${end}`;
    const authHeader = `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const response = await fetch(url, {
            headers: {
                Authorization: authHeader,
                "User-Agent": "sinkaroid-portfolio"
            }
        });

        if (response.status === 429) {
            const backoff = 5000 * (attempt + 1);
            console.warn(`[getWakaTime] 429 rate limit, backoff ${backoff}ms`);
            await pendingSebentar(backoff);
            continue;
        }

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`WakaTime API HTTP ${response.status}: ${errText}`);
        }

        const data = (await response.json()) as WakaSummariesResponse;
        return data;
    }

    throw new Error("[getWakaTime] Max retries reached");
};

const fetchProjectLanguages = async (
    projectName: string,
    start: string,
    end: string
): Promise<ProcessedEntity[]> => {
    if (!projectName || projectName === "Unknown Project") {
        return [];
    }

    const url = `${WAKATIME_API_BASE}/users/current/summaries?project=${encodeURIComponent(projectName)}&start=${start}&end=${end}`;
    const authHeader = `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: authHeader,
                    "User-Agent": "sinkaroid-portfolio"
                }
            });

            if (response.status === 429) {
                const backoff = 5000 * (attempt + 1);
                console.warn(`[getWakaTime] 429 rate limit for project ${projectName}, backoff ${backoff}ms`);
                await pendingSebentar(backoff);
                continue;
            }

            if (!response.ok) {
                console.warn(`[getWakaTime] Failed to fetch languages for ${projectName}: HTTP ${response.status}`);
                return [];
            }

            const data = (await response.json()) as WakaSummariesResponse;
            const days = data.data ?? [];
            const projectTotalSeconds = days.reduce(
                (sum, d) => sum + (d.grand_total?.total_seconds || 0),
                0
            );

            return aggregateEntities(days, "languages", projectTotalSeconds);
        } catch (err) {
            console.warn(`[getWakaTime] Error fetching languages for ${projectName}: ${(err as Error).message}`);
        }
    }

    return [];
};

if (!WAKATIME_API_KEY) {
    console.error("[getWakaTime] WAKATIME_API_KEY missing. Set env before running.");
} else {
    (async () => {
        try {
            const range = get60DaysRange();
            console.log(`[getWakaTime] Fetching summaries from ${range.start} to ${range.end}...`);

            const raw = await fetchWakaTimeSummaries(range.start, range.end);
            const days = raw.data ?? [];

            // Calculate overall cumulative seconds
            const totalSecondsFromDays = days.reduce(
                (sum, day) => sum + (day.grand_total?.total_seconds || 0),
                0
            );

            const cumulativeSeconds =
                raw.cumulative_total?.seconds ?? Math.round(totalSecondsFromDays);
            const cumulativeText =
                raw.cumulative_total?.text ?? formatSecondsToText(cumulativeSeconds);
            const cumulativeDigital =
                raw.cumulative_total?.digital ?? formatSecondsToDigital(cumulativeSeconds);

            const dailyAverageSeconds =
                raw.daily_average?.seconds ??
                Math.round(cumulativeSeconds / (days.length || DAYS_SPAN));
            const dailyAverageText =
                raw.daily_average?.text ?? formatSecondsToText(dailyAverageSeconds);

            const { projects, ai_overview: aiOverview } = aggregateProjects(
                days,
                cumulativeSeconds
            );

            console.log(`[getWakaTime] Fetching language breakdowns for ${projects.length} projects...`);
            const CHUNK_SIZE = 5;
            for (let i = 0; i < projects.length; i += CHUNK_SIZE) {
                const chunk = projects.slice(i, i + CHUNK_SIZE);
                await Promise.all(
                    chunk.map(async (project) => {
                        if (project.total_seconds >= 30 && project.name !== "Unknown Project") {
                            const projectLangs = await fetchProjectLanguages(
                                project.name,
                                range.start,
                                range.end
                            );
                            project.languages = projectLangs;
                            project.primary_language = projectLangs[0]?.name || "Other";
                        }
                    })
                );
                if (i + CHUNK_SIZE < projects.length) {
                    await pendingSebentar(600);
                }
            }
            const languages = aggregateEntities(days, "languages", cumulativeSeconds);
            const editors = aggregateEntities(days, "editors", cumulativeSeconds);
            const operatingSystems = aggregateEntities(
                days,
                "operating_systems",
                cumulativeSeconds
            );

            const dailySummaries: DailyActivityItem[] = days.map((day) => {
                const dayTotal = day.grand_total?.total_seconds || 0;
                const dayLangs: ProcessedEntity[] = (day.languages || []).map((l) => ({
                    name: l.name,
                    total_seconds: Math.round(l.total_seconds),
                    percent: dayTotal > 0 ? Number(((l.total_seconds / dayTotal) * 100).toFixed(2)) : 0,
                    digital: formatSecondsToDigital(l.total_seconds),
                    text: formatSecondsToText(l.total_seconds)
                }));
                return {
                    date: day.range.date,
                    total_seconds: Math.round(dayTotal),
                    text: day.grand_total?.text || formatSecondsToText(dayTotal),
                    languages: dayLangs
                };
            });

            const processed: ProcessedWakaTimeData = {
                range: {
                    start: range.start,
                    end: range.end,
                    days: DAYS_SPAN
                },
                cumulative_total: {
                    seconds: cumulativeSeconds,
                    text: cumulativeText,
                    digital: cumulativeDigital
                },
                daily_average: {
                    seconds: dailyAverageSeconds,
                    text: dailyAverageText
                },
                ai_overview: aiOverview,
                projects,
                languages,
                editors,
                operating_systems: operatingSystems,
                daily_summaries: dailySummaries
            };

            const outPath = "ci/data_wakatime.json";
            fs.writeFileSync(outPath, JSON.stringify(processed, null, 4));
            console.log(
                `[getWakaTime] Successfully synced ${days.length} days of activity to ${outPath}`
            );
            console.log(`[getWakaTime] Total: ${cumulativeText} | Daily Avg: ${dailyAverageText}`);
            console.log(
                `[getWakaTime] AI Overview: Spend ${aiOverview.total_spend_text} | Tokens ${aiOverview.total_tokens_text} | Prompts ${aiOverview.total_prompts} | AI Lines ${formatCompactNumber(aiOverview.ai_line_changes)} (${aiOverview.ai_percent}%)`
            );
            console.log(
                `[getWakaTime] Top Projects: ${projects.slice(0, 5).map((p) => `${p.name} [${p.primary_language}] (${p.text}, AI: ${p.ai_percent}%)`).join(", ")}`
            );
            console.log(
                `[getWakaTime] Top Languages: ${languages.slice(0, 5).map((l) => `${l.name} (${l.percent}%)`).join(", ")}`
            );
        } catch (err) {
            console.error(`[getWakaTime] Failed: ${(err as Error).message}`);
        }
    })();
}
