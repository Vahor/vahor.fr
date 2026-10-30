## Vahor

Static Astro portfolio and MDX blog, deployed on Vercel. Pages, tags, RSS,
Markdown exports and social images are generated at build time. No React runtime
is shipped. Search loads Fuse and its index only when opened; comments load near
the bottom of articles. Spotify and legacy social-image redirects are the only
server endpoints; social-image PNGs themselves are static.

### Development and verification

Use Node 24 and Bun, then `bun install --frozen-lockfile` and `bun dev`.

- `bun run typecheck` — Astro and TypeScript checks.
- `bunx biome ci .` — non-mutating formatting and lint checks.
- `bun run build` — Vercel production output.
- `bun run build:local && bun run start --port 4321` — local production preview
  using the official Node adapter (Vercel does not support `astro preview`).
- `bunx playwright install chromium && bun run test` — route/export, search,
  theme, clipboard and code-wrap browser tests. Set `PLAYWRIGHT_CHANNEL=chrome`
  to use an installed Google Chrome instead.

`bun test` invokes Bun's test runner; use `bun run test` for Playwright.

### Integrations

Local builds require no secrets. Configure `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the hosting
environment to enable Spotify. Redis must already contain the private
`spotify:refreshToken` value from the existing integration. Do not put secrets in
`PUBLIC_` variables. An unavailable Spotify service leaves a generic Spotify link;
the static page remains usable. Successful responses use bounded CDN caching.
URL-preview metadata is fetched at build time and optionally cached in Redis.
Network access is needed for remote preview metadata; unavailable preview images
can use the transparent fallback. Giscus retains the original repository/category
and pathname mapping; no authenticated comment posting is part of local checks.

### Upgrade compatibility exceptions

All retained dependencies were upgraded, including major versions, except:

- TypeScript stays on `~6.0.3`: TypeScript 7 removes compiler APIs needed by
  Twoslash and is rejected by the installed Astro checker.
- D2 stays on `0.1.23`: tested published versions 0.1.27–0.1.33 reject the
  existing article's wildcard style rule. Retaining the pin preserves diagrams
  without rewriting historical content.

See [the prioritized audit checklist](plan/site-audit-CHECKLIST.md) for measured
production baselines, migration validation and remaining editorial/performance
work. Publication and post-deployment verification remain separate steps.
