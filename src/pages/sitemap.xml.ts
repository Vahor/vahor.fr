export function GET() {
	return new Response(null, {
		status: 302,
		headers: { Location: "/sitemap-index.xml" },
	});
}
