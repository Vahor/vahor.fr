import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			<ul>
				{allPosts.map((post) => (
					<li key={post._raw.flattenedPath}>
						<h2>{post.title}</h2>
						<Link href={post.url}>{post.url}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
