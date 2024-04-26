import Fuse from "fuse.js";
import { allPosts } from "contentlayer/generated";
import { env } from "@/env";
import { HEADER_LINKS } from "./constants";

// TODO: search in content

const search_content = [
	...allPosts,
	...HEADER_LINKS.map((l) => ({
		title: l.label,
		datePublished: env.NEXT_PUBLIC_BUILD_TIME,
		url: l.href,
		pageType: "app",
	})),
];

export const SEARCH_INDEX = new Fuse(search_content, {
	keys: [
		{
			name: "title",
			weight: 2,
		},
		{
			name: "description",
			weight: 0.3,
		},
		{
			name: "tags",
			weight: 0.5,
		},
		{
			name: "datePublished",
			weight: 0.1,
		},
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
