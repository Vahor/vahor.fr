import type { CollectionEntry } from "astro:content";
import { urlFromEntry } from "@/lib/posts";
import { Button } from "../ui/button";

export function TocLink({ post }: { post: CollectionEntry<"posts"> }) {
	const pathname =
		typeof window !== "undefined" ? window.location.pathname : "";
	const url = urlFromEntry(post);

	return (
		<a href={url}>
			<Button
				size="sm"
				disabled={url === pathname}
				className="w-full justify-start capitalize"
				variant="ghost"
			>
				{post.data.title}
			</Button>
		</a>
	);
}
