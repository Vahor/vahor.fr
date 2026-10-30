import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("published routes, feeds, Markdown and social images remain available", async ({
	request,
}) => {
	const sitemap = await request.get("/sitemap.xml");
	expect(sitemap.ok()).toBeTruthy();
	const paths = [
		...(await sitemap.text()).matchAll(
			/<loc>https:\/\/vahor\.fr([^<]*)<\/loc>/g,
		),
	].map((match) => match[1] || "/");
	expect(paths).toContain("/tag/all");
	expect(paths).toContain("/project/charts.vahor.fr");
	const contentPaths = readdirSync("content/posts", { recursive: true })
		.filter(
			(file): file is string =>
				typeof file === "string" && file.endsWith(".mdx"),
		)
		.map((file) => `/${file.replace(/\.mdx$/, "")}`);
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
		["/robots.txt", "text/plain", "Sitemap: https://vahor.fr/sitemap.xml"],
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
	await query.fill("charts");
	const result = page
		.locator("#search-results")
		.getByRole("link", { name: "Charts", exact: true });
	await expect(result).toBeVisible();
	expect(requests.some((url) => url.includes("/search.json"))).toBe(true);
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page).toHaveURL(/\/project\/charts\.vahor\.fr\/?$/);
	await expect(page.locator("html")).toHaveClass("dark");
	await page
		.getByRole("button", { name: "Chercher une page", exact: true })
		.click();
	await page.keyboard.press("Escape");
	await expect(page.locator("#search-dialog")).not.toBeVisible();
	await expect(
		page.getByRole("button", { name: "Chercher une page", exact: true }),
	).toBeFocused();
});

test("article code controls copy real text and toggle wrapping", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/blog/rss");
	const block = page.locator("[data-code-block]").first();
	await expect(block.locator("code")).toContainText("import RSS");
	await block.getByRole("button", { name: "Wrap code", exact: true }).click();
	await expect(block).toHaveAttribute("data-wrap-code", "true");
	await block.getByRole("button", { name: "Wrap code", exact: true }).click();
	await expect(block).toHaveAttribute("data-wrap-code", "false");
	await block.getByRole("button", { name: "Copy code to clipboard" }).click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
		"import RSS",
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

test("Spotify card updates from public data and remains usable when unavailable", async ({
	page,
}) => {
	await page.route("**/api/spotify", (route) =>
		route.fulfill({
			json: {
				name: "Example track",
				artists: "First artist, Second artist",
				album: "Example album",
				image: "/icons/spotify.png",
				url: "https://open.spotify.com/track/example?ref=vahor.fr",
			},
		}),
	);
	await page.goto("/");
	const card = page.locator("#spotify-track");
	await expect(card).toContainText("Example track");
	await expect(card).toContainText("First artist, Second artist");
	await expect(card.locator("a")).toHaveAttribute(
		"href",
		"https://open.spotify.com/track/example?ref=vahor.fr",
	);
	await page.route("**/api/spotify", (route) =>
		route.fulfill({ status: 503, json: { error: "Spotify unavailable" } }),
	);
	await page.reload();
	await expect(card).toContainText("Ma musique préférée du moment");
	await expect(card.locator("a")).toHaveAttribute(
		"href",
		"https://open.spotify.com/",
	);
});
