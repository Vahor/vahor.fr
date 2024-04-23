import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Vahor",
	description: "yey",
	twitter: {
		creator: "@vahor_",
		card: "summary",
		images: ["https://google.com"], // TODO
	},
	openGraph: {
		images: ["https://google.com"], // TODO
	},
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
