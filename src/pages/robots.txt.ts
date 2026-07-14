export function GET() {
	return new Response(
		[
			"User-agent: *",
			"Allow: /",
			"",
			"Sitemap: https://vahor.fr/sitemap.xml",
			"Host: https://vahor.fr",
			"",
			"# Content Signals: https://contentsignals.org/",
			"Content-Signal: ai-train=no, search=yes, ai-input=no",
		].join("\n"),
		{ headers: { "Content-Type": "text/plain" } },
	);
}
