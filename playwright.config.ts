import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "http://localhost:4321",
		browserName: "chromium",
		channel: process.env.PLAYWRIGHT_CHANNEL,
	},
	webServer: {
		command: "bun run build:local && bun run start --port 4321",
		url: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
});
