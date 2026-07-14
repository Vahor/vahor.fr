export function GET() {
	return new Response(
		"User-agent: *\nAllow: /\n\nSitemap: https://vahor.fr/sitemap.xml\nHost: https://vahor.fr\n",
		{ headers: { "Content-Type": "text/plain" } },
	);
}
