"use client";
import { Search } from "lucide-react";
import React, { useEffect, useTransition } from "react";
import { useStore } from "zustand";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { createSearchIndex, type SearchItem } from "@/lib/search";
import { searchStore } from "@/stores/search.store";

interface FuseResultItem { score?: number; refIndex: number; item: SearchItem; }

export function SearchMenu({ posts }: { posts: SearchItem[] }) {
	const searchIndex = React.useMemo(() => createSearchIndex(posts), [posts]);
	const initialItems: FuseResultItem[] = React.useMemo(() => posts.map((post, index) => ({ score: 1, refIndex: index, item: post })), [posts]);
	return <SearchWrapper><SearchInput searchIndex={searchIndex} initialItems={initialItems} /></SearchWrapper>;
}

function SearchWrapper({ children }: React.PropsWithChildren) {
	const toggle = useStore(searchStore, (s) => s.toogleOpen);
	const setOpen = useStore(searchStore, (s) => s.setOpen);
	const open = useStore(searchStore, (s) => s.open);
	useEffect(() => {
		const down = (e: KeyboardEvent) => { if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); toggle(); } };
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [toggle]);

	return (
		<>
			<label className="relative flex items-center">
				<Search className="mr-2 size-4 shrink-0 opacity-50" />
				<input type="text" className="flex w-24 rounded-md bg-transparent text-sm outline-hidden sm:w-48" name="search" placeholder="Chercher..." onFocus={() => setOpen(true)} />
				<kbd className="pointer-events-none absolute inset-y-0 right-0 hidden h-5 select-none items-center gap-1.5 rounded-md border px-1.5 text-muted-foreground sm:flex"><span className="mt-px text-xs">⌘</span><span className="text-sm">K</span></kbd>
			</label>
			<CommandDialog open={open} onOpenChange={setOpen} commandProps={{ loop: true, disablePointerSelection: false, shouldFilter: false, vimBindings: false, label: "Chercher une page" }} title="Chercher une page">{children}</CommandDialog>
		</>
	);
}

interface SearchInputProps { searchIndex: ReturnType<typeof createSearchIndex>; initialItems: FuseResultItem[]; }

const scoreDiff = (a: FuseResultItem, b: FuseResultItem) => {
	const aScore = a.score ?? 1; const bScore = b.score ?? 1;
	if (aScore === bScore) return a.item.datePublished > b.item.datePublished ? -1 : a.item.title.localeCompare(b.item.title);
	return aScore - bScore;
};

const groupByType = (results: FuseResultItem[]) => {
	const grouped = results.reduce((acc, item) => { const t = item.item.pageType; acc[t] = acc[t] ?? []; acc[t].push(item); return acc; }, {} as Record<string, FuseResultItem[]>);
	for (const key in grouped) grouped[key].sort(scoreDiff);
	const sorted = Object.entries(grouped).sort(([a], [b]) => scoreDiff(grouped[a]![0]!, grouped[b]![0]!));
	return Object.fromEntries(sorted);
};

function SearchInput({ searchIndex, initialItems }: SearchInputProps) {
	const setOpen = useStore(searchStore, (s) => s.setOpen);
	const [query, setQuery] = React.useState("");
	const [, startTransition] = useTransition();
	const [results, setResults] = React.useState(() => groupByType(initialItems));
	const handleQueryChange = (q: string) => {
		startTransition(() => {
			setQuery(q);
			if (!q) return setResults(groupByType(initialItems));
			setResults(groupByType(searchIndex.search(`"${q}" | '"${q}"`)));
		});
	};

	return (
		<>
			<CommandInput placeholder="Chercher une page..." value={query} onValueChange={handleQueryChange} />
			<CommandList>
				<CommandEmpty>Aucun résultat pour <span className="text-foreground">{query}</span> </CommandEmpty>
				{Object.entries(results).map(([type, data]) => (
					<CommandGroup key={type} heading={type}>
						{data.map((item) => (
							<a href={item.item.url} key={item.refIndex}>
								<CommandItem value={item.item.title} onSelect={() => { window.location.href = item.item.url; setOpen(false); }}>{item.item.title}</CommandItem>
							</a>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</>
	);
}
