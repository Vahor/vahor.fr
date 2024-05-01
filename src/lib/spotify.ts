import { env } from "@/env";
import { kv } from "@vercel/kv";

const cacheKey = (key: string) => `spotify:${key}`;
const cacheKeyAccessToken = cacheKey("accessToken");
const cacheKeyRefreshToken = cacheKey("refreshToken");

const getCachedAccessToken = async () => {
	const cachedToken = await kv.get(cacheKeyAccessToken);
	if (cachedToken) {
		return cachedToken;
	}
	return null;
};

export async function getSpotifyAccessToken() {
	const cachedToken = await getCachedAccessToken();
	if (cachedToken) {
		return cachedToken;
	}

	const refreshToken = await kv.get<string>(cacheKeyRefreshToken);
	if (!refreshToken) {
		console.error("Spotify refresh token not found");
		throw new Error("Spotify refresh token not found");
	}

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
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

	const data = await response.json();
	const { access_token, expires_in, refresh_token } = data;
	kv.set(cacheKeyAccessToken, access_token, { ex: expires_in * 1000 });
	kv.set(cacheKeyRefreshToken, refresh_token);

	console.log("Spotify access token refreshed");

	return access_token;
}
