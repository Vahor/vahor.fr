import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {

  render() {
    return (
      <Html lang="fr" className="antialiased">
        <Head>
          <script async defer data-website-id="888966bb-9b68-4b33-bba2-e3de58e1ac1e"
                  src="https://analytics.vahor.fr/umami.js"></script>
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;