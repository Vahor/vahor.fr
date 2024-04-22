"use server";

import * as xpath from "xpath";
import { DOMParser } from '@xmldom/xmldom'
import cache from 'memory-cache'

const xpaths = {
	// title is either the first <title> or og:title
	title: 'string(//title | //meta[@property="og:title"]/@content)',
	// description is either the first <meta name="description"> or og:description
	description: 'string(//meta[@name="description"]/@content | //meta[@property="og:description"]/@content)',
	// image is og:image (either name or property)
	image: 'string(//meta[@name="og:image"]/@content | //meta[@property="og:image"]/@content)',
	favicon: 'string(//link[@rel="icon" or @rel="shortcut icon"]/@href)',
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

type MetaTags = Record<XPathsKeys, string>

export const extractMetaTags = async (url: string): Promise<MetaTags> => {

	const cleanUrl = url.split('?', 2)[0]
	const cached = cache.get(cleanUrl)
	if (cached) return cached as MetaTags

	console.log(`Fetching ${url}`)

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

	let favicon = properties.favicon?.toString() ?? ''
	favicon = favicon && (favicon.startsWith('http') ? favicon : new URL(favicon, url).toString())

	const image = properties.image?.toString() ?? ''

	properties.favicon = await imageToBase64(favicon)
	properties.image = image ? await imageToBase64(image) : properties.favicon

	cache.put(cleanUrl, properties)

	return properties as MetaTags
}

const EMPTY_BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='

const imageToBase64 = async (url: string) => {
	if (!url) return EMPTY_BASE64_IMAGE
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'image/*',
		}
	})
	const blob = await response.arrayBuffer()
	const buffer = Buffer.from(blob)
	const base64 = buffer.toString('base64')
	return `data:${response.headers.get('content-type')};base64,${base64}`
}

