"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import darkLogo from "../../../public/logo-dark.svg";
import whiteLogo from "../../../public/logo-white.svg";

export function Logo() {
	const { resolvedTheme: theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Link href="/" className="flex items-center gap-3 cursor-pointer shrink-0">
			<Image
				src={mounted && theme === "dark" ? darkLogo : whiteLogo}
				alt="Logo"
				width={24}
				className="transform hover:rotate-12 transition-transform w-[24px] h-[24px]"
			/>
			<span className="hidden sm:inline text-dark dark:text-white font-semibold text-lg">
				Vahor
			</span>
		</Link>
	);
}
