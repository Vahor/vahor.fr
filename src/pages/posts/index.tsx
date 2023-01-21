import {Meta} from '@/components/meta'
import type {GetStaticProps, NextPage} from "next"
import {useState} from 'react'
import Notion from "@/integrations/notion";
import type {DatabaseResponse} from "@/types/notion";
import {env} from "@/env/server.mjs";
import type {BlogPostProps} from "@/components/Posts/BlogPost";
import BlogPost from "@/components/Posts/BlogPost";

export const getStaticProps: GetStaticProps = async () => {
    const database = (await Notion.databases.query({
        database_id: env.DATABASE_ID
    })) as unknown as DatabaseResponse;
    const posts = database.results

    const results: BlogPostProps[] = await Promise.all(posts.map(async post => {
        return {
            id: post.id,
            title: post.properties.Name.title[0].plain_text,
            description: post.properties.Summary.rich_text[0].plain_text,
            created_at: post.properties.Date.date.start,
        }
    }))


    return {
        props: {
            posts: results
        },
        revalidate: 5 * 60 // every 5 minutes
    }
}

interface PostsPageProps {
    posts: BlogPostProps[];
}

const PostsPage: NextPage<PostsPageProps> = ({posts}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const filteredBlogPosts = posts
        .sort((a, b) => Number(new Date(b.created_at || 'now')) - Number(new Date(a.created_at || 'now'))
        )
        .filter((post) =>
            post.title.toLowerCase().includes(searchValue.toLowerCase())
        );
    return (
        <>
            <Meta title="Blog"/>

            <div className={`py-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}>
                <h1 className="font-bold text-3xl md:text-5xl !mb-4">
                    Blog
                </h1>
                <p className="mb-4">
                    Depuis 2021, j&apos;ai écrit {posts.length} articles différents sur ce site.
                    Utilises la barre de recherche pour filtrer par titre
                </p>
                <div className="relative w-full mb-4">
                    <input
                        aria-label="Chercher un article"
                        type="text"
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Chercher un article"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-900 w-full rounded-md"
                    />
                </div>

                <h2 className="font-bold mb-6 mt-8 text-black dark:text-white">
                    Tous les articles
                </h2>
                {!filteredBlogPosts.length &&
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Aucun article trouvé.
                    </p>
                }
                {filteredBlogPosts.map((post) => (
                    <BlogPost key={post.id} {...post}/>
                ))}
            </div>
        </>
    )
}

export default PostsPage