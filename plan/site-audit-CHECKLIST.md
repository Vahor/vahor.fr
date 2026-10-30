# Deployed-site baseline audit and follow-up checklist

Audit date: **2026-10-29**, approximately **22:28–22:34 UTC**. Target: **https://vahor.fr**, the existing deployed Next.js site, **not the local Astro migration**. Source content cross-check: starting repository revision `8ed4dae91057e1534d1081eec3620637dd9d02f8`. Other agents were changing the checkout during this audit; source references below identify the original content, not a review of their changes.

**Verdict:** the sampled production pages already score very well in Lighthouse. The strongest follow-ups are avoidable speculative downloads/JavaScript, French copy corrections, unfinished tutorial content, tag-page metadata and small-screen readability. These are existing baseline issues/opportunities, not evidence that the migration introduced regressions. Do not redesign the site or silently rewrite historical articles as part of framework parity work.

All unchecked boxes are proposed work, **not completed fixes**. **B** = observed baseline issue; **M** = migration verification still to do. P1 = important follow-up; P2 = improvement; P0 migration gate = preserve working public behavior before release.

## Evidence and coverage

Evidence directory (ignored, local, not committed): [`../.amp/in/artifacts/site-audit/`](../.amp/in/artifacts/site-audit/).

- `inspection.json`: HTTP status, live title/description/canonical, heading structure, image loading, nested controls and mobile document width.
- `home.txt`, `blog-rss.txt`, `project-next-broken-links.txt`, `tutorial-add-comments-to-blog.txt`, `tag-all.txt`, `tag-project.txt`: actual rendered public text.
- `<page>-desktop.png` / `<page>-mobile.png`: full-page captures at 1280×900 and 390×844 respectively. `home-mobile.png` is a fresh navigation, not the closing-search animation. Screenshots use light mode; these are not dark-theme parity evidence.
- `<page>-<mode>.report.html` and `.report.json`: eight complete Lighthouse reports. Page prefixes: `home`, `blog-rss`, `project-next-broken-links`, `tag-all`. `metrics.txt` and `audit-details.txt` contain extracted measurements and underlying diagnostics.
- `home.headers`, `home.html`, `robots.txt.response`, `sitemap.xml.response`, `rss.xml.response`, `llms.txt.response`, `project-next-broken-links.md.response`: direct public response evidence.
- `search-rss.png` / `search-rss.txt`: focusing header search opens the dialog; entering `rss` returns `rss` and `Charts` (fuzzy search). Result navigation, full keyboard traversal and clipboard were not certified.

Six browsed URLs all returned **200**:

1. https://vahor.fr/
2. https://vahor.fr/blog/rss
3. https://vahor.fr/project/next-broken-links
4. https://vahor.fr/tutorial/add-comments-to-blog
5. https://vahor.fr/tag/all
6. https://vahor.fr/tag/project

All images present in the sampled top-level DOM were loaded; no uncaught page JavaScript exceptions were captured. At 390px, all six documents had `scrollWidth = innerWidth = 390`: no page-level horizontal overflow. This does not prove every code block or iframe interaction works. Public `/robots.txt`, `/sitemap.xml`, `/rss.xml`, `/llms.txt`, `/project/next-broken-links.md` returned 200 with appropriate text/XML/Markdown content types; `/tag/not-a-real-tag` returned 404.

## Measured Lighthouse baseline

Tool: **Lighthouse 13.6.0**, CLI via `bunx --bun lighthouse`; **Google Chrome 156.0.8078.49**, headless, macOS Darwin 24.6.0 arm64; Bun 1.4.4. Anonymous public network requests, no credentials. One run per URL per profile, separate fresh Chrome launches, **simulated throttling**, not physical mobile hardware:

