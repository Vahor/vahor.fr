import { extractMetaTags } from "@/lib/scraper";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface UrlBadgeProps {
	url: string;
	title: string;
	favicon?: string;
}

export const UrlBadge = async ({ url, title, favicon }: UrlBadgeProps) => {
	const metadata = favicon ? { favicon, title } : await extractMetaTags(url);

	return (
		<UrlBadgeWithMetadata url={url} title={title} favicon={metadata.favicon} />
	);
};

export const UrlBadgeWithMetadata = ({
	url,
	title,
	favicon,
}: UrlBadgeProps & { favicon: string }) => {
	return (
		<Badge asChild>
			<a
				href={url}
				aria-label={title}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					src={favicon}
					alt={title}
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
