import Posts from '@/components/Home/Posts'
import Brand from '@/components/Home/Brand'
import About from '@/components/Home/About'
import Contact from '@/components/Home/Contact'

import Layout from '@/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout, NotionPage } from 'types'
import { GetStaticProps } from "next"
import Notion from 'integrations/notion'
import Meta from '@/components/meta/Meta'
import { getPlaiceholder } from 'plaiceholder'
import OrganizationMeta from '@/components/meta/OrganizationMeta'


export const getStaticProps: GetStaticProps = async () => {
  const posts: NotionPage[] = (await Notion.databases.query({
    database_id: process.env.DATABASE_ID,
    filter: {
      "and": [
        {
          property: 'Project',
          checkbox: {
            equals: true,
          },
        }
      ]
    }
  }))?.results


  const tags: string[] = []
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

    post.properties.Tags.multi_select.forEach(tag => {
      if (tags.indexOf(tag.name) === -1) tags.push(tag.name)
    })

    // Remove unused properties
    delete post.object
    delete post.parent
    delete post.icon
    delete post.url
    delete post.archived
    delete post.url
    delete post.last_edited_time
    delete post.created_time
    delete post.properties.Summary
  }

  // Sort
  tags.sort();

  // "Autre" at the end
  const i = tags.indexOf("Autre")
  tags.splice(i, 1);
  tags.push("Autre")


  return {
    props: {
      posts,
      tags
    },
    revalidate: 5 * 60 // every 5 minutes
  }
}

const Home: NextPageWithLayout = ({ posts, tags }: any) => {
  return (
    <>
      <Meta title="Accueil" />
      <OrganizationMeta />
      <Brand />
      <Posts posts={posts} tags={tags} />
      <About />
      <Contact />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
