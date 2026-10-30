import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { JSDOM } from "jsdom";

test("published routes, feeds, Markdown and social images remain available", async ({
	request,
}) => {
	const legacySitemap = await request.get("/sitemap.xml", { maxRedirects: 0 });
	expect(legacySitemap.status()).toBe(301);
	expect(legacySitemap.headers().location).toBe("/sitemap-index.xml");
	const sitemapIndex = await request.get("/sitemap-index.xml");
	expect(sitemapIndex.ok()).toBeTruthy();
	const indexDocument = new JSDOM(await sitemapIndex.text(), {
		contentType: "application/xml",
	}).window.document;
	const sitemapPath = new URL(
		indexDocument.querySelector("sitemap > loc")!.textContent!,
	).pathname;
	const sitemap = await request.get(sitemapPath);
	expect(sitemap.ok()).toBeTruthy();
	const paths = [
		...(await sitemap.text()).matchAll(
			/<loc>https:\/\/vahor\.fr([^<]*)<\/loc>/g,
		),
	].map((match) => match[1] || "/");
	expect(new Set(paths).size).toBe(paths.length);
	expect(paths).toContain("/");
	expect(paths).toContain("/tag/all");
	expect(paths).toContain("/project/charts.vahor.fr");
	const contentPaths = readdirSync("content/posts", { recursive: true })
		.filter(
			(file): file is string =>
				typeof file === "string" && file.endsWith(".mdx"),
		)
		.map((file) => `/${file.replace(/\.mdx$/, "")}`);
	expect(
		paths.every(
			(path) =>
				path === "/" || path.startsWith("/tag/") || contentPaths.includes(path),
		),
	).toBe(true);
	const feed = await request.get("/rss.xml");
	const feedDocument = new JSDOM(await feed.text(), {
		contentType: "application/xml",
	}).window.document;
	const items = [...feedDocument.querySelectorAll("item")];
	expect(
		items
			.map((item) => new URL(item.querySelector("link")!.textContent!).pathname)
			.sort(),
	).toEqual([...contentPaths].sort());
	for (const item of items) {
		expect(item.querySelector("guid")!.textContent).toBe(
			item.querySelector("link")!.textContent,
		);
		expect(item.querySelector("guid")!.getAttribute("isPermaLink")).toBe(
			"true",
		);
	}
	const rssPost = items.find(
		(item) =>
			item.querySelector("link")!.textContent === "https://vahor.fr/blog/rss",
	)!;
	expect(rssPost.querySelector("title")!.textContent).toBe("rss");
	expect(
		new Date(rssPost.querySelector("pubDate")!.textContent!).toISOString(),
	).toBe("2025-04-18T00:00:00.000Z");
	expect(
		[...rssPost.querySelectorAll("category")].map((node) => node.textContent),
	).toEqual(["blog", "2025"]);
	expect(feedDocument.querySelector("channel > language")!.textContent).toBe(
		"fr_FR",
	);
	expect(
		feedDocument.querySelector("channel > managingEditor")!.textContent,
	).toBe("me@vahor.fr (Nathan David)");
	for (const path of contentPaths) {
		expect(paths).toContain(path);
		expect((await request.get(`${path}.md`)).status(), path).toBe(200);
	}
	for (const path of paths) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(200);
		expect(await response.text(), path).toContain(
			`rel="canonical" href="https://vahor.fr${path}"`,
		);
	}
	for (const [path, contentType, text] of [
		["/rss.xml", "xml", "<rss"],
		["/llms.txt", "text/plain", "# Vahor.fr"],
		["/project/charts.vahor.fr.md", "text/markdown", "Charts"],
		[
			"/robots.txt",
			"text/plain",
			"Sitemap: https://vahor.fr/sitemap-index.xml",
		],
	]) {
		const response = await request.get(path);
		expect(response.ok(), path).toBeTruthy();
		expect(response.headers()["content-type"]).toContain(contentType);
		expect(await response.text()).toContain(text);
	}
	const image = await request.get("/og/charts.vahor.fr");
	expect(image.headers()["content-type"]).toContain("image/png");
	expect((await image.body()).subarray(1, 4).toString()).toBe("PNG");
	expect((await request.get("/tag/not-a-real-tag")).status()).toBe(404);
});

