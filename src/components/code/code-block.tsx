"use client";
import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, type ReactElement, useRef } from "react";
import { CopyToClipboardButton } from "./clipboard-button";
import { CodeWrapButton } from "./code-wrap-button";

function getNodeText(node: any): string {
	if (["string", "number"].includes(typeof node)) return node.toString();
	if (Array.isArray(node)) return node.map(getNodeText).join("");
	if (typeof node === "object" && node?.props?.children) return getNodeText(node.props.children);
	return "";
}

export const CodeBlock = function CodeBlock({ filename, children, className, actions = true, ...props }: { filename?: string; children: any; actions?: boolean; } & ComponentPropsWithoutRef<"div">) {
	const Button = (p: Partial<ComponentPropsWithoutRef<typeof CopyToClipboardButton>>) => <CopyToClipboardButton textToCopy={getNodeText(children)} {...p} />;
	const wrapperRef = useRef<HTMLDivElement>(null);

	let header: ReactElement | null = null;
	let contentChildren = children;
	if (Array.isArray(children)) { header = children[1] as ReactElement | null; contentChildren = children[0]; }

	return (
		<div className={clsx("relative my-3 h-full overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900", "group", className)} data-code-block ref={wrapperRef} {...props}>
			{filename && <div className="flex h-11 items-center justify-between rounded-t-2xl border-border border-b bg-zinc-100 dark:bg-zinc-800 px-3 pr-5"><div className="mr-auto font-semibold dark:text-white text-xs">{filename}</div>{actions && <div className="flex items-center gap-2 text-zinc-500"><CodeWrapButton wrapperRef={wrapperRef} /><Button /></div>}</div>}
			{header && <div className="flex h-9 items-center gap-2 border-zinc-800 border-b bg-zinc-900 px-4 text-white">{header}</div>}
			<div className="relative h-full overflow-hidden" style={{ fontVariantLigatures: "none" }}>
				{!filename && actions && <div className="absolute top-[16px] right-4 z-[1] flex items-center gap-2 text-zinc-500" data-actions><CodeWrapButton wrapperRef={wrapperRef} /><Button /></div>}
				{contentChildren}
			</div>
		</div>
	);
};
