import { DEFAULT_SETTINGS, THEME_OPTIONS } from "./constants.js";
import { normalizeLanguage, SUPPORTED_LANGUAGE_IDS } from "./language-registry.js";
import type {
	CanonicalLanguageId,
	RawSyntaxHighlighterSettings,
	SyntaxCollapseOverride,
	SyntaxDisplayOverride,
	SyntaxHighlighterSettings,
	SyntaxThemeId,
} from "./types.js";

function parseBoolean(value: unknown, fallback: boolean): boolean {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		if (value === "true") return true;
		if (value === "false") return false;
	}
	return fallback;
}

function parseNumber(value: unknown, fallback: number, min: number, max: number): number {
	const parsed =
		typeof value === "number"
			? value
			: typeof value === "string" && value.trim().length > 0
				? Number(value)
				: Number.NaN;

	if (!Number.isFinite(parsed)) return fallback;
	return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function parseTheme(value: unknown): SyntaxThemeId {
	if (typeof value !== "string") return DEFAULT_SETTINGS.theme;
	const match = THEME_OPTIONS.find((option) => option.value === value);
	return match?.value ?? DEFAULT_SETTINGS.theme;
}

function dedupeLanguages(values: CanonicalLanguageId[]): CanonicalLanguageId[] {
	return [...new Set(values)];
}

export function parseAllowedLanguages(value: unknown): CanonicalLanguageId[] {
	if (typeof value !== "string" || value.trim().length === 0) {
		return [...DEFAULT_SETTINGS.allowedLanguages];
	}

	const parsed = dedupeLanguages(
		value
			.split(/[\n,]+/g)
			.map((entry) => normalizeLanguage(entry))
			.filter((entry): entry is CanonicalLanguageId => entry !== null),
	);

	return parsed.length > 0 ? parsed : [...DEFAULT_SETTINGS.allowedLanguages];
}

export function normalizeSyntaxHighlighterSettings(
	raw: Partial<RawSyntaxHighlighterSettings> = {},
): SyntaxHighlighterSettings {
	return {
		theme: parseTheme(raw.theme),
		defaultLineNumbers: parseBoolean(raw.defaultLineNumbers, DEFAULT_SETTINGS.defaultLineNumbers),
		defaultCopyButton: parseBoolean(raw.defaultCopyButton, DEFAULT_SETTINGS.defaultCopyButton),
		allowedLanguages: parseAllowedLanguages(raw.allowedLanguages),
		collapseLongSnippets: parseBoolean(
			raw.collapseLongSnippets,
			DEFAULT_SETTINGS.collapseLongSnippets,
		),
		maxSnippetLength: parseNumber(
			raw.maxSnippetLength,
			DEFAULT_SETTINGS.maxSnippetLength,
			1,
			500,
		),
	};
}

export function resolveDisplayOverride(
	override: SyntaxDisplayOverride | undefined,
	defaultValue: boolean,
): boolean {
	if (override === "show") return true;
	if (override === "hide") return false;
	return defaultValue;
}

export function resolveCollapseOverride(
	override: SyntaxCollapseOverride | undefined,
	settings: SyntaxHighlighterSettings,
	lineCount: number,
): boolean {
	if (override === "collapsed") return true;
	if (override === "expanded") return false;
	return settings.collapseLongSnippets && lineCount > settings.maxSnippetLength;
}

export function isAllowedLanguage(
	language: CanonicalLanguageId,
	settings: SyntaxHighlighterSettings,
): boolean {
	return language === "text" || settings.allowedLanguages.includes(language);
}

export { DEFAULT_SETTINGS, SUPPORTED_LANGUAGE_IDS };
