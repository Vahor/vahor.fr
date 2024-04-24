import { JsonLd } from "@/components/jsonld/profile-page";
import { author } from "@/lib/jsonld";

export default function AboutPage() {
	return (
		<div>
			<JsonLd jsonLd={author} />
		</div>
	);
}
