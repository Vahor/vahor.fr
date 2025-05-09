"use client";
import {
	CommandDialog,
	type CommandDialogProps,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { INITIAL_DATA, SEARCH_INDEX } from "@/lib/search";
import { searchStore } from "@/stores/search.store";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { useStore } from "zustand";

const commandProps: CommandDialogProps["commandProps"] = {
	loop: true,
	disablePointerSelection: false,
	shouldFilter: false,
	vimBindings: false,
	label: "Chercher une page",
};

export function SearchMenu() {
	return (
		<SearchWrapper>
			<SearchInput />
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

const filterResults = (query: string) => {
	const results = SEARCH_INDEX.search(`"${query}" | '"${query}"`);
	return results;
};

const scoreDiff = (
	a: (typeof INITIAL_DATA)[0],
	b: (typeof INITIAL_DATA)[0],
) => {
	const aScore = a.score!;
	const bScore = b.score!;
	if (aScore === bScore) {
		return a.item.datePublished > b.item.datePublished
			? -1
			: a.item.title.localeCompare(b.item.title);
	}
	return aScore - bScore;
};

const groupByType = (results: typeof INITIAL_DATA) => {
	const grouped = results.reduce(
		(acc, item) => {
			const type = item.item.pageType;
			acc[type] = acc[type] ?? [];
			acc[type].push(item);
			return acc;
		},
		{} as Record<string, typeof INITIAL_DATA>,
	);

	for (const key in grouped) {
		// fuse.js sorts by score (0 = best) by default
		grouped[key].sort(scoreDiff);
	}

	const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
		return scoreDiff(grouped[a][0], grouped[b][0]);
	});

	return Object.fromEntries(sortedGroups);
};

function SearchInput() {
	const setOpen = useStore(searchStore, (state) => state.setOpen);

	const [query, setQuery] = React.useState("");
	const router = useRouter();
	const [_, startTransition] = useTransition();

	const [results, setResults] = React.useState(() => groupByType(INITIAL_DATA));

	const handleQueryChange = (query: string) => {
		startTransition(() => {
			setQuery(query);
			if (!query) return setResults(groupByType(INITIAL_DATA));
			return setResults(groupByType(filterResults(query)));
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
					Aucun résultat pour <span className="text-foreground">
						{query}
					</span>{" "}
				</CommandEmpty>
				{Object.entries(results).map(([type, data]) => (
					<CommandGroup key={type} heading={type}>
						{data.map((item) => (
							<Link href={item.item.url} key={item.refIndex}>
								<CommandItem
									value={item.item.title}
									onSelect={() => {
										router.push(item.item.url);
										setOpen(false);
									}}
								>
									{item.item.title}
								</CommandItem>
							</Link>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</>
	);
}
