import * as fs from "node:fs";
import { addCalloutComponent } from "@/lib/contentlayer/add-callout-component";
import { shikiOptions } from "@/lib/shiki";
import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { defineNestedType } from "contentlayer2/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
const contentFolder = "content";
import path from "node:path";
import rehypeD2 from "@vahor/rehype-d2";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

const TocProperties = defineNestedType(() => ({
	name: "TocProperties",
	fields: {
		group: { type: "string", required: true },
		order: { type: "number", required: true },
	},
}));

const slug = (path: string) => {
	const withoutPrefix = path.split("/").splice(-1)[0];
	return withoutPrefix;
};

const pageType = (path: string) => {
	if (path.indexOf("/") < 2) return "blog";
	const firstSegment = path.split("/")[1];
	return firstSegment;
};

const lastModified = (path: string) => {
	const stats = fs.statSync(`${contentFolder}/${path}`);
	const date = stats.mtime;
	return date;
};

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "posts/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		datePublished: { type: "date", required: true },
		description: { type: "string", required: true },
		tags: { type: "list", of: { type: "string" }, required: false },
		toc: { type: "nested", of: TocProperties, required: false },
	},
	computedFields: {
		slug: {
			type: "string",
			resolve: (post) => slug(post._raw.flattenedPath),
		},
		url: {
			type: "string",
			resolve: (post) => {
				const filePath = post._raw.flattenedPath;
				return `/${pageType(filePath)}/${slug(filePath)}`;
			},
		},
		githubEditUrl: {
			type: "string",
			resolve: (post) => {
				const filePath = post._raw.sourceFilePath;
				return `https://github.com/vahor/vahor.fr/edit/main/src/content/${filePath}`;
			},
		},
		fullTags: {
			type: "list",
			of: { type: "string" },
			resolve: (post) => {
				const tags = post.tags ?? [];
				// append page type and year
				const type = pageType(post._raw.flattenedPath);
				const year = new Date(post.datePublished).getFullYear();
				return [type, ...tags, year.toString()];
			},
		},
		pageType: {
			type: "string",
			resolve: (post) => {
				return pageType(post._raw.flattenedPath);
			},
		},
		timeToRead: {
			type: "number",
			resolve: (post) => {
				const content = post.body.raw;
				const words = content.split(/\s+/).length;
				const minutes = words / 180;
				return Math.ceil(minutes);
			},
		},
		dateModified: {
			type: "date",
			resolve: (post) => {
				const sourceFilePath = post._raw.sourceFilePath;
				return lastModified(sourceFilePath);
			},
		},
	},
}));

const highlightPlugin = () => {
	return rehypePrettyCode({
		...shikiOptions,
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerNotationErrorLevel(),
			transformerNotationFocus(),
			transformerTwoslash({
				explicitTrigger: true,
			}),
		],
	});
};

function includeMarkdown() {
	// Adapted from https://github.com/hashicorp/remark-plugins/blob/main/plugins/include-markdown/index.js
	return (tree: Node, file: VFile) => {
		visit(tree, (node: Node) => {
			try {
				const targetNode = node.children?.[0] ?? node;
				const includeMatch = targetNode.value?.match(
					/^@include\s['"](.*)['"]$/,
				);
				if (!includeMatch) return;
				let filePath = includeMatch[1];
				// If we want to show the @include text without any transformation
				const isFake = filePath.startsWith("fake:");
				if (isFake) {
					filePath = filePath.slice(5);
					targetNode.value = `@include "${filePath}"`;
					return;
				}
				const isRaw = filePath.startsWith("raw:");
				if (isRaw) {
					filePath = filePath.slice(4);
				}

				const includePath = path.join(file.dirname, filePath);
				const contents = fs.readFileSync(includePath, "utf8");

				const extension = includePath.match(/\.(\w+)$/)[1];
				const isMdx = extension === "mdx";
				if (isMdx) {
					const processor = remark();
					for (const plugin of mdxOptions.remarkPlugins) {
						processor.use(plugin);
					}
					const ast = processor.parse(contents);
					const result = processor.runSync(ast, contents);
					node.type = "root";
					node.children = result.children;
					node.position = result.position;
					return;
				}

				if (!isRaw) {
					node.type = "code";
					node.lang = extension;
					node.value = contents.replace(/\n$/, "");
				} else {
					targetNode.value = contents.replace(/\n$/, "");
				}
			} catch (err) {
				console.error(err);
			}
		});
	};
}

export const mdxOptions = {
	rehypePlugins: [
		[
			rehypeD2,
			{
				cwd: "./public/blog/d2",
				defaultMetadata: {
					sketch: false,
				},
			},
		],
		highlightPlugin,
		rehypeSlug,
	],
	remarkPlugins: [
		remarkGfm,
		remarkDirective,
		addCalloutComponent,
		includeMarkdown,
	],
};
export default makeSource({
	contentDirPath: contentFolder,
	documentTypes: [Post],
	mdx: mdxOptions,
});
