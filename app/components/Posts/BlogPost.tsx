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
            <a className="!no-underline">
                <div className="pb-8 w-full">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                            <h4 className="!m-0 text-lg md:text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                                {post.properties.Name.title[0].plain_text}
                            </h4>
                            <span className="font-light">
                                Publié le {dayjs(post.properties.Date.date.start).locale("fr").format("DD MMMM YYYY")}
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