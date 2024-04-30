import { extractMetaTags } from "@/lib/scraper";
import Image from "next/image";

interface UrlBadgeProps {
	url: string;
	title: string;
	favicon?: string;
}

export const UrlBadge = async ({ url, title, favicon }: UrlBadgeProps) => {
	const metadata = favicon ? { favicon, title } : await extractMetaTags(url);

	return (
		<a
			href={url}
			className="rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 hover:dark:border-neutral-600 bg-accent text-accent-foreground p-1 !no-underline space-x-2 leading-4 text-sm"
			aria-label={title}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image
				src={metadata.favicon}
				alt={metadata.title}
				width={16}
				height={16}
				unoptimized={true}
				className="inline-block rounded-lg"
			/>
			<span>{title}</span>
		</a>
	);
};
