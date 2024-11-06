"use client";

import { EMAIL } from "@/lib/constants";
import { useCopy } from "@/lib/useCopy";
import { CheckIcon, SendIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export const CopyMailBadge = () => {
	const { hasCopied, handleClick } = useCopy(EMAIL);
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
