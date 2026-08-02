export function timeAgo(unix: number | string | null | undefined): string {
    if (!unix) return "";
    const seconds = Math.floor((Date.now() - Number(unix) * 1000) / 1000);
    if (seconds < 60) return "just now";
    const units: [number, string][] = [
        [31536000, "year"],
        [2592000, "month"],
        [604800, "week"],
        [86400, "day"],
        [3600, "hour"],
        [60, "minute"]
    ];
    for (const [secs, label] of units) {
        const value = Math.floor(seconds / secs);
        if (value >= 1) {
            return `${value} ${label}${value > 1 ? "s" : ""} ago`;
        }
    }
    return "just now";
}
