# EmDash Syntax Highlighter

First-class code snippets for EmDash CMS.

`@emdash-cms/plugin-syntax-highlighter` adds a dedicated `syntaxCode` Portable Text block with:

- server-rendered syntax highlighting via Shiki
- sitewide defaults for theme, line numbers, copy buttons, and collapse behavior
- per-block override controls with true “inherit site default” behavior
- highlighted-line support (`2,4-6`)
- graceful fallback to plain text for unsupported or disallowed languages
- progressive copy-to-clipboard enhancement with no runtime network dependency

## Why this is a trusted/native plugin

EmDash currently requires a **native/trusted plugin** for the combination of:

- `admin.portableTextBlocks`
- `componentsEntry` SSR block rendering

That means this package installs through `plugins: []` in your EmDash config, not via the sandboxed marketplace flow.

## Installation

```bash
pnpm add @emdash-cms/plugin-syntax-highlighter
```

## Usage

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { syntaxHighlighterPlugin } from "@emdash-cms/plugin-syntax-highlighter";

export default defineConfig({
	integrations: [
		emdash({
			plugins: [syntaxHighlighterPlugin()],
		}),
	],
});
```

Once installed, editors can insert **Code Snippet** from the Portable Text slash menu.

## Sitewide settings

The auto-generated plugin settings screen includes:

- **Syntax theme**
- **Show line numbers by default**
- **Show copy button by default**
- **Allowed languages**
- **Collapse long snippets by default**
- **Max lines before a snippet is considered long**

### Allowed languages

The `Allowed languages` setting accepts comma-separated or newline-separated IDs and aliases, for example:

```text
ts
tsx
js
json
bash
python
astro
```

Leaving it blank allows all bundled languages:

- text
- bash
- javascript
- typescript
- jsx
- tsx
- json
- yaml
- html
- css
- markdown
- astro
- diff
- python
- go
- rust
- sql

## Per-block fields

Each `syntaxCode` block supports:

- **Code**
- **Language**
- **Title**
- **Highlight lines**
- **Line numbers** (`inherit`, `show`, `hide`)
- **Copy button** (`inherit`, `show`, `hide`)
- **Collapsed by default** (`inherit`, `collapsed`, `expanded`)

The tri-state controls are intentional: they let a block inherit the latest sitewide default instead of flattening “inherit” and “false” into the same value.

## Rendering behavior

- Base highlighting is rendered on the server.
- Unsupported or disallowed languages safely fall back to plain text.
- Copy uses the Clipboard API when available and stays hidden otherwise.
- Line numbers are rendered with CSS pseudo-elements so copied text stays clean.

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
```

## Release notes

- **Distribution:** npm + GitHub repository
- **Execution model:** trusted/native EmDash plugin
- **Network access:** none required
- **Routes/storage:** none in v1

## Repository

- GitHub: https://github.com/masonjames/emdash-syntax-highlighter
