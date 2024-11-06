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
		<div className="container grid gap-4 pb-4 md:grid-cols-4">
			<nav className="col-span-4 flex max-h-64 flex-col gap-2 overflow-y-auto md:col-span-1 md:max-h-none">
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
				<ul className="mt-8 space-y-4 divide-y">
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
		<div className="group mt-4 space-y-1">
			<div className="flex justify-between gap-2">
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
