import type { APIRoute } from "astro";
import { BASE_URL } from "../lib/constants";
export const GET: APIRoute = () =>
	new Response(
		`User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\nHost: ${BASE_URL}\n`,
		{ headers: { "Content-Type": "text/plain; charset=utf-8" } },
	);
