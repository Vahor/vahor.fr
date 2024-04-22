import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";
import "@/app/code.css";
import "@shikijs/twoslash/style-rich.css";
import { absolutePath } from "@/lib/utils";
import { Mdx } from "@/lib/mdx";
import Image from "next/image";
import { fr } from "date-fns/locale";

export const generateStaticParams = async () =>
	allPosts.map((post) => ({ slug: post.slug.split("/") }));

interface PageProps {
	params: { slug: string[] };
}

const getPost = ({ params }: PageProps) => {
	const slug = params.slug.join('/');
	return allPosts.find((post) => post.slug === slug);
};

export const generateMetadata = (props: PageProps): Metadata => {
	const post = getPost(props);
	if (!post) notFound();
	return {
		title: post.title,
		description: post.description,
		openGraph: {
			type: "article",
			url: absolutePath(post.url),
		},
		twitter: {
			card: "summary_large_image",
		},
	};
};

export default async function PostPage(props: PageProps) {
	const post = getPost(props);
	if (!post) notFound();

	return (
		<article className="container" id="skip-nav">
			<div className="mb-8 text-center">
				<time dateTime={post.date} className="mb-1 text-xs text-gray-600">
					{format(parseISO(post.date), "d MMMM yyyy", { locale: fr })}
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
			<Mdx code={post.body.code} />
		</article>
	);
}
