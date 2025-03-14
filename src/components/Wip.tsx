import { Warning } from "@/components/callout";
import A from "./A";

export function Wip({
	children,
	title = "Work in progress",
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Warning title={title} {...props}>
			{children}
			<hr className="mt-4" />
			<p className="mt-2">
				Cette page n'est pas encore terminée.
				<br />
				Ajoutez un <A href="#comments">commentaire</A> si les sujets abordés
				vous intéressent.
			</p>
		</Warning>
	);
}
