import { NotionPage } from "types"
import Link from 'next/link';
import dayjs from "dayjs";
import 'dayjs/locale/fr' // load on demand


interface Props {
    post: NotionPage
}

const BlogPost = ({ post }: Props) => {
    return (
        <Link href={`/posts/${post.id}`}>
            <a className="!no-underline border-b last:border-transparent dark:last:border-transparent dark:border-gray-800 mb-8 ">
                <div className="w-full">
                    <div className="flex flex-col">
                        <div className="flex justify-between mb-2 items-center text-gray-900 dark:text-gray-100">
                            <h3 className="!m-0 text-lg md:text-xl font-medium  ">
                                {post.properties.Name.title[0].plain_text}
                            </h3>
                            <span className="font-light text-sm">
                                <span className="hidden md:inline">Publié le </span>
                                <span>{dayjs(post.properties.Date.date.start).locale("fr").format("DD MMMM YYYY")}</span>
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {post.properties.Summary?.rich_text[0].plain_text}
                        </p>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default BlogPost