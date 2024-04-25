import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

const simpleLinks = [
	{
		label: "Accueil",
		href: "/",
	},
	{
		label: "Presentation",
		href: "/about",
	},
];

export function Header() {
	return (
		<header>
			<div id="maybe-a-logo-one-day" />
			<div className="flex justify-end gap-3 items-center">
				<nav className="flex gap-3 text-sm">
					{simpleLinks.map(({ label, href }) => (
						<Link href={href} key={label}>
							{label}
						</Link>
					))}
				</nav>
				<ThemeSwitcher />
				<div className="w-48 h-8 border"></div>
			</div>
		</header>
	);
}
