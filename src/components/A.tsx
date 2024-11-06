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
				"group inline-flex w-max items-center gap-2 font-medium text-primary underline decoration-dashed transition-colors duration-200 hover:text-primary has-[code]:no-underline",
				className,
			)}
			{...props}
		/>
	);
}