- Mobile: 412×823, DPR 1.75, 4× CPU slowdown, 150ms RTT / 1638.4Kbps simulation configuration.
- Desktop: preset desktop, 1350×940, DPR 1, 1× CPU, 40ms RTT / 10240Kbps simulation configuration.
- Fetch timestamps are in each JSON; runs span **22:28:40–22:30:31 UTC**. Browser inspection overlapped part of the batch and other local work was running: use these as indicative single samples, not medians or a controlled benchmark.
- Lighthouse emitted source-map parsing warnings for chunks `372-15a702624b14ab46.js.map` and `794-115a407a4ac876d8.js.map`; reports completed with empty `runWarnings`. Source attribution/savings are estimates.

Scores are **Performance / Accessibility / Best Practices / SEO**, each out of 100. Timing values below use raw numeric metrics rounded here; report UI can round differently. Transfer includes requests captured during the run, including speculation/prefetch and third parties, not just critical initial resources.

| Public path                  | Profile | Scores P/A/BP/SEO     |    FCP |    LCP | Speed Index |    TBT | CLS | Transfer |
| ---------------------------- | ------- | --------------------- | -----: | -----: | ----------: | -----: | --: | -------: |
| `/`                          | mobile  | 99 / 100 / 96 / 100   | 1.084s | 1.084s |      2.561s |   87ms |   0 |   440KiB |
| `/`                          | desktop | 100 / 100 / 100 / 100 | 0.257s | 0.257s |      0.324s |    0ms |   0 |   438KiB |
| `/blog/rss`                  | mobile  | 100 / 100 / 96 / 100  | 1.252s | 1.252s |      2.592s | 44.5ms |   0 |   607KiB |
| `/blog/rss`                  | desktop | 100 / 100 / 96 / 100  | 0.265s | 0.265s |      0.265s |    0ms |   0 |   607KiB |
| `/project/next-broken-links` | mobile  | 100 / 100 / 100 / 100 | 0.917s | 0.917s |      0.917s |   52ms |   0 |   548KiB |
| `/project/next-broken-links` | desktop | 100 / 100 / 100 / 100 | 0.264s | 0.264s |      0.264s |    0ms |   0 |   548KiB |
| `/tag/all`                   | mobile  | 100 / 100 / 100 / 100 | 1.232s | 1.232s |      2.491s | 21.5ms |   0 |  1059KiB |
| `/tag/all`                   | desktop | 100 / 100 / 100 / 100 | 0.250s | 0.250s |      0.250s |    0ms |   0 |  2243KiB |

**Interpretation:** a 100 score does not mean zero waste, complete accessibility, or excellent field Core Web Vitals. No CrUX/Search Console/RUM percentiles or real-user INP were obtained. Do not claim the migration improved speed from these production-only measurements.

Reproduction, from a directory outside tracked application tooling (replace output path as appropriate):

```sh
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  bunx --bun lighthouse@13.6.0 https://vahor.fr/blog/rss \
  --chrome-flags='--headless --no-sandbox' \
  --output=json --output=html --output-path=./blog-rss-mobile
# Add --preset=desktop for the desktop run; repeat for /, /project/next-broken-links, /tag/all.
```

## Prioritized baseline follow-ups

### P1 — speed and unnecessary work

- [ ] **B / P1 — Investigate speculative article/media downloads on the listing.** URL: https://vahor.fr/tag/all. Desktop Lighthouse captured **2,296,465 bytes**, including `/projects/saverly.fr/homepage.png` (886,567 bytes), `/projects/rehype-d2/uml_diagram_in_editor_excalidraw.svg` (372,680 bytes), `/projects/charts.vahor.fr/shadcn-default-page.png` (203,660 bytes), and numerous `?_rsc=` article requests. These images are not visible listing content. Mobile captured 1,084,278 bytes. Confirm initiators in a clean trace; restrict eager navigation prefetch (especially full article/media loads). **Acceptance:** before any click/hover, the listing does not download unrelated article screenshots; retain fast navigation, working filters and the current visual layout. Compare request lists and bytes, not just the already-100 score. If adding Astro prefetch, keep it opt-in/intent-based rather than prefetching every listed post.
- [ ] **B / P1 — Reduce always-loaded search/framework JavaScript.** URLs: all four measured templates. Lighthouse estimates **67–68KiB unused JS**, including Fuse, cmdk/dialog/focus infrastructure on pages where search was never opened; legacy JS estimate ~12KiB. Use static HTML plus small interaction scripts and load search index/library on first intent/open where practical. **Acceptance:** initial first-party JS bytes decrease versus the captured reports; keyboard shortcut, fuzzy matching, Escape, focus return and result navigation still work. A Lighthouse unused-code estimate is not proof a whole library is safe to delete.

