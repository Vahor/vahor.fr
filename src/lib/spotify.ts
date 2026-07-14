import { kv } from "@/lib/redis";

const cacheKeyAccessToken = "spotify:accessToken";
const cacheKeyRefreshToken = "spotify:refreshToken";

export async function getSpotifyAccessToken(refresh = false) {
	const cachedToken = await kv.get<string>(cacheKeyAccessToken);
	if (cachedToken && !refresh) return cachedToken;

	const refreshToken = await kv.get<string>(cacheKeyRefreshToken);
	if (!refreshToken) throw new Error("Spotify refresh token not found");

	const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
	const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) throw new Error("Failed to refresh Spotify access token");
	const data = await response.json();
	kv.set(cacheKeyAccessToken, data.access_token, { ex: data.expires_in });
	return data.access_token;
}
