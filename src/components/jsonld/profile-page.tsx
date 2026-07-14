export const JsonLd = ({ jsonLd }: { jsonLd: unknown }) => {
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};