### P1 — copy and content quality

- [ ] **B / P1 — Correct prominent homepage French.** https://vahor.fr/: `passioné` → **`passionné`**; `En dehors de la programation` → **`En dehors de la programmation`**. Source: original `src/app/page.tsx` lines 29 and 60. **Acceptance:** both corrected strings appear in rendered HTML and search/cached copies after intentional publication; do not change typography/layout.
- [ ] **B / P1 — Fix project description and agreement.** https://vahor.fr/project/next-broken-links and its listing entries on https://vahor.fr/tag/all and https://vahor.fr/tag/project: `Une cli qui détectes les liens invalides dans un site Next.js` → **`Une CLI qui détecte les liens invalides dans un site Next.js.`** Source: `content/posts/project/next-broken-links.mdx:3`. In the same article, `chaque page présent` → **`chaque page présente`**, `les pages qu'il a croisé` → **`les pages qu'elle a croisées`** (referent: la CLI), and `3 liens invalide` → **`3 liens invalides`**. **Acceptance:** body, metadata, listing, Markdown export and generated feed agree; review copied descriptions in `content/posts/project/llms-txt.mdx` separately because some are historical tool-output examples, not current editorial copy.
- [ ] **B / P1 — Decide whether to finish the comments tutorial.** https://vahor.fr/tutorial/add-comments-to-blog visibly contains `Work in progress`, `Plusiurs tests:` and a short objectives/vendor list, not an implementation walkthrough. Source `content/posts/tutorial/add-comments-to-blog.mdx:19`: **`Plusieurs tests :`**. **Acceptance:** either keep an explicitly labeled draft with corrected spelling or publish a tested Giscus tutorial with setup, repo/category mapping, theme and loading details. Preserve existing URL and comments mapping; do not remove the WIP warning while leaving outline-only content.

### P2 — Lighthouse diagnostics, metadata, readability and semantics

- [ ] **B / P2 — Stop treating RSS/static documents as framework page navigations.** https://vahor.fr/blog/rss: both reports record console 404s for `https://vahor.fr/rss.xml?ref=vahor.fr&_rsc=FiNtZ3dDscDtE56n` and `https://vahor.fr/rss.xml?_rsc=FiNtZ3dDscDtE56n`, explaining Best Practices 96. Direct `/rss.xml` succeeds; a later plain curl with `_rsc` also succeeded, so the failure is request-context-dependent, **not proof the actual feed is broken**. Original `src/components/A.tsx` uses Next Link for every URL. Render ordinary anchors for feeds/downloads/external documents and preserve query/fragment components correctly if adding referral parameters. **Acceptance:** actual feed click opens valid XML; no speculative RSC document errors on a fresh article load; Lighthouse console audit passes on repeated runs.
- [ ] **B / P2 — Size and optimize article images.** https://vahor.fr/blog/rss: `/blog/rss/nom-menu.png` and `/blog/rss/nom-page.png` lack explicit width/height. Lighthouse estimates ~19KiB mobile image-delivery savings (responsive dimensions/modern compression). **Acceptance:** reserve intrinsic aspect ratio, use appropriate responsive images without changing displayed appearance, defer below-fold images, retain meaningful alt text, and maintain CLS ≤0.1 (baseline sample 0). Avoid promising a score increase: Performance is already 100.
- [ ] **B / P2 — Sharpen tiny homepage favicons on high-DPR displays.** https://vahor.fr/: mobile Best Practices flags Mewo, SESAMm, Rust and Go 16×16 raster icons, expecting 24×24 at the audit density. **Acceptance:** use SVG or a higher-resolution source at the same 16px CSS size; no low-resolution-image diagnostic and no visual size change.
- [ ] **B / P2 — Revisit homepage cache strategy without freezing Spotify.** https://vahor.fr/: captured `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`, `x-vercel-cache: MISS`; Lighthouse reports no-store back/forward cache exclusions. Static portfolio text need not depend on uncached third-party data. Separate cached/static shell from a bounded-TTL Spotify lookup/fallback. **Acceptance:** intentional public shell cache policy, fast repeat navigation, no credentials in client output and graceful stale/unavailable Spotify behavior. Do not claim slow TTFB: these runs measured root-document response duration only ~10–13ms, not field latency.
- [ ] **B / P2 — Give tag pages useful localized metadata.** https://vahor.fr/tag/all and https://vahor.fr/tag/project both have title **`Vahor`** and description **`Développeur full-stack`**, despite different content; H1s are `all` / `project` (CSS capitalized). Propose `Tous les articles | Vahor` / `Projets | Vahor` with descriptive French summaries, leaving route slugs intact. **Acceptance:** unique title/description and self-canonical per tag; selected tag semantics preserved. This is a content/SEO improvement despite Lighthouse SEO 100, not a migration requirement to alter wording.
- [ ] **B / P2 — Improve listing dates on narrow screens, only as an approved design follow-up.** https://vahor.fr/tag/all and https://vahor.fr/tag/project at 390px: long dates/read times break across many lines (e.g. `2 septembre 2025`, `18 septembre 2021`, with the latter month split inside the word). The 256px-tall tag picker also hides lower year choices behind its own scroll area. Propose stable metadata column sizing or stacking metadata below titles and an obvious scroll affordance. **Acceptance:** readable dates at 320/390px, all tags reachable by touch/keyboard, no clipped content/page overflow; desktop layout unchanged unless approved. Existing screenshots define migration parity, not permission to redesign.
- [ ] **B / P2 — Flatten nested interactive controls.** Live tag navigation on `/tag/all`, `/tag/project` and related-page navigation on `/tutorial/add-comments-to-blog` contains **`a > button`**, confirmed in `inspection.json`; source originals `src/app/tag/[tag]/page.tsx` and `src/components/toc/TocLink.tsx`. Style the link itself and set `aria-current="page"` instead of a disabled button inside a link. **Acceptance:** one focus target per destination; correct current-state announcement and working keyboard activation without changing appearance. Automated accessibility 100 does not invalidate the observed markup.
- [ ] **B / P2 — Use one page-level H1 with nested article sections.** https://vahor.fr/blog/rss currently has four H1s (title plus three sections); https://vahor.fr/project/next-broken-links also has four. Promote rendered body sections to H2/H3 while preserving their current IDs/styles. **Acceptance:** one article H1, logical outline and unchanged existing hash links/TOC appearance. This is a semantic improvement, not a claim of an automatic SEO penalty.
- [ ] **B / P2 — Additional editorial consistency.** Listing text from `content/posts/project/game-of-life.mdx:3`: `Implementation` → **`Implémentation`**. On https://vahor.fr/blog/rss, prefer **`RSS`** in title/prose and review the joke `les 5 articles du site` against the homepage's current **21 articles**; either retain as a dated joke or make intentionally timeless. In French prose use spacing before `:` / `?` (e.g. project `Pourquoi?`, `Comment ça marche?`, homepage `mail:`). **Acceptance:** owner-approved corrections propagate consistently; quoted historical examples remain distinguishable from current facts.

## Local Astro migration validation

