import React, { ReactNode } from "react"
import dynamic from 'next/dynamic'

import Navbar from "../Navbar"
const Loading = dynamic(() => import("../Progress"))

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Loading />
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default Layout

