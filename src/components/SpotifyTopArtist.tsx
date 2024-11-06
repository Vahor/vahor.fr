import { getSpotifyAccessToken } from "@/lib/spotify";
import Image from "next/image";
import { z } from "zod";

const API_URL =
	"https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1&offset=0";

const itemSchema = z.object({
	name: z.string(),
	external_urls: z.object({
		spotify: z.string(),
	}),
	artists: z.array(
		z.object({
			name: z.string(),
		}),
	),

	album: z.object({
		name: z.string(),
		images: z.array(
			z.object({
				url: z.string(),
				height: z.number(),
				width: z.number(),
			}),
		),
	}),
});
const itemsSchema = z.array(itemSchema);
const apiSchema = z.object({
	items: itemsSchema,
});

async function getTopTrack() {
	const token = await getSpotifyAccessToken();
	const res = await fetch(API_URL, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) {
		console.error(await res.text());
		throw new Error("Failed to fetch data from Spotify API");
	}
	const data = await res.json();
	const items = apiSchema.parse(data).items;
	return items;
}

export async function SpotifyTopTrackBadge() {
	const tracks = await getTopTrack();

	if (tracks.length === 0) {
		return null;
	}

	const topTrack = tracks[0];

	return (
		<div>
			<a
				className="flex flew-row rounded-md border border-neutral-200 dark:border-neutral-700 gap-4 hover:border-neutral-300 hover:dark:border-neutral-600 bg-accent text-accent-foreground p-2"
				title="Ma musique préférée du moment"
				href={`${topTrack.external_urls.spotify}?ref=vahor.fr`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					src={topTrack.album.images[0].url}
					alt={topTrack.album.name}
					width={64}
					height={64}
					className="inline-block rounded-lg w-16 h-16"
				/>
				<div>
					<div className="font-semibold">{topTrack.name}</div>
					<div className="text-sm text-neutral-700 dark:text-neutral-300">
						{topTrack.artists.map((artist, i) => (
							<span key={artist.name}>
								{artist.name}
								{i < topTrack.artists.length - 1 ? ", " : ""}
							</span>
						))}
					</div>
				</div>
			</a>
		</div>
	);
}
