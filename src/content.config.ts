import { defineCollection, z } from "astro:content";

const posts = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		datePublished: z.coerce.date(),
		description: z.string(),
		tags: z.array(z.string()).optional().default([]),
		toc: z
			.object({
				group: z.string(),
				order: z.number(),
			})
			.optional(),
	}),
});

export const collections = { posts };
