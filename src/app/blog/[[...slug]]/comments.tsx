"use client";

import Giscus from "@giscus/react";

export default function CommentSection() {
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
			theme="dark"
			strict="0"
			loading="lazy"
			lang="fr"
		/>
	);
}
