"use client";
import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function CommentSection() {
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
		setTheme(current);

		const observer = new MutationObserver(() => {
			setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

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
			theme={theme}
			strict="0"
			loading="lazy"
			lang="fr"
		/>
	);
}
