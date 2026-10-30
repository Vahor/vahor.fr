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
const statusTemplate = dialog.querySelector<HTMLTemplateElement>(
	"#search-status-template",
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
				useExtendedSearch: true,
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

function showStatus(message: string, query = "") {
	const status = statusTemplate.content.firstElementChild!.cloneNode(
		true,
	) as HTMLElement;
	status.children[0]!.textContent = message;
	status.children[1]!.textContent = query;
	results.replaceChildren(status);
	input.removeAttribute("aria-activedescendant");
}

function selectResult(link: HTMLAnchorElement) {
	results
		.querySelector<HTMLElement>('[data-selected="true"]')
		?.removeAttribute("data-selected");
	link.dataset.selected = "true";
	input.setAttribute("aria-activedescendant", link.id);
}

async function renderResults() {
	let search: Awaited<ReturnType<typeof loadSearch>>;
	try {
		search = await loadSearch();
	} catch {
		results.removeAttribute("aria-busy");
		showStatus(
			"La recherche est indisponible. Réessayez ou consultez la page Blog.",
		);
		return;
	}
	results.removeAttribute("aria-busy");
	const { entries, index } = search;
	const query = input.value.trim();
	const matches = query
		? index
				.search(`"${query}" | '"${query}"`)
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
		showStatus("Aucun résultat pour ", query);
		return;
	}
	const groups = new Map<string, HTMLElement>();
	for (const [resultIndex, entry] of matches.entries()) {
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
		link.id = `search-result-${resultIndex}`;
		group.append(link);
	}
	selectResult(results.querySelector<HTMLAnchorElement>("a")!);
}

function openSearch() {
	if (dialog.open) return;
	if (!loading) {
		results.setAttribute("aria-busy", "true");
		showStatus("Chargement…");
	}
	dialog.showModal();
	input.focus();
	void renderResults();
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
	button.addEventListener("click", openSearch);
});
input.addEventListener("input", () => {
	void renderResults();
});
input.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		event.preventDefault();
		dialog.close();
	}
});
dialog
	.querySelector("[data-search-close]")!
	.addEventListener("click", () => dialog.close());
dialog.querySelector("form")?.addEventListener("submit", (event) => {
	event.preventDefault();
	results.querySelector<HTMLAnchorElement>('[data-selected="true"]')?.click();
});
results.addEventListener("pointermove", (event) => {
	const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a");
	if (link) selectResult(link);
});
results.addEventListener("focusin", (event) => {
	if (event.target instanceof HTMLAnchorElement) selectResult(event.target);
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
	const active = links.indexOf(
		results.querySelector<HTMLAnchorElement>('[data-selected="true"]')!,
	);
	const next =
		active < 0
			? event.key === "ArrowDown"
				? 0
				: links.length - 1
			: (active + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
				links.length;
	const selected = links[next]!;
	selectResult(selected);
	selected.scrollIntoView({ block: "nearest" });
	input.focus({ preventScroll: true });
});
