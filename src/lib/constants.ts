import { env } from "@/env";

const PROTOCOL = env.NEXT_PUBLIC_VERCEL_URL.includes("localhost")
	? "http"
	: "https";
export const BASE_URL = `${PROTOCOL}://${env.NEXT_PUBLIC_VERCEL_URL}`;
export const GITHUB_PROFILE = "https://github.com/vahor";
export const TWITTER_PROFILE = "https://twitter.com/vahor_";
export const LINKEDIN_PROFILE = "https://www.linkedin.com/in/nathan--david/";
export const AVATAR_URL = "https://avatars.githubusercontent.com/u/17593209";

export const HEADER_LINKS = [
	{
		label: "Accueil",
		href: "/",
	},
	{
		label: "Presentation",
		href: "/about",
	},
];
