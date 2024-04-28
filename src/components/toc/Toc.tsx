import { allPosts } from "contentlayer/generated";
import { TocLink } from "./TocLink";

interface TocProps {
	prefix: string;
}

export function Toc({ prefix }: TocProps) {

	const matchingPosts = allPosts.filter((post) => post._raw.sourceFilePath.startsWith(prefix)).toSorted((a, b) => {
		const aOrder = a.toc?.order || new Date(a.datePublished).getTime();
		const bOrder = b.toc?.order || new Date(b.datePublished).getTime();
		return aOrder - bOrder;
	});

	return (
		<div className="sticky top-20">
			<nav className="space-y-2">
				<h2 className="text-lg font-semibold">Pages sur le même sujet</h2>
				<ul className="space-y-1">
					{matchingPosts.map((post) => {
						return (
							<li key={post._id}>
								<TocLink post={post} />
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
