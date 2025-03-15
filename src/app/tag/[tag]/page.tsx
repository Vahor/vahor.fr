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
		<div className="container relative grid gap-4 pb-8 md:grid-cols-4 md:pb-16">
			<nav className="top-0 col-span-4 flex max-h-64 flex-col gap-2 overflow-y-auto md:sticky md:col-span-1 md:h-max md:max-h-none">
				{allTags.map((tag) => {
					const active = tag === params.tag;
					return (
						<Link key={tag} href={`/tag/${tag}`} className="w-full md:w-max">
							<Button
								disabled={active}
								className="w-full justify-start capitalize"
								variant="ghost"
							>
								{tag}
							</Button>
						</Link>
					);
				})}
			</nav>

			<hr className="col-span-4 md:hidden" />

			<main className="col-span-4 px-4 md:col-span-3 md:px-0">
				<h1 className="font-semibold text-3xl text-black capitalize dark:text-white">
					{params.tag}
				</h1>
				<ul className="mt-8 flex flex-col">
					{filteredPosts.map((post) => (
						<li
							key={post.url}
							className="list-none border-b px-0 py-4 first:pt-0 last:border-none"
						>
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
		<div className="group flex justify-between gap-2">
			<div>
				<Link
					href={post.url}
					className="group-hover:text-black dark:group-hover:text-white"
				>
					<h2 className="my-0">{post.title}</h2>
				</Link>
				<p className="text-muted-foreground text-sm">{post.description}</p>
			</div>
			<div className="text-right text-muted-foreground text-sm">
				<time dateTime={post.datePublished}>
					{format(parseISO(post.datePublished), "d MMMM yyyy", {
						locale: fr,
					})}
				</time>
				<p className="text-xs">{post.timeToRead} min de lecture</p>
			</div>
		</div>
	);
};
