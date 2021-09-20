import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout, NotionPage } from 'types'
import { GetStaticProps, GetStaticPaths } from "next"
import Notion from 'integrations/notion'
import Meta from 'app/components/meta/Meta'
import NotionPageContent from 'app/components/Notion/NotionPageContent'
import { NotionContent } from 'app/components/Notion/types'
import { extractMetaTags } from '@/lib/scraper'
import { getPlaiceholder } from 'plaiceholder'

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps = async (context) => {

    const id = context.params?.id as string
    const post: NotionPage = await Notion.pages.retrieve({
        page_id: id,
    })

    let content: NotionContent = await Notion.blocks.children.list({
        block_id: id,
        page_size: 50, // max 100
    });

    content.results = await Promise.all(Object.values(content?.results).map(async (block) => {
        if (block.type === "bookmark") {
            const meta = await extractMetaTags(block.bookmark.url)
            const { base64, img } = await getPlaiceholder(meta.image, { size: 10 })

            block["bookmark"].meta = {
                title: meta.title,
                description: meta.description.substring(0, 100),
                image: {
                    url: meta.image,
                    blur: base64,
                    width: img.width,
                    height: img.height
                }
            }
            console.log(block.bookmark)
        }

        return block
    }))



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

                <article className={`py-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}>
                    <h1 className="pb-16 skeleton !mb-4" />
                    <p className="pb-24 mb-12 skeleton" />
                    <div className="border-b dark:border-gray-800" />

                    <h2 className="pb-8 skeleton" />
                    <span className="pb-8 skeleton mb-1" />
                    <span className="pb-6 w-3/4 skeleton mb-1" />
                    <span className="pb-6 skeleton mb-1" />
                    <span className="pb-6 w-4/5 skeleton mb-1" />
                    <span className="pb-6 skeleton mb-12" />

                    <h2 className="pb-8 skeleton" />
                    <span className="pb-8 skeleton mb-1" />
                    <span className="pb-6 skeleton mb-1" />
                    <span className="pb-6 w-3/4 skeleton mb-1" />
                    <span className="pb-6 w-3/4 skeleton mb-1" />
                    <span className="pb-6 skeleton mb-12" />

                    <span className={`py-64 skeleton mb-2 wide`} />
                    <h2 className="pb-8 skeleton mb-12" />

                    <h2 className="pb-8 skeleton" />
                    <span className="pb-8 skeleton mb-1" />
                    <span className="pb-6 skeleton mb-1" />
                    <span className="pb-6 w-3/4 skeleton mb-1" />
                    <span className="pb-6 w-3/4 skeleton mb-1" />
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

            <div className={`pt-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}>
                <h1 className="font-bold text-3xl md:text-5xl !mb-4">
                    {post.properties.Name.title[0].plain_text}
                </h1>
                <p className="pb-12 border-b dark:border-gray-800">
                    {post.properties.Summary?.rich_text[0].plain_text}
                </p>
            </div>

            <NotionPageContent page={content} />
        </>
    )
}

PostPage.getLayout = (page) => <Layout>{page}</Layout>

export default PostPage
