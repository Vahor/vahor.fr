"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function CommentSection() {
	const { resolvedTheme: theme } = useTheme();

	return (
		<Giscus
			id="comments"
			repo="vahor/vahor.fr-comments"
			repoId="R_kgDOLxpd7Q"
			category="Announcements"
			categoryId="DIC_kwDOLxpd7c4Ce2zK"
			mapping="pathname"
			reactionsEnabled="1"
			emitMetadata="0"
			inputPosition="top"
			theme={theme === "dark" ? "dark" : "light"}
			strict="0"
			loading="lazy"
			lang="fr"
		/>
	);
}
