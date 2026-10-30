import * as fs from "node:fs";
import {
	generate,
	LLMS_TXT_FILENAME,
	type PluginOptions,
} from "@vahor/llms-txt";
import { visit } from "unist-util-visit";
import { SITE_METADATA } from "../src/lib/constants";
import type { Post } from "../src/lib/posts";

function fixRelativeLinks() {
	return (tree: any) => {
		const imagePattern = /^(?:\.\.?\/)*(?:public|src\/assets)\//;
		// Only rewrite relative paths at token boundaries, never inside absolute URLs.
		const pattern = /(^|[\s"'`(])(?:\.\.?\/)*(?:public|src\/assets)\//g;
		visit(tree, "image", (node) => {
			node.url = (node.url as string).replace(imagePattern, "/");
		});
		visit(tree, "html", (node) => {
			node.value = (node.value as string).replace(pattern, "$1/");
		});
		visit(tree, "code", (node) => {
			node.value = (node.value as string).replace(pattern, "$1/");
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
				links: posts.map((post) => ({
					title: post.title,
					url: new URL(`${post.url}.md`, SITE_METADATA.url).href,
					description: post.description,
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
