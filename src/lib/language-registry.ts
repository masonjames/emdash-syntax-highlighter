import type { CanonicalLanguageId } from "./types.js";

interface LanguageDefinition {
	id: CanonicalLanguageId;
	label: string;
	aliases: string[];
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
	{ id: "text", label: "Plain text", aliases: ["plain", "plaintext", "txt"] },
	{ id: "bash", label: "Bash", aliases: ["sh", "shell", "zsh"] },
	{ id: "javascript", label: "JavaScript", aliases: ["js", "node"] },
	{ id: "typescript", label: "TypeScript", aliases: ["ts"] },
	{ id: "jsx", label: "JSX", aliases: [] },
	{ id: "tsx", label: "TSX", aliases: [] },
	{ id: "json", label: "JSON", aliases: [] },
	{ id: "yaml", label: "YAML", aliases: ["yml"] },
	{ id: "html", label: "HTML", aliases: ["htm"] },
	{ id: "css", label: "CSS", aliases: [] },
	{ id: "markdown", label: "Markdown", aliases: ["md"] },
	{ id: "astro", label: "Astro", aliases: [] },
	{ id: "diff", label: "Diff", aliases: ["patch"] },
	{ id: "python", label: "Python", aliases: ["py"] },
	{ id: "go", label: "Go", aliases: ["golang"] },
	{ id: "rust", label: "Rust", aliases: ["rs"] },
	{ id: "sql", label: "SQL", aliases: [] },
];

export const SUPPORTED_LANGUAGE_IDS = SUPPORTED_LANGUAGES.map((language) => language.id);

export const SUPPORTED_LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((language) => ({
	label: language.label,
	value: language.id,
}));

const LANGUAGE_BY_KEY = new Map<string, LanguageDefinition>(
	SUPPORTED_LANGUAGES.flatMap((language) => [
		[language.id, language],
		...language.aliases.map((alias) => [alias, language] as const),
	]),
);

export function normalizeLanguage(input: string | undefined): CanonicalLanguageId | null {
	if (!input) return null;
	const normalized = LANGUAGE_BY_KEY.get(input.trim().toLowerCase());
	return normalized?.id ?? null;
}

export function getLanguageLabel(input: string | undefined): string {
	if (!input) return "Plain text";
	const normalized = normalizeLanguage(input);
	if (!normalized) return input;
	return SUPPORTED_LANGUAGES.find((language) => language.id === normalized)?.label ?? input;
}
