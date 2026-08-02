export function parseMarkdown(markdown: string | null | undefined): string {
    if (!markdown) {
        return "";
    }

    // Escape HTML tags to prevent XSS (allowing only safe rendering)
    let text = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 1. Extract Code Blocks (fenced with ```)
    const codeBlocks: string[] = [];
    text = text.replace(/```([\s\S]*?)```/g, (_, codeContent) => {
        const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
        const cleanCode = codeContent.replace(/^\r?\n|\r?\n$/g, "");
        codeBlocks.push(`<pre><code>${cleanCode}</code></pre>`);
        return `\n\n${placeholder}\n\n`;
    });

    // 2. Split into blocks using double newlines
    const rawBlocks = text.split(/\n{2,}/);
    const processedBlocks: string[] = [];

    for (let block of rawBlocks) {
        block = block.trim();
        if (!block) {
            continue;
        }

        // Check for Code Block Placeholder
        const placeholderMatch = block.match(/^__CODE_BLOCK_PLACEHOLDER_(\d+)__$/);
        if (placeholderMatch) {
            const idx = parseInt(placeholderMatch[1], 10);
            processedBlocks.push(codeBlocks[idx]);
            continue;
        }

        // Check for Horizontal Rule
        if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(block)) {
            processedBlocks.push("<hr>");
            continue;
        }

        // Check for Headers
        if (/^#+\s+/.test(block)) {
            block = block.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
            block = block.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
            block = block.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
            block = block.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
            processedBlocks.push(block);
            continue;
        }

        // Check for Lists (unordered or ordered)
        const lines = block.split(/\r?\n/);
        const firstLine = lines[0];
        const hasUlMarker = /^\s*[-*+]\s+/.test(firstLine);
        const hasOlMarker = /^\s*\d+\.\s+/.test(firstLine);

        if (hasUlMarker || hasOlMarker) {
            const listType = hasUlMarker ? "ul" : "ol";
            let listHtml = `<${listType}>\n`;
            let currentItem = "";

            for (const line of lines) {
                const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
                const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);

                if (ulMatch && listType === "ul") {
                    if (currentItem) {
                        listHtml += `  <li>${parseInlineMarkdown(currentItem)}</li>\n`;
                    }
                    currentItem = ulMatch[1];
                } else if (olMatch && listType === "ol") {
                    if (currentItem) {
                        listHtml += `  <li>${parseInlineMarkdown(currentItem)}</li>\n`;
                    }
                    currentItem = olMatch[1];
                } else {
                    const trimmedLine = line.trim();
                    if (trimmedLine) {
                        if (currentItem) {
                            currentItem += " " + trimmedLine;
                        } else {
                            currentItem = trimmedLine;
                        }
                    }
                }
            }
            if (currentItem) {
                listHtml += `  <li>${parseInlineMarkdown(currentItem)}</li>\n`;
            }
            listHtml += `</${listType}>`;
            processedBlocks.push(listHtml);
            continue;
        }

        // Default: Paragraph with inline parsing
        const parsedParagraph = parseInlineMarkdown(block);
        processedBlocks.push(`<p>${parsedParagraph.replace(/\r?\n/g, "<br>")}</p>`);
    }

    return processedBlocks.join("\n");
}

function parseInlineMarkdown(text: string): string {
    // Inline code: `code`
    let html = text.replace(/`(.*?)`/g, "<code>$1</code>");

    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text* or _text_
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.*?)_/g, "<em>$1</em>");

    // Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"markdown-link\">$1</a>");

    return html;
}

export function stripMarkdown(markdown: string | null | undefined): string {
    if (!markdown) {
        return "";
    }
    // Remove code blocks
    let text = markdown.replace(/```[\s\S]*?```/g, "");
    // Remove headers
    text = text.replace(/^#+\s+/gm, "");
    // Remove inline code
    text = text.replace(/`(.*?)`/g, "$1");
    // Remove bold/italic
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");
    text = text.replace(/\*(.*?)\*/g, "$1");
    text = text.replace(/_(.*?)_/g, "$1");
    // Remove links but keep text
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, "$1");
    // Remove lists markers
    text = text.replace(/^[-*+]\s+/gm, "");
    text = text.replace(/^\d+\.\s+/gm, "");
    return text.trim();
}
