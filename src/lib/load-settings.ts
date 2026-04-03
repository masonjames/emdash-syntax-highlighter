import { getDb } from "emdash/runtime";

import { PLUGIN_ID } from "./constants.js";
import { normalizeSyntaxHighlighterSettings } from "./settings.js";
import type { RawSyntaxHighlighterSettings, SyntaxHighlighterSettings } from "./types.js";

const SETTINGS_PREFIX = `plugin:${PLUGIN_ID}:settings:`;

interface EmDashPluginSettingsModule {
	getPluginSettings?: (pluginId: string) => Promise<Record<string, unknown>>;
}

async function loadViaPublicHelper(): Promise<Partial<RawSyntaxHighlighterSettings> | null> {
	try {
		const emdashModule = (await import("emdash")) as EmDashPluginSettingsModule;
		if (typeof emdashModule.getPluginSettings !== "function") return null;
		return (await emdashModule.getPluginSettings(PLUGIN_ID)) as Partial<RawSyntaxHighlighterSettings>;
	} catch {
		return null;
	}
}

async function loadViaRuntimeDatabase(): Promise<Partial<RawSyntaxHighlighterSettings>> {
	const db = await getDb();
	const rows = await db
		.selectFrom("options")
		.select(["name", "value"])
		.where("name", "like", `${SETTINGS_PREFIX}%`)
		.execute();

	const settings: Partial<RawSyntaxHighlighterSettings> = {};

	for (const row of rows) {
		const key = row.name.replace(SETTINGS_PREFIX, "");
		try {
			settings[key as keyof RawSyntaxHighlighterSettings] = JSON.parse(row.value);
		} catch {
			// Ignore malformed values and fall back to defaults.
		}
	}

	return settings;
}

export async function loadRawSyntaxHighlighterSettings(): Promise<
	Partial<RawSyntaxHighlighterSettings>
> {
	try {
		const helperSettings = await loadViaPublicHelper();
		if (helperSettings) return helperSettings;
		return await loadViaRuntimeDatabase();
	} catch {
		return {};
	}
}

export async function loadSyntaxHighlighterSettings(): Promise<SyntaxHighlighterSettings> {
	return normalizeSyntaxHighlighterSettings(await loadRawSyntaxHighlighterSettings());
}
