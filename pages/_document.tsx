import Document, { Head, NextScript, Html, Main } from "next/document"

class MyDocument extends Document {

    render() {
        return (
            <Html lang="fr" className="antialiased">
                <Head >
                    <link
                        rel="preload"
                        href="/fonts/inter-var-latin.woff2"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument