import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout, NotionPage } from 'types'
import { GetStaticProps, GetStaticPaths } from "next"
import Notion from 'integrations/notion'
import Meta from 'app/components/meta/Meta'
import NotionPageContent from 'app/components/Notion/NotionPageContent'

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

    return {
        props: {
            post,
            content
        },
        revalidate: 60 * 60 // every hour
    }
}

const PostPage: NextPageWithLayout = ({ post, content }: any) => {
    return (
        <>
            <Meta title="Accueil" />
            <NotionPageContent page={content} />
        </>
    )
}

PostPage.getLayout = (page) => <Layout>{page}</Layout>

export default PostPage
