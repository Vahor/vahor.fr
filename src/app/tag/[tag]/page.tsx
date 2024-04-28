import { Button } from "@/components/ui/button";
import { type Post, allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

const allTags = Array.from(
	new Set(allPosts.flatMap((post) => post.fullTags)),
).toSorted((a, b) => b.localeCompare(a));

export const generateStaticParams = async () => {
	return allTags.map((tag) => ({ tag }));
};

interface PageProps {
	params: { tag: string };
}

export default function TagPage({ params }: PageProps) {
	if (!allTags.includes(params.tag)) notFound();

	const filteredPosts = allPosts
		.filter((post) => post.fullTags.includes(params.tag))
		.toSorted((a, b) => b.datePublished.localeCompare(a.datePublished));

	return (
		<div className="grid sm:grid-cols-4 gap-4 container">
			<nav className="flex gap-2 flex-col col-span-4 sm:col-span-1 max-h-64 sm:max-h-none overflow-y-auto">
				{allTags.map((tag) => {
					const active = tag === params.tag;
					return (
						<Link key={tag} href={`/tag/${tag}`} className="w-full sm:w-max ">
							<Button
								disabled={active}
								className="capitalize w-full justify-start"
								variant="ghost"
							>
								{tag}
							</Button>
						</Link>
					);
				})}
			</nav>

			<main className="col-span-4 sm:col-span-3 px-3">
				<h1 className="text-3xl font-semibold text-black dark:text-white capitalize">
					{params.tag}
				</h1>
				<ul className="divide-y space-y-4">
					{filteredPosts.map((post) => (
						<li key={post.url}>
							<PostEntry post={post} />
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}

const PostEntry = ({ post }: { post: Post }) => {
	return (
		<div className="mt-4 space-y-1">
			<div className="flex gap-2 justify-between">
				<Link href={post.url} className="text-black dark:text-white">
					<h2>{post.title}</h2>
				</Link>
				<time
					dateTime={post.datePublished}
					className="text-muted-foreground text-sm"
				>
					{format(parseISO(post.datePublished), "d MMMM yyyy", {
						locale: fr,
					})}
				</time>
			</div>
			<p>{post.description}</p>
		</div>
	);
};
