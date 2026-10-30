import { h } from "hastscript";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

export function addCalloutComponent() {
	return (tree: Node) => {
		visit(
			tree,
			(
				node: Node & {
					name?: string;
					attributes?: Record<string, string>;
					data?: {
						hName?: string;
						hProperties?: ReturnType<typeof h>["properties"];
					};
				},
			) => {
				const supportedTypes = ["info", "warning", "note", "tip", "check"];
				const type = node.attributes?.type ?? node.name;
				if (
					!node.name ||
					(node.name !== "callout" && !supportedTypes.includes(node.name)) ||
					!type ||
					!supportedTypes.includes(type)
				)
					return;
				if (
					node.type === "containerDirective" ||
					node.type === "leafDirective" ||
					node.type === "textDirective"
				) {
					const data = node.data || {};
					const tagName = "callout";

					node.attributes = node.attributes || {};
					node.attributes.type = type;
					data.hName = tagName;
					data.hProperties = h(tagName, node.attributes || {}).properties;
					node.data = data;
				}
			},
		);
	};
}
