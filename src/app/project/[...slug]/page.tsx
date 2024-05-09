import PostPage, {
	generateMetadataBuilder,
	postPageBuilder,
} from "@/app/blog/[...slug]/page";
import { allPosts } from "contentlayer/generated";

export const generateStaticParams = async () =>
	allPosts
		.filter((post) => post.pageType === "project")
		.map((post) => ({ slug: post.slug.split("/") }));

export default postPageBuilder("project");
export const generateMetadata = generateMetadataBuilder("project");
