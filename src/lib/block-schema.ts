import type {
	SyntaxCodeBlock,
	SyntaxCollapseOverride,
	SyntaxDisplayOverride,
} from "./types.js";

function normalizeText(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const normalized = value.replace(/\r\n/g, "\n").trim();
	return normalized.length > 0 ? normalized : undefined;
}

function normalizeCode(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	return value.replace(/\r\n/g, "\n");
}

function normalizeDisplayOverride(value: unknown): SyntaxDisplayOverride | undefined {
	if (value === true) return "show";
	if (value === false) return "hide";
	if (typeof value !== "string") return undefined;
	if (value === "inherit" || value === "show" || value === "hide") return value;
	return undefined;
}

function normalizeCollapseOverride(value: unknown): SyntaxCollapseOverride | undefined {
	if (value === true) return "collapsed";
	if (value === false) return "expanded";
	if (typeof value !== "string") return undefined;
	if (value === "inherit" || value === "collapsed" || value === "expanded") return value;
	return undefined;
}

export function parseSyntaxCodeBlock(input: unknown): SyntaxCodeBlock | null {
	if (!input || typeof input !== "object") return null;

	const block = input as Record<string, unknown>;

	if (block._type !== "syntaxCode") return null;

	const code = normalizeCode(block.code);
	if (typeof code !== "string") return null;

	return {
		_type: "syntaxCode",
		_key: typeof block._key === "string" ? block._key : undefined,
		code,
		language: normalizeText(block.language),
		title: normalizeText(block.title),
		showLineNumbers: normalizeDisplayOverride(block.showLineNumbers),
		highlightLines: normalizeText(block.highlightLines),
		copyButton: normalizeDisplayOverride(block.copyButton),
		collapsed: normalizeCollapseOverride(block.collapsed),
	};
}
