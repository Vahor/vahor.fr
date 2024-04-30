import { allPosts } from "contentlayer/generated";

export interface BlogPageProps {
	params: { slug: string[] };
}

export const getPost = ({ params }: BlogPageProps) => {
	if (!params.slug) return null;
	const slug = params.slug.join("/");
	return allPosts.find((post) => post.slug === slug);
};
