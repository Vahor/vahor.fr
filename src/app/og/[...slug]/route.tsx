import { BASE_URL } from "@/lib/constants";
import { type BlogPageProps, getPost } from "@/lib/posts";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

export async function GET(_: NextRequest, params: BlogPageProps) {
	const post = getPost(params);
	if (!post) {
		return new Response("Not found", { status: 404 });
	}

	// Font
	const interSemiBold = fetch(
		`${BASE_URL}/fonts/Inter-SemiBold.ttf`,
	).then((res) => res.arrayBuffer())

	return new ImageResponse(
		<div
			style={{
				fontSize: 48,
				background: "white",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{post.title}
		</div>,
		{
			...size,
			fonts: [
				{
					name: 'Inter',
					data: await interSemiBold,
					style: 'normal',
					weight: 400,
				},
			]
		},
	);
}
