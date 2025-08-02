import type { Metadata } from "next";
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

export const globalMetadata = {
	title: {
		default: "Vahor",
		template: "%s | Vahor",
	},
	description: "Développeur full-stack",
	metadataBase: new URL("https://vahor.fr"),
	creator: "Nathan David",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	authors: [
		{
			name: "Nathan David",
			url: "https://vahor.fr",
		},
	],
	twitter: {
		creator: "@vahor_",
		card: "summary",
		images: [
			{
				url: "/android-chrome-512x512.png",
				alt: "Vahor",
				width: 512,
				height: 512,
			},
		],
	},
	openGraph: {
		locale: "fr_FR",
		siteName: "Vahor",
		images: [
			{
				url: "/android-chrome-512x512.png",
				alt: "Vahor",
				width: 512,
				height: 512,
			},
		],
	},
	icons: [
		{ rel: "icon", url: "/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/apple-icon.png" },
		{ rel: "icon", sizes: "192x192", url: "/android-chrome-192x192.png" },
		{ rel: "icon", sizes: "512x512", url: "/android-chrome-512x512.png" },
	],
	alternates: {
		types: {
			"application/rss+xml": "rss.xml",
		},
	},
} as const satisfies Metadata;
