"use client";

import { clsx } from "clsx";
import {
	type ComponentPropsWithoutRef,
	type ReactElement,
	useRef,
} from "react";
import { CopyToClipboardButton } from "@/components/code/clipboard-button";
import { CodeWrapButton } from "@/components/code/code-wrap-button";
import { getNodeText } from "@/lib/getNodeText";

export interface CodeBlockPropsBase {
	filename?: string;
	children: OneOrMany<ReactElement | null>;
	allowFullScreen?: boolean;
	actions?: boolean;
}

export type CodeBlockProps = CodeBlockPropsBase &
	Omit<ComponentPropsWithoutRef<"div">, keyof CodeBlockPropsBase>;

export const CodeBlock = function CodeBlock({
	filename,
	children,
	className,
	actions = true,
	...props
}: CodeBlockProps) {
	const Button = (
		props: Partial<ComponentPropsWithoutRef<typeof CopyToClipboardButton>>,
	) => <CopyToClipboardButton textToCopy={getNodeText(children)} {...props} />;

	const wrapperRef = useRef<HTMLDivElement>(null);

	// TODO: use captions
	let header: ReactElement | null = null;
	if (Array.isArray(children)) {
		header = Array.isArray(children) ? children[1] : children;
		children = children[0];
	}

	return (
		<div
			className={clsx(
				"relative my-3 h-full overflow-hidden rounded-2xl bg-zinc-900",
				"dark",
				"group",
				className,
			)}
			data-code-block
			ref={wrapperRef}
			{...props}
		>
			{filename && (
				<CodeTabBar filename={filename}>
					{actions ? (
						<>
							<CodeWrapButton wrapperRef={wrapperRef} />
							<Button />
						</>
					) : null}
				</CodeTabBar>
			)}

			{header && <CodeHeader>{header}</CodeHeader>}

			<div
				className="relative h-full overflow-hidden"
				style={{ fontVariantLigatures: "none" }}
			>
				{!filename && actions && (
					<div
						className="absolute top-[16px] right-4 z-[1] flex items-center gap-2 text-zinc-500"
						data-actions
					>
						<CodeWrapButton wrapperRef={wrapperRef} />
						<Button />
					</div>
				)}

				{children}
			</div>
		</div>
	);
};

function CodeHeader({ children }: { children: ReactElement }) {
	return (
		<div className="flex h-9 items-center gap-2 border-zinc-800 border-b bg-zinc-900 px-4 text-white">
			{children}
		</div>
	);
}

function CodeTabBar({
	filename,
	children,
}: {
	filename: string;
	children?: OneOrMany<ReactElement | null>;
}) {
	return (
		<div className="flex h-11 items-center justify-between rounded-t-2xl border-zinc-800 border-b bg-zinc-800 px-3 pr-5">
			<div className="mr-auto font-semibold text-white text-xs">{filename}</div>
			{children && (
				<div className="flex items-center gap-2 text-zinc-500">{children}</div>
			)}
		</div>
	);
}
