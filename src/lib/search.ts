import Fuse from "fuse.js";
import { allPosts } from "contentlayer/generated";
import { env } from "@/env";
import { EMAIL, GITHUB_PROFILE, HEADER_LINKS, LINKEDIN_PROFILE, TWITTER_PROFILE } from "./constants";

// TODO: search in content

const contact_links = [
	{
		label: "Github",
		href: GITHUB_PROFILE,
		external: true,
	},
	{
		label: "Twitter",
		href: TWITTER_PROFILE,
		external: true,
	},
	{
		label: "Linkedin",
		href: LINKEDIN_PROFILE,
		extrnal: true,
	},
	{
		label: "Email",
		href: `mailto:${EMAIL}`,
		extrnal: true,
	}
];

const search_content = [
	...allPosts.map((post) => ({
		...post,
		external: false,
	})),
	...HEADER_LINKS.map((l) => ({
		title: l.label,
		datePublished: env.NEXT_PUBLIC_BUILD_TIME,
		url: l.href,
		pageType: "app",
		external: false,
	})),
	...contact_links.map((l) => ({
		title: l.label,
		datePublished: env.NEXT_PUBLIC_BUILD_TIME,
		url: l.href,
		pageType: "contact",
		external: l.external ?? true,
	})),
];

export const SEARCH_INDEX = new Fuse(search_content, {
	keys: [
		{
			name: "title",
			weight: 1,
		},
		{
			name: "description",
			weight: 0.3,
		},
		{
			name: "fullTags",
			weight: 0.2,
		},
		{
			name: "pageType",
			weight: 0.1,
		}
	],
	includeMatches: true,
	includeScore: true,
	useExtendedSearch: true,
	findAllMatches: true,
});

export const INITIAL_DATA: ReturnType<
	typeof SEARCH_INDEX.search<(typeof search_content)[number]>
> = search_content.map((post, index) => ({
	score: 1,
	matches: [],
	refIndex: index,
	item: post,
}));
