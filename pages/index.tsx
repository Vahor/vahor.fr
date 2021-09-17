import Posts from 'app/components/Home/Posts'
import Brand from 'app/components/Home/Brand'

import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout } from 'types'
import { GetStaticProps } from "next"
import Notion from 'integrations/notion'


export const getStaticProps: GetStaticProps = async () => {
  const posts = (await Notion.databases.query({
    database_id: process.env.DATABASE_ID,
  }))?.results

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
      <Brand />
      <Posts posts={posts} />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
