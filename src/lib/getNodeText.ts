// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const getNodeText = (node: any): string => {
	if (node.props?.dangerouslySetInnerHTML) {
		return getNodeTextFromHtml(node.props.dangerouslySetInnerHTML.__html);
	}

	if (["string", "number"].includes(typeof node)) {
		// Convert number into string
		return node.toString();
	}

	if (Array.isArray(node)) {
		return node.map(getNodeText).join("");
	}

	if (typeof node === "object" && node?.props?.children) {
		return getNodeText(node.props.children);
	}

	return "";
};

export const getNodeTextFromHtml = (node: string): string => {
	if (typeof DOMParser === "undefined") return "";
	const parse = new DOMParser();
	const doc = parse.parseFromString(node, "text/html");
	return doc.body.textContent || "";
};
