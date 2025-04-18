import { writeFileSync } from "node:fs";
import { globalMetadata } from "@/lib/constants";
import { allDocuments } from "contentlayer/generated";

import RSS from "rss";

const site_url = globalMetadata.metadataBase.toString().replace(/\/$/, "");

const feed = new RSS({
	title: globalMetadata.title.default,
	description: globalMetadata.description,
	site_url: site_url,
	feed_url: `${site_url}/rss.xml`,
	image_url: `${site_url}${globalMetadata.openGraph.images[0].url}`,
	pubDate: new Date(),
	language: globalMetadata.openGraph.locale,
	managingEditor: `me@vahor.fr (${globalMetadata.creator})`,
	generator: "Vahor",
});

for (const post of allDocuments) {
	feed.item({
		title: post.title,
		description: post.description,
		url: `${site_url}${post.url}`,
		date: post.datePublished,
		categories: post.fullTags,
	});
}

writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
