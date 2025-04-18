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
	params: Promise<{ slug: string[] }>;
}

const getPost = async (props: PageProps) => {
	const params = await props.params;
	if (!params.slug) return null;
	const slug = `/${params.slug.join("/")}`;

	return allPosts.find((post) => post.url === slug);
};

const Tag = ({ tag, href }: { tag: string; href: string }) => (
	<Link
		href={href}
		className="rounded-md bg-accent px-2 py-1 font-mono text-black text-xs capitalize dark:text-white"
	>
		{tag}
	</Link>
);

const formatDateTime = (date: string) =>
	format(parseISO(date), "d MMMM yyyy", { locale: fr });

export default async function PostPage(props: PageProps) {
	const post = await getPost(props);
	if (!post) notFound();

	return (
		<main className="post-content container mx-auto pb-16" id="skip-nav">
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
				<h1 className="text-balance font-semibold text-3xl text-black dark:text-white">
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
					className="flex w-max flex-row items-center gap-2 font-mono text-sm hover:text-black dark:hover:text-white"
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
}

export const generateStaticParams = async () =>
	allPosts.map((post) => ({ slug: post.url.split("/").filter(Boolean) }));

export const generateMetadata = async (
	props: PageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const post = await getPost(props);
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
		alternates: {
			canonical: post.url,
			types: {
				...parentMetadata.alternates?.types,
				"text/markdown": `${post.url}.md`,
			},
		},
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
export const dynamic = "force-static";
export const dynamicParams = false;
