"use client";

import { EMAIL } from "@/lib/constants";
import { useCopy } from "@/lib/useCopy";
import { CheckIcon, MailIcon, SendIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export const CopyMailBadge = () => {
	const { hasCopied, handleClick } = useCopy(EMAIL);
	const Icon = hasCopied ? CheckIcon : SendIcon;

	return (
		<Badge className="cursor-pointer" onClick={handleClick}>
			<Icon size={16} className="inline-block" />
			<span>{EMAIL}</span>
		</Badge>
	);
};
