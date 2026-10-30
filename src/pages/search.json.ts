import type { APIRoute } from "astro";
import { env } from "../env";
import {
	EMAIL,
	GITHUB_PROFILE,
	LINKEDIN_PROFILE,
	TWITTER_PROFILE,
} from "../lib/constants";
import { getPosts } from "../lib/posts";

export const GET: APIRoute = async () => {
	const posts = await getPosts();
	const entries = posts.map(
		({ title, description, fullTags, pageType, datePublished, url, body }) => ({
			title,
			description,
			fullTags,
			pageType,
			datePublished,
			url,
			raw: body.raw,
		}),
	);
	const contacts = [
		["GitHub", GITHUB_PROFILE],
		["Twitter", TWITTER_PROFILE],
		["LinkedIn", LINKEDIN_PROFILE],
		["Email", `mailto:${EMAIL}`],
	].map(([title, url]) => ({
		title,
		url,
		pageType: "contact",
		datePublished: env.BUILD_TIME,
	}));
	return Response.json([...entries, ...contacts]);
};
