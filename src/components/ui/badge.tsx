import { Slot } from "@radix-ui/react-slot";

function Badge({
  asChild,
  className,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className="!no-underline inline w-max cursor-pointer space-x-1 whitespace-nowrap rounded-md border border-neutral-200 bg-card p-1 text-accent-foreground text-sm leading-4 hover:border-neutral-300 dark:border-neutral-700 hover:dark:border-neutral-600"
      {...props}
    />
  );
}

export { Badge };
