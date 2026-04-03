export type SyntaxThemeId = "github-dark" | "github-light" | "min-dark" | "min-light";

export type CanonicalLanguageId =
	| "text"
	| "bash"
	| "javascript"
	| "typescript"
	| "jsx"
	| "tsx"
	| "json"
	| "yaml"
	| "html"
	| "css"
	| "markdown"
	| "astro"
	| "diff"
	| "python"
	| "go"
	| "rust"
	| "sql";

export type SyntaxDisplayOverride = "inherit" | "show" | "hide";
export type SyntaxCollapseOverride = "inherit" | "collapsed" | "expanded";

export interface RawSyntaxHighlighterSettings {
	theme?: unknown;
	defaultLineNumbers?: unknown;
	defaultCopyButton?: unknown;
	allowedLanguages?: unknown;
	collapseLongSnippets?: unknown;
	maxSnippetLength?: unknown;
}

export interface SyntaxHighlighterSettings {
	theme: SyntaxThemeId;
	defaultLineNumbers: boolean;
	defaultCopyButton: boolean;
	allowedLanguages: CanonicalLanguageId[];
	collapseLongSnippets: boolean;
	maxSnippetLength: number;
}

export interface SyntaxCodeBlock {
	_type: "syntaxCode";
	_key?: string;
	code: string;
	language?: string;
	title?: string;
	showLineNumbers?: SyntaxDisplayOverride;
	highlightLines?: string;
	copyButton?: SyntaxDisplayOverride;
	collapsed?: SyntaxCollapseOverride;
}

export interface RenderHtmlInput {
	code: string;
	language: CanonicalLanguageId;
	theme: SyntaxThemeId;
	highlightedLines: Set<number>;
}

export interface SyntaxRenderModel {
	block: SyntaxCodeBlock;
	code: string;
	html: string;
	lineCount: number;
	isLongSnippet: boolean;
	isCollapsed: boolean;
	showLineNumbers: boolean;
	showCopyButton: boolean;
	highlightedLines: Set<number>;
	resolvedLanguage: CanonicalLanguageId;
	displayLanguageLabel: string;
	requestedLanguage?: string;
	wasFallback: boolean;
	fallbackReason?: string;
}