The migration is implemented locally on `migrate-astro`; it is **not committed,
pushed or deployed**. The deployed baseline above is intentionally unchanged.
Editorial fixes, tag metadata, image optimization and listing redesign remain
follow-up work. Ordinary links, lazy search and a static homepage naturally
replace the old framework behaviors; their production acceptance still requires
a deployment check.

### Completed local checks

- [x] Vercel production build and Node-adapter local production build pass.
- [x] Astro/TypeScript check: zero errors and warnings; one informational
  deprecation hint for the existing Vimeo `frameborder` attribute.
- [x] Biome CI check and frozen Bun install pass. `bun outdated` lists only the
  documented compatibility exceptions: TypeScript 6.0.3 (Astro checker and
  Twoslash compiler API) and D2 0.1.23 (existing wildcard-style diagram syntax).
- [x] All **32 production sitemap URLs** are present in the local sitemap. Four
  Playwright tests check page status/canonicals, all 21 source posts and Markdown
  exports, RSS, robots, llms.txt, social PNG output/legacy redirects and tag 404s.
- [x] Browser checks exercise lazy search, Ctrl+K, result arrows/Enter,
  Escape/focus return, persistent theme, clipboard code text, wrapping and Giscus
  loader pathname mapping. Diagram dimensions and exclusive light/dark
  visibility have regression assertions; Astro's moved fence metadata is restored
  for D2. Existing diagram color definitions are retained, not redesigned.
- [x] Spotify card success and 503 fallback were exercised using intercepted
  public responses. The real credential-free endpoint returns 503 without
  exposing secrets, leaving a usable generic Spotify card. This is **not** proof
  of authenticated Spotify token refresh or production Redis integration.
- [x] Rendered desktop/light/dark, mobile, search, WIP content, code controls and
  diagrams captured and inspected. Automated document-width checks across five
  templates at **320, 390 and 768px** found no horizontal page overflow. Loaded
  project images decode successfully. Original narrow listing dates remain.

Evidence: `../.amp/in/artifacts/astro/`, including `preview.html` (self-contained
visual review), PNG captures, `inspection.json`, `extra-checks.json` and eight
Lighthouse HTML/JSON reports. Build/check logs are in `../.amp/in/`.

### Local Lighthouse samples — not a hosting benchmark

Same Lighthouse 13.6.0 and installed Chrome as the baseline, with the same
mobile/desktop simulated profiles, **one completed run per template/profile**.
The target is the Node production preview on the runner, not Vercel. Local
preview explicitly omits Vercel telemetry scripts because their hosting-only
routes do not exist locally; the Vercel build retains analytics/speed insights.
Spotify is unconfigured. Some runs overlap local work. Home and listing mobile
reports warn that loading exceeded the gather time limit; treat those samples as
provisional rather than release certification. A disconnected Chrome run was
rerun; the retained homepage mobile report is the later successful sample.

Scores below are Performance / Accessibility / Best Practices / SEO.

| Path                         | Mobile                | Desktop               | Mobile LCP | Mobile TBT / CLS |
| ---------------------------- | --------------------- | --------------------- | ---------: | ---------------: |
| `/`                          | 100 / 100 / 92 / 100  | 100 / 100 / 96 / 100  |     1.052s |          0ms / 0 |
| `/blog/rss`                  | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |     1.202s |          0ms / 0 |
| `/project/next-broken-links` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |     1.201s |          0ms / 0 |
| `/tag/all`                   | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |     1.052s |          0ms / 0 |

Homepage Best Practices records the expected `/api/spotify` 503 and existing
low-resolution badge images on mobile. These remain visible findings, not
suppressed errors. An early homepage sample found CLS 0.223 from late Inter
loading; the font preload was added and the retained later sample reports CLS 0.
An early tag sample exposed missing disabled semantics after replacing nested
controls; current-tag semantics were restored and the retained result is 100
accessibility. Final D2-only compatibility fixes followed this measured batch;
their browser regression tests were rerun, not represented as a new Lighthouse
benchmark.

