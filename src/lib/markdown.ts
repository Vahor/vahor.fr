import * as fs from "node:fs";
import path from "node:path";
import type { RehypePlugins, RemarkPlugins } from "@astrojs/markdown-remark";
import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerRenderWhitespace,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import rehypeD2 from "@vahor/rehype-d2";
import type { Element } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import type { Literal, Node, Parent } from "unist";
import { SKIP, visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { addCalloutComponent } from "./add-callout-component";
import { shikiOptions } from "./shiki";

type IncludeNode = Node & Partial<Parent & Literal> & { lang?: string };

function publicImages() {
	return (tree: Node) => {
		visit(tree, "image", (node: Node & { url: string }) => {
			node.url = node.url.replace(/^.*public\//, "/");
		});
	};
}

function includeMarkdown() {
	return (tree: Node, file: VFile) => {
		visit(tree, (node: IncludeNode) => {
			const target = (node.children?.[0] ?? node) as IncludeNode;
			if (typeof target.value !== "string") return;
			const match = target.value.match(/^@include\s['"](.*)['"]$/);
			if (!match) return;
			let filePath = match[1];
			if (filePath.startsWith("fake:")) {
				target.value = `@include "${filePath.slice(5)}"`;
				return SKIP;
			}
			const isRaw = filePath.startsWith("raw:");
			if (isRaw) filePath = filePath.slice(4);
			const includePath = path.resolve(file.dirname ?? process.cwd(), filePath);
			const contents = fs.readFileSync(includePath, "utf8");
			const extension = path.extname(includePath).slice(1);
			if (extension === "mdx") {
				const processor = remark().use(remarkPlugins as PluggableList);
				const includedFile = { path: includePath, value: contents };
				const result = processor.runSync(
					processor.parse(includedFile),
					includedFile,
				);
				node.type = "root";
				node.children = (result as Parent).children;
				delete node.value;
			} else if (isRaw) {
				target.value = contents.replace(/\n$/, "");
			} else {
				node.type = "code";
				node.lang = extension;
				node.value = contents.replace(/\n$/, "");
				delete node.children;
			}
		});
	};
}

const highlightPlugin = () =>
	rehypePrettyCode({
		...shikiOptions,
		transformers: [
			transformerRenderWhitespace(),
			transformerNotationDiff(),
			transformerNotationErrorLevel(),
			transformerNotationFocus(),
			transformerTwoslash({ explicitTrigger: true }),
		],
	});

export const remarkPlugins: RemarkPlugins = [
	remarkGfm,
	remarkDirective,
	addCalloutComponent,
	includeMarkdown,
	publicImages,
];
export const rehypePlugins: RehypePlugins = [
	// Astro MDX moves fence metadata to `metastring`; D2 still reads data.meta.
	() => (tree) => {
		visit(tree, "element", (node: Element) => {
			if (
				node.tagName === "code" &&
				typeof node.properties.metastring === "string"
			) {
				node.data = { ...node.data, meta: node.properties.metastring };
			}
		});
	},
	[
		rehypeD2,
		{
			cwd: "./public/blog/d2/imports",
			defaultThemes: ["light", "dark"],
			globalImports: {
				light: [{ filename: "light.d2", mode: "prepend" }, "config.d2"],
				dark: [
					{ filename: "light.d2", mode: "prepend" },
					{ filename: "dark.d2", mode: "prepend" },
					"config.d2",
				],
			},
		},
	],
	highlightPlugin,
	rehypeSlug,
];

export const mdxOptions = { remarkPlugins, rehypePlugins };
