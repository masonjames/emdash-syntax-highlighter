export function parseHighlightLines(input: string | undefined, maxLine: number): Set<number> {
	const highlighted = new Set<number>();
	if (!input || maxLine < 1) return highlighted;

	for (const rawSegment of input.split(",")) {
		const segment = rawSegment.trim();
		if (!segment) continue;

		const rangeMatch = /^(\d+)-(\d+)$/.exec(segment);
		if (rangeMatch) {
			const start = Number(rangeMatch[1]);
			const end = Number(rangeMatch[2]);
			if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
			const lower = Math.max(1, Math.min(start, end));
			const upper = Math.min(maxLine, Math.max(start, end));

			for (let line = lower; line <= upper; line += 1) {
				highlighted.add(line);
			}

			continue;
		}

		const line = Number(segment);
		if (!Number.isFinite(line) || line < 1 || line > maxLine) continue;
		highlighted.add(line);
	}

	return highlighted;
}
