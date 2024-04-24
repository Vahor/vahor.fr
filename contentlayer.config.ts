import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import codeImport from "remark-code-import";
import rehypeSlug from "rehype-slug";
import { defineNestedType } from "contentlayer2/source-files";
import {
	transformerNotationDiff,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
// import remarkCustomHeaderId from 'remark-custom-header-id';
import type { ShikiTransformer } from "shiki";
import * as fs from "node:fs";

const CoverProperties = defineNestedType(() => ({
	name: "CoverProperties",
	fields: {
		image: { type: "image", required: true },
		alt: { type: "string", required: false },
		size: { type: "enum", options: ["small", "large"], required: true },
	},
}));

const TocProperties = defineNestedType(() => ({
	name: "TocProperties",
	fields: {
		order: { type: "number", required: true },
	},
}));

const OGPProperties = defineNestedType(() => ({
	name: "OGPProperties",
	fields: {
		image: { type: "image", required: true },
	},
}));

const postSlug = (path: string) => {
	const withoutPrefix = path.split("posts/").splice(-1)[0];
	return withoutPrefix.split("blog/").splice(-1)[0];
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
		cover: { type: "nested", of: CoverProperties, required: true },
		og: { type: "nested", of: OGPProperties, required: false },
		toc: { type: "nested", of: TocProperties, required: false },
	},
	computedFields: {
		slug: {
			type: "string",
			resolve: (post) => postSlug(post._raw.flattenedPath),
		},
		url: {
			type: "string",
			resolve: (post) => `/blog/${postSlug(post._raw.flattenedPath)}`,
		},
		githubEditUrl: {
			type: "string",
			resolve: (post) => {
				const filePath = post._raw.sourceFilePath;
				return `https://github.com/vahor/vahor.fr/edit/main/src/posts/${filePath}`;
			},
		},
		coverUrl: {
			type: "string",
			resolve: (post) => {
				const relativeFilePath = post.cover.image.relativeFilePath;
				return relativeFilePath.replace(/^.*public\//, "/");
			},
		},
		ogImageUrl: {
			type: "string",
			resolve: (post) => {
				if (!post.og?.image) return "";
				const relativeFilePath = post.og.image.relativeFilePath;
				return relativeFilePath.replace(/^.*public\//, "/");
			},
		},
		blogType: {
			type: "string",
			resolve: (post) => {
				const slug = postSlug(post._raw.flattenedPath);
				if (slug.indexOf("/") === -1) return "blog";
				const firstSegment = slug.split("/")[0];
				return firstSegment;
			},
		},
		timeToRead: {
			type: "number",
			resolve: (post) => {
				const content = post.body.raw;
				const words = content.split(/\s+/).length;
				const minutes = words / 200;
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
		theme: "catppuccin-mocha",
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
