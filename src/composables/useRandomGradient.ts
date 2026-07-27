export function randomGradient(): string {
    const h1 = Math.floor(Math.random() * 360);
    const h2 = Math.floor(Math.random() * 360);
    const s = 80 + Math.floor(Math.random() * 20);
    const l = 45 + Math.floor(Math.random() * 15);
    return `linear-gradient(135deg, hsl(${h1}, ${s}%, ${l}%) 0%, hsl(${h2}, ${s}%, ${l}%) 100%)`;
}
