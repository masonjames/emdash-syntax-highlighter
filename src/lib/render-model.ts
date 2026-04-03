import { parseSyntaxCodeBlock } from "./block-schema.js";
import { parseHighlightLines } from "./highlight-lines.js";
import { renderHighlightedHtml } from "./highlighter.js";
import { getLanguageLabel, normalizeLanguage } from "./language-registry.js";
import { isAllowedLanguage, resolveCollapseOverride, resolveDisplayOverride } from "./settings.js";
import type {
	CanonicalLanguageId,
	RenderHtmlInput,
	SyntaxCodeBlock,
	SyntaxHighlighterSettings,
	SyntaxRenderModel,
} from "./types.js";

function countLines(code: string): number {
	return code.split("\n").length;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function renderPlainFallbackHtml(code: string, highlightedLines: Set<number>): string {
	const lines = code.split("\n");
	return [
		'<pre class="shiki emdash-syntax__pre"><code class="emdash-syntax__code">',
		...lines.flatMap((line, index) => {
			const lineNumber = index + 1;
			const classes = ["line", "emdash-syntax__line"];
			if (highlightedLines.has(lineNumber)) {
				classes.push("emdash-syntax__line--highlighted");
			}
			return [
				`<span class="${classes.join(" ")}" data-line-number="${lineNumber}">${escapeHtml(line)}</span>`,
				index < lines.length - 1 ? "\n" : "",
			];
		}),
		"</code></pre>",
	].join("");
}

export interface BuildSyntaxRenderModelOptions {
	renderHtml?: (input: RenderHtmlInput) => Promise<string>;
}

export async function buildSyntaxRenderModel(
	blockInput: unknown,
	settings: SyntaxHighlighterSettings,
	options: BuildSyntaxRenderModelOptions = {},
): Promise<SyntaxRenderModel | null> {
	const block = parseSyntaxCodeBlock(blockInput);
	if (!block) return null;

	const lineCount = countLines(block.code);
	const highlightedLines = parseHighlightLines(block.highlightLines, lineCount);
	const normalizedRequestedLanguage = normalizeLanguage(block.language);

	let resolvedLanguage: CanonicalLanguageId = "text";
	let wasFallback = false;
	let fallbackReason: string | undefined;

	if (!block.language) {
		resolvedLanguage = "text";
	} else if (!normalizedRequestedLanguage) {
		wasFallback = true;
		fallbackReason = "Unsupported language; rendered as plain text.";
	} else if (!isAllowedLanguage(normalizedRequestedLanguage, settings)) {
		wasFallback = true;
		fallbackReason = "Language is not currently allowed by the site settings.";
	} else {
		resolvedLanguage = normalizedRequestedLanguage;
	}

	const showLineNumbers = resolveDisplayOverride(
		block.showLineNumbers,
		settings.defaultLineNumbers,
	);
	const showCopyButton =
		block.code.length > 0 &&
		resolveDisplayOverride(block.copyButton, settings.defaultCopyButton);
	const isCollapsed = resolveCollapseOverride(block.collapsed, settings, lineCount);
	const isLongSnippet = lineCount > settings.maxSnippetLength;

	const renderHtml = options.renderHtml ?? renderHighlightedHtml;

	let html: string;
	try {
		html = await renderHtml({
			code: block.code,
			language: resolvedLanguage,
			theme: settings.theme,
			highlightedLines,
		});
	} catch {
		wasFallback = true;
		resolvedLanguage = "text";
		fallbackReason = "Syntax highlighting failed; rendered as plain text.";
		html = renderPlainFallbackHtml(block.code, highlightedLines);
	}

	return {
		block,
		code: block.code,
		html,
		lineCount,
		isLongSnippet,
		isCollapsed,
		showLineNumbers,
		showCopyButton,
		highlightedLines,
		resolvedLanguage,
		displayLanguageLabel: getLanguageLabel(resolvedLanguage),
		requestedLanguage: block.language,
		wasFallback,
		fallbackReason,
	};
}

export type { SyntaxCodeBlock };
