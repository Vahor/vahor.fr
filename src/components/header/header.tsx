import type { SearchItem } from "@/lib/search";
import { HEADER_LINKS } from "@/lib/constants";
import { Logo } from "./logo";
import { SearchMenu } from "./search";
import { ThemeSwitcher } from "./theme-switcher";

export function Header({ posts }: { posts: SearchItem[] }) {
	return (
		<header className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-8 py-4 sm:px-12 sm:py-8">
			<Logo />
			<div className="flex items-center justify-end gap-3">
				<nav className="flex gap-6">
					{HEADER_LINKS.map(({ label, href }) => (
						<a href={href} key={label} className="hover:text-black dark:hover:text-white">{label}</a>
					))}
				</nav>
				<ThemeSwitcher />
				<SearchMenu posts={posts} />
			</div>
		</header>
	);
}
