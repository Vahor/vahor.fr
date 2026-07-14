"use client";

import { TooltipPortal } from "@radix-ui/react-tooltip";
import { CheckIcon, SendIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { EMAIL } from "@/lib/constants";
import { useClipboard } from "@/lib/useClipboard";
import { Badge } from "./ui/badge";

export const CopyMailBadge = () => {
	const { hasCopied, handleClick } = useClipboard(EMAIL);
	const Icon = hasCopied ? CheckIcon : SendIcon;

	return (
		<TooltipProvider>
			<Tooltip open={hasCopied}>
				<TooltipTrigger>
					<Badge className="cursor-pointer" onClick={handleClick}>
						<Icon size={16} className="inline-block" />
						<span>{EMAIL}</span>
					</Badge>
				</TooltipTrigger>
				<TooltipPortal>
					<TooltipContent side="bottom">Copié</TooltipContent>
				</TooltipPortal>
			</Tooltip>
		</TooltipProvider>
	);
};
