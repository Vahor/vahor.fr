import type { AppPropsWithLayout } from 'types'
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  )
}
export default MyApp
