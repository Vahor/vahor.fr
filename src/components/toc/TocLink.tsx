"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import type { Post } from "contentlayer/generated";
import { usePathname } from "next/navigation";

export function TocLink({ post }: { post: Post }) {
	const pathname = usePathname();

	const active = post.url === pathname;

	return (
		<Link href={post.url}>
			<Button
				size="sm"
				disabled={active}
				className="capitalize w-full justify-start"
				variant="ghost">
				{post.title}
			</Button>
		</Link>
	)
}
