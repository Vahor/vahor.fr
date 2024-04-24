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

export default async function PostPage(props: PageProps) {
	const post = getPost(props);
	if (!post) notFound();

	return (
		<article className="container py-8 mx-auto post-content" id="skip-nav">
			<JsonLd
				jsonLd={articlePage({
					headline: post.title,
					datePublished: post.datePublished,
					dateModified: post.dateModified,
					image: post.ogImageUrl,
					description: post.description,
				})}
			/>
			<div className="mb-8 text-center">
				<time
					dateTime={post.datePublished}
					className="mb-1 text-xs text-gray-600"
				>
					{format(parseISO(post.datePublished), "d MMMM yyyy", { locale: fr })}
				</time>
				<h1 className="text-3xl font-bold">{post.title}</h1>
				<p>{post.blogType}</p>
				<Image
					src={post.coverUrl}
					alt={post.cover.alt ?? post.title}
					width={600}
					height={600 / post.cover.image.aspectRatio}
					blurDataURL={post.cover.image.blurhashDataUrl}
				/>
			</div>
			<div role="main">
				<Mdx code={post.body.code} />
			</div>
			<CommentSection />
		</article>
	);
}
