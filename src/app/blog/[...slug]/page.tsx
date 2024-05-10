import Hr from "@/components/Hr";
import { JsonLd } from "@/components/jsonld/profile-page";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { BASE_URL } from "@/lib/constants";
import { articlePage } from "@/lib/jsonld";
import { Mdx } from "@/lib/mdx";
import { absolutePath } from "@/lib/utils";
import "@/styles/code.css";
import "@shikijs/twoslash/style-rich.css";
import { allPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Pencil } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "./comments";

interface PageProps {
	params: { slug: string[] };
}

const getPost = ({ params }: PageProps, pageType: "blog" | "project") => {
	if (!params.slug) return null;
	const slug = `${pageType}/${params.slug.join("/")}`;
	return allPosts.find((post) => post.slug === slug);
};

export const generateMetadataBuilder = (pageType: "blog" | "project") => {
	return async (
		props: PageProps,
		parent: ResolvingMetadata,
	): Promise<Metadata> => {
		const post = getPost(props, pageType);
		if (!post) notFound();

		const parentMetadata = await parent;

		const ogImages = [
			{
				alt: post.title,
				type: "image/png",
				width: 1200,
				height: 630,
				url: `${BASE_URL}/og/${post.slug}`,
			},
		];

		return {
			title: post.title,
			description: post.description,
			openGraph: {
				...parentMetadata.openGraph,
				type: "article",
				url: absolutePath(post.url),
				images: ogImages,
			},
			twitter: {
				...parentMetadata.twitter,
				// @ts-expect-error wrong type
				card: "summary_large_image",
				images: ogImages,
			},
		};
	};
};

const Tag = ({ tag, href }: { tag: string; href: string }) => (
	<Link
		href={href}
		className="text-xs bg-accent font-mono capitalize text-black dark:text-white px-2 py-1 rounded-md"
	>
		{tag}
	</Link>
);

const formatDateTime = (date: string) =>
	format(parseISO(date), "d MMMM yyyy", { locale: fr });

export const postPageBuilder = (pageType: "blog" | "project") => {
	return function PostPage(props: PageProps) {
		const post = getPost(props, pageType);
		if (!post) notFound();

		return (
			<main className="container py-16 mx-auto post-content" id="skip-nav">
				<JsonLd
					jsonLd={articlePage({
						headline: post.title,
						datePublished: post.datePublished,
						dateModified: post.dateModified,
						image: `${BASE_URL}/og/${post.slug}`,
						description: post.description,
					})}
				/>

				<header className="mb-10 flex flex-col gap-6">
					<h1 className="text-3xl font-semibold text-black dark:text-white text-balance">
						{post.title}
					</h1>
					<p>{post.description}</p>
					<div className="flex flex-row items-center gap-6 font-mono">
						<div className="flex flex-row items-center gap-2">
							<Clock className="size-4" />
							<span className="text-xs">{post.timeToRead} min de lecture</span>
						</div>
						<TooltipProvider delayDuration={50}>
							<Tooltip>
								<TooltipTrigger>
									<div className="flex flex-row items-center gap-2">
										<Calendar className="size-4" />
										<span className="text-xs">
											<time dateTime={post.datePublished}>
												{formatDateTime(post.datePublished)}
											</time>
										</span>
									</div>
								</TooltipTrigger>
								<TooltipContent align="start">
									Dernière modification le{" "}
									<time dateTime={post.dateModified}>
										{formatDateTime(post.dateModified)}
									</time>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className="flex flex-row items-center gap-2" id="tags">
						{post.fullTags.map((tag: string) => (
							<Tag key={tag} tag={tag} href={`/tag/${tag}`} />
						))}
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
						className="flex flex-row items-center gap-2 font-mono text-sm hover:text-black dark:hover:text-white w-max"
					>
						<Pencil className="size-3" />
						<span>Suggérer une modification</span>
					</Link>
				</footer>

				<section className="larger-post-content">
					<CommentSection />
				</section>
			</main>
		);
	};
};

export const generateStaticParams = async () =>
	allPosts
		.filter((post) => post.pageType === "blog")
		.map((post) => ({ slug: post.slug.split("/") }));

export default postPageBuilder("blog");
export const generateMetadata = generateMetadataBuilder("blog");
