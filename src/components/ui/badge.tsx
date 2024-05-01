import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline w-max rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 hover:dark:border-neutral-600 bg-accent text-accent-foreground p-1 space-x-1 !no-underline leading-4 text-sm whitespace-nowrap",
	{
		variants: {
			variant: {},
		},
		defaultVariants: {},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
	const Comp = asChild ? Slot : "span";
	return (
		<Comp className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
