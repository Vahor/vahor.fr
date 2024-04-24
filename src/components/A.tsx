import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import type { HTMLProps } from "react";

export default function A({
	className,
	...props
}: LinkProps & HTMLProps<HTMLAnchorElement>) {
	return (
		<Link
			className={cn(
				"font-medium underline decoration-dashed has-[code]:no-underline text-primary hover:text-primary-light transition-colors duration-200 group inline-flex items-center gap-2 w-max",
				className,
			)}
			{...props}
		/>
	);
}
