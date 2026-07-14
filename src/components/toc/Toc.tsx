import { getAllPosts } from "@/lib/posts";
import { TocLink } from "./TocLink";

interface TocProps { group: string; }

export async function Toc({ group }: TocProps) {
	const allPosts = await getAllPosts();
	const matchingPosts = allPosts.filter((post) => post.data.toc && post.data.toc.group === group).toSorted((a, b) => (a.data.toc?.order ?? 0) - (b.data.toc?.order ?? 0));
	return (
		<div className="border-y py-4">
			<nav className="space-y-2">
				<h2 className="font-semibold text-lg">Pages sur le même sujet</h2>
				<ul className="space-y-1">
					{matchingPosts.map((post) => <li key={post.id} className="list-none"><TocLink post={post} /></li>)}
				</ul>
			</nav>
		</div>
	);
}
