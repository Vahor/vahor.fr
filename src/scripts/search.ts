import type { SearchEntry } from "../lib/search";

const dialog = document.querySelector<HTMLDialogElement>("#search-dialog")!;
const input = document.querySelector<HTMLInputElement>("#search-query")!;
const results = document.querySelector<HTMLElement>("#search-results")!;
let entries: SearchEntry[];
let index: import("fuse.js").default<SearchEntry>;
let loading: Promise<void> | undefined;

function renderResults() {
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
			group = document.createElement("section");
			const heading = document.createElement("h3");
			heading.className =
				"mb-1 px-2 py-1 text-xs font-medium text-muted-foreground";
			heading.textContent = entry.pageType;
			group.append(heading);
			groups.set(entry.pageType, group);
			results.append(group);
		}
		const link = document.createElement("a");
		link.href = entry.url;
		link.textContent = entry.title;
		link.className =
			"block rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none";
		group.append(link);
	}
}

async function openSearch() {
	if (dialog.open) return;
	dialog.showModal();
	input.focus();
	if (!loading) {
		results.textContent = "Chargement…";
		loading = Promise.all([
			import("fuse.js"),
			fetch("/search.json").then((response) => {
				if (!response.ok) throw new Error("Search index unavailable");
				return response.json();
			}),
		])
			.then(([{ default: Fuse }, data]) => {
				entries = data as SearchEntry[];
				index = new Fuse(entries, {
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
				});
			})
			.catch(() => {
				loading = undefined;
			});
	}
	await loading;
	if (index) renderResults();
	else
		results.textContent =
			"La recherche est indisponible. Réessayez ou consultez la page Blog.";
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
	button.addEventListener("click", openSearch);
});
input.addEventListener("input", () => {
	if (index) renderResults();
});
dialog.querySelector("form")?.addEventListener("submit", (event) => {
	if (event.submitter) return;
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
