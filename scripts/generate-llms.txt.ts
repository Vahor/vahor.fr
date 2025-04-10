import {
	LLMS_TXT_OUTPUT_DIR_INPUT,
	type PluginOptions,
	generate,
} from "@vahor/llms-txt";
import { allDocuments } from "contentlayer/generated";
import { visit } from "unist-util-visit";

function fixRelativeLinks() {
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	return (tree: any) => {
		const pattern = /(..\/)*public\//g;
		visit(tree, "image", (node) => {
			node.url = (node.url as string).replace(pattern, "/");
			return node;
		});
		visit(tree, "html", (node) => {
			node.value = (node.value as string).replace(pattern, "/");
			return node;
		});
		visit(tree, "code", (node) => {
			node.value = (node.value as string).replace(pattern, "/");
			return node;
		});

		return tree;
	};
}

const options = {
	outputPath: (path) => {
		if (path === LLMS_TXT_OUTPUT_DIR_INPUT) {
			return "./public/llms.txt";
		}
		// path is "./content/posts/[slug].mdx"
		const slug = path.split("/").slice(3).join("/");
		const withoutExtension = slug.split(".").slice(0, -1).join(".");
		return `./public/${withoutExtension}.md`;
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
			links: allDocuments.map((doc) => ({
				title: doc.title,
				url: `https://vahor.fr/${doc.pageType}/${doc.slug}.md`,
				description: doc.description,
			})),
		},
	],
	content: allDocuments.map((doc) => ({
		path: `./content/${doc._raw.sourceFilePath}`,
	})),
	remarkPlugins: [fixRelativeLinks],
} satisfies PluginOptions;

generate(options);
