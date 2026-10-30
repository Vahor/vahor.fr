import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { SITE_METADATA } from "./src/lib/constants";
import { mdxOptions } from "./src/lib/markdown";

const site = SITE_METADATA.url;
const buildTime = new Date().toISOString();

export default defineConfig({
	site,
	trailingSlash: "never",
	redirects: {
		"/sitemap.xml": { destination: "/sitemap-index.xml", status: 301 },
	},
	adapter: node({ mode: "standalone" }),
	outDir: "dist",
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: { webp: { lossless: true } },
		},
	},
	integrations: [mdx(), sitemap({ customPages: [new URL("/", site).href] })],
	markdown: {
		syntaxHighlight: false,
		processor: unified({ ...mdxOptions, smartypants: false }),
	},
	vite: {
		plugins: [tailwindcss()],
		define: { __BUILD_TIME__: JSON.stringify(buildTime) },
	},
});
