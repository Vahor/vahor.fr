"use client";

import type { Post } from "contentlayer/generated";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export function TocLink({ post }: { post: Post }) {
	const pathname = usePathname();

	const active = post.url === pathname;

	return (
		<Link href={post.url}>
			<Button
				size="sm"
				disabled={active}
				className="w-full justify-start capitalize"
				variant="ghost"
			>
				{post.title}
			</Button>
		</Link>
	);
}
