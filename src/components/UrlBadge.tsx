import { extractMetaTags } from "@/lib/scraper";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface UrlBadgeProps {
	url: string;
	title: string;
	favicon?: string;
}

export const UrlBadge = async ({ url, title, favicon }: UrlBadgeProps) => {
	const metadata = favicon
		? { favicon, title, ariaLabel: title }
		: await extractMetaTags(url);

	return (
		<UrlBadgeWithMetadata
			url={url}
			title={title}
			ariaLabel={metadata.title}
			favicon={metadata.favicon}
		/>
	);
};

export const UrlBadgeWithMetadata = ({
	url,
	title,
	favicon,
	ariaLabel,
}: UrlBadgeProps & { favicon: string; ariaLabel?: string }) => {
	return (
		<Badge asChild>
			<a href={url} target="_blank" rel="noopener noreferrer">
				<Image
					src={favicon}
					alt={ariaLabel || title}
					width={16}
					height={16}
					unoptimized={true}
					className="inline-block mb-0.5"
				/>
				<span>{title}</span>
			</a>
		</Badge>
	);
};
