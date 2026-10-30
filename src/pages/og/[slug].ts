import type { APIRoute } from "astro";

export const prerender = false;

// Keep existing social image links working while serving static PNGs with a
// recognizable extension and the correct MIME type on every hosting adapter.
export const GET: APIRoute = ({ params, redirect }) =>
	redirect(`/og/${encodeURIComponent(params.slug ?? "")}.png`, 301);
