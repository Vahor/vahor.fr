import A from "./A";
import { Callout } from "./Callout";

export function Wip({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Callout variant="warning" title="Work in progress"  {...props}>
			{children}
			<hr className="my-2" />
			<p className="mt-2">
				Cette page n'est pas encore terminée.<br />
				Ajoutez un <A href="#comments">commentaire</A> si les sujets abordés vous intéressent.
			</p>
		</Callout>
	);
}
