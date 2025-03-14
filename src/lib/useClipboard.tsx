import { useState } from "react";

export const useClipboard = (text: string) => {
	const [hasCopied, setHasCopied] = useState(false);

	const handleClick = () => {
		if (hasCopied) return;

		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
		}
		setHasCopied(true);

		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	};

	return { hasCopied, handleClick };
};
