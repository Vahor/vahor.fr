import {
	LLMS_TXT_OUTPUT_DIR_INPUT,
	type PluginOptions,
	generate,
} from "@vahor/llms-txt";
import { allDocuments } from "contentlayer/generated";

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
	}),
	sections: [
		{
			title: "Vahor.fr",
			description: "This is a super cool blog",
			details: "In this blog I will write about stuff",
		},
		{
			title: "Posts",
			links: allDocuments.map((doc) => ({
				title: doc.title,
				url: `/${doc.pageType}/${doc.slug}`,
				description: doc.description,
			})),
		},
	],
	content: allDocuments.map((doc) => ({
		path: `./content/${doc._raw.sourceFilePath}`,
	})),
} satisfies PluginOptions;

generate(options);
