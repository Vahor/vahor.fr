import { Button } from "@/components/ui/button";
import { type Post, allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

const ALL_TAG = "all";

const allTags = Array.from(
	new Set(allPosts.flatMap((post) => post.fullTags)),
).toSorted((a, b) => b.localeCompare(a));
allTags.unshift(ALL_TAG);

export const generateStaticParams = async () => {
	return allTags.map((tag) => ({ tag }));
};

interface PageProps {
	params: Promise<{ tag: string }>;
}

export default async function TagPage(props: PageProps) {
	const params = await props.params;
	if (!allTags.includes(params.tag)) notFound();

	const filteredPosts = allPosts
		.filter(
			(post) => params.tag === ALL_TAG || post.fullTags.includes(params.tag),
		)
		.toSorted((a, b) => b.datePublished.localeCompare(a.datePublished));

	return (
		<div className="grid md:grid-cols-4 gap-4 container">
			<nav className="flex gap-2 flex-col col-span-4 md:col-span-1 max-h-64 md:max-h-none overflow-y-auto">
				{allTags.map((tag) => {
					const active = tag === params.tag;
					return (
						<Link key={tag} href={`/tag/${tag}`} className="w-full md:w-max">
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

			<hr className="col-span-4 md:hidden" />

			<main className="col-span-4 md:col-span-3 px-4 md:px-0">
				<h1 className="text-3xl font-semibold text-black dark:text-white capitalize">
					{params.tag}
				</h1>
				<ul className="divide-y space-y-4 mt-8">
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
		<div className="mt-4 space-y-1 group">
			<div className="flex gap-2 justify-between">
				<Link
					href={post.url}
					className="group-hover:text-black group-hover:dark:text-white"
				>
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
			<p className="text-muted-foreground">{post.description}</p>
		</div>
	);
};
