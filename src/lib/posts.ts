import { type CollectionEntry, getCollection } from "astro:content";

export type Post = CollectionEntry<"posts">;

export function slugFromEntry(post: Post): string {
	return post.id.replace(/^posts\//, "").replace(/\.mdx?$/, "");
}

export function urlFromEntry(post: Post): string {
	const filePath = post.id.replace(/^posts\//, "").replace(/\.mdx?$/, "");
	const segments = filePath.split("/");
	if (segments.length < 2) return `/${filePath}`;
	const pageType = segments[0]!;
	const slug = segments[segments.length - 1]!;
	return `/${pageType}/${slug}`;
}

export function pageTypeFromEntry(post: Post): string {
	const filePath = post.id.replace(/^posts\//, "").replace(/\.mdx?$/, "");
	const segments = filePath.split("/");
	return segments.length < 2 ? "blog" : (segments[0] ?? "blog");
}

export function fullTagsFromEntry(post: Post): string[] {
	const tags = post.data.tags ?? [];
	const type = pageTypeFromEntry(post);
	const year = new Date(post.data.datePublished).getFullYear();
	return [type, ...tags, year.toString()];
}

export function timeToRead(content: string): number {
	const words = content.split(/\s+/).length;
	return Math.ceil(words / 140);
}

export function githubEditUrl(post: Post): string {
	return `https://github.com/vahor/vahor.fr/edit/main/src/content/${post.id}`;
}

export async function getAllTags() {
	const posts = await getCollection("posts");
	const tags = Array.from(
		new Set(posts.flatMap((post) => fullTagsFromEntry(post))),
	).toSorted((a, b) => b.localeCompare(a));
	tags.unshift("all");
	return tags;
}
