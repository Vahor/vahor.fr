import * as fs from "node:fs";
import {
	generate,
	LLMS_TXT_FILENAME,
	type PluginOptions,
} from "@vahor/llms-txt";
import { visit } from "unist-util-visit";
import type { Post } from "../src/lib/posts";

function fixRelativeLinks() {
	return (tree: any) => {
		const pattern = /(..\/)*public\//g;
		visit(tree, "image", (node) => {
			node.url = (node.url as string).replace(pattern, "/");
		});
		visit(tree, "html", (node) => {
			node.value = (node.value as string).replace(pattern, "/");
		});
		visit(tree, "code", (node) => {
			node.value = (node.value as string).replace(pattern, "/");
		});

		return tree;
	};
}

export function generateLlms(posts: Post[]) {
	const output = new Map<string, string>();
	const options = {
		fs: {
			readFileSync: fs.readFileSync,
			mkdirSync: () => undefined,
			writeFileSync: (path, data) => {
				output.set(String(path), String(data));
			},
		},
		outputPath: (path) => {
			if (path === LLMS_TXT_FILENAME) {
				return "/llms.txt";
			}
			const post = posts.find((post) => post.entry.filePath === path);
			return post ? `${post.url}.md` : null;
		},
		formatFrontmatter: (frontmatter) => ({
			title: frontmatter.title,
			description: frontmatter.description,
			datePublished: frontmatter.datePublished,
		}),
		sections: [
			{
				title: "Vahor.fr",
			},
			{
				title: "Posts",
				links: posts.map((doc) => ({
					title: doc.title,
					url: `https://vahor.fr/${doc.pageType}/${doc.slug}.md`,
					description: doc.description,
				})),
			},
		],
		content: posts.map((doc) => ({
			path: doc.entry.filePath!,
		})),
		remarkPlugins: [fixRelativeLinks],
	} satisfies PluginOptions;

	generate(options);
	return output;
}
