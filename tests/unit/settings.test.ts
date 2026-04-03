import { describe, expect, it } from "vitest";

import {
	DEFAULT_SETTINGS,
	normalizeSyntaxHighlighterSettings,
	parseAllowedLanguages,
} from "../../src/lib/settings.js";

describe("parseAllowedLanguages", () => {
	it("accepts aliases, commas, and newlines", () => {
		expect(parseAllowedLanguages("ts, js\nplain\nyml")).toEqual([
			"typescript",
			"javascript",
			"text",
			"yaml",
		]);
	});

	it("falls back to the full bundled list when parsing yields nothing", () => {
		expect(parseAllowedLanguages("totally-not-a-lang")).toEqual(DEFAULT_SETTINGS.allowedLanguages);
	});
});

describe("normalizeSyntaxHighlighterSettings", () => {
	it("returns defaults when values are missing", () => {
		expect(normalizeSyntaxHighlighterSettings()).toEqual(DEFAULT_SETTINGS);
	});

	it("normalizes raw settings and clamps maxSnippetLength", () => {
		expect(
			normalizeSyntaxHighlighterSettings({
				theme: "min-light",
				defaultLineNumbers: "false",
				defaultCopyButton: true,
				allowedLanguages: "ts,tsx",
				collapseLongSnippets: "true",
				maxSnippetLength: "900",
			}),
		).toEqual({
			theme: "min-light",
			defaultLineNumbers: false,
			defaultCopyButton: true,
			allowedLanguages: ["typescript", "tsx"],
			collapseLongSnippets: true,
			maxSnippetLength: 500,
		});
	});
});
