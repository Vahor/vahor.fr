declare const __BUILD_TIME__: string;

export const env = {
	BUILD_TIME: __BUILD_TIME__,
	SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
};
