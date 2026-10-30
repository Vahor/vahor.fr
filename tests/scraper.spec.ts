import { createServer } from "node:http";
import { expect, test } from "@playwright/test";
import { extractMetaTags } from "../src/lib/scraper";

test("metadata extraction ignores remote stylesheets and preserves document-order precedence", async () => {
	const server = createServer((_request, response) => {
		response.setHeader("Content-Type", "text/html");
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
	} finally {
		console.error = originalError;
		await new Promise<void>((resolve, reject) => {
			server.close((error) => (error ? reject(error) : resolve()));
		});
	}
});
