import Fuse from "fuse.js";
import { EMAIL, GITHUB_PROFILE, LINKEDIN_PROFILE, TWITTER_PROFILE } from "./constants";

const contactLinks = [
	{ label: "Github", href: GITHUB_PROFILE, external: true },
	{ label: "Twitter", href: TWITTER_PROFILE, external: true },
	{ label: "Linkedin", href: LINKEDIN_PROFILE, external: true },
	{ label: "Email", href: `mailto:${EMAIL}`, external: true },
];

export interface SearchItem {
	title: string;
	description?: string;
	fullTags?: string[];
	pageType: string;
	datePublished: string;
	raw?: string;
	url: string;
	external: boolean;
}

export function createSearchIndex(posts: SearchItem[]) {
	const searchContent = [
		...posts,
		...contactLinks.map((l) => ({
			title: l.label,
			datePublished: "",
			url: l.href,
			pageType: "contact",
			external: true,
		})),
	];

	return new Fuse(searchContent, {
		keys: [
			{ name: "title", weight: 0.8 },
			{ name: "description", weight: 0.3 },
			{ name: "fullTags", weight: 0.2 },
			{ name: "raw", weight: 0.3 },
			{ name: "pageType", weight: 0.1 },
		],
		includeMatches: true,
		ignoreDiacritics: true,
		includeScore: true,
		isCaseSensitive: false,
		useExtendedSearch: true,
		shouldSort: false,
		findAllMatches: true,
		threshold: 0.5,
	});
}
