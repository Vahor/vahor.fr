import Image from "next/image";
import { extractMetaTags } from "@/lib/scraper";

interface UrlPreviewProps {
	url: string;
}

export const UrlPreview = async ({ url }: UrlPreviewProps) => {
	const metadata = await extractMetaTags(url);

	return (
		<a
			href={`${url}?ref=vahor.fr`}
			className="no-underline! group lg:-mx-20 relative mt-6 grid grid-cols-3 rounded-md border bg-white dark:bg-black"
			aria-label={metadata.title}
			title={metadata.title}
		>
			<div className="pointer-events-none absolute inset-0 rounded-md bg-black opacity-0 transition duration-250 ease-in-out group-hover:opacity-10 dark:bg-white" />

			<div className="col-span-3 flex flex-col justify-between p-4 text-sm md:col-span-2">
				<div className="truncate text-black text-md dark:text-white">
					{metadata.title}
				</div>
				<p className="flex min-h-[3.5rem] items-center overflow-hidden break-words py-1 font-light text-muted-foreground">
					{metadata.description.slice(0, 200)}
				</p>
				<div className="space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
					<Image
						src={metadata.favicon}
						alt={metadata.title}
						width={16}
						height={16}
						unoptimized={true}
						className="inline-block rounded-lg"
					/>
					<span>{url}</span>
				</div>
			</div>
			<div className="relative hidden w-full md:block">
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
