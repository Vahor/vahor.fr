import type { APIRoute, GetStaticPaths } from "astro";
import { generateLlms } from "../../scripts/generate-llms.txt";
import { getPosts } from "../lib/posts";
export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getPosts();
	const output = generateLlms(posts);
	return posts.map((post) => ({
		params: { slug: post.url.slice(1) },
		props: { markdown: output.get(`${post.url}.md`) },
	}));
};
export const GET: APIRoute = ({ props }) =>
	new Response(props.markdown, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
