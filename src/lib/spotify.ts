import { z } from "zod";
import { env } from "@/env";
import { kv } from "@/lib/redis";

const cacheKey = (key: string) => `spotify:${key}`;
const cacheKeyAccessToken = cacheKey("accessToken");
const cacheKeyRefreshToken = cacheKey("refreshToken");

const getCachedAccessToken = async () => {
	const cachedToken = await kv?.get<string>(cacheKeyAccessToken);
	if (cachedToken) {
		return cachedToken;
	}
	return null;
};

export async function getSpotifyAccessToken(refresh = false) {
	if (!kv || !env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
		throw new Error("Spotify integration is not configured");
	}
	const cachedToken = await getCachedAccessToken();
	if (cachedToken && !refresh) {
		return cachedToken;
	}

	const refreshToken = await kv.get<string>(cacheKeyRefreshToken);
	if (!refreshToken) {
		console.error("Spotify refresh token not found");
		throw new Error("Spotify refresh token not found");
	}

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		signal: AbortSignal.timeout(10000),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			client_id: env.SPOTIFY_CLIENT_ID,
			client_secret: env.SPOTIFY_CLIENT_SECRET,
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) {
		console.error(
			"Failed to refresh Spotify access token",
			await response.text(),
		);
		throw new Error("Failed to refresh Spotify access token");
	}

	const data = z
		.object({
			access_token: z.string(),
			expires_in: z.number(),
			refresh_token: z.string().optional(),
		})
		.parse(await response.json());
	const { access_token, expires_in, refresh_token: newRefreshToken } = data;
	await kv.set(cacheKeyAccessToken, access_token, { ex: expires_in });
	if (newRefreshToken) {
		await kv.set(cacheKeyRefreshToken, newRefreshToken);
		console.log("Spotify refresh token updated");
	}

	console.log("Spotify access token refreshed");

	return access_token;
}
