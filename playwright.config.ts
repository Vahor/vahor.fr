import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "http://localhost:4329",
		browserName: "chromium",
		channel: process.env.PLAYWRIGHT_CHANNEL,
	},
	webServer: {
		command: "bun run build:local && bun run start --port 4329",
		url: "http://localhost:4329",
		// Never reuse an unrelated development checkout's server.
		reuseExistingServer: false,
		timeout: 120000,
	},
});
