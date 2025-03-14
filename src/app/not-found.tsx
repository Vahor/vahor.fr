import { TriggerSearch } from "@/components/TriggerSearch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import whereAmI from "../../public/where-am-i.gif";

export default function NotFound() {
	return (
		<div className="container flex w-full flex-col items-center gap-8 sm:h-full sm:justify-center md:mt-[-105px] md:gap-12 lg:flex-row">
			<Image
				src={whereAmI}
				alt="Where am I?"
				className="rounded-md shadow-sm"
				unoptimized
			/>
			<main className="flex flex-col gap-4">
				<h1 className="font-semibold text-6xl text-black dark:text-white">
					Oops !
				</h1>
				<div className="text-muted-foreground">
					<p>La page que vous cherchez n'existe pas.</p>
					<p>
						Peut-être que vous avez mal tapé l'adresse ou que la page a été
						supprimée.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild variant="secondary" className="w-max">
						<Link href="/">Returner à l'accueil</Link>
					</Button>
					<span className="text-sm">ou</span>
					<TriggerSearch variant="secondary">Chercher une page</TriggerSearch>
				</div>
			</main>
		</div>
	);
}
