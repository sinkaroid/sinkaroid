import { marked } from "marked";

export function parseMarkdown(markdown: string | null | undefined): string {
    if (!markdown) {
        return "";
    }
    const renderer = new marked.Renderer();
    renderer.link = (arg1: any, arg2?: any, arg3?: any) => {
        let href = "";
        let title = "";
        let text = "";
        if (typeof arg1 === "object" && arg1 !== null) {
            href = arg1.href || "";
            title = arg1.title || "";
            text = arg1.text || "";
        } else {
            href = arg1 || "";
            title = arg2 || "";
            text = arg3 || "";
        }
        const titleAttr = title ? ` title="${title}"` : "";
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="markdown-link"${titleAttr}>${text}</a>`;
    };
    return marked.parse(markdown, { renderer }) as string;
}

export function stripMarkdown(markdown: string | null | undefined): string {
    if (!markdown) {
        return "";
    }
    const tokens = marked.lexer(markdown);
    let text = "";

    function extractText(tokenList: any[]): void {
        for (const token of tokenList) {
            if (token.type === "code" || token.type === "heading" || token.type === "table") {
                continue;
            }
            if (token.tokens) {
                extractText(token.tokens);
            } else if (token.items) {
                extractText(token.items);
            } else if (token.text) {
                text += token.text + " ";
            }
        }
    }

    extractText(tokens);
    return text.replace(/\s+/g, " ").trim();
}
