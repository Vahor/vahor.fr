"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon } from "lucide-react";

interface CopyButtonProps extends ButtonProps {
	value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
	const [hasCopied, setHasCopied] = useState(false);

	const handleClick = () => {
		if (hasCopied) return;

		if (navigator.clipboard) {
			navigator.clipboard.writeText(value);
		}
		setHasCopied(true);

		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	};

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
