import RSS from "rss";
import { BASE_URL, globalMetadata } from "../src/lib/constants";
import type { Post } from "../src/lib/posts";

export function generateRss(posts: Post[]) {
	const feed = new RSS({
		title: globalMetadata.title.default,
		description: globalMetadata.description,
		site_url: BASE_URL,
		feed_url: `${BASE_URL}/rss.xml`,
		image_url: `${BASE_URL}${globalMetadata.openGraph.images[0].url}`,
		pubDate: new Date(),
		language: globalMetadata.openGraph.locale,
		managingEditor: `me@vahor.fr (${globalMetadata.creator})`,
		generator: "Vahor",
		categories: [...new Set(posts.flatMap((post) => post.fullTags))],
	});
	for (const post of posts) {
		feed.item({
			title: post.title,
			description: post.description,
			url: `${BASE_URL}${post.url}`,
			date: post.datePublished,
			categories: post.fullTags,
		});
	}
	return feed.xml({ indent: true });
}
