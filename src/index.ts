import type { PluginDescriptor } from "emdash";

import { PACKAGE_NAME, PACKAGE_VERSION } from "./lib/constants.js";

export function syntaxHighlighterPlugin(): PluginDescriptor {
	return {
		id: "syntax-highlighter",
		version: PACKAGE_VERSION,
		format: "native",
		entrypoint: `${PACKAGE_NAME}/plugin`,
		componentsEntry: `${PACKAGE_NAME}/astro`,
		options: {},
		capabilities: [],
	};
}

export default syntaxHighlighterPlugin;
