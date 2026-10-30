import rss from "@astrojs/rss";
import XMLBuilder from "fast-xml-builder";
import { EMAIL, SITE_METADATA } from "../src/lib/constants";
import type { Post } from "../src/lib/posts";

export function generateRss(posts: Post[], site: URL) {
	const date = new Date().toUTCString();
	return rss({
		title: SITE_METADATA.title,
		description: SITE_METADATA.description,
		site,
		trailingSlash: false,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: new XMLBuilder({ ignoreAttributes: false }).build({
			language: SITE_METADATA.locale,
			managingEditor: `${EMAIL} (${SITE_METADATA.author})`,
			generator: SITE_METADATA.title,
			pubDate: date,
			lastBuildDate: date,
			"atom:link": {
				"@_href": new URL("rss.xml", site).href,
				"@_rel": "self",
				"@_type": "application/rss+xml",
			},
			image: {
				url: new URL(SITE_METADATA.image, site).href,
				title: SITE_METADATA.title,
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
