import type { Element } from "@emdash-cms/blocks";
import type { ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import {
	COLLAPSE_OVERRIDE_OPTIONS,
	DISPLAY_OVERRIDE_OPTIONS,
	PACKAGE_VERSION,
	THEME_OPTIONS,
} from "./lib/constants.js";
import { SUPPORTED_LANGUAGE_OPTIONS } from "./lib/language-registry.js";

const BLOCK_FIELDS: Element[] = [
	{
		type: "text_input",
		action_id: "code",
		label: "Code",
		placeholder: "Paste your snippet here",
		multiline: true,
	},
	{
		type: "select",
		action_id: "language",
		label: "Language",
		options: SUPPORTED_LANGUAGE_OPTIONS,
		initial_value: "text",
	},
	{
		type: "text_input",
		action_id: "title",
		label: "Title",
		placeholder: "Optional label shown above the snippet",
	},
	{
		type: "text_input",
		action_id: "highlightLines",
		label: "Highlight lines",
		placeholder: "Examples: 2,4-6",
	},
	{
		type: "select",
		action_id: "showLineNumbers",
		label: "Line numbers",
		options: DISPLAY_OVERRIDE_OPTIONS,
		initial_value: "inherit",
	},
	{
		type: "select",
		action_id: "copyButton",
		label: "Copy button",
		options: DISPLAY_OVERRIDE_OPTIONS,
		initial_value: "inherit",
	},
	{
		type: "select",
		action_id: "collapsed",
		label: "Collapsed by default",
		options: COLLAPSE_OVERRIDE_OPTIONS,
		initial_value: "inherit",
	},
];

export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: "syntax-highlighter",
		version: PACKAGE_VERSION,
		capabilities: [],
		admin: {
			settingsSchema: {
				theme: {
					type: "select",
					label: "Syntax theme",
					description: "Choose the default Shiki theme used for code snippets.",
					options: THEME_OPTIONS,
					default: "github-dark",
				},
				defaultLineNumbers: {
					type: "boolean",
					label: "Show line numbers by default",
					description: "Editors can still override this per snippet.",
					default: true,
				},
				defaultCopyButton: {
					type: "boolean",
					label: "Show copy button by default",
					description: "Copy remains progressive enhancement in the browser.",
					default: true,
				},
				allowedLanguages: {
					type: "string",
					label: "Allowed languages",
					description:
						"Comma- or newline-separated language IDs or aliases. Leave blank to allow all bundled languages.",
					default:
						"text\nbash\njavascript\ntypescript\njsx\ntsx\njson\nyaml\nhtml\ncss\nmarkdown\nastro\ndiff\npython\ngo\nrust\nsql",
					multiline: true,
				},
				collapseLongSnippets: {
					type: "boolean",
					label: "Collapse long snippets by default",
					description:
						"When enabled, snippets longer than the max line threshold start collapsed unless the block overrides it.",
					default: false,
				},
				maxSnippetLength: {
					type: "number",
					label: "Max lines before snippet is considered long",
					description: "Used for the collapse threshold and long-snippet badge.",
					default: 40,
					min: 1,
					max: 500,
				},
			},
			portableTextBlocks: [
				{
					type: "syntaxCode",
					label: "Code Snippet",
					icon: "code",
					description: "Server-rendered, syntax-highlighted code with optional copy and line-number UI.",
					fields: BLOCK_FIELDS,
				},
			],
		},
	});
}

export default createPlugin;
