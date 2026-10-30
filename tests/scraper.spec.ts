import { createServer } from "node:http";
import { expect, test } from "@playwright/test";
import { extractMetaTags } from "../src/lib/scraper";

test("metadata extraction ignores remote stylesheets, preserves precedence and degrades HTTP errors", async () => {
	const server = createServer((request, response) => {
		response.setHeader("Content-Type", "text/html");
		if (request.url === "/429" || request.url === "/503") {
			response.statusCode = Number(request.url.slice(1));
			response.end(
				"<title>Error page must not become preview metadata</title>",
			);
			return;
		}
		response.end(`<!doctype html><html><head>
			<meta property="og:title" content="First title &amp; more">
			<title>Second title</title>
			<meta name="description" content="First description">
			<meta property="og:description" content="Second description">
			<style>input::placeholder { rgb(46, 46, 46, 0.8) !important; }</style>
		</head><body></body></html>`);
	});
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("No test port");
	const errors: unknown[][] = [];
	const originalError = console.error;
	console.error = (...args) => errors.push(args);
	try {
		const metadata = await extractMetaTags(`http://127.0.0.1:${address.port}`);
		expect(metadata.title).toBe("First title & more");
		expect(metadata.description).toBe("First description");
		expect(errors).toEqual([]);
		for (const status of [429, 503]) {
			const unavailable = await extractMetaTags(
				`http://127.0.0.1:${address.port}/${status}`,
			);
			expect(unavailable.title).toBe("");
			expect(unavailable.description).toBe("");
			expect(unavailable.favicon).toMatch(/^data:image\//);
			expect(unavailable.image).toMatch(/^data:image\//);
		}
	} finally {
		console.error = originalError;
		await new Promise<void>((resolve, reject) => {
			server.close((error) => (error ? reject(error) : resolve()));
		});
	}
});
