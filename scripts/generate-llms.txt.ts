import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import {
	generate,
	LLMS_TXT_FILENAME,
	type PluginOptions,
} from "@vahor/llms-txt";
import matter from "gray-matter";

const BASE_URL = "https://vahor.fr";
const contentDir = "src/content/posts";

function findAllMdxFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory())
			files.push(...findAllMdxFiles(fullPath));
		else if (extname(entry) === ".mdx") files.push(fullPath);
	}
	return files;
}

const mdxFiles = findAllMdxFiles(contentDir);

const posts = mdxFiles.map((filePath) => {
	const content = readFileSync(filePath, "utf-8");
	const { data } = matter(content);
	const relative = filePath.replace(contentDir + "/", "").replace(/\.mdx$/, "");
	const segments = relative.split("/");
	const pageType = segments.length < 2 ? "blog" : segments[0]!;
	const slug = segments[segments.length - 1]!;
	return {
		title: data.title,
		description: data.description ?? "",
		pageType,
		slug,
	};
});

const options: PluginOptions = {
	outputPath: (path) => {
		if (path === LLMS_TXT_FILENAME) return "./public/llms.txt";
		const relative = path.replace(contentDir + "/", "").replace(/\.mdx$/, "");
		const segments = relative.split("/");
		const pageType = segments.length < 2 ? "blog" : segments[0]!;
		const slug = segments[segments.length - 1]!;
		return `./public/${pageType}/${slug}.md`;
	},
	formatFrontmatter: (frontmatter) => ({
		title: frontmatter.title,
		description: frontmatter.description,
		datePublished: frontmatter.datePublished,
	}),
	sections: [
		{ title: "Vahor.fr" },
		{
			title: "Posts",
			links: posts.map((post) => ({
				title: post.title,
				url: `${BASE_URL}/${post.pageType}/${post.slug}.md`,
				description: post.description,
			})),
		},
	],
	content: mdxFiles.map((path) => ({ path })),
};

generate(options);
console.log("Generated llms.txt and markdown files");
