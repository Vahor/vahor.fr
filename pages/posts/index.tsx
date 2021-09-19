
import type { NextPageWithLayout, NotionPage } from 'types'
import Meta from '@/components/meta/Meta'
import Layout from '@/components/layouts/Layout'
import BlogPost from '@/components/Posts/BlogPost'
import { GetStaticProps } from "next"
import Notion from 'integrations/notion'
import { useState } from 'react'

export const getStaticProps: GetStaticProps = async () => {
    const posts: NotionPage[] = (await Notion.databases.query({
        database_id: process.env.DATABASE_ID
    }))?.results


    for (let post of posts.values()) {
        // Remove unused properties
        delete post.object
        delete post.parent
        delete post.icon
        post.cover = null
        delete post.url
        delete post.archived
        delete post.url
        delete post.last_edited_time
        delete post.created_time
    }


    return {
        props: {
            posts
        },
        revalidate: 5 * 60 // every 5 minutes
    }
}

interface Props {
    posts: NotionPage[];
}

const PostsPage: NextPageWithLayout<Props> = ({ posts }) => {

    const [searchValue, setSearchValue] = useState<string>('');
    const filteredBlogPosts = posts
        .sort((a, b) => Number(new Date(b.created_time!)) - Number(new Date(a.created_time!))
        )
        .filter((post) =>
            post.properties.Name.title[0].plain_text.toLowerCase().includes(searchValue.toLowerCase())
        );
    return (
        <>
            <Meta title="Blog" />

            <div className={`py-8 container prose dark:prose-dark max-w-none base`}>
                <h1 className="font-bold text-3xl md:text-5xl mb-4">
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

                <h3 className="font-bold text-2xl md:text-4xl mb-4 mt-8 text-black dark:text-white">
                    Tous les articles
                </h3>
                {!filteredBlogPosts.length &&
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Aucun article trouvé.
                    </p>
                }
                {filteredBlogPosts.map((post) => (
                    <BlogPost key={post.id} post={post} />
                ))}
            </div>
        </>
    )
}

PostsPage.getLayout = (page) => <Layout>{page}</Layout>

export default PostsPage