import { writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import RSS from "rss";
import matter from "gray-matter";

const BASE_URL = "https://vahor.fr";

function findAllMdxFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) files.push(...findAllMdxFiles(fullPath));
		else if (extname(entry) === ".mdx") files.push(fullPath);
	}
	return files;
}

function getPostMeta(filePath: string) {
	const content = readFileSync(filePath, "utf-8");
	const { data } = matter(content);
	if (!data.title) return null;
	const relative = filePath.replace("src/content/posts/", "").replace(/\.mdx$/, "");
	const segments = relative.split("/");
	const pageType = segments.length < 2 ? "blog" : segments[0]!;
	const slug = segments[segments.length - 1]!;
	const url = `/${pageType}/${slug}`;
	const tags: string[] = data.tags ?? [];
	const year = new Date(data.datePublished).getFullYear();
	return {
		title: data.title, description: data.description ?? "",
		datePublished: new Date(data.datePublished),
		url, fullTags: [pageType, ...tags, year.toString()],
	};
}

const posts = findAllMdxFiles("src/content/posts")
	.map(getPostMeta)
	.filter((p): p is NonNullable<ReturnType<typeof getPostMeta>> => p !== null);

const feed = new RSS({
	title: "Vahor", description: "Développeur full-stack",
	site_url: BASE_URL, feed_url: `${BASE_URL}/rss.xml`,
	image_url: `${BASE_URL}/android-chrome-512x512.png`,
	pubDate: new Date(), language: "fr_FR",
	managingEditor: "me@vahor.fr (Nathan David)", generator: "Vahor",
	categories: Array.from(new Set(posts.flatMap((p) => p.fullTags))),
});

for (const post of posts) {
	feed.item({ title: post.title, description: post.description, url: `${BASE_URL}${post.url}`, date: post.datePublished, categories: post.fullTags });
}

writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
console.log("RSS feed generated");
