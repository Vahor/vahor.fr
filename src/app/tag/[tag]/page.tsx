import { Button } from "@/components/ui/button";
import { allPosts } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";


const allTags = Array.from(new Set(allPosts.flatMap((post) => post.fullTags))).toSorted((a, b) => b.localeCompare(a));

export const generateStaticParams = async () => {
	return allTags.map((tag) => ({ tag }));
};

interface PageProps {
	params: { tag: string };
}


export default function TagPage({ params }: PageProps) {
	if (!allTags.includes(params.tag)) notFound();

	const filteredPosts = allPosts.filter((post) => post.fullTags.includes(params.tag));

	return (
		<div className="grid sm:grid-cols-4 gap-4 container">
			<aside className="flex gap-2 flex-col col-span-4 sm:col-span-1 max-h-64 sm:max-h-none overflow-y-auto">
				{allTags.map((tag) => {
					const active = tag === params.tag;
					return (
						<Link key={tag} href={`/tag/${tag}`} className="w-full sm:w-max ">
							<Button disabled={active} className="capitalize w-full justify-start" variant="ghost">
								{tag}
							</Button>
						</Link>
					);
				})}
			</aside>

			<main className="col-span-4 sm:col-span-3 px-3">
				<h1 className="text-3xl font-semibold text-black dark:text-white capitalize">{params.tag}</h1>
				<ul>
					{filteredPosts.map((post) => (
						<li key={post.url}>
							<Link href={post.url}>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}

