import { describe, expect, it } from "vitest";

import { renderHighlightedHtml } from "../../src/lib/highlighter.js";

describe("renderHighlightedHtml", () => {
	it("adds per-line metadata for line numbers and highlighted lines", async () => {
		const html = await renderHighlightedHtml({
			code: "const value = 1;\nconsole.log(value);",
			language: "typescript",
			theme: "github-dark",
			highlightedLines: new Set([2]),
		});

		expect(html).toContain('data-line-number="1"');
		expect(html).toContain('data-line-number="2"');
		expect(html).toContain("emdash-syntax__line--highlighted");
		expect(html).toContain("emdash-syntax__pre");
	});
});
