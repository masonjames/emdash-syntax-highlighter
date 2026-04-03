import { describe, expect, it } from "vitest";

import { parseSyntaxCodeBlock } from "../../src/lib/block-schema.js";

describe("parseSyntaxCodeBlock", () => {
	it("normalizes boolean overrides into tristate values", () => {
		const result = parseSyntaxCodeBlock({
			_type: "syntaxCode",
			code: "const value = 1;\r\nconsole.log(value);\r\n",
			showLineNumbers: true,
			copyButton: false,
			collapsed: true,
		});

		expect(result).toMatchObject({
			code: "const value = 1;\nconsole.log(value);\n",
			showLineNumbers: "show",
			copyButton: "hide",
			collapsed: "collapsed",
		});
	});

	it("returns null for invalid blocks", () => {
		expect(parseSyntaxCodeBlock(null)).toBeNull();
		expect(parseSyntaxCodeBlock({ _type: "paragraph" })).toBeNull();
		expect(parseSyntaxCodeBlock({ _type: "syntaxCode", code: 42 })).toBeNull();
	});

	it("trims optional text fields without stripping code whitespace", () => {
		const result = parseSyntaxCodeBlock({
			_type: "syntaxCode",
			code: "  const value = 1;\n",
			title: "  Example snippet  ",
			language: "  ts  ",
			highlightLines: " 2,4-6 ",
		});

		expect(result).toMatchObject({
			code: "  const value = 1;\n",
			title: "Example snippet",
			language: "ts",
			highlightLines: "2,4-6",
		});
	});
});
