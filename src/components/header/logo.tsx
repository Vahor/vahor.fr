"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
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
		<Link href="/" className="flex shrink-0 cursor-pointer items-center gap-3">
			<Image
				src={mounted && theme === "dark" ? darkLogo : whiteLogo}
				alt="Logo"
				width={24}
				className="h-[24px] w-[24px] transform transition-transform hover:rotate-12"
			/>
			<span className="hidden font-semibold text-dark text-lg sm:inline dark:text-white">
				Vahor
			</span>
		</Link>
	);
}
