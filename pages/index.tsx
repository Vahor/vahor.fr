import Posts from 'app/components/Home/Posts'
import Brand from 'app/components/Home/Brand'

import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout } from 'types'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Brand />
      <Posts />
    </>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
