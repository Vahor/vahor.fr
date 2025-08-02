import { writeFileSync } from "node:fs";
import { allDocuments } from "contentlayer/generated";
import RSS from "rss";
import { globalMetadata } from "@/lib/constants";

const site_url = globalMetadata.metadataBase.toString().replace(/\/$/, "");

const allCategories = new Set(allDocuments.flatMap((post) => post.fullTags));

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
	categories: Array.from(allCategories),
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
