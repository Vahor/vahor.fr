import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "@playwright/test";

const execute = promisify(execFile);

test("Vercel homepage renders without requiring ESM from CommonJS dependencies", async () => {
	test.setTimeout(120000);
	await execute("bun", ["run", "build"], { timeout: 100000 });
	// Vercel's require hook rejects the jsdom CJS → ESM chain even on Node 24.
	// Importing the generated handler alone is insufficient: pages load lazily.
	await execute(
		process.execPath,
		[
			"--no-experimental-require-module",
			"--input-type=module",
			"-e",
			`
		import assert from 'node:assert/strict';
		globalThis.fetch = async () => { throw new Error('No external services in this probe'); };
		const { default: handler } = await import('./.vercel/output/functions/_isr.func/.vercel/output/server/entry.mjs');
		const response = await handler.fetch(new Request('https://vahor.fr/'));
		assert.equal(response.status, 200);
		const html = await response.text();
		assert.ok(html.includes('Nathan David'));
		assert.ok(html.includes('me@vahor.fr'));
		assert.ok(html.includes('</html>'));
		for (const icon of ['mewo.png', 'sesamm.svg', 'rust.png', 'go.png']) {
			assert.ok(html.includes('/icons/' + icon));
		}
	`,
		],
		{ timeout: 20000 },
	);
});
