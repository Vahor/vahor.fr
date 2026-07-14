import { Link as IconLink } from "lucide-react";
import { cn } from "@/lib/utils";

const AnchorPermalink = ({ id, size }: { id?: string; size: string }) => {
	if (!id) return null;
	return <a href={`#${id}`} aria-label={`${id} permalink`} className="invisible text-primary no-underline group-hover:visible"><IconLink className={size} /></a>;
};

function H1({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h1 className={cn("group mt-12 flex scroll-m-20 items-center gap-3 font-semibold text-4xl text-black dark:text-white", className)} id={id} {...props}>{children}<AnchorPermalink id={id} size="size-6" /></h1>;
}
function H2({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h2 className={cn("group mt-12 flex scroll-m-20 items-center gap-2 pb-2 font-semibold text-3xl text-black tracking-tight first:mt-0 dark:text-white", className)} id={id} {...props}>{children}<AnchorPermalink id={id} size="size-5" /></h2>;
}
function H3({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h3 className={cn("group mt-8 flex scroll-m-20 items-center gap-2 pb-2 font-medium text-black text-xl tracking-tight dark:text-white", className)} id={id} {...props}>{children}<AnchorPermalink id={id} size="size-4" /></h3>;
}
function H4({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h4 className={cn("group mt-8 flex scroll-m-20 items-center gap-2 font-heading font-medium text-black text-lg tracking-tight dark:text-white", className)} id={id} {...props}>{children}<AnchorPermalink id={id} size="size-4" /></h4>;
}
function H5({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h5 className={cn("group mt-8 flex scroll-m-20 items-center gap-2 font-semibold text-black text-lg tracking-tight dark:text-white", className)} id={id} {...props}>{children}<AnchorPermalink id={id} size="size-4" /></h5>;
}

const MarkColor: React.FC<{ children: string; color: string }> = ({ children, color }) => (
	<code className="not-prose relative rounded-lg bg-zinc-950 p-1.5 text-xs dark:bg-zinc-900">
		<mark data-highlighted-chars="" data-chars-id={color}>{children}</mark>
	</code>
);

export const mdxComponents = {
	h1: H1, h2: H2, h3: H3, h4: H4, h5: H5,
	R: ({ children }: { children: string }) => <MarkColor color="r">{children}</MarkColor>,
	G: ({ children }: { children: string }) => <MarkColor color="g">{children}</MarkColor>,
	B: ({ children }: { children: string }) => <MarkColor color="b">{children}</MarkColor>,
	Y: ({ children }: { children: string }) => <MarkColor color="y">{children}</MarkColor>,
};
