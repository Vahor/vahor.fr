import { extractMetaTags } from "@/lib/scraper";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface UrlBadgeProps {
	url: string;
	title: string;
	favicon?: string;
	alt?: string;
}

export const UrlBadge = async ({ url, title, favicon, alt }: UrlBadgeProps) => {
	const metadata = favicon
		? { favicon, title, ariaLabel: title }
		: await extractMetaTags(url);

	return (
		<UrlBadgeWithMetadata
			url={url}
			title={title}
			alt={alt ?? metadata.title}
			favicon={metadata.favicon}
		/>
	);
};

export const UrlBadgeWithMetadata = ({
	url,
	title,
	favicon,
	alt,
}: UrlBadgeProps & { favicon: string }) => {
	return (
		<Badge asChild>
			<a href={`${url}?ref=vahor.fr`} target="_blank" rel="noopener noreferrer">
				<Image
					src={favicon}
					alt={alt ?? title}
					width={16}
					height={16}
					unoptimized={true}
					className="mb-0.5 inline-block select-none"
				/>
				<span>{title}</span>
			</a>
		</Badge>
	);
};
