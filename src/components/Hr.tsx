export default function Hr({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
	return <hr className={`my-16 w-full border-border md:my-24 lg:my-32 ${className ?? ""}`} {...props} />;
}
