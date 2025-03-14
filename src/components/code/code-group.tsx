"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ComponentPropsWithoutRef } from "react";

interface CodeWrapButtonProps extends ComponentPropsWithoutRef<"button"> {
	wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export function CodeWrapButton({ wrapperRef, ...props }: CodeWrapButtonProps) {
	const toggle = () => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const isEnabled = wrapper.getAttribute("data-wrap-code") === "true";
		wrapper.setAttribute("data-wrap-code", String(!isEnabled));
	};

	return (
		<Tooltip>
			<TooltipTrigger
				aria-label="Wrap code"
				{...props}
				onClick={toggle}
				className="hover:text-zinc-400 group-data-[wrap-code=true]:text-zinc-400"
			>
				<svg
					role="img"
					aria-label="Wrap code icon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width={24}
					height={24}
					color="currentColor"
					fill="none"
					className="size-[18px] transform transition-transform duration-100 active:scale-95"
				>
					<path
						d="M3 3H21"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 15H9"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 21H9"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12M12 18C12 17.1597 14.3932 15.5898 15 15M12 18C12 18.8403 14.3932 20.4102 15 21"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TooltipTrigger>
			<TooltipContent side="left">Wrap code</TooltipContent>
		</Tooltip>
	);
}
