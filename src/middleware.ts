export const config = {
	matcher: "/:path*.md",
};

import { env } from "@/env";
import { allPosts } from "contentlayer/generated";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const headers = new Headers();
headers.set("Content-Type", "text/markdown; charset=utf-8");
headers.set("Cache-Control", "public, max-age=0, must-revalidate");
headers.set("Etag", env.BUILD_TIME);

const getPost = async (path: string) => {
	return allPosts.find((post) => post.url === path);
};

const cleanImageSrc = (src: string) =>
	src.replaceAll(/".*public\//g, '"/').replaceAll(/\(.*public\//g, "(/");

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const withoutMd = pathname.replace(/\.md$/, "");
	const post = await getPost(withoutMd);
	if (!post) return NextResponse.next();

	const md = post.body.raw;
	const cleanedMd = cleanImageSrc(md);

	const fullMd = `
---
title: ${post.title}
description: ${post.description}
datePublished: ${post.datePublished}
dateModified: ${post.dateModified}
---

${cleanedMd}
`.trim();

	return new Response(fullMd, { headers });
}
