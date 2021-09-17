import Posts from 'app/components/Home/Posts'
import Brand from 'app/components/Home/Brand'

import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout, NotionPage } from 'types'
import { GetStaticProps } from "next"
import Notion from 'integrations/notion'
import Meta from 'app/components/meta/Meta'
import { getPlaiceholder } from 'plaiceholder'


export const getStaticProps: GetStaticProps = async () => {
  const posts: NotionPage[] = (await Notion.databases.query({
    database_id: process.env.DATABASE_ID,
  }))?.results


  for (let post of posts.values()) {
    if (post.cover?.external.url) {
      const { base64, img } = await getPlaiceholder(post.cover.external.url, { size: 10 })
      post.cover.external = {
        url: post.cover.external.url,
        blur: base64,
        width: img.width,
        height: img.height,
      }
    }
  }

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 // every hour
  }
}

const Home: NextPageWithLayout = ({ posts }: any) => {
  return (
    <>
      <Meta title="Accueil" />
      <Brand />
      <Posts posts={posts} />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
