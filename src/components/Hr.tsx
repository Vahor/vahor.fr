import type { HTMLProps } from "react";
import { cn } from "@/lib/utils";

export default function Hr({ className, ...props }: HTMLProps<HTMLHRElement>) {
	return <hr className={cn("my-4 md:my-8", className)} {...props} />;
}
