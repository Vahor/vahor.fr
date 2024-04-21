"use server";

import * as xpath from "xpath";
import { DOMParser } from '@xmldom/xmldom'

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
type XPaths = typeof xpaths
type XPathsKeys = keyof XPaths

const nodesFromDocument = (document: Document, selector: string) => xpath.select(selector, document)
const mapProperties = (paths: typeof xpaths, document: Document) => {
	const properties = Object.keys(paths) as XPathsKeys[]
	return properties.reduce((acc, path) => {
		acc[path] = nodesFromDocument(document, paths[path])
		return acc
	}, {} as Record<XPathsKeys, xpath.SelectReturnType>)
}

const domParser = new DOMParser({
	locator: {},
	errorHandler: {
		warning: () => {
		},
		error: () => {
		},
		fatalError: console.error,
	},
})

export const extractMetaTags = async (url: string): Promise<MetaTags> => {
	const page = await fetch(url,
		{
			next: {
				revalidate: 24 * 60 * 60, // 24 hours
			},
		}
	)

	const html = await page.text()
	const document = domParser.parseFromString(html);

	const properties = mapProperties(xpaths, document)
	return properties as MetaTags
}
