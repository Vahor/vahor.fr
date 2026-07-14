"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
	theme: Theme | null;
	resolvedTheme: Theme | null;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: null,
	resolvedTheme: null,
	setTheme: () => {},
});

export function Providers({ children }: React.PropsWithChildren) {
	const [theme, setThemeState] = useState<Theme | null>(null);

	useEffect(() => {
		const current = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
		setThemeState(current);
	}, []);

	const setTheme = useCallback((t: Theme) => {
		document.documentElement.classList.toggle("dark", t === "dark");
		document.documentElement.style.colorScheme = t;
		localStorage.setItem("theme", t);
		setThemeState(t);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	return { resolvedTheme: ctx.resolvedTheme, setTheme: ctx.setTheme };
}
