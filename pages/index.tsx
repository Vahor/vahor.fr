import Layout from 'app/components/layouts/Layout'
import React from 'react'
import type { NextPageWithLayout } from 'types'

const Home: NextPageWithLayout = () => {
  return (
    <p> yep</p>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
