import Link from 'next/link';
import dayjs from "dayjs";
import 'dayjs/locale/fr';


export type BlogPostProps = {
    id: string;
    title: string;
    description: string;
    created_at: string;
}

const BlogPost = (post: BlogPostProps) => {
    return (
        <Link href={`/posts/${post.id}`}
              className="!no-underline border-b last:border-transparent dark:last:border-transparent dark:border-gray-800 mb-8 ">
            <div className="w-full">
                <div className="flex flex-col">
                    <div className="flex justify-between mb-2 items-center text-gray-900 dark:text-gray-100">
                        <h3 className="!m-0 text-lg md:text-xl font-medium  ">
                            {post.title}
                        </h3>
                        <span className="font-light text-sm">
                                <span className="hidden md:inline">Publié le </span>
                                <span>{dayjs(post.created_at).locale("fr").format("DD MMMM YYYY")}</span>
                            </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {post.description}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default BlogPost