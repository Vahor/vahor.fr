import { HEADER_LINKS } from "@/lib/constants";
import Link from "next/link";
import { Logo } from "./logo";
import { SearchMenu } from "./search";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
	return (
		<header className="py-4 sm:py-8 px-8 max-w-screen-xl mx-auto flex items-center justify-between">
			<Logo />
			<div className="flex justify-end gap-3 items-center">
				<nav className="flex gap-6">
					{HEADER_LINKS.map(({ label, href }) => (
						<Link
							href={href}
							key={label}
							className="hover:text-black dark:hover:text-white"
						>
							{label}
						</Link>
					))}
				</nav>
				<ThemeSwitcher />
				<SearchMenu />
			</div>
		</header>
	);
}
