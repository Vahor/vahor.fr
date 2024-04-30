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
	const interSemiBold = fetch(`${BASE_URL}/fonts/Inter-SemiBold.ttf`).then(
		(res) => res.arrayBuffer(),
	);

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "center",
				backgroundImage: `url(${BASE_URL}/og-bg.jpg)`,
			}}
		>
			<div
				style={{
					padding: "0 90px",
					marginTop: -50,
					display: "flex",
					fontSize: 110,
					fontFamily: "Inter",
					letterSpacing: "-0.05em",
					fontStyle: "normal",
					lineHeight: "105px",
					color: "white",
					whiteSpace: "pre-wrap",
				}}
			>
				{post.title}
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 90,
					left: 100,
					display: "flex",
					fontSize: 24,
					fontFamily: "Inter",
					letterSpacing: "-0.05em",
					fontStyle: "normal",
					color: "white",
					whiteSpace: "pre-wrap",
				}}
			>
				<img
					src={`${BASE_URL}/logo-dark.svg`}
					style={{
						width: 40,
						height: 40,
						marginTop: -5,
						marginRight: 15,
					}}
					alt=""
				/>
				<span>Nathan David</span>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Inter",
					data: await interSemiBold,
					style: "normal",
					weight: 400,
				},
			],
		},
	);
}
