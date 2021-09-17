import Document, { Head, NextScript, Html, Main } from "next/document"

class MyDocument extends Document {

    render() {
        return (
            <Html lang="fr" className="antialiased">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument