## Vahor

Static Astro portfolio and MDX blog, deployed as a Node container. Pages, tags, RSS,
Markdown exports and social images are generated at build time. No React runtime
is shipped. Search loads Fuse and its index only when opened; comments load near
the bottom of articles. The homepage is server-rendered with Spotify embedded in
the initial HTML. There is no Spotify browser
fetch or generic fallback. Other pages and social-image PNGs remain static;
legacy social-image redirects are server endpoints.

Search deliberately uses native result links: arrow keys move focus to a link,
Enter follows it, and Escape closes the dialog and restores focus to its opener.
To refine the query after navigating results, focus the search field again
(Shift+Tab from the first result, past the close button, or click the field).
This avoids an incomplete active-descendant combobox implementation.

Sitemaps use `@astrojs/sitemap` at `/sitemap-index.xml`; the previous
`/sitemap.xml` URL redirects there. The server-rendered homepage is explicitly
included alongside discovered static pages. RSS uses `@astrojs/rss` at the
unchanged `/rss.xml` URL, retaining article GUIDs and feed metadata.

Article image sources live in `src/assets` and use Astro's `Image` component
with intrinsic dimensions and lossless WebP encoding. SVGs stay vector images.
The original `public/` images are retained for published URLs and Markdown
exports; keep these compatibility copies when updating existing images.
RSS channel metadata is serialized from an object with `fast-xml-builder`.

### Development and verification

Use Node 26 and Bun, then `bun install --frozen-lockfile` and `bun dev`.

- `bun run typecheck` — Astro and TypeScript checks.
- `bunx biome ci .` — non-mutating formatting and lint checks.
- `bun run build` — production output using the Node standalone adapter.
- `bun run build && bun run start --port 4321` — local production preview.
- `bunx playwright install chromium && bun run test` — route/export, search,
  theme, clipboard and code-wrap browser tests. Set `PLAYWRIGHT_CHANNEL=chrome`
  to use an installed Google Chrome instead.
  Browser tests start their own production preview on port 4329; they never reuse
  a development server on port 4321.

`bun test` invokes Bun's test runner; use `bun run test` for Playwright.

### Container

Build and run the production image:

```sh
docker build -t vahor-fr .
docker run --rm -p 4321:4321 --env-file .env.production.local vahor-fr
```

The container stores the Astro standalone server in `dist/`. Pass the Spotify
and Upstash variables at runtime; they are not needed during the image build.

Biome's unused-import/variable rules are disabled for `.astro` files because
template references are not counted as frontmatter usage. `astro check` validates
those references instead; do not auto-remove imports used by templates.

### Integrations

Local builds require no secrets. Configure `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
(or the Vercel KV aliases `KV_REST_API_URL` and `KV_REST_API_TOKEN`) in the hosting
environment to enable Spotify. Redis must already contain the private
`spotify:refreshToken` value from the existing integration. Do not put secrets in
`PUBLIC_` variables. The homepage fetches the top track on the server and embeds
it directly in the HTML, so it works without JavaScript. If Spotify is
unavailable or has no top track, the whole listening block is omitted; there is
no generic fallback or client-side Spotify request.
The refresh token must belong to the same Spotify app and authorize `user-top-read`.
`scripts/spotify.sh` starts that authorization flow and requires macOS's `open`,
`curl` and `jq`, with the Spotify client ID and secret exported in the shell.
On other platforms, open the authorization URL manually or adapt the browser
launcher before running the script. Its redirect URI must match
the URI registered in the Spotify app. Store the returned refresh token in Redis
under `spotify:refreshToken`, without expiry. An access token is refreshed and
cached automatically. Reuse the existing app and Redis database if already set up.
Configure the four variables in the container environment and restart it after
changing them. For local runs, export them into the server process environment.
Never commit credentials or paste tokens into logs.
URL-preview metadata is fetched at build time and optionally cached in Redis.
Network access is needed for remote preview metadata; unavailable preview images
can use the transparent fallback. Giscus retains the original repository/category
and pathname mapping; no authenticated comment posting is part of local checks.

### Upgrade compatibility exceptions

Dependencies were reviewed and upgraded where compatible, including major
versions. Some retained packages already satisfied the review or remain on their
existing release; this is not a claim that every package changed or is the latest
registry release. Explicit compatibility pins are:

- TypeScript stays on `~6.0.3`: TypeScript 7 removes compiler APIs needed by
  Twoslash and is rejected by the installed Astro checker.
- D2 stays on `0.1.23`: tested published versions 0.1.27–0.1.33 reject the
  existing article's wildcard style rule. Retaining the pin preserves diagrams
  without rewriting historical content.
