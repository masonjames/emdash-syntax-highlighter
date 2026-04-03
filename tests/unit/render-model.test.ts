import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "../../src/lib/settings.js";
import { buildSyntaxRenderModel } from "../../src/lib/render-model.js";

describe("buildSyntaxRenderModel", () => {
	it("resolves inherit/default behavior and collapse thresholds", async () => {
		const settings = {
			...DEFAULT_SETTINGS,
			defaultLineNumbers: false,
			defaultCopyButton: true,
			collapseLongSnippets: true,
			maxSnippetLength: 2,
		};

		const model = await buildSyntaxRenderModel(
			{
				_type: "syntaxCode",
				code: "line1\nline2\nline3",
				language: "ts",
				showLineNumbers: "inherit",
				copyButton: "inherit",
				collapsed: "inherit",
			},
			settings,
			{
				renderHtml: async () => "<pre class=\"shiki\"><code><span class=\"line\">test</span></code></pre>",
			},
		);

		expect(model).toMatchObject({
			showLineNumbers: false,
			showCopyButton: true,
			isCollapsed: true,
			isLongSnippet: true,
			displayLanguageLabel: "TypeScript",
		});
	});

	it("falls back to plain text when the language is unsupported or disallowed", async () => {
		const unsupported = await buildSyntaxRenderModel(
			{
				_type: "syntaxCode",
				code: "hello",
				language: "brainfuck",
			},
			DEFAULT_SETTINGS,
			{
				renderHtml: async ({ language }) => `<pre><code>${language}</code></pre>`,
			},
		);

		expect(unsupported).toMatchObject({
			resolvedLanguage: "text",
			wasFallback: true,
		});

		const disallowed = await buildSyntaxRenderModel(
			{
				_type: "syntaxCode",
				code: "hello",
				language: "ts",
			},
			{
				...DEFAULT_SETTINGS,
				allowedLanguages: ["text", "bash"],
			},
			{
				renderHtml: async ({ language }) => `<pre><code>${language}</code></pre>`,
			},
		);

		expect(disallowed).toMatchObject({
			resolvedLanguage: "text",
			wasFallback: true,
			fallbackReason: "Language is not currently allowed by the site settings.",
		});
	});
});
