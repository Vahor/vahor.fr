import { allPosts } from "contentlayer/generated";

export default function Home() {
	return (
		<div>
			<ul>
				{allPosts.map((post) => (
					<li key={post._raw.flattenedPath}>
						<h2>{post.title}</h2>
						<a href={post.url}>{post.url}</a>
					</li>
				))}
			</ul>
		</div>
	);
}
