import { extractMetaTags } from "@/lib/scraper";
import { Badge } from "./ui/badge";

interface UrlBadgeProps { url: string; title: string; favicon?: string; alt?: string; }

export const UrlBadge = async ({ url, title, favicon, alt }: UrlBadgeProps) => {
	const metadata = favicon ? { favicon, title } : await extractMetaTags(url);
	return (
		<Badge asChild>
			<a href={`${url}?ref=vahor.fr`} target="_blank" rel="noopener noreferrer">
				<img src={metadata.favicon} alt={alt ?? metadata.title} width={16} height={16} className="mb-0.5 inline-block select-none" />
				<span>{title}</span>
			</a>
		</Badge>
	);
};
