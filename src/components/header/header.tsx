import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { SearchMenu } from "./search";
import { HEADER_LINKS } from "@/lib/constants";

export function Header() {
	return (
		<header className="py-8 px-8 max-w-screen-xl mx-auto">
			<div id="maybe-a-logo-one-day" />
			<div className="flex justify-end gap-3 items-center">
				<nav className="flex gap-3 text-xs sm:text-sm">
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
