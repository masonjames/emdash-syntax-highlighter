import type {
	CanonicalLanguageId,
	SyntaxCollapseOverride,
	SyntaxDisplayOverride,
	SyntaxHighlighterSettings,
	SyntaxThemeId,
} from "./types.js";

export const PLUGIN_ID = "syntax-highlighter";
export const PACKAGE_NAME = "@emdash-cms/plugin-syntax-highlighter";
export const PACKAGE_VERSION = "0.1.0";

export const DEFAULT_THEME: SyntaxThemeId = "github-dark";

export const DEFAULT_SETTINGS: SyntaxHighlighterSettings = {
	theme: DEFAULT_THEME,
	defaultLineNumbers: true,
	defaultCopyButton: true,
	allowedLanguages: [
		"text",
		"bash",
		"javascript",
		"typescript",
		"jsx",
		"tsx",
		"json",
		"yaml",
		"html",
		"css",
		"markdown",
		"astro",
		"diff",
		"python",
		"go",
		"rust",
		"sql",
	] satisfies CanonicalLanguageId[],
	collapseLongSnippets: false,
	maxSnippetLength: 40,
};

export const THEME_OPTIONS: Array<{ label: string; value: SyntaxThemeId }> = [
	{ label: "GitHub Dark", value: "github-dark" },
	{ label: "GitHub Light", value: "github-light" },
	{ label: "Min Dark", value: "min-dark" },
	{ label: "Min Light", value: "min-light" },
];

export const DISPLAY_OVERRIDE_OPTIONS: Array<{ label: string; value: SyntaxDisplayOverride }> = [
	{ label: "Inherit site default", value: "inherit" },
	{ label: "Show", value: "show" },
	{ label: "Hide", value: "hide" },
];

export const COLLAPSE_OVERRIDE_OPTIONS: Array<{ label: string; value: SyntaxCollapseOverride }> = [
	{ label: "Inherit site default", value: "inherit" },
	{ label: "Collapsed", value: "collapsed" },
	{ label: "Expanded", value: "expanded" },
];
