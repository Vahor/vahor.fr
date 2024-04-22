import type { MDXComponents } from "mdx/types";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UrlPreview } from "@/components/UrlPreview";
import { Callout } from "@/components/Callout";
import { Link as IconLink } from "lucide-react";

// Based on Tailwind prose css: https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
// And shadcn

const AnchorPermalink = ({ id, size }: { id?: string, size: string }) => {
	if (!id) return null;

	return (
		<a
			href={`#${id}`}
			aria-label={`${id} permalink`}
			className="no-underline hidden group-hover:inline-block text-primary"
		>
			<IconLink className={size} />
		</a>
	);
};

const mdxComponents: MDXComponents = {
	a: ({ href, children, className }) => (
		<Link href={href as string}
			className={cn("font-medium underline underline-offset-4 has-[code]:no-underline", className)}
		>
			{children}
		</Link>
	),
	code: ({ className, ...props }) => (
		<code
			className={cn(
				"relative rounded py-[0.2rem] font-mono text-sm whitespace-nowrap",
				className
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }) => {
		// @ts-ignore
		const { rawString, ...rest } = props;
		return (
			<pre
				className={cn("rounded-lg py-4 my-4 border group/pre", className)}
				{...rest} />
		);
	},
	h1: ({ className, id, children, ...props }) => (
		<h1 className={cn("text-4xl mt-2 scroll-m-20 font-bold group flex gap-3 items-center", className)} id={id} {...props} >
			{children}
			<AnchorPermalink id={id} size="size-6" />
		</h1>
	),
	h2: ({ className, id, children, ...props }) => (
		<h2
			className={cn(
				"mt-8 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 flex items-center gap-2 group",
				className
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
				"mt-6 scroll-m-20 text-xl pb-2 font-semibold tracking-tight flex items-center gap-2 group",
				className
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
				"font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight flex items-center gap-2 group",
				className
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
				"mt-8 scroll-m-20 text-lg font-semibold tracking-tight flex items-center gap-2 group",
				className
			)}
			id={id}
			{...props}
		>
			{children}
			<AnchorPermalink id={id} size="size-4" />
		</h5>
	),
	p: ({ className, ...props }) => (
		<p
			className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }) => (
		<ul className={cn("mt-4 pl-4 md:pl-8 list-disc", className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol className={cn("mt-4 pl-4 md:pl-8 list-decimal", className)} {...props} />
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<li className={cn("mt-2 pl-1 md:pl-2", className)} {...props} />
	),
	hr: ({ className }) => <hr className={cn("my-4 md:my-8", className)} />,
	Vimeo: ({ id, title, muted = true }) => (
		<div className="aspect-video rounded-md overflow-hidden mt-6 translate-z-0 md:-mx-8">
			<iframe
				title={title}
				src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&vimeo_logo=0${muted ? "&muted=1" : ""}`}
				className="w-full h-full rounded-md scale-x-[1.02]"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	),
	img: ({
		className,
		src = "",
		alt = "",
		...props
	}) => {
		const cleanSrc = src.replace(/^.*public\//, "/");
		return (
			<img
				className={cn("rounded-md", className)}
				src={cleanSrc}
				{...props}
				alt={alt}
			/>
		);
	},
	UrlPreview,
	Callout
};

interface MdxProps {
	code: string;
}

export const Mdx = ({ code }: MdxProps) => {
	const MDXContent = useMDXComponent(code);
	return <MDXContent components={mdxComponents} />;
};
