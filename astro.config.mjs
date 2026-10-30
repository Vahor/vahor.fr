import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { mdxOptions } from "./src/lib/markdown";

const localPreview = process.env.ASTRO_LOCAL_PREVIEW === "1";

export default defineConfig({
	site: "https://vahor.fr",
	adapter: localPreview
		? node({ mode: "standalone" })
		: vercel({ isr: { expiration: 86400, exclude: ["/og/[slug]"] } }),
	outDir: localPreview ? ".local-dist" : "dist",
	integrations: [mdx()],
	markdown: {
		syntaxHighlight: false,
		processor: unified({ ...mdxOptions, smartypants: false }),
	},
	vite: { plugins: [tailwindcss()] },
});
