import type { SearchEntry } from "../lib/search";

const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
const input = document.querySelector<HTMLInputElement>("#search-query")!;
const results = document.querySelector<HTMLElement>("#search-results")!;
const groupTemplate = dialog.querySelector<HTMLTemplateElement>(
	"#search-group-template",
)!;
const resultTemplate = dialog.querySelector<HTMLTemplateElement>(
	"#search-result-template",
)!;
let loading:
	| Promise<{
			entries: SearchEntry[];
			index: import("fuse.js").default<SearchEntry>;
	  }>
	| undefined;

function loadSearch() {
	if (loading) return loading;
	loading = Promise.all([
		import("fuse.js"),
		fetch("/search.json").then((response) => {
			if (!response.ok) throw new Error("Search index unavailable");
			return response.json() as Promise<SearchEntry[]>;
		}),
	])
		.then(([{ default: Fuse }, entries]) => ({
			entries,
			index: new Fuse(entries, {
				keys: [
					{ name: "title", weight: 0.8 },
					{ name: "description", weight: 0.3 },
					{ name: "fullTags", weight: 0.2 },
					{ name: "raw", weight: 0.3 },
					{ name: "pageType", weight: 0.1 },
				],
				ignoreDiacritics: true,
				includeScore: true,
				threshold: 0.5,
				findAllMatches: true,
			}),
		}))
		.catch((error) => {
			loading = undefined;
			throw error;
		});
	return loading;
}

async function renderResults() {
	let search: Awaited<ReturnType<typeof loadSearch>>;
	try {
		search = await loadSearch();
	} catch {
		results.textContent =
			"La recherche est indisponible. Réessayez ou consultez la page Blog.";
		return;
	}
	const { entries, index } = search;
	const query = input.value.trim();
	const matches = query
		? index
				.search(query)
				.map((result) => ({ ...result.item, score: result.score ?? 1 }))
		: entries.map((entry) => ({ ...entry, score: 1 }));
	matches.sort(
		(a, b) =>
			a.score - b.score ||
			b.datePublished.localeCompare(a.datePublished) ||
			a.title.localeCompare(b.title),
	);
	results.replaceChildren();
	if (!matches.length) {
		results.textContent = `Aucun résultat pour ${query}`;
		return;
	}
	const groups = new Map<string, HTMLElement>();
	for (const entry of matches) {
		let group = groups.get(entry.pageType);
		if (!group) {
			group = groupTemplate.content.firstElementChild!.cloneNode(
				true,
			) as HTMLElement;
			group.querySelector("h3")!.textContent = entry.pageType;
			groups.set(entry.pageType, group);
			results.append(group);
		}
		const link = resultTemplate.content.firstElementChild!.cloneNode(
			true,
		) as HTMLAnchorElement;
		link.href = entry.url;
		link.textContent = entry.title;
		group.append(link);
	}
}

function openSearch() {
	if (dialog.open) return;
	dialog.showModal();
	input.focus();
	if (!loading) results.textContent = "Chargement…";
	void renderResults();
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
	button.addEventListener("click", openSearch);
});
input.addEventListener("input", () => {
	void renderResults();
});
dialog
	.querySelector("[data-search-close]")!
	.addEventListener("click", () => dialog.close());
dialog.querySelector("form")?.addEventListener("submit", (event) => {
	event.preventDefault();
	results.querySelector<HTMLAnchorElement>("a")?.click();
});
dialog.addEventListener("click", (event) => {
	if (event.target === dialog) {
		const box = dialog.getBoundingClientRect();
		if (
			event.clientX < box.left ||
			event.clientX > box.right ||
			event.clientY < box.top ||
			event.clientY > box.bottom
		)
			dialog.close();
	}
});
document.addEventListener("keydown", (event) => {
	if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
		event.preventDefault();
		if (dialog.open) dialog.close();
		else void openSearch();
	}
	if (!dialog.open || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
	const links = [...results.querySelectorAll<HTMLAnchorElement>("a")];
	if (!links.length) return;
	event.preventDefault();
	const active = links.indexOf(document.activeElement as HTMLAnchorElement);
	const next =
		active < 0
			? event.key === "ArrowDown"
				? 0
				: links.length - 1
			: (active + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
				links.length;
	links[next]?.focus();
});
