import Posts from 'app/components/Home/Posts'
import Brand from 'app/components/Home/Brand'
import About from 'app/components/Home/About'
import Contact from 'app/components/Home/Contact'

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
    const type = post.cover?.type
    if (type && post.cover?.[type]) {
      const { base64, img } = await getPlaiceholder(post.cover[type].url, { size: 10 })
      post.cover[type] = {
        url: post.cover[type].url,
        blur: base64,
        width: img.width,
        height: img.height,
      }
    }
  }

  // Remove unused properties
  delete posts[0].object
  delete posts[0].parent
  delete posts[0].icon
  delete posts[0].url
  delete posts[0].archived
  delete posts[0].url
  delete posts[0].last_edited_time
  delete posts[0].created_time

  return {
    props: {
      posts
    },
    revalidate: 5 * 60 // every 5 minutes
  }
}

const Home: NextPageWithLayout = ({ posts }: any) => {
  return (
    <>
      <Meta title="Accueil" />
      <Brand />
      <Posts posts={posts} />
      <About />
      <Contact />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
