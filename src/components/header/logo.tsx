"use client";
import { useEffect, useState } from "react";

const darkLogo = "/logo-dark.svg";
const whiteLogo = "/logo-white.svg";

export function Logo() {
	const [mounted, setMounted] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
		setMounted(true);

		const observer = new MutationObserver(() => {
			setIsDark(document.documentElement.classList.contains("dark"));
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	return (
		<a href="/" className="flex shrink-0 cursor-pointer items-center gap-3">
			{mounted ? (
				<img src={isDark ? darkLogo : whiteLogo} alt="Logo" width={24} className="h-[24px] w-[24px] transform transition-transform hover:rotate-12" />
			) : (
				<img src={whiteLogo} alt="Logo" width={24} className="h-[24px] w-[24px] transform transition-transform hover:rotate-12" />
			)}
			<span className="hidden font-semibold text-dark text-lg sm:inline dark:text-white">Vahor</span>
		</a>
	);
}
