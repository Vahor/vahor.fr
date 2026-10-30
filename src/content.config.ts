import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./content/posts" }),
	schema: z.object({
		title: z.string(),
		datePublished: z.coerce.date(),
		description: z.string(),
		tags: z.array(z.string()).optional(),
		toc: z.object({ group: z.string(), order: z.number() }).optional(),
	}),
});

export const collections = { posts };
