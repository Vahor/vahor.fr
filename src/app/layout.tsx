import { Header } from "@/components/header/header";
import "@/styles/globals.css";
import { globalMetadata } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";

const mono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});
const serif = Inter({
	subsets: ["latin"],
});

export const viewport: Viewport = {
	colorScheme: "dark light",
	initialScale: 1,
	minimumScale: 1,
};

export const metadata = globalMetadata;

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
