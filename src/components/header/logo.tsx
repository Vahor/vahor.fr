"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const darkLogo = "/logo-dark.svg";
const whiteLogo = "/logo-white.svg";

export function Logo() {
	const { resolvedTheme: theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => { setMounted(true); }, []);

	return (
		<a href="/" className="flex shrink-0 cursor-pointer items-center gap-3">
			{mounted && theme === "dark" ? (
				<img src={darkLogo} alt="Logo" width={24} className="h-[24px] w-[24px] transform transition-transform hover:rotate-12" />
			) : (
				<img src={whiteLogo} alt="Logo" width={24} className="h-[24px] w-[24px] transform transition-transform hover:rotate-12" />
			)}
			<span className="hidden font-semibold text-dark text-lg sm:inline dark:text-white">Vahor</span>
		</a>
	);
}
