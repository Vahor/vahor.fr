import { getCollection } from "astro:content";
import path from "node:path";
import type { APIRoute } from "astro";

export const prerender = false;

// Keep existing social image links working while serving static PNGs with a
// recognizable extension and the correct MIME type on every hosting adapter.
export const GET: APIRoute = async ({ params, redirect }) => {
	const posts = await getCollection("posts");
	if (
		!posts.some(
			(post) => path.basename(post.filePath ?? post.id, ".mdx") === params.slug,
		)
	) {
		return new Response(null, { status: 404 });
	}
	return redirect(`/og/${encodeURIComponent(params.slug!)}.png`, 301);
};
