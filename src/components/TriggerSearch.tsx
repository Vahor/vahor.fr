"use client";
import { searchStore } from "@/stores/search.store";
import { useStore } from "zustand";
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