test("search is lazy, keyboard accessible, and themes persist across navigation", async ({
	page,
}) => {
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	await page.goto("/tag/all");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("all");
	expect(requests.some((url) => url.includes("/search.json"))).toBe(false);
	await page.getByRole("button", { name: "Changer le thème" }).click();
	await expect(page.locator("html")).toHaveClass("dark");
	await page.keyboard.press("Control+k");
	const query = page.getByRole("searchbox");
	await expect(query).toBeFocused();
	const links = page.locator("#search-results").getByRole("link");
	await expect(links.nth(1)).toBeVisible();
	const nextUrl = new URL(
		(await links.nth(1).getAttribute("href"))!,
		page.url(),
	).href;
	await query.press("ArrowDown");
	await expect(query).toBeFocused();
	await query.press("Enter");
	await expect(page).toHaveURL(nextUrl);
	await page.keyboard.press("Control+k");
	await query.fill("charts");
	const result = page
		.locator("#search-results")
		.getByRole("link", { name: "Charts", exact: true });
	await expect(result).toBeVisible();
	expect(requests.some((url) => url.includes("/search.json"))).toBe(true);
	await query.press("Enter");
	await expect(page).toHaveURL(/\/project\/charts\.vahor\.fr\/?$/);
	await page
		.getByRole("button", { name: "Chercher une page", exact: true })
		.click();
	await query.fill("zzzzzzzzzzzzzzzzzzzz");
	await expect(page.locator("#search-results")).toContainText("Aucun résultat");
	await query.press("Enter");
	await expect(page.locator("#search-dialog")).toBeVisible();
	await page.getByRole("button", { name: "Fermer la recherche" }).click();
	await expect(page.locator("#search-dialog")).not.toBeVisible();
	await page.keyboard.press("Control+k");
	await query.fill("charts");
	await expect(result).toBeVisible();
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/\/project\/charts\.vahor\.fr\/?$/);
	await expect(page.locator("html")).toHaveClass("dark");
	await page
		.getByRole("button", { name: "Chercher une page", exact: true })
		.click();
	await query.fill("charts");
	await page.keyboard.press("Escape");
	await expect(page.locator("#search-dialog")).not.toBeVisible();
	await expect(
		page.getByRole("button", { name: "Chercher une page", exact: true }),
	).toBeFocused();
});

test("related articles identify only the current page", async ({ page }) => {
	await page.goto("/tutorial/add-comments-to-blog");
	const related = page.getByRole("navigation", {
		name: "Pages sur le même sujet",
	});
	const current = related.locator('[aria-current="page"]');
	await expect(current).toHaveCount(1);
	await expect(current).toHaveAttribute(
		"href",
		"/tutorial/add-comments-to-blog",
	);
	await related.locator('a:not([aria-current="page"])').first().click();
	await expect(related.locator('[aria-current="page"]')).toHaveCount(1);
	await expect(related.locator('[aria-current="page"]')).not.toHaveAttribute(
		"href",
		"/tutorial/add-comments-to-blog",
	);
});

test("article code controls copy real text and toggle wrapping", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/blog/rss");
	const block = page.locator("[data-code-block]").first();
	await expect(block.locator("code")).toContainText(
		'import rss from "@astrojs/rss"',
	);
	await block.getByRole("button", { name: "Wrap code", exact: true }).click();
	await expect(block).toHaveAttribute("data-wrap-code", "true");
	await block.getByRole("button", { name: "Wrap code", exact: true }).click();
	await expect(block).toHaveAttribute("data-wrap-code", "false");
	await block.getByRole("button", { name: "Copy code to clipboard" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
		'import rss from "@astrojs/rss"',
	);
	await page.locator("#comments").scrollIntoViewIfNeeded();
	await expect(
		page.locator('script[src="https://giscus.app/client.js"]'),
	).toHaveAttribute("data-mapping", "pathname");
	await page.goto("/project/rehype-d2");
	const lightDiagram = page.locator('[data-d2-theme="light"]').first();
	const darkDiagram = page.locator('[data-d2-theme="dark"]').first();
	await expect(lightDiagram).toBeVisible();
	await expect(lightDiagram).toHaveAttribute("height", "350");
	await expect(darkDiagram).toBeHidden();
	await page.getByRole("button", { name: "Changer le thème" }).click();
	await expect(lightDiagram).toBeHidden();
	await expect(darkDiagram).toBeVisible();
});

test("homepage needs no Spotify browser request or generic fallback", async ({
	page,
}) => {
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	await page.goto("/");
	expect(requests.some((url) => url.includes("/api/spotify"))).toBe(false);
	await expect(page.locator('a[href="https://open.spotify.com/"]')).toHaveCount(
		0,
	);
});
