"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/Providers";
import { GITHUB_PROFILE } from "@/lib/constants";
import { UrlBadgeWithMetadata } from "../UrlBadge";

export function GithubIcon() {
	const { resolvedTheme: theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<UrlBadgeWithMetadata
			url={GITHUB_PROFILE}
			title="GitHub"
			alt="GitHub icon"
			favicon={
				mounted && theme === "dark"
					? "/icons/github-mark-white.svg"
					: "/icons/github-mark.svg"
			}
		/>
	);
}
