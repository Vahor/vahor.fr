import * as fs from "node:fs";
import {
	transformerNotationDiff,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { defineNestedType } from "contentlayer2/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import codeImport from "remark-code-import";
import remarkGfm from "remark-gfm";
// import remarkCustomHeaderId from 'remark-custom-header-id';
import type { ShikiTransformer } from "shiki";

const TocProperties = defineNestedType(() => ({
	name: "TocProperties",
	fields: {
		group: { type: "string", required: true },
		order: { type: "number", required: true },
	},
}));

const postSlug = (path: string) => {
	const withoutPrefix = path.split("posts/").splice(-1)[0];
	return withoutPrefix;
};

const pageType = (path: string) => {
	const slug = postSlug(path);
	if (slug.indexOf("/") === -1) return "blog";
	const firstSegment = slug.split("/")[0];
	return firstSegment;
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
			resolve: (post) => postSlug(post._raw.flattenedPath),
		},
		url: {
			type: "string",
			resolve: (post) => {
				const slug = postSlug(post._raw.flattenedPath);
				return `/${slug}`;
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
				const prefix = "src/content/";
				const stats = fs.statSync(prefix + sourceFilePath);
				const date = stats.mtime;
				return date;
			},
		},
	},
}));

function shikiCustom(): ShikiTransformer {
	return {
		name: "@vahor/skiki",
		pre(node) {
			node.properties.__raw_source = this.source;
		},
	};
}

const highlightPlugin = () => {
	return rehypePrettyCode({
		theme: {
			dark: "catppuccin-mocha",
			light: "catppuccin-latte",
		},
		defaultLang: "plaintext",
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerTwoslash({
				explicitTrigger: true,
			}),
			shikiCustom(),
		],
	});
};

export default makeSource({
	contentDirPath: "src/content",
	documentTypes: [Post],
	mdx: {
		rehypePlugins: [highlightPlugin, codeImport, rehypeSlug],
		remarkPlugins: [
			//	remarkCustomHeaderId,  FIXME: not working with ContentLayer
			remarkGfm,
		],
	},
});
