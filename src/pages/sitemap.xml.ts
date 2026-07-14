import { getAllPosts, urlFromEntry, fullTagsFromEntry } from "@/lib/posts";

export async function GET() {
	const posts = await getAllPosts();
	const allTags = Array.from(new Set(posts.flatMap((p) => fullTagsFromEntry(p))));
	allTags.push("all");

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://vahor.fr/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
	${posts.map((post) => `<url><loc>https://vahor.fr${urlFromEntry(post)}</loc><lastmod>${post.data.datePublished.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("")}
	${allTags.map((tag) => `<url><loc>https://vahor.fr/tag/${tag}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`).join("")}
</urlset>`;

	return new Response(sitemap, { headers: { "Content-Type": "application/xml" } });
}
