import rss from "@astrojs/rss";
import XMLBuilder from "fast-xml-builder";
import { EMAIL, globalMetadata } from "../src/lib/constants";
import type { Post } from "../src/lib/posts";

export function generateRss(posts: Post[], site: URL) {
	const date = new Date().toUTCString();
	return rss({
		title: globalMetadata.title.default,
		description: globalMetadata.description,
		site,
		trailingSlash: false,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: new XMLBuilder({ ignoreAttributes: false }).build({
			language: globalMetadata.openGraph.locale,
			managingEditor: `${EMAIL} (${globalMetadata.creator})`,
			generator: "Vahor",
			pubDate: date,
			lastBuildDate: date,
			"atom:link": {
				"@_href": new URL("rss.xml", site).href,
				"@_rel": "self",
				"@_type": "application/rss+xml",
			},
			image: {
				url: new URL(globalMetadata.openGraph.images[0].url, site).href,
				title: globalMetadata.title.default,
				link: site.href,
			},
			category: [...new Set(posts.flatMap((post) => post.fullTags))],
		}),
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			link: post.url,
			pubDate: new Date(post.datePublished),
			categories: post.fullTags,
		})),
	});
}
