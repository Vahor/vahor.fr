import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import codeImport from "remark-code-import";
import rehypeSlug from "rehype-slug";
import { defineNestedType } from "contentlayer2/source-files";
import { transformerNotationDiff, transformerRenderWhitespace, transformerMetaWordHighlight } from '@shikijs/transformers';
import {
	transformerTwoslash
} from '@shikijs/twoslash'

const CoverProperties = defineNestedType(() => ({
	name: "CoverProperties",
	fields: {
		image: { type: "image", required: true },
		alt: { type: "string", required: false },
		size: { type: "enum", options: ["small", "large"], required: true },
	},
}));

const postSlug = (path: string) => {
	return path.split("blog/").splice(-1)[0];
}

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
		blogType: {
			type: "string",
			resolve: (post) => {
				const slug = post._raw.flattenedPath;
				if (slug.indexOf("/") === -1) return "blog";
				const firstSegment = post._raw.flattenedPath.split("/", 2)[0];
				return firstSegment;
			}
		},
	},
}));

const highlightPlugin = () => {
	return rehypePrettyCode({
		theme: "catppuccin-mocha",
		defaultLang: "plaintext",
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			// transformerMetaWordHighlight(),
			transformerTwoslash({
				explicitTrigger: true,
			})
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
