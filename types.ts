import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<T = {}> = NextPage<T> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export enum NotionCoverType {
    file = "file",
    external = "external"
}

export type BlurImage = {
    url: string
    width: number
    height: number
    blur: string
}

export type NotionPage = {
    object?: string
    id: string
    created_time?: Date
    last_edited_time?: Date
    parent?: {
        type: string
        [id: string]: any
    }
    icon?: any
    archived?: boolean
    url?: string
    cover: null | {
        type: NotionCoverType
    } & {
        [type in NotionCoverType]: BlurImage;
    }
    properties: {
        Date: {
            date: {
                start: string
                end: string
            }
        }
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
        Summary: {
            rich_text: {
                plain_text: string
            }[]
        }
    }
}

