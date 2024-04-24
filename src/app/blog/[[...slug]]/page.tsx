import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";
import "@/app/code.css";
import "@shikijs/twoslash/style-rich.css";
import { absolutePath } from "@/lib/utils";
import { Mdx } from "@/lib/mdx";
import Image from "next/image";
import { fr } from "date-fns/locale";
import CommentSection from "./comments";
import { JsonLd } from "@/components/jsonld/profile-page";
import { articlePage } from "@/lib/jsonld";
import { Calendar, Clock, Pencil } from "lucide-react";
import Link from "next/link";
import Hr from "@/components/Hr";

export const generateStaticParams = async () =>
	allPosts.map((post) => ({ slug: post.slug.split("/") }));

interface PageProps {
	params: { slug: string[] };
}

const getPost = ({ params }: PageProps) => {
	const slug = params.slug.join("/");
	return allPosts.find((post) => post.slug === slug);
};

export const generateMetadata = async (
	props: PageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const post = getPost(props);
	if (!post) notFound();

	const parentMetadata = await parent;
	return {
		title: post.title,
		description: post.description,
		openGraph: {
			...parentMetadata.openGraph,
			type: "article",
			url: absolutePath(post.url),
			images: post.ogImageUrl || parentMetadata.openGraph?.images,
		},
		twitter: {
			...parentMetadata.twitter,
			// @ts-expect-error weird typing
			card: post.ogImageUrl
				? "summary_large_image"
				: parentMetadata.twitter?.card,
			images: post.ogImageUrl || parentMetadata.twitter?.images,
		},
	};
};

const Tag = ({ tag, href }: { tag: string; href: string }) => (
	<Link
		href={href}
		className="text-xs bg-background-light font-mono capitalize text-white px-2 py-1 rounded-md"
	>
		{tag}
	</Link>
);

export default async function PostPage(props: PageProps) {
	const post = getPost(props);
	if (!post) notFound();

	return (
		<main className="container py-16 mx-auto post-content" id="skip-nav">
			<JsonLd
				jsonLd={articlePage({
					headline: post.title,
					datePublished: post.datePublished,
					dateModified: post.dateModified,
					image: post.ogImageUrl,
					description: post.description,
				})}
			/>

			<header className="mb-10 text-center flex flex-col gap-6">
				<h1 className="text-4xl font-semibold text-white text-balance">
					{post.title}
				</h1>
				<p className="mx-4">{post.description}</p>
				<div className="flex flex-row items-center gap-6 justify-center font-mono">
					<div className="flex flex-row items-center gap-2">
						<Clock className="size-4" />
						<span className="text-xs">{post.timeToRead} min de lecture</span>
					</div>
					<div className="flex flex-row items-center gap-2">
						<Calendar className="size-4" />
						<time dateTime={post.datePublished} className="text-xs">
							{format(parseISO(post.datePublished), "d MMMM yyyy", {
								locale: fr,
							})}
						</time>
					</div>
				</div>
				<div
					className="flex flex-row items-center gap-2 justify-center"
					id="tags"
				>
					<Tag tag={post.blogType} href={`/tag/${post.blogType}`} />
					{post.tags?.map((tag) => (
						<Tag key={tag} tag={tag} href={`/tag/${tag}`} />
					))}
				</div>
				<div className="larger-post-content block mt-8">
					<Image
						className="rounded-md mx-auto"
						src={post.coverUrl}
						alt={post.cover.alt ?? post.title}
						width={600}
						height={600 / post.cover.image.aspectRatio}
						blurDataURL={post.cover.image.blurhashDataUrl}
					/>
				</div>
			</header>

			<article className="text-pretty">
				<Mdx code={post.body.code} />
			</article>

			<Hr />

			<footer className="mb-16">
				<Link
					href={post.githubEditUrl}
					prefetch={false}
					className="flex flex-row items-center gap-2 font-mono text-sm hover:text-primary w-max"
				>
					<Pencil className="size-3" />
					<span>Suggérer une modification</span>
				</Link>
			</footer>

			<section id="comments" className="larger-post-content">
				<CommentSection />
			</section>
		</main>
	);
}
