import type { Options } from "rehype-pretty-code";

export const shikiOptions = {
	theme: {
		dark: "catppuccin-mocha",
		light: "github-light",
	},
	defaultLang: "plaintext",
} satisfies Options;
