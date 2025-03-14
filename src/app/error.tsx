"use client";

import A from "@/components/A";
import { TriggerSearch } from "@/components/TriggerSearch";
import { Button } from "@/components/ui/button";
import { GITHUB_REPOSITORY } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import homerError from "../../public/error.gif";

export default function ErrorPage() {
	return (
		<div className="container flex w-full flex-col items-center gap-8 sm:h-full sm:justify-center md:mt-[-105px] md:gap-12 lg:flex-row">
			<Image
				src={homerError}
				alt="Homer Simpson error"
				className="rounded-md shadow-sm"
				unoptimized
			/>
			<main className="flex flex-col gap-4">
				<h1 className="font-semibold text-6xl text-black dark:text-white">
					Erreur!
				</h1>
				<div className="text-muted-foreground">
					<p>Une erreur s'est produite.</p>
					<p>Ce n'est pas de votre faute, c'est de la mienne.</p>
					<p className="mt-2">
						Si vous voulez m'aider à la corriger, le repository est disponible
						sur <A href={GITHUB_REPOSITORY}>GitHub</A>.
					</p>
					<p className="mt-2">
						Et si vous voulez simplement retourner à l'accueil, utilisez les
						boutons ci-dessous.
					</p>
				</div>
				<div className="space-x-2">
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
