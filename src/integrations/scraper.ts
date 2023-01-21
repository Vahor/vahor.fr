import * as xpath from "xpath";
import {DOMParser} from '@xmldom/xmldom'

type MetaTags = {
    title: string;
    description: string;
    image: string
}

const xpaths = {
    // title is either the first <title> or og:title
    title: 'string(//title | //meta[@property="og:title"]/@content)',
    // description is either the first <meta name="description"> or og:description
    description: 'string(//meta[@name="description"]/@content | //meta[@property="og:description"]/@content)',
    // image is og:image (either name or property)
    image: 'string(//meta[@name="og:image"]/@content | //meta[@property="og:image"]/@content)',
} as const;

const nodesFromDocument = (document: Document, selector: string) => xpath.select(selector, document)
const mapProperties = (paths: any, document: Document) => {
    return Object.keys(paths).reduce((acc, path) => ({...acc, [path]: nodesFromDocument(document, paths[path])}), {})
}

export const extractMetaTags = async (url: string): Promise<MetaTags> => {
    const page = await fetch(url)
    const html = await page.text()
    const document = new DOMParser({
        locator: {},
        errorHandler: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            warning: function () {
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            error: function () {
            },
            fatalError: function (e) {
                console.error(e);
            },
        },
    }).parseFromString(html);

    const properties = mapProperties(xpaths, document)
    return properties as MetaTags
}