"use client";

import { useCopy } from "@/lib/useCopy";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Button, type ButtonProps } from "./button";

interface CopyButtonProps extends ButtonProps {
	value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
	const { hasCopied, handleClick } = useCopy(value);

	return (
		<Button
			onClick={handleClick}
			size="icon"
			variant="ghost"
			className={cn(
				"relative size-7 [&_svg]:size-4 hover:bg-accent",
				className,
			)}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon /> : <ClipboardIcon />}
		</Button>
	);
}
