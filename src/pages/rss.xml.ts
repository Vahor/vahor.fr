import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { fullTagsFromEntry, urlFromEntry } from "@/lib/posts";

export async function GET() {
	const posts = await getCollection("posts");
	const sorted = posts.toSorted(
		(a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime(),
	);

	return rss({
		title: "Vahor",
		description: "Développeur full-stack",
		site: "https://vahor.fr",
		items: sorted.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.datePublished,
			link: urlFromEntry(post),
			categories: fullTagsFromEntry(post),
		})),
		customData: `<language>fr-FR</language>`,
	});
}
