import A from "@/components/A";
import { GITHUB_PROFILE } from "@/lib/constants";

export function GithubIcon() {
	return (
		<A href={GITHUB_PROFILE} aria-label="Github profile" className="inline-flex items-center gap-2">
			<img src="/icons/github-mark.svg" alt="GitHub mark" className="hidden size-4 dark:block" />
			<img src="/icons/github-mark-white.svg" alt="GitHub mark" className="block size-4 dark:hidden" />
			<span>GitHub</span>
		</A>
	);
}
