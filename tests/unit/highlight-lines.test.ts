import { describe, expect, it } from "vitest";

import { parseHighlightLines } from "../../src/lib/highlight-lines.js";

describe("parseHighlightLines", () => {
	it("parses single lines and ranges", () => {
		expect([...parseHighlightLines("2,4-6,8-7", 10)]).toEqual([2, 4, 5, 6, 7, 8]);
	});

	it("ignores invalid entries and clamps to max line", () => {
		expect([...parseHighlightLines("0,-1,3-20,abc,5", 6)]).toEqual([3, 4, 5, 6]);
	});

	it("returns an empty set for empty input", () => {
		expect([...parseHighlightLines(undefined, 10)]).toEqual([]);
	});
});
