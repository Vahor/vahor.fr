import { Header } from "@/components/header/header";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";

const mono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});
const serif = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
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
};

export const viewport: Viewport = {
	colorScheme: "dark light",
	initialScale: 1,
	minimumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="fr"
			suppressHydrationWarning
			className={`${mono.variable} ${serif.className}`}
		>
			<head>
				<link rel="sitemap" href="/sitemap.xml" />
			</head>
			<body>
				<Providers>
					<Header />
					{children}
				</Providers>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
