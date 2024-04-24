import { env } from "@/env";
import type { Person, ProfilePage, WithContext } from "schema-dts";

// TODO: use them

export const profilePage: WithContext<ProfilePage> = {
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	dateCreated: "2021-09-17",
	dateModified: env.BUILD_TIME,
}

export const author: Person = {
	"@type": "Person",
	name: "Nathan David",
	url: "https://vahor.fr",
}
