import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/header/header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Vahor",
		template: "%s | Vahor",
	},
	description: "yey",
	metadataBase: new URL("https://vahor.fr"),
	creator: "Nathan David",
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "/",
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
		images: ["https://google.com"], // TODO
	},
	openGraph: {
		images: ["https://google.com"], // TODO
		locale: "fr_FR",
		siteName: "Vahor",
	},
};

export const viewport: Viewport = {
	colorScheme: "dark light",
	initialScale: 1,
	minimumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body className={cn(inter.className)}>
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
