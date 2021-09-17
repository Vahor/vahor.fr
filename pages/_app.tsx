import type { AppPropsWithLayout } from 'types'

import '../styles/globals.css'
import '../styles/nprogress.css'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
export default MyApp
