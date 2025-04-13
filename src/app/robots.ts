import { BASE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			disallow: "",
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL,
	};
}
