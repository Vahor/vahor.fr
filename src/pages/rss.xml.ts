import type { APIRoute } from "astro";
import { generateRss } from "../../scripts/generate-rss";
import { getPosts } from "../lib/posts";
export const GET: APIRoute = async () =>
	new Response(generateRss(await getPosts()), {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
