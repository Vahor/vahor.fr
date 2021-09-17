import React, { ReactNode } from "react"
import Navbar from "../Navbar"

type Props = {
  children: ReactNode
}

const Layout =  ({ children } : Props) => {
    return (
      <>
        <Navbar/>
        <main className="bg-red-200">{children}</main>
      </>
    )
  }

  export default Layout