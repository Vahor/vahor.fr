import Head from 'next/head'
import { useRouter } from 'next/router'

type FollowBot = "index,follow" | "noindex,nofollow"
type ContentType = "website" | "article"

interface MetaProps {
    title: string
    description?: string
    imageUrl?: string
    follow?: FollowBot
    contentType?: ContentType
}

const Meta = ({
    title,
    description = "Ut auctor pulvinar lectus ac bibendum. Aenean bibendum tristique sem quis augue.",
    imageUrl = "https://static.vahor.fr/vahor/logo.png",
    follow = "index,follow",
    contentType = "website"
}: MetaProps) => {
    title += " - Vahor"

    const BASE_URL = "https://vahor.fr" + useRouter().asPath

    return (
        <Head>
            <title>{title}</title>
            <meta name="title" content={title} key="title" />
            <meta name="description" content={description} key="description" />

            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content={follow} />
            <meta name="googlebot" content={follow} />
            <meta name="theme-color" content="#82BEF4" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={contentType} />
            <meta property="og:url" content={BASE_URL} key="og:url" />
            <meta property="og:title" content={title} key="og:title" />
            <meta property="og:description" content={description} key="og:description" />
            <meta property="og:image" content={imageUrl} key="og:image" />
            <meta property="og:site_name" content={"Vahor"} key="og:site_name" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={BASE_URL} key="twitter:url" />
            <meta property="twitter:title" content={title} key="twitter:title" />
            <meta property="twitter:description" content={description} key="twitter:description" />
            <meta property="twitter:image" content={imageUrl} key="twitter:image" />
        </Head>
    )
}

export default Meta