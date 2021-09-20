import type { AppPropsWithLayout } from 'types'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { NextWebVitalsMetric } from 'next/app'

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

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
  // Use `window.gtag` if you initialized Google Analytics as this example:
  // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
  window.gtag('event', name, {
    event_category:
      label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
}
export default MyApp
