import { h } from "hastscript";
import { visit } from "unist-util-visit";

export function addCalloutComponent() {
	return (tree: any) => {
		visit(tree, (node: any) => {
			if (node.type === "containerDirective" || node.type === "leafDirective" || node.type === "textDirective") {
				node.attributes = node.attributes || {};
				node.attributes.type = node.attributes.type || node.name || "note";
				const data = node.data || {};
				data.hName = "callout";
				data.hProperties = h("callout", node.attributes || {}).properties;
				node.data = data;
			}
		});
	};
}
