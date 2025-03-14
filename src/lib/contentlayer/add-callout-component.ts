import { h } from "hastscript";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

export function addCalloutComponent() {
	return (tree: Node) => {
		visit(tree, (node: Node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				const data = node.data || {};
				const tagName = "callout";

				node.attributes = node.attributes || {};
				node.attributes.type = node.attributes.type || node.name || "note";
				data.hName = tagName;
				data.hProperties = h(tagName, node.attributes || {}).properties;
				node.data = data;
			}
		});
	};
}
