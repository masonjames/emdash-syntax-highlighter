# Releasing

This package is a **trusted EmDash plugin** distributed through npm.

It is **not** a marketplace plugin today.

Why:
- it defines a Portable Text block type
- it relies on Astro component rendering via `componentsEntry`
- EmDash currently treats PT-block plugins as trusted-only, not sandboxed marketplace plugins

## Package identity

- npm package: `@masonjames/emdash-syntax-highlighter`
- GitHub repo: `masonjames/emdash-syntax-highlighter`

## Install path for users

Users install the package from npm and add it in `astro.config.mjs`:

```ts
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { syntaxHighlighterPlugin } from "@masonjames/emdash-syntax-highlighter";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [syntaxHighlighterPlugin()],
    }),
  ],
});
```

## Do not use marketplace publish

Do **not** use `emdash plugin publish` for this package unless the plugin is redesigned to be marketplace-compatible.

That command publishes sandboxed marketplace tarballs. This package is intentionally distributed as a trusted npm plugin.

## Release checklist

1. Update `package.json` version
2. Run validation:
   - `pnpm typecheck`
   - `pnpm test`
   - `npm pack --dry-run`
3. Commit and push to `main`
4. Create a GitHub release with the matching tag
5. Let the release workflow publish to npm
6. Verify npm resolution:
   - `npm view @masonjames/emdash-syntax-highlighter version`

## Manual fallback publish

If GitHub Actions publish is blocked but npm auth is working locally:

```bash
npm publish --access public --provenance=false
```

## Notes

- The release workflow is configured for token-based npm publish.
- If you later switch to npm trusted publishing, update the workflow and remove token-based publish configuration.