The local listing requests one **3,996-byte external application script**
(4,314 bytes including local HTTP overhead), plus small inline theme/interaction
scripts. It does not request the search index, Fuse chunk or linked-article
screenshots before interaction. Baseline mobile listing script transfer was
315,699 bytes, including its framework/dependency chunks. Local mobile listing
total transfer is 133,516 bytes versus baseline 1,084,278 bytes; desktop local is
156,944 versus 2,296,465 bytes. Different hosting, compression, telemetry and
third-party data mean these are **payload observations, not a controlled speedup
percentage**. The intended architectural reduction is no Next/React runtime,
no speculative article prefetch, and on-demand search.

Reproduce local measurements after `bun run build:local` and
`bun run start --port 4321`, using the baseline Lighthouse command with
`http://localhost:4321/<path>` and a separate output path. Do not run builds
concurrently with a release-quality benchmark; use three runs and medians on
equivalent hosting for the outstanding release gate below.

## Migration release gates (remaining coverage)

- [ ] **M / P0 — Remaining route/metadata coverage:** sitemap parity, all post routes/Markdown, canonical URLs, exports, social image and 404 checks pass locally (above). Before release, finish a full historical hash-link and external-link crawl, and cross-check all metadata/JSON-LD fields rather than only representative pages.
- [ ] **M / P0 — Visual parity:** compare home, article, code-heavy project, WIP tutorial and tag listing at desktop and 320/390/768px, light/dark/system theme. Match fonts, spacing, logo, badges, Spotify card, syntax highlighting, diagrams, callouts, images and sticky/scroll behavior; no unapproved redesign or missing content.
- [ ] **M / P0 — Interaction parity:** search via click and Ctrl/Cmd+K; query typing, fuzzy results, no-result state, arrows/Enter, Escape/focus return; theme persistence across navigation; clipboard mail/code (secure context), code wrapping/tab groups; details/summary; TOC anchors; comments lazy loading/theme/path mapping and edit-on-GitHub links. Do not post comments to test production.
- [ ] **M / P0 — Remaining live integration coverage:** missing-credential Spotify fallback and mocked success pass locally. Verify real Spotify refresh/401 retry, rate-limit/cache behavior, Redis configuration and Giscus rendering/theme with the hosting environment. Remote previews can encounter 429/526 image responses during local builds and use transparent placeholders. No authenticated Spotify/GitHub write behavior was exercised.
- [ ] **M / P1 — Repeat measured comparison on equivalent hosting:** three sequential runs per representative URL/profile, use medians and retain raw reports. Proposed release budget: mobile Performance ≥95, LCP ≤2.5s, TBT ≤200ms, CLS ≤0.1, no new serious accessibility issues, no new console/network errors or missing content. Baseline Accessibility/SEO are 100: investigate any drop. Record JS/transfer reductions separately; avoid listing-prefetch regressions. A local server score is not equivalent to this deployed baseline.
- [ ] **M / P1 — Real-world verification after separately authorized deployment:** check public response headers/cache behavior and mobile Safari/Android; collect RUM p75 LCP/CLS/INP where available. Field “good” targets: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms. Lighthouse TBT is not a substitute for real-user INP.

## Limitations and assumptions

- No deployment, production mutation, commit or source/content fix was performed by this audit. It assumes preserving design/features is the migration's first goal; editorial/layout improvements are separate opt-in follow-ups.
- Public-site checks are a sample, not a comprehensive crawl, security audit, WCAG certification or evaluation of the in-progress Astro implementation. No analytics access, authenticated comments, clipboard permission verification or real-device testing.
- Lighthouse scores are actual single-run results, not invented targets or proof of migration speedup. Dynamic Spotify tracks varied across requests; third-party assets can change measurements. Network location was not independently verified (the captured Vercel request ID included `cdg1`).
- Web-page reader was unavailable; public inspection used direct curl and installed Chrome/Playwright instead. Evidence is local/ignored and must be retained or explicitly shared if reviewers need access outside this checkout.
