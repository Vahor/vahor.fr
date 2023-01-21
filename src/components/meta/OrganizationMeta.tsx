import Head from 'next/head'

export const OrganizationMeta = () => {

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://vahor.fr/",
                        "logo": "https://static.vahor.fr/vahor/logo.png"
                    })
                }} />
        </Head>
    )

}
