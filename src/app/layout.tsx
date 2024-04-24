import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Vahor",
	description: "yey",
	metadataBase: new URL("https://vahor.fr"),
	creator: "Nathan David",
	robots: "index, follow",
	authors: [{
		name: "Nathan David",
		url: "https://vahor.fr",
	}],
	twitter: {
		creator: "@vahor_",
		card: "summary",
		images: ["https://google.com"], // TODO
	},
	openGraph: {
		images: ["https://google.com"], // TODO
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
		<html lang="fr">
			<body className={cn(inter.className, "dark")}>{children}</body>
		</html>
	);
}

