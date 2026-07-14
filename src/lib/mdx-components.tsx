import A from "@/components/A";
import { CodeBlock } from "@/components/code/code-block";
import { mdxComponents as baseMdxComponents } from "@/components/mdx";
import Hr from "@/components/Hr";
import { Check, Info, Note, Tip, Warning } from "@/components/callout";
import { Toc } from "@/components/toc/Toc";
import { UrlPreview } from "@/components/UrlPreview";
import { Wip } from "@/components/Wip";
import { getNodeText } from "@/lib/getNodeText";
import { cn } from "@/lib/utils";

export const mdxComponents = {
	...baseMdxComponents,
	a: A,
	hr: Hr,
	figure: ({ children, ...props }: any) => {
		const isCode = props["data-rehype-pretty-code-figure"] !== undefined;
		if (isCode) {
			const title = children?.length > 1 ? getNodeText(children[0]) : "";
			const childrenToRender = children?.length > 1 ? children.slice(1) : children;
			return <CodeBlock {...props} filename={title}>{childrenToRender}</CodeBlock>;
		}
		return <figure {...props}>{children}</figure>;
	},
	p: ({ className, ...props }: any) => {
		const Comp = typeof props.children === "string" ? "p" : "div";
		return <Comp className={cn("not-first:mt-4", className)} {...props} />;
	},
	Vimeo: ({ id, title, muted = true }: { id: string; title?: string; muted?: boolean }) => (
		<div className="translate-z-0 larger-post-content mt-6 aspect-video overflow-hidden rounded-md">
			<iframe title={title} src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&vimeo_logo=0${muted ? "&muted=1" : ""}`} className="h-full w-full scale-x-[1.02] rounded-md" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
		</div>
	),
	Video: ({ src, title, muted = true, autoplay = true, controls = false, loop = false, preload = "none", large = false }: any) => {
		const cleanSrc = src.replace(/^.*public\//, "/");
		return (
			<div className={cn("translate-z-0 mt-6 aspect-video rounded-md", large && "larger-content")}>
				<video title={title} src={cleanSrc} controls={controls} className="mx-auto rounded-md" muted={muted} autoPlay={autoplay} playsInline loop={loop} preload={preload} />
			</div>
		);
	},
	img: ({ className, src = "", alt = "", ...props }: any) => {
		const cleanSrc = src.replace(/^.*public\//, "/");
		return (
			<figure className="my-6 text-center">
				<img className={cn("mx-auto rounded-2xl border object-cover", className)} src={cleanSrc} {...props} alt={alt} />
				{alt && <figcaption className="mt-2 text-balance leading-5">{alt}</figcaption>}
			</figure>
		);
	},
	callout: ({ type, ...props }: any) => {
		switch (type) {
			case "info": return <Info {...props} />;
			case "warning": return <Warning {...props} />;
			case "note": return <Note {...props} />;
			case "tip": return <Tip {...props} />;
			case "check": return <Check {...props} />;
			default: throw new Error(`Unknown callout type: ${type}`);
		}
	},
	Toc,
	UrlPreview,
	Wip,
};
