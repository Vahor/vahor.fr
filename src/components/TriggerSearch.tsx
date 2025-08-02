"use client";
import { useStore } from "zustand";
import { searchStore } from "@/stores/search.store";
import { Button, type ButtonProps } from "./ui/button";

export const TriggerSearch = ({
	children,
	...props
}: React.PropsWithChildren<ButtonProps>) => {
	const openSearch = useStore(searchStore, (state) => state.setOpen);

	return (
		<Button {...props} type="button" onClick={() => openSearch(true)}>
			{children}
		</Button>
	);
};
