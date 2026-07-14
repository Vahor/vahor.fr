import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import tailwindcss from "@tailwindcss/vite";
import rehypeD2 from "@vahor/rehype-d2";
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { addCalloutComponent } from "./src/lib/remark-add-callout";
import { includeMarkdown } from "./src/lib/remark-include-markdown";

const shikiOptions = {
	theme: {
		dark: "catppuccin-mocha",
		light: "github-light",
	},
	defaultLang: "plaintext",
};

const highlightPlugin = [
	rehypePrettyCode,
	{
		...shikiOptions,
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerNotationErrorLevel(),
			transformerNotationFocus(),
			transformerTwoslash({
				explicitTrigger: true,
			}),
		],
	},
];

export default defineConfig({
	site: "https://vahor.fr",
	integrations: [
		react(),
		mdx({
			rehypePlugins: [
				[
					rehypeD2,
					{
						cwd: "./public/blog/d2/imports",
						defaultThemes: ["light", "dark"],
						globalImports: {
							light: [{ filename: "light.d2", mode: "prepend" }, "config.d2"],
							dark: [
								{ filename: "light.d2", mode: "prepend" },
								{ filename: "dark.d2", mode: "prepend" },
								"config.d2",
							],
						},
					},
				],
				highlightPlugin,
				rehypeSlug,
			],
			remarkPlugins: [
				remarkGfm,
				remarkDirective,
				addCalloutComponent,
				includeMarkdown,
			],
		}),
		sitemap({
			filter: (page) => !page.includes("/og/"),
			serialize(item) {
				if (item.url === "https://vahor.fr/") {
					return { ...item, changefreq: "daily", priority: 1 };
				}
				if (item.url.includes("/tag/")) {
					return { ...item, changefreq: "monthly", priority: 0.5 };
				}
				return { ...item, changefreq: "monthly", priority: 0.6 };
			},
		}),
	],
	adapter: vercel(),
	vite: {
		plugins: [tailwindcss()],
		ssr: {
			noExternal: ["@giscus/react", "cmdk"],
			external: ["sharp", "jsdom"],
		},
	},
});
