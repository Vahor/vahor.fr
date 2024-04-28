"use client";
import React, { useEffect, useTransition } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	type CommandDialogProps,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { INITIAL_DATA, SEARCH_INDEX } from "@/lib/search";
import { useIsMounted, useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { create, useStore } from "zustand";

const openStore = create<{
	open: boolean;
	toogleOpen: () => void;
	setOpen: (open: boolean) => void;
}>((set) => ({
	open: false,
	toogleOpen: () => set((state) => ({ open: !state.open })),
	setOpen: (open) => set({ open }),
}));

const commandProps: CommandDialogProps["commandProps"] = {
	loop: false,
	disablePointerSelection: false,
	shouldFilter: false,
};

export function SearchMenu() {
	return (
		<SearchWrapper>
			<SearchInput />
		</SearchWrapper>
	);
}

function SearchWrapper({ children }: React.PropsWithChildren) {
	const toggle = useStore(openStore, (state) => state.toogleOpen);
	const setOpen = useStore(openStore, (state) => state.setOpen);
	const open = useStore(openStore, (state) => state.open);
	const md = useMediaQuery("(min-width: 640px)", { defaultValue: true });
	const isMounted = useIsMounted();

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
			<label className="flex items-center relative">
				<Search className="mr-2 size-4 shrink-0 opacity-50" />
				<input
					type="text"
					className="flex rounded-md bg-transparent text-sm outline-none w-24 sm:w-48"
					name="search"
					placeholder={
						isMounted() && md ? "Chercher une page..." : "Chercher..."
					}
					onFocus={() => setOpen(true)}
				/>
				<kbd className="text-muted-foreground absolute right-0 inset-y-0 select-none pointer-events-none h-5 gap-1.5 border hidden sm:flex items-center px-1.5 rounded-md text-sm">
					<span className="text-base mt-px">⌘</span>
					<span>K</span>
				</kbd>
			</label>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				commandProps={commandProps}
			>
				{children}
			</CommandDialog>
		</>
	);
}

const filterResults = (query: string) => {
	const results = SEARCH_INDEX.search(query);
	return results;
};

const scoreDiff = (
	a: (typeof INITIAL_DATA)[0],
	b: (typeof INITIAL_DATA)[0],
) => {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const aScore = a.score!;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
	const setOpen = useStore(openStore, (state) => state.setOpen);

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
				<CommandEmpty>Aucun résultat pour <span className="text-foreground">{query}</span> </CommandEmpty>
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
			</CommandList >
		</>
	);
}
