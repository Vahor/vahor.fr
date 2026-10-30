import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { getPosts } from "../../lib/posts";

export const getStaticPaths: GetStaticPaths = async () =>
	(await getPosts()).map((post) => ({
		params: { slug: post.slug },
		props: { title: post.title },
	}));

export const GET: APIRoute = async ({ props }) => {
	const [font, background, logo] = await Promise.all([
		readFile("public/fonts/Inter-SemiBold.ttf"),
		readFile("public/og-bg.jpg"),
		readFile("public/logo-dark.svg"),
	]);
	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					backgroundImage: `url(data:image/jpeg;base64,${background.toString("base64")})`,
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								padding: "0 90px",
								marginTop: -50,
								display: "flex",
								fontSize: 110,
								fontFamily: "Inter",
								letterSpacing: "-0.05em",
								lineHeight: "105px",
								color: "white",
								whiteSpace: "pre-wrap",
							},
							children: props.title,
						},
					},
					{
						type: "div",
						props: {
							style: {
								position: "absolute",
								bottom: 90,
								left: 100,
								display: "flex",
								fontSize: 24,
								fontFamily: "Inter",
								letterSpacing: "-0.05em",
								color: "white",
							},
							children: [
								{
									type: "img",
									props: {
										src: `data:image/svg+xml;base64,${logo.toString("base64")}`,
										width: 40,
										height: 40,
										style: { marginTop: -5, marginRight: 15 },
									},
								},
								{ type: "span", props: { children: "Nathan David" } },
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }],
		},
	);
	return new Response(new Uint8Array(new Resvg(svg).render().asPng()), {
		headers: { "Content-Type": "image/png" },
	});
};
