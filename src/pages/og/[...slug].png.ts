import { getAllPosts, urlFromEntry } from "@/lib/posts";

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts.map((post) => {
		const segments = urlFromEntry(post).split("/").filter(Boolean);
		return { params: { slug: segments.join("/") } };
	});
}

export async function GET({ params }: { params: { slug: string } }) {
	const posts = await getAllPosts();
	const post = posts.find((p) => urlFromEntry(p) === `/${params.slug}`);
	if (!post) return new Response("Not found", { status: 404 });

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" /><stop offset="100%" style="stop-color:#16213e;stop-opacity:1" /></linearGradient></defs>
	<rect width="1200" height="630" fill="url(#bg)" />
	<text x="90" y="280" font-family="system-ui, sans-serif" font-size="64" font-weight="bold" fill="white" width="1020">${post.data.title}</text>
	<text x="100" y="540" font-family="system-ui, sans-serif" font-size="24" fill="#a0a0a0"><tspan font-weight="bold" fill="white">Nathan David</tspan> — vahor.fr</text>
</svg>`;

	return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" } });
}
