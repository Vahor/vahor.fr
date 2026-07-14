import { cn } from "@/lib/utils";
export default function A({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isHash = href?.startsWith("#");
	const isExternal = href?.startsWith("http");
	return <a href={isExternal ? `${href}?ref=vahor.fr` : href} target={!isHash && isExternal ? "_blank" : undefined} rel={!isHash && isExternal ? "noopener noreferrer" : undefined} className={cn("group inline-flex w-max items-center gap-2 font-medium text-primary underline decoration-dashed transition-colors duration-200 hover:text-primary has-[code]:no-underline", className)} {...props} />;
}
