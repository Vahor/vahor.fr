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
import type { ShikiTransformer } from "shiki";

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
	return path.split("blog/").splice(-1)[0];
};

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "**/*.mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		date: { type: "date", required: true },
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
				const slug = post._raw.flattenedPath;
				if (slug.indexOf("/") === -1) return "blog";
				const firstSegment = post._raw.flattenedPath.split("/", 2)[0];
				return firstSegment;
			},
		},
	},
}));

function shikiCustom(): ShikiTransformer {
	return {
		name: "@vahor/skiki",
		code(node) {
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
	contentDirPath: "src/posts",
	documentTypes: [Post],
	mdx: {
		rehypePlugins: [highlightPlugin, codeImport, rehypeSlug],
		remarkPlugins: [remarkGfm],
	},
});
