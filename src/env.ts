import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "production"]),
		BUILD_TIME: z.coerce.string(),

		SPOTIFY_CLIENT_ID: z.string(),
		SPOTIFY_CLIENT_SECRET: z.string(),
	},

	client: {
		NEXT_PUBLIC_VERCEL_URL: z.string(),
		NEXT_PUBLIC_VERCEL_ENV: z.string(),
		NEXT_PUBLIC_BUILD_TIME: z.coerce.string(),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		BUILD_TIME: process.env.BUILD_TIME,

		NEXT_PUBLIC_BUILD_TIME: process.env.BUILD_TIME,
		NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
		NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,

		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
