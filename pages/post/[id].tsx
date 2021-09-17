import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout, NotionPage } from 'types'
import { GetStaticProps, GetStaticPaths } from "next"
import Notion from 'integrations/notion'
import Meta from 'app/components/meta/Meta'
import NotionPageContent from 'app/components/Notion/NotionPageContent'
import { NotionContent } from 'app/components/Notion/types'
import styles from "styles/Notion/notion.module.css"

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps = async (context) => {

    const id = context.params?.id as string
    const post: NotionPage = await Notion.pages.retrieve({
        page_id: id,
    })

    const content = await Notion.blocks.children.list({
        block_id: id,
        page_size: 50, // max 100
    });


    delete post.parent
    delete post.url
    delete post.icon
    delete post.object
    delete post.archived

    return {
        props: {
            post,
            content
        },
        revalidate: 5 * 60 // every 5 minutes
    }
}

interface Props {
    post: NotionPage
    content: NotionContent
}

const PostPage: NextPageWithLayout<Props> = ({ post, content }) => {

    if (!post || !content) {
        return (
            <>
                <Meta title={"Chargement"} contentType={"article"} />
                <article className={`py-8 container prose lg:prose-lg dark:prose-dark max-w-none ${styles.base}`}>
                    <h1 className="bg-gray-400 pb-8 skeleton" />
                    <span className="bg-gray-400 pb-8 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-4/5 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 skeleton mb-12" />

                    <h1 className="bg-gray-400 pb-8 skeleton" />
                    <span className="bg-gray-400 pb-8 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-4/6 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 skeleton mb-12" />

                    <span className={`bg-gray-400 py-64 skeleton mb-2 ${styles.wide}`} />
                    <h1 className="bg-gray-400 pb-8 skeleton mb-12" />

                    <h1 className="bg-gray-400 pb-8 skeleton" />
                    <span className="bg-gray-400 pb-8 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                    <span className="bg-gray-400 pb-6 w-3/4 skeleton mb-1" />
                </article>
            </>
        )
    }

    const type = post.cover?.type
    const cover = type && post.cover?.[type]
    return (
        <>
            <Meta
                title={post.properties.Name.title[0].plain_text}
                imageUrl={cover?.url}
                contentType="article" />
            <NotionPageContent page={content} />
        </>
    )
}

PostPage.getLayout = (page) => <Layout>{page}</Layout>

export default PostPage
