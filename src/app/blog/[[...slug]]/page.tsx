import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";
import "@/app/code.css";
import { absolutePath } from "@/lib/utils";
import { Mdx } from "@/lib/mdx";
import Image from "next/image";

export const generateStaticParams = async () =>
	allPosts.map((post) => ({ slug: post._raw.flattenedPath.split("/") }));

interface PageProps {
	params: { slug: string[] };
}

const getPost = ({ params }: PageProps) => {
	const slug = params.slug.join('/');
	return allPosts.find((post) => post._raw.flattenedPath === slug);
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
	console.log(allPosts.map(p => p.coverUrl));
	if (!post) notFound();

	return (
		<article className="mx-auto px-12 md:px-0 max-w-2xl py-8">
			<div className="mb-8 text-center">
				<time dateTime={post.date} className="mb-1 text-xs text-gray-600">
					{format(parseISO(post.date), "LLLL d, yyyy")}
				</time>
				<h1 className="text-3xl font-bold">{post.title}</h1>
				<p>{post.blogType}</p>
				<Image
					src={post.coverUrl}
					alt={post.cover.alt ?? post.title}
					width={800}
					height={800 / post.cover.image.aspectRatio}
					blurDataURL={post.cover.image.blurhashDataUrl}
				/>
			</div>
			<Mdx code={post.body.code} />
		</article>
	);
}
