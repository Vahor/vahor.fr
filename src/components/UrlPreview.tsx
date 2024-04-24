import { extractMetaTags } from "@/lib/scraper";
import Image from "next/image";

interface UrlPreviewProps {
	url: string;
}

export const UrlPreview = async ({ url }: UrlPreviewProps) => {
	const metadata = await extractMetaTags(url);

	return (
		<a
			href={url}
			className="mt-6 border rounded-md !no-underline group relative md:-mx-8 grid h-32 grid-cols-3 bg-background"
			aria-label={metadata.title}
		>
			<div className="absolute inset-0 transition duration-250 ease-in-out bg-black opacity-0 group-hover:opacity-10 dark:bg-white pointer-events-none rounded-md" />

			<div className="flex flex-col justify-between col-span-3 p-4 text-sm md:col-span-2">
				<div className="text-md">{metadata.title}</div>
				<p className="font-light text-muted-foreground break-words h-[3em] overflow-hidden">
					{metadata.description}
				</p>
				<div className="text-muted-foreground">
					<Image
						src={metadata.favicon}
						alt={metadata.title}
						width={16}
						height={16}
						unoptimized={true}
						className="inline-block mr-2 rounded-lg"
					/>
					{url}
				</div>
			</div>
			<div className="relative hidden w-full h-32 md:block">
				<Image
					src={metadata.image || metadata.favicon}
					alt={metadata.title}
					fill
					unoptimized={true}
					className="rounded-r-md"
					style={{
						objectFit: "cover",
						objectPosition: "center",
					}}
				/>
			</div>
		</a>
	);
};