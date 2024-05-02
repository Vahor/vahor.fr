import {
	Alert,
	AlertDescription,
	AlertTitle,
	type Variant,
} from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

interface CalloutProps {
	variant: Variant;
	title: string;
	children: React.ReactNode;
}

const icon = {
	warning: <TriangleAlertIcon aria-label="Warning" size={16} />,
};

export function Callout({
	title,
	variant,
	children: description,
}: CalloutProps) {
	const Icon = variant && icon[variant as keyof typeof icon];
	return (
		<Alert className="mt-4" variant={variant}>
			{Icon}
			{title && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
