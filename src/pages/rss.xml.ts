import type { APIRoute } from "astro";
import { generateRss } from "../../scripts/generate-rss";
import { getPosts } from "../lib/posts";
export const GET: APIRoute = async ({ site }) =>
	generateRss(await getPosts(), site!);
