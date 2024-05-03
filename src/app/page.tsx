import A from "@/components/A";
import { CopyMailBadge } from "@/components/CopyMailBadge";
import { CurrentlyListeningSvg } from "@/components/CurrentlyListeningSvg";
import { SpotifyTopTrackBadge } from "@/components/SpotifyTopArtist";
import { UrlBadge } from "@/components/UrlBadge";
import { GithubIcon } from "@/components/icons/Github";
import { JsonLd } from "@/components/jsonld/profile-page";
import { TWITTER_PROFILE } from "@/lib/constants";
import { profilePage } from "@/lib/jsonld";
import { allPosts } from "contentlayer/generated";

const postCount = allPosts.length;

export default function Home() {
	return (
		<main className="py-16 mx-auto container post-content">
			<JsonLd jsonLd={profilePage} />
			<h1 className="text-2xl text-black dark:text-white font-semibold mb-8">
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
					Je réalise actuellement un master informatique à{" "}
					<UrlBadge url="https://www.mewo.fr" title="Mewo" />, effectué en
					alternance chez{" "}
					<UrlBadge url="https://www.sesamm.com/" title="SESAMm" /> où j'occupe
					le poste de développeur fullstack depuis plus de 2ans.
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
					<UrlBadge url="https://go.dev/" title="Go" />. Et je réalise un projet
					open-source <UrlBadge url="https://pedaki.fr" title="Pedaki" />.
				</p>
			</section>

			<section className="mt-8">
				<p>
					En dehors de la programation, j'aime regarder des séries, lire des
					livres et écouter de la musique.
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 sm:mt-5 gap-2">
					<div className="hidden sm:flex justify-end">
						<CurrentlyListeningSvg />
					</div>
					<div className="sm:hidden font-semibold">
						<p>En ce moment j'écoute:</p>
					</div>
					<SpotifyTopTrackBadge />
				</div>
			</section>

			<section className="mt-8">
				<p>
					Vous pouvez me retrouver sur
					<GithubIcon />{" "}
					<UrlBadge
						url={TWITTER_PROFILE}
						title="Twitter"
						alt="Twitter icon"
						favicon="/icons/twitter.svg"
					/>
				</p>
				<p className="mt-2">
					Ou me contacter par mail: <CopyMailBadge />
				</p>
			</section>
		</main>
	);
}
