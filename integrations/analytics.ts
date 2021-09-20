// log the pageview with their URL
export const pageview = (url: string) => {
    console.log("pageview", url)
    window?.gtag?.('config', process.env.GOOGLE_ANALYTICS_ID as string, {
        page_path: url,
    })
}

// log specific events happening.
export const event = ({ action, params }: any) => {
    window?.gtag?.('event', action, params)
}