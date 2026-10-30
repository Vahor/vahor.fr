import { createServer } from "node:http";
import { expect, test } from "@playwright/test";

// Use an isolated cache client; no test sends requests to Redis.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
process.env.UPSTASH_REDIS_REST_URL = "https://cache.invalid";
process.env.UPSTASH_REDIS_REST_TOKEN = "test";
const { extractMetaTags } = await import("../src/lib/scraper");
if (redisUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
else process.env.UPSTASH_REDIS_REST_URL = redisUrl;
if (redisToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
else process.env.UPSTASH_REDIS_REST_TOKEN = redisToken;

const fetchOriginal = globalThis.fetch;
const cache = new Map<string, string>();
test.beforeEach(() => {
	cache.clear();
	globalThis.fetch = async (input, options) => {
		if (String(input).startsWith("https://cache.invalid")) {
			const commands = JSON.parse(options!.body as string) as string[][];
			return Response.json(
				commands.map(([operation, key, value, ...flags]) => {
					if (operation.toLowerCase() === "get")
						return { result: cache.get(key) ?? null };
					if (flags.includes("nx") && cache.has(key)) return { result: null };
					cache.set(key, value);
					return { result: "OK" };
				}),
			);
		}
		return fetchOriginal(input, options);
	};
});
test.afterEach(() => {
	globalThis.fetch = fetchOriginal;
});

test("metadata reuses fresh cache entries instead of legacy long-lived entries", async () => {
	const cachedFetch = globalThis.fetch;
	cache.set(
		"meta:https://metadata.invalid/cached",
		JSON.stringify({ title: "Legacy stale title" }),
	);
	let remoteRequests = 0;
	globalThis.fetch = async (input, options) => {
		if (String(input).startsWith("https://cache.invalid"))
			return cachedFetch(input, options);
		remoteRequests++;
		return new Response("<title>Fresh title</title>");
	};
	const first = await extractMetaTags("https://metadata.invalid/cached");
	const second = await extractMetaTags("https://metadata.invalid/cached");
	expect(first.title).toBe("Fresh title");
	expect(second).toEqual(first);
	expect(remoteRequests).toBe(1);
});

test("a slower degraded request cannot replace concurrently cached metadata", async () => {
	const cachedFetch = globalThis.fetch;
	const started = Promise.withResolvers<void>();
	const release = Promise.withResolvers<void>();
	let pages = 0;
	globalThis.fetch = async (input, options) => {
		const url = String(input);
		if (url.startsWith("https://cache.invalid"))
			return cachedFetch(input, options);
		if (url.endsWith("/valid.ico"))
			return new Response(new Uint8Array([0, 1, 2]), {
				headers: { "Content-Type": "image/x-icon" },
			});
		if (++pages === 1) {
			started.resolve();
			await release.promise;
			return new Response("<title>Degraded response</title>");
		}
		return new Response(
			'<title>Complete response</title><link rel="icon" href="/valid.ico">',
		);
	};
	const slow = extractMetaTags("https://metadata.invalid/concurrent");
	await started.promise;
	try {
		const complete = await extractMetaTags(
			"https://metadata.invalid/concurrent",
		);
		expect(complete.favicon).toBe("data:image/x-icon;base64,AAEC");
		release.resolve();
		await slow;
		expect(
			await extractMetaTags("https://metadata.invalid/concurrent"),
		).toEqual(complete);
	} finally {
		release.resolve();
		await slow;
	}
});

test("image network failures preserve parsed metadata and independent image results", async () => {
	const cachedFetch = globalThis.fetch;
	const originalError = console.error;
	console.error = () => {};
	try {
		globalThis.fetch = async (input, options) => {
			const url = String(input);
			if (url.startsWith("https://cache.invalid"))
				return cachedFetch(input, options);
			if (url.endsWith("/cover.png"))
				throw new TypeError("Image connection reset");
			if (url.endsWith("/favicon.ico"))
				return new Response(new Uint8Array([0, 1, 2]), {
					headers: { "Content-Type": "image/x-icon" },
				});
			return new Response(
				'<title>Useful title</title><meta name="description" content="Useful description"><link rel="icon" href="/favicon.ico"><meta property="og:image" content="https://metadata.invalid/cover.png">',
			);
		};
		const metadata = await extractMetaTags(
			"https://metadata.invalid/image-error",
		);
		expect(metadata.title).toBe("Useful title");
		expect(metadata.description).toBe("Useful description");
		expect(metadata.favicon).toBe("data:image/x-icon;base64,AAEC");
		expect(metadata.image).toBe(
			"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
		);
	} finally {
		console.error = originalError;
	}
});

test("metadata extraction ignores remote stylesheets, preserves precedence and degrades HTTP errors", async () => {
	const requests: string[] = [];
	const server = createServer((request, response) => {
		requests.push(request.url!);
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
			<link rel="stylesheet" href="/must-not-load.css">
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
			expect(unavailable.favicon).toBe(
				"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
			);
			expect(unavailable.image).toBe(unavailable.favicon);
		}
		expect(requests).not.toContain("/must-not-load.css");
	} finally {
		console.error = originalError;
		await new Promise<void>((resolve, reject) => {
			server.close((error) => (error ? reject(error) : resolve()));
		});
	}
});

test("optional metadata survives network rejection and cache outages", async () => {
	const originalFetch = globalThis.fetch;
	const originalError = console.error;
	const diagnostics: unknown[][] = [];
	console.error = (...args) => diagnostics.push(args);
	try {
		globalThis.fetch = async (input, options) => {
			if (String(input).startsWith("https://cache.invalid"))
				return originalFetch(input, options);
			throw new TypeError("Connection reset");
		};
		const failed = await extractMetaTags("https://metadata.invalid/network");
		expect(failed.title).toBe("");
		expect(failed.favicon).toBe(
			"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
		);
		globalThis.fetch = async (input) => {
			if (String(input).startsWith("https://cache.invalid"))
				throw new Error("Cache unavailable");
			return new Response("<title>Available without cache</title>");
		};
		const uncached = await extractMetaTags("https://metadata.invalid/cache");
		expect(uncached.title).toBe("Available without cache");
		expect(diagnostics.map(([message]) => message)).toEqual([
			"Metadata unavailable: https://metadata.invalid/network",
			"Metadata cache read failed: https://metadata.invalid/cache",
			"Metadata cache write failed: https://metadata.invalid/cache",
		]);
	} finally {
		globalThis.fetch = originalFetch;
		console.error = originalError;
	}
});
