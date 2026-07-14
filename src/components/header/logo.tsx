"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/Providers";

const darkLogo = "/logo-dark.svg";
const whiteLogo = "/logo-white.svg";

export function Logo() {
	const { resolvedTheme: theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<a
			href="/"
			data-astro-prefetch
			className="flex shrink-0 cursor-pointer items-center gap-3"
		>
			<img
				src={mounted && theme === "dark" ? darkLogo : whiteLogo}
				alt="Logo"
				width={24}
				className="h-[24px] w-[24px] transform transition-transform hover:rotate-12"
			/>
			<span className="hidden font-semibold text-dark text-lg sm:inline dark:text-white">
				Vahor
			</span>
		</a>
	);
}
