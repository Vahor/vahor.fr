import type { APIRoute } from "astro";
import { generateLlms } from "../../scripts/generate-llms.txt";
import { getPosts } from "../lib/posts";
export const GET: APIRoute = async () =>
	new Response(generateLlms(await getPosts()).get("/llms.txt"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
