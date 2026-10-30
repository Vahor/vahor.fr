Summary: Plan for migrating vahor.fr to Astro, updating remaining dependencies, and delivering an evidence-based site audit. Approved scope: preserve the design, features, and URLs; audit improvements stay checklist-only.

Steps:
1. Migrate to Astro, upgrade remaining dependencies, verify feature/design parity, and produce a prioritized audit checklist.

---

# Step 1: Migrate, verify the site, and produce a prioritized audit checklist

- [x] Replace Next.js and Contentlayer with Astro content collections, static routes, and build-time MDX processing.

Preserve article/tag/OG/feed/Markdown URLs, styling, MDX directives/includes/diagrams/highlighting, related pages, metadata, search keyboard controls, themes, clipboard/code wrapping, comments, Spotify, and URL previews. Use small browser scripts instead of hydrating React. Keep Spotify secrets in a server endpoint and retain Vercel hosting compatibility. Avoid requiring service credentials to compile content. Compare the public deployed baseline with local production output and explicitly document any unverified external integrations.

- [x] Establish the baseline and upgrade dependencies, including major versions, with documented compatibility pins for TypeScript and D2.

Use Bun and the existing package.json/bun.lock. Compare registry releases with declared and installed versions, including overrides and GitHub Actions. Run baseline checks before updates. Migrate configuration and affected source only where upgrades require it; preserve site behavior and design. Do not commit, push, or deploy without authorization.

- [x] Verify the upgraded production build and representative pages.

Run dependency installation, TypeScript, non-mutating Biome checks, production compilation and generation scripts. Review failures against the baseline rather than hiding them. Exercise the homepage, post/project pages, search, and theme switching as practical. Inspect rendered screenshots if migrations affect appearance. Document missing service credentials and any verification limitations; do not use production writes or fabricate working integrations.

- [x] Produce plan/site-audit-CHECKLIST.md with prioritized findings and reproducible evidence.

Audit the deployed https://vahor.fr and, where runnable, the upgraded local production build. Cover mobile/desktop Lighthouse, rendering speed, payloads, images/fonts/scripts, accessibility, SEO, broken links, typos, content clarity/freshness, and maintainability. Sample the homepage and representative content pages. Record the URL, environment, measurement conditions, observed evidence, suggested fix, priority, and acceptance criteria. Distinguish measured results from hypotheses and deployed behavior from local changes. Leave audit improvements unimplemented.

Delivery state: local uncommitted migration with passing production builds,
typecheck, Biome, frozen install and four Playwright tests. Rendered captures and
local/production Lighthouse reports are retained as ignored evidence. Real
Spotify/Redis credentials, authenticated comments, equivalent-host medians and
post-deployment field verification remain explicitly unchecked in the audit.
