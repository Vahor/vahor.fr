"use client";
import React from "react";
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

const commandProps: CommandDialogProps["commandProps"] = {
	loop: true,
	disablePointerSelection: false,
};

export function SearchMenu() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<label className="flex items-center">
				<Search className="mr-2 size-4 shrink-0 opacity-50" />
				<input
					type="text"
					className="flex h-11 rounded-md bg-transparent py-3 text-sm outline-none w-48"
					name="search"
					placeholder="Chercher un article..."
					onFocus={() => setOpen(true)}
				/>
				<kbd className="text-muted-foreground absolute right-8 select-none pointer-events-none h-5 gap-1.5 border hidden sm:flex items-center px-1.5 rounded-md text-sm">
					<span className="text-base">⌘</span>
					<span>K</span>
				</kbd>
			</label>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				commandProps={commandProps}
			>
				<CommandInput placeholder="Chercher un article..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Blogs">
						<CommandItem>Calendar</CommandItem>
						<CommandItem>Search Emoji</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Projects">
						<CommandItem>Calculator</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
