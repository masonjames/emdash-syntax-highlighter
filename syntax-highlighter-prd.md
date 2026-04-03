---
title: "PRD: EmDash Syntax Highlighting"
status: draft
priority: P1
inspired_by: "SyntaxHighlighter Evolved"
plugin_id: "syntax-highlighter"
package_name: "@emdash-cms/plugin-syntax-highlighter"
execution_mode: "Trusted-first, sandbox-compatible target"
---

# PRD: EmDash Syntax Highlighting

## Product summary

EmDash Syntax Highlighting gives editors a first-class way to publish readable, attractive code snippets. The greenfield product should use EmDash’s Portable Text model instead of trying to retrofit WordPress shortcodes or old browser-only highlighting patterns.

The MVP should produce:

- a dedicated `syntaxCode` Portable Text block,
- structured code metadata rather than shortcode attributes,
- SSR-friendly highlighted output,
- sitewide settings for theme and code presentation,
- zero server routes and no required network access.

## Problem

Technical publishers and developer-relations teams need code blocks that are easy to author and pleasant to read. Raw code blocks are serviceable, but not enough for polished documentation, tutorials, and changelogs.

In WordPress, syntax-highlighting plugins often rely on shortcode parsing or client-side scripts. That creates friction in EmDash because:

- the editor already has a structured block model,
- client-only rendering is worse for performance and accessibility,
- script injection is a bad default for marketplace-safe plugins.

## Goals

1. Make code snippets a first-class Portable Text authoring experience.
2. Render highlighted code server-side by default.
3. Support common documentation affordances like title, line numbers, highlighted lines, and copy.
4. Keep the MVP deterministic and low-risk. No routes, no outbound network, no public endpoints.
5. Leave room for future field-widget support and richer docs-oriented features.

## Non-goals

- Full IDE behavior inside the editor
- Live code execution or sandboxes
- Arbitrary HTML/CSS/JS injection from themes
- Browser-only highlighting as the primary rendering path
- Automatic conversion of every existing built-in `code` block in v1

## Primary users

### Editors
They want to paste code, choose a language, and move on.

### Technical marketers and docs teams
They want polished snippets that match brand and documentation standards.

### Readers
They want legible, copyable code that preserves structure and line references.

## Key user stories

1. As an editor, I can insert a code-snippet block and choose a language.
2. As an editor, I can mark specific lines for emphasis.
3. As a reader, I can copy the snippet without selecting line numbers or UI chrome.
4. As a site admin, I can choose a default highlighting theme and enable line numbers globally.
5. As a theme developer, I can trust the block to render fully on the server.

## MVP scope

### In scope

- `syntaxCode` Portable Text block
- sitewide settings for highlight theme and defaults
- SSR-based syntax highlighting
- code title or caption
- optional line numbers
- optional highlighted lines
- optional copy button
- language allowlist
- graceful fallback for unsupported languages

### Out of scope

- live preview of highlighted output while typing every keystroke
- code folding
- runnable sandboxes
- inline code highlighting redesign
- migration of all existing code blocks

## Functional requirements

### Editor experience

The block must support:

- raw code content
- language selection
- optional snippet title
- show line numbers yes/no
- highlight lines field
- copy button yes/no

The block UI should default to the sitewide settings but allow per-block override.

### Frontend behavior

- Highlighted code must render server-side.
- The HTML structure must remain accessible and copy-friendly.
- Copy behavior should be progressive enhancement, not a hard dependency.
- Unsupported languages must fall back to escaped plain code.

### Configuration

Admin settings must include:

- syntax theme
- default line numbers
- default copy button
- allowed languages
- max snippet length before warning
- whether to collapse long snippets by default

## UX and integration model

This product should be block-first. The main path is:

1. editor inserts `syntaxCode`,
2. configures language and display options,
3. frontend renders via the plugin’s `componentsEntry`.

Later phases can add a field widget for code-like fields elsewhere in the schema, but that should not delay the core block experience.

## Technical approach for EmDash

### Plugin surfaces

- `admin.settingsSchema`
- `admin.portableTextBlocks`
- `componentsEntry` for SSR rendering

### Capabilities

None required for MVP.

### Rendering strategy

Use an SSR-compatible highlighter abstraction with a default implementation such as Shiki-style tokenization. The renderer should be packaged so it does not require runtime network calls.

### Storage model

No storage required for v1.

### Routes

No plugin routes in v1.

### Data model

KV-backed settings only:

- `settings:theme`
- `settings:defaultLineNumbers`
- `settings:defaultCopyButton`
- `settings:allowedLanguages`
- `settings:collapseLongSnippets`
- `settings:maxSnippetLength`

### Block contract

Suggested block fields:

- `code`
- `language`
- `title`
- `showLineNumbers`
- `highlightLines`
- `copyButton`
- `collapsed`

## Success metrics

- Editors can author highlighted snippets without custom markdown or shortcode syntax.
- Docs pages render with no client-side dependency for base highlighting.
- Copy-to-clipboard works where supported and fails gracefully where not.
- The plugin stays capability-free in v1.

## Risks and mitigations

### Risk: large renderer bundle size
Mitigation: ship a constrained language set in v1 and load extended grammars only when explicitly configured.

### Risk: editors paste enormous files
Mitigation: provide soft warnings and recommend excerpts rather than full files.

### Risk: theme CSS conflicts
Mitigation: scope class names and provide a minimal baseline theme contract.

## Milestones

1. Define block schema and editor UI.
2. Implement SSR renderer and theme settings.
3. Add copy behavior and line highlighting.
4. Validate output against accessibility and copy behavior.
5. Ship docs and sample theme integration.

## Acceptance criteria

- Editors can insert a syntax-highlighted block from slash commands.
- The frontend renders highlighted HTML server-side.
- Unsupported languages fall back safely.
- Copy behavior is optional and progressive.
- The plugin works without routes, storage, or network access.

## Open questions

1. Should the built-in Portable Text `code` block gain an optional migration path into this plugin later?
2. How many languages should ship in the default bundle?
3. Should we support diff-style line additions and removals in v1.1?
