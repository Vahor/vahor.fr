"use client";

import type { ComponentPropsWithoutRef } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClipboard } from "@/lib/useClipboard";

interface CopyToClipboardButtonProps
	extends ComponentPropsWithoutRef<"button"> {
	textToCopy: string;
}

export function CopyToClipboardButton({
	textToCopy,
	...props
}: {
	textToCopy: string;
} & CopyToClipboardButtonProps) {
	const { hasCopied, handleClick } = useClipboard(textToCopy);

	return (
		<Tooltip>
			<TooltipTrigger
				aria-label={"Copy code to clipboard"}
				onClick={handleClick}
				className="hover:text-zinc-400"
				{...props}
			>
				<svg
					className="size-[18px] transform transition-transform duration-100 active:scale-95"
					data-active={hasCopied}
					role="img"
					aria-label="Clipboard icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					color="currentColor"
					fill="none"
				>
					<path
						d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TooltipTrigger>
			<TooltipContent side="left">
				{hasCopied ? "Copied!" : "Copy"}
			</TooltipContent>
		</Tooltip>
	);
}
