import rss from "@astrojs/rss";
import { EMAIL, globalMetadata } from "../src/lib/constants";
import type { Post } from "../src/lib/posts";

export function generateRss(posts: Post[], site: URL) {
	const escapeXml = (value: string) =>
		value
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;");
	return rss({
		title: globalMetadata.title.default,
		description: globalMetadata.description,
		site,
		trailingSlash: false,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `
			<language>${globalMetadata.openGraph.locale}</language>
			<managingEditor>${escapeXml(`${EMAIL} (${globalMetadata.creator})`)}</managingEditor>
			<generator>Vahor</generator>
			<pubDate>${new Date().toUTCString()}</pubDate>
			<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
			<atom:link href="${escapeXml(new URL("rss.xml", site).href)}" rel="self" type="application/rss+xml" />
			<image><url>${escapeXml(new URL(globalMetadata.openGraph.images[0].url, site).href)}</url><title>${escapeXml(globalMetadata.title.default)}</title><link>${escapeXml(site.href)}</link></image>
			${[...new Set(posts.flatMap((post) => post.fullTags))].map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
		`,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			link: post.url,
			pubDate: new Date(post.datePublished),
			categories: post.fullTags,
		})),
	});
}
