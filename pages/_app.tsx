import type { AppPropsWithLayout } from 'types'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import * as ga from '@/lib/analytics'

import '../styles/globals.css'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const router = useRouter()

  useEffect(() => {

    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)


    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  )
}
export default MyApp
