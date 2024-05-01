export const JsonLd = ({ jsonLd }: { jsonLd: unknown }) => {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a JSON object
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
};
