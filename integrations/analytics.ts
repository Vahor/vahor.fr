export const pageview = (url: string) => {
    window?.gtag?.('config', process.env.GOOGLE_ANALYTICS_ID as string, {
        page_path: url,
    })
}

// log specific events happening.
export const event = ({ action, params }: any) => {
    window?.gtag?.('event', action, params)
}