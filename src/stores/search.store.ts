import { create } from "zustand";

interface SearchStore {
	open: boolean;
	toogleOpen: () => void;
	setOpen: (open: boolean) => void;
}

export const searchStore = create<SearchStore>((set) => ({
	open: false,
	toogleOpen: () => set((state) => ({ open: !state.open })),
	setOpen: (open) => set({ open }),
}));
