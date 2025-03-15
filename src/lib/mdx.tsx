import A from "@/components/A";
import Hr from "@/components/Hr";
import { UrlPreview } from "@/components/UrlPreview";
import { Wip } from "@/components/Wip";
import { Check, Info, Note, Tip, Warning } from "@/components/callout";
import { CodeBlock } from "@/components/code/code-block";
import { Toc } from "@/components/toc/Toc";
import { getNodeText } from "@/lib/getNodeText";
import { cn } from "@/lib/utils";
import { Link as IconLink } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";

const AnchorPermalink = ({ id, size }: { id?: string; size: string }) => {
	if (!id) return null;

	return (
		<a
			href={`#${id}`}
			aria-label={`${id} permalink`}
			className="hidden text-primary no-underline group-hover:inline-block"
		>
			<IconLink className={size} />
		</a>
	);
};

const MarkColor: React.FC<{ children: string; color: string }> = ({
	children,
	color,
}) => {
	return (
		<code className="not-prose relative rounded-lg bg-zinc-950 p-1.5 text-xs dark:bg-zinc-900">
			<mark data-highlighted-chars="" data-chars-id={color}>
				{children}
			</mark>
		</code>
	);
};

const mdxComponents: MDXComponents = {
	a: A,
	figure: ({ children, ...props }) => {
		const isCode = props["data-rehype-pretty-code-figure"] !== undefined;
		if (isCode) {
			const title = children.length > 1 ? getNodeText(children[0]) : "";
			const childrenToRender =
				children.length > 1 ? children.slice(1) : children;
			return (
				<CodeBlock {...props} filename={title}>
					{childrenToRender}
				</CodeBlock>
			);
		}
		return <figure {...props} />;
	},
	h1: ({ className, id, children, ...props }) => (
		<h1
			className={cn(
				"group mt-12 flex scroll-m-20 items-center gap-3 font-semibold text-4xl text-black dark:text-white",
				className,
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-6" />
		</h1>
	),
	h2: ({ className, id, children, ...props }) => (
		<h2
			className={cn(
				"group mt-12 flex scroll-m-20 items-center gap-2 pb-2 font-semibold text-3xl text-black tracking-tight first:mt-0 dark:text-white",
				className,
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-5" />
		</h2>
	),
	h3: ({ className, id, children, ...props }) => (
		<h3
			className={cn(
				"group mt-8 flex scroll-m-20 items-center gap-2 pb-2 font-medium text-black text-xl tracking-tight dark:text-white",
				className,
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-4" />
		</h3>
	),
	h4: ({ className, id, children, ...props }) => (
		<h4
			className={cn(
				"group mt-8 flex scroll-m-20 items-center gap-2 font-heading font-medium text-black text-lg tracking-tight dark:text-white",
				className,
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-4" />
		</h4>
	),
	h5: ({ className, id, children, ...props }) => (
		<h5
			className={cn(
				"group mt-8 flex scroll-m-20 items-center gap-2 font-semibold text-black text-lg tracking-tight dark:text-white",
				className,
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-4" />
		</h5>
	),
	p: ({ className, ...props }) => {
		const Comp = typeof props.children === "string" ? "p" : "div";
		return <Comp className={cn("not-first:mt-4", className)} {...props} />;
	},
	hr: Hr,
	Vimeo: ({ id, title, muted = true }) => (
		<div className="translate-z-0 larger-post-content mt-6 aspect-video overflow-hidden rounded-md">
			<iframe
				title={title}
				src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&vimeo_logo=0${muted ? "&muted=1" : ""
					}`}
				className="h-full w-full scale-x-[1.02] rounded-md"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	),
	Video: ({
		src,
		title,
		muted = true,
		autoplay = true,
		controls = false,
		loop = false,
		preload = "none",
		large = false,
	}) => {
		const cleanSrc = src.replace(/^.*public\//, "/");
		return (
			<div
				className={cn(
					"translate-z-0 mt-6 aspect-video rounded-md",
					large && "larger-content",
				)}
			>
				<video
					title={title}
					src={cleanSrc}
					controls={controls}
					className="mx-auto rounded-md"
					muted={muted}
					autoPlay={autoplay}
					playsInline
					loop={loop}
					preload={preload}
				/>
			</div>
		);
	},
	img: async ({ className, src = "", alt = "", width, height, ...props }) => {
		const cleanSrc = src.replace(/^.*public\//, "/");
		return (
			<figure className="my-6 text-center">
				<img
					className={cn("mx-auto rounded-2xl border object-cover", className)}
					src={cleanSrc}
					{...props}
					alt={alt}
				/>
				<figcaption className="mt-2 text-balance leading-5">{alt}</figcaption>
			</figure>
		);
	},

	// Higlight colors (same as in code.css)
	R: ({ children }) => <MarkColor color="r">{children}</MarkColor>,
	G: ({ children }) => <MarkColor color="g">{children}</MarkColor>,
	B: ({ children }) => <MarkColor color="b">{children}</MarkColor>,
	Y: ({ children }) => <MarkColor color="y">{children}</MarkColor>,

	callout: ({ type, ...props }) => {
		switch (type) {
			case "info":
				return <Info {...props} />;
			case "warning":
				return <Warning {...props} />;
			case "note":
				return <Note {...props} />;
			case "tip":
				return <Tip {...props} />;
			case "check":
				return <Check {...props} />;
			default:
				throw new Error(`Unknown callout type: ${type}`);
		}
	},

	Toc,
	UrlPreview,
	Wip,
};

interface MdxProps {
	code: string;
}

export const Mdx = ({ code }: MdxProps) => {
	const MDXContent = useMDXComponent(code);
	return <MDXContent components={mdxComponents} />;
};
