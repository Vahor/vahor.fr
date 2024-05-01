import { env } from "@/env";

const HOSTNAME =
	env.NEXT_PUBLIC_VERCEL_ENV === "production"
		? "vahor.fr"
		: env.NEXT_PUBLIC_VERCEL_URL;
const PROTOCOL = HOSTNAME.includes("localhost") ? "http" : "https";
export const BASE_URL = `${PROTOCOL}://${HOSTNAME}`;
export const GITHUB_PROFILE = "https://github.com/vahor";
export const GITHUB_REPOSITORY = `${GITHUB_PROFILE}/vahor.fr`;
export const TWITTER_PROFILE = "https://twitter.com/vahor_";
export const LINKEDIN_PROFILE = "https://www.linkedin.com/in/nathan--david/";
export const EMAIL = "me@vahor.fr";
export const AVATAR_URL = "https://avatars.githubusercontent.com/u/17593209";

export const HEADER_LINKS = [
	{
		label: "Blog",
		href: "/tag/all",
	},
];
