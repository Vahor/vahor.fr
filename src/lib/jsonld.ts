import { env } from "@/env";
import type { Person, ProfilePage, WithContext, Article } from "schema-dts";
import {
	AVATAR_URL,
	GITHUB_PROFILE,
	LINKEDIN_PROFILE,
	TWITTER_PROFILE,
} from "./constants";

// TODO: use them

export const author: Person = {
	"@type": "Person",
	name: "Nathan David",
	alternateName: "Vahor",
	url: "https://vahor.fr",
	image: AVATAR_URL,
	sameAs: [TWITTER_PROFILE, LINKEDIN_PROFILE, GITHUB_PROFILE],
};

export const profilePage: WithContext<ProfilePage> = {
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	dateCreated: "2021-09-17",
	dateModified: env.BUILD_TIME,
	mainEntity: author,
};

export const articlePage = (props: Partial<Article>): WithContext<Article> => ({
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	author,
	dateModified: env.BUILD_TIME,
	...props,
});
