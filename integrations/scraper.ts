import * as xpath from "xpath";
import { DOMParser } from "xmldom"

type MetaTags = {
    title: string;
    description: string;
    image: string
}

const xpaths = {
    title: 'string(//meta[@property="og:title"]/@content)',
    description: 'string(//meta[@property="og:description"]/@content)',
    image: 'string(//meta[@property="og:image"]/@content)'
}

const nodesFromDocument = (document: Document, selector: string) => xpath.select(selector, document)
const mapProperties = (paths: any, document: Document) => {
    return Object.keys(paths).reduce((acc, path) => ({ ...acc, [path]: nodesFromDocument(document, paths[path]) }), {})
}

export const extractMetaTags = async (url: string): Promise<MetaTags> => {
    const page = await fetch(url)
    const html = await page.text()
    const document = new DOMParser().parseFromString(html)
    const properties = mapProperties(xpaths, document)
    return properties as MetaTags
}