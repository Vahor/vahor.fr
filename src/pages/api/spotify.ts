import type { APIRoute } from "astro";
import { z } from "zod";
import { getSpotifyAccessToken } from "../../lib/spotify";

export const prerender = false;
const apiSchema = z.object({
	items: z.array(
		z.object({
			name: z.string(),
			external_urls: z.object({ spotify: z.url() }),
			artists: z.array(z.object({ name: z.string() })),
			album: z.object({
				name: z.string(),
				images: z.array(z.object({ url: z.url() })),
			}),
		}),
	),
});

export const GET: APIRoute = async () => {
	try {
		const request = async (refresh = false) =>
			fetch(
				"https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1&offset=0",
				{
					headers: {
						Authorization: `Bearer ${await getSpotifyAccessToken(refresh)}`,
					},
					signal: AbortSignal.timeout(10000),
				},
			);
		let response = await request();
		if (response.status === 401) response = await request(true);
		if (!response.ok) throw new Error(`Spotify returned ${response.status}`);
		const track = apiSchema.parse(await response.json()).items[0];
		return Response.json(
			track
				? {
						name: track.name,
						artists: track.artists.map((artist) => artist.name).join(", "),
						album: track.album.name,
						image: track.album.images[0]?.url ?? "/icons/spotify.png",
						url: `${track.external_urls.spotify}?ref=vahor.fr`,
					}
				: null,
			{
				headers: {
					"Cache-Control":
						"public, max-age=300, s-maxage=86400, stale-while-revalidate=3600",
				},
			},
		);
	} catch (error) {
		console.error(
			"Spotify top track unavailable:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return Response.json(
			{ error: "Spotify unavailable" },
			{ status: 503, headers: { "Cache-Control": "no-store" } },
		);
	}
};
