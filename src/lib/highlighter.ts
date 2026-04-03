import { createHighlighter } from "shiki";

import { SUPPORTED_LANGUAGE_IDS } from "./language-registry.js";
import type { RenderHtmlInput, SyntaxThemeId } from "./types.js";

type ShikiHighlighter = Awaited<ReturnType<typeof createHighlighter>>;

const HIGHLIGHTER_CACHE = new Map<SyntaxThemeId, Promise<ShikiHighlighter>>();

async function getHighlighter(theme: SyntaxThemeId): Promise<ShikiHighlighter> {
	const existing = HIGHLIGHTER_CACHE.get(theme);
	if (existing) return existing;

	const pending = createHighlighter({
		themes: [theme],
		langs: [...SUPPORTED_LANGUAGE_IDS],
	});

	HIGHLIGHTER_CACHE.set(theme, pending);

	try {
		return await pending;
	} catch (error) {
		HIGHLIGHTER_CACHE.delete(theme);
		throw error;
	}
}

function enhanceHighlightedHtml(html: string, highlightedLines: Set<number>): string {
	let lineNumber = 0;

	const withClasses = html
		.replace(
			/<pre class="shiki([^"]*)"/,
			(_match, suffix: string) => `<pre class="shiki${suffix} emdash-syntax__pre"`,
		)
		.replace("<code>", '<code class="emdash-syntax__code">');

	return withClasses.replace(/<span class="line">/g, () => {
		lineNumber += 1;
		const classes = ["line", "emdash-syntax__line"];
		if (highlightedLines.has(lineNumber)) {
			classes.push("emdash-syntax__line--highlighted");
		}
		return `<span class="${classes.join(" ")}" data-line-number="${lineNumber}">`;
	});
}

export async function renderHighlightedHtml({
	code,
	language,
	theme,
	highlightedLines,
}: RenderHtmlInput): Promise<string> {
	const highlighter = await getHighlighter(theme);
	const html = highlighter.codeToHtml(code, {
		lang: language,
		theme,
	});

	return enhanceHighlightedHtml(html, highlightedLines);
}
