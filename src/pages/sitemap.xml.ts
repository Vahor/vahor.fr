import type { APIRoute } from "astro";
import { BASE_URL } from "../lib/constants";
import { getPosts, getTags } from "../lib/posts";
export const GET: APIRoute = async () => {
	const posts = await getPosts();
	const urls = [
		"/",
		...(await getTags()).map((tag) => `/tag/${tag}`),
		...posts.map((post) => post.url),
	];
	const escapeXml = (text: string) =>
		text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeXml(`${BASE_URL}${url}`)}</loc><lastmod>${posts.find((post) => post.url === url)?.dateModified ?? new Date().toISOString()}</lastmod></url>`).join("")}</urlset>`,
		{ headers: { "Content-Type": "application/xml; charset=utf-8" } },
	);
};
