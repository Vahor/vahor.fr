import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";
import { env } from "@/env";
import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const getPosts = (): MetadataRoute.Sitemap => {
	return allPosts.map((post) => ({
		url: `${BASE_URL}${post.url}`,
		lastModified: post.dateModified,
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));
};

export const getAllTags = (): MetadataRoute.Sitemap => {
	const allTags = Array.from(
		new Set(allPosts.flatMap((post) => post.fullTags)),
	);
	allTags.push("all");
	return allTags.map((tag) => ({
		url: `${BASE_URL}/tag/${tag}`,
		lastModified: env.BUILD_TIME,
		changeFrequency: "monthly",
		priority: 0.5,
	}));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: `${BASE_URL}/`,
			lastModified: env.BUILD_TIME,
			changeFrequency: "daily",
			priority: 1,
		},
		...getPosts(),
		...getAllTags(),
	];
}
