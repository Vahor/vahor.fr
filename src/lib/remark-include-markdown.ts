import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export function includeMarkdown() {
	return (tree: any, file: VFile) => {
		visit(tree, (node: any) => {
			try {
				if (node.type === "code") return;
				const targetNode = node.children?.[0] ?? node;
				const includeMatch = targetNode.value?.match(
					/^@include\s['"](.*)['"]$/,
				);
				if (!includeMatch) return;
				let filePath = includeMatch[1];
				const isFake = filePath.startsWith("fake:");
				if (isFake) {
					targetNode.value = `@include "${filePath.slice(5)}"`;
					return;
				}
				const isRaw = filePath.startsWith("raw:");
				if (isRaw) filePath = filePath.slice(4);
				const dirname = file.dirname ?? file.cwd ?? ".";
				const includePath = path.join(dirname, filePath);
				const contents = fs.readFileSync(includePath, "utf8");
				const extension = includePath.match(/\.(\w+)$/)?.[1];
				if (extension === "mdx") {
					const processor = remark();
					const ast = processor.parse(contents);
					const result: any = processor.runSync(ast, contents);
					node.type = "root";
					node.children = result.children;
					node.position = result.position;
					return;
				}
				if (isRaw) {
					targetNode.value = contents.replace(/\n$/, "");
				} else {
					node.type = "code";
					node.lang = extension;
					node.value = contents.replace(/\n$/, "");
				}
			} catch (err) {
				console.error(err);
			}
		});
	};
}
