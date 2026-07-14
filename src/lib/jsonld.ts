import type { Article, Person, ProfilePage, WithContext } from "schema-dts";
import { AVATAR_URL, GITHUB_PROFILE, LINKEDIN_PROFILE, TWITTER_PROFILE } from "./constants";

export const author: Person = {
	"@type": "Person",
	name: "Nathan David",
	alternateName: "Vahor",
	url: "https://vahor.fr",
	image: AVATAR_URL,
	sameAs: [TWITTER_PROFILE, LINKEDIN_PROFILE, GITHUB_PROFILE],
};

export function profilePage(buildTime: string): WithContext<ProfilePage> {
	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		dateCreated: "2021-09-17T00:00:00.000Z",
		dateModified: buildTime,
		mainEntity: author,
	};
}

export function articlePage(props: Partial<Article>, buildTime: string): WithContext<Article> {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		author,
		dateModified: buildTime,
		...props,
	};
}
