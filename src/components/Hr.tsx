import { cn } from "@/lib/utils";
import type { HTMLProps } from "react";

export default function Hr({ className, ...props }: HTMLProps<HTMLHRElement>) {
	return <hr className={cn("my-4 md:my-8", className)} {...props} />;
}
