"use client";
import { Search } from "lucide-react";
import React, { useEffect, useMemo, useTransition } from "react";
import { useStore } from "zustand";
import {
	CommandDialog,
	type CommandDialogProps,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import Fuse from "fuse.js";
import { EMAIL, GITHUB_PROFILE, LINKEDIN_PROFILE, TWITTER_PROFILE } from "@/lib/constants";
import type { SearchItem } from "@/lib/search";
import { searchStore } from "@/stores/search.store";

const contactLinks = [
	{ label: "Github", href: GITHUB_PROFILE, external: true },
	{ label: "Twitter", href: TWITTER_PROFILE, external: true },
	{ label: "Linkedin", href: LINKEDIN_PROFILE, external: true },
	{ label: "Email", href: `mailto:${EMAIL}`, external: true },
];

type SearchResult = { score: number; refIndex: number; item: SearchItem };

const commandProps: CommandDialogProps["commandProps"] = {
	loop: true,
	disablePointerSelection: false,
	shouldFilter: false,
	vimBindings: false,
	label: "Chercher une page",
};

export function SearchMenu({ posts }: { posts: SearchItem[] }) {
	return (
		<SearchWrapper>
			<SearchInput posts={posts} />
		</SearchWrapper>
	);
}

function SearchWrapper({ children }: React.PropsWithChildren) {
	const toggle = useStore(searchStore, (state) => state.toogleOpen);
	const setOpen = useStore(searchStore, (state) => state.setOpen);
	const open = useStore(searchStore, (state) => state.open);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggle();
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [toggle]);

	return (
		<>
			<label className="relative flex items-center">
				<Search className="mr-2 size-4 shrink-0 opacity-50" />
				<input
					type="text"
					className="flex w-24 rounded-md bg-transparent text-sm outline-hidden sm:w-48"
					name="search"
					placeholder="Chercher..."
					onFocus={() => setOpen(true)}
				/>
				<kbd className="pointer-events-none absolute inset-y-0 right-0 hidden h-5 select-none items-center gap-1.5 rounded-md border px-1.5 text-muted-foreground sm:flex">
					<span className="mt-px text-xs">⌘</span>
					<span className="text-sm">K</span>
				</kbd>
			</label>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				commandProps={commandProps}
				title="Chercher une page"
			>
				{children}
			</CommandDialog>
		</>
	);
}

const scoreDiff = (a: SearchResult, b: SearchResult) => {
	if (a.score === b.score) {
		return a.item.datePublished > b.item.datePublished
			? -1
			: a.item.title.localeCompare(b.item.title);
	}
	return a.score - b.score;
};

const groupByType = (results: SearchResult[]) => {
	const grouped = results.reduce(
		(acc, item) => {
			const type = item.item.pageType;
			acc[type] = acc[type] ?? [];
			acc[type].push(item);
			return acc;
		},
		{} as Record<string, SearchResult[]>,
	);

	for (const key in grouped) {
		grouped[key].sort(scoreDiff);
	}

	const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
		return scoreDiff(grouped[a][0], grouped[b][0]);
	});

	return Object.fromEntries(sortedGroups);
};

function SearchInput({ posts }: { posts: SearchItem[] }) {
	const setOpen = useStore(searchStore, (state) => state.setOpen);

	const searchContent = useMemo(() => {
		return [
			...posts,
			...contactLinks.map((l) => ({
				title: l.label,
				description: "",
				fullTags: [] as string[],
				pageType: "contact",
				datePublished: new Date().toISOString(),
				raw: "",
				url: l.href,
				external: l.external ?? true,
			})),
		];
	}, [posts]);

	const searchIndex = useMemo(
		() =>
			new Fuse(searchContent, {
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
			}),
		[searchContent],
	);

	const initialData: SearchResult[] = useMemo(
		() =>
			searchContent.map((post, index) => ({
				score: 1,
				refIndex: index,
				item: post,
			})),
		[searchContent],
	);

	const [query, setQuery] = React.useState("");
	const [_, startTransition] = useTransition();

	const [results, setResults] = React.useState(() => groupByType(initialData));

	const handleQueryChange = (query: string) => {
		startTransition(() => {
			setQuery(query);
			if (!query) return setResults(groupByType(initialData));
			return setResults(
				groupByType(
					searchIndex.search(`"${query}" | '"${query}"`) as SearchResult[],
				),
			);
		});
	};

	return (
		<>
			<CommandInput
				placeholder="Chercher une page..."
				value={query}
				onValueChange={handleQueryChange}
			/>
			<CommandList>
				<CommandEmpty>
					Aucun résultat pour{" "}
					<span className="text-foreground">{query}</span>{" "}
				</CommandEmpty>
				{Object.entries(results).map(([type, data]) => (
					<CommandGroup key={type} heading={type}>
						{data.map((item) => (
							<a href={item.item.url} key={item.refIndex}>
								<CommandItem
									value={item.item.title}
									onSelect={() => {
										window.location.href = item.item.url;
										setOpen(false);
									}}
								>
									{item.item.title}
								</CommandItem>
							</a>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</>
	);
}
