import { type CollectionEntry, getCollection } from "astro:content";
import { stat } from "node:fs/promises";
import path from "node:path";

export type Post = Omit<CollectionEntry<"posts">["data"], "datePublished"> & {
	id: string;
	entry: CollectionEntry<"posts">;
	slug: string;
	pageType: string;
	url: string;
	fullTags: string[];
	datePublished: string;
	dateModified: string;
	timeToRead: number;
	githubEditUrl: string;
	body: { raw: string };
};

export async function getPosts(): Promise<Post[]> {
	const entries = await getCollection("posts");
	return Promise.all(
		entries.map(async (entry) => {
			const filePath = entry.filePath ?? `content/posts/${entry.id}.mdx`;
			const slug = path.basename(filePath, ".mdx");
			const pageType = path.basename(path.dirname(filePath));
			const datePublished = entry.data.datePublished.toISOString();
			const raw = entry.body ?? "";
			return {
				...entry.data,
				id: entry.id,
				entry,
				slug,
				pageType,
				url: `/${pageType}/${slug}`,
				fullTags: [
					pageType,
					...(entry.data.tags ?? []),
					String(entry.data.datePublished.getFullYear()),
				],
				datePublished,
				dateModified: (await stat(filePath)).mtime.toISOString(),
				timeToRead: Math.ceil(raw.split(/\s+/).length / 140),
				githubEditUrl: `https://github.com/vahor/vahor.fr/edit/main/content/posts/${path.relative("content/posts", filePath).split(path.sep).join("/")}`,
				body: { raw },
			};
		}),
	);
}

export async function getTags(posts?: Post[]): Promise<string[]> {
	return [
		"all",
		...[
			...new Set(
				(posts ?? (await getPosts())).flatMap((post) => post.fullTags),
			),
		]
			.filter((tag) => tag !== "all")
			.toSorted((a, b) => b.localeCompare(a)),
	];
}
