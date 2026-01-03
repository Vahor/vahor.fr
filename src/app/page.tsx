import { allPosts } from "contentlayer/generated";
import type { Metadata, ResolvingMetadata } from "next";
import A from "@/components/A";
import { CopyMailBadge } from "@/components/CopyMailBadge";
import { CurrentlyListeningSvg } from "@/components/CurrentlyListeningSvg";
import { GithubIcon } from "@/components/icons/Github";
import { JsonLd } from "@/components/jsonld/profile-page";
import { SpotifyTopTrackBadge } from "@/components/SpotifyTopArtist";
import { UrlBadge } from "@/components/UrlBadge";
import { TWITTER_PROFILE } from "@/lib/constants";
import { profilePage } from "@/lib/jsonld";

const postCount = allPosts.length;

export const revalidate = 84600; // 24 hours

export default function Home() {
	return (
		<main className="post-content container mx-auto py-16 **:leading-7">
			<JsonLd jsonLd={profilePage} />
			<h1 className="mb-8 font-semibold text-2xl text-black dark:text-white">
				Nathan David
			</h1>
			<section>
				<p>
					Hello <span className="inline-block hover:animate-wiggle">👋🏻</span>
					<span>
						{" "}
						Je suis un développeur fullstack passioné par les automatisations,
						la performance et l'open-source.
					</span>
				</p>
			</section>
			<section className="mt-8">
				<p>
					Après un master informatique à{" "}
					<UrlBadge url="https://www.mewo.fr" title="Mewo" /> effectué en
					alternance chez{" "}
					<UrlBadge url="https://www.sesamm.com/" title="SESAMm" />, j'occupe
					désormais le poste de développeur fullstack depuis plus de 3 ans.
				</p>
			</section>

			<section className="mt-8">
				<p>
					En parallèle, je réalise des projets personnels que je documente sur
					ce site. Vous pouvez retrouver mes{" "}
					<span className="font-semibold">{postCount} articles</span> sur la
					page <A href="/tag/all">blog</A>.
				</p>
				<p className="mt-2">
					Par exemple, j'essaie d'apprendre{" "}
					<UrlBadge url="https://www.rust-lang.org/" title="Rust" /> et{" "}
					<UrlBadge url="https://go.dev/" title="Go" />. Mes principaux projets
					sont <UrlBadge url="https://pedaki.fr" title="Pedaki" /> et{" "}
					<UrlBadge url="https://helosion.net" title="Helosion" />.
				</p>
			</section>

			<section className="mt-8">
				<p>
					En dehors de la programation, j'aime regarder des séries,{" "}
					<A href="https://www.kenmei.co/user/vahor">lire</A> et écouter de la
					musique.
				</p>

				<div className="grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2">
					<div className="hidden justify-end sm:flex">
						<CurrentlyListeningSvg />
					</div>
					<div className="font-semibold sm:hidden">
						<p>En ce moment j'écoute:</p>
					</div>
					<SpotifyTopTrackBadge />
				</div>
			</section>

			<section className="mt-8">
				<p>
					Vous pouvez me retrouver sur <GithubIcon />{" "}
					<UrlBadge
						url="https://discordapp.com/users/132552926689230848"
						title="Discord"
						alt="Discord icon"
						favicon="/icons/discord.svg"
					/>
					{", "}
					<UrlBadge
						url={TWITTER_PROFILE}
						title="Twitter"
						alt="Twitter icon"
						favicon="/icons/twitter.svg"
					/>
					.
				</p>
				<p className="mt-2">
					Ou me contacter par mail: <CopyMailBadge />
				</p>
			</section>
		</main>
	);
}

export const generateMetadata = async (
	_,
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const alternates = (await parent).alternates ?? {};
	return {
		alternates: {
			...alternates,
			canonical: "/",
		},
	};
};
