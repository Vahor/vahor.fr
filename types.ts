import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export type NotionPage = {
    id: string
    created_time: Date
    cover: null | {
        external: {
            url: string
            width: number
            height: number
            blur: string
        }
    }
    properties: {
        Tags: {
            multi_select: {
                name: string
                color: string
            }[]
        }
        Name: {
            title: {
                plain_text: string
            }[]
        }
    }
}

