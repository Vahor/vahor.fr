import { env } from "@/env";
import { BASE_URL } from "@/lib/constants";
import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export const getPosts = (): MetadataRoute.Sitemap => {
	return allPosts.map((post) => ({
		url: `${BASE_URL}/blog/${post.slug}`,
		lastModified: post.dateModified,
		changeFrequency: "monthly" as const,
		priority: 0.6,
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
		{
			url: `${BASE_URL}/about`,
			lastModified: env.BUILD_TIME,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: env.BUILD_TIME,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: env.BUILD_TIME,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		...getPosts(),
	];
}
