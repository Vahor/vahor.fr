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

export const mdxOptions = {
	rehypePlugins: [highlightPlugin, rehypeSlug],
	remarkPlugins: [remarkGfm, remarkDirective, addCalloutComponent],
};
export default makeSource({
	contentDirPath: contentFolder,
	documentTypes: [Post],
	mdx: mdxOptions,
});
