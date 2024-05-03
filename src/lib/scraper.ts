"use server";

import { kv } from "@vercel/kv";
import { DOMParser } from "@xmldom/xmldom";
import sharp from "sharp";
import * as xpath from "xpath";

const xpaths = {
	// title is either the first <title> or og:title
	title: 'string(//title | //meta[@property="og:title"]/@content)',
	// description is either the first <meta name="description"> or og:description
	description:
		'string(//meta[@name="description"]/@content | //meta[@property="og:description"]/@content)',
	// image is og:image (either name or property)
	image:
		'string(//meta[@name="og:image"]/@content | //meta[@property="og:image"]/@content)',
	favicon: 'string(//link[@rel="icon" or @rel="shortcut icon"]/@href)',
} as const;
type XPaths = typeof xpaths;
type XPathsKeys = keyof XPaths;

const nodesFromDocument = (document: Document, selector: string) =>
	xpath.select(selector, document);
const mapProperties = (paths: typeof xpaths, document: Document) => {
	const properties = Object.keys(paths) as XPathsKeys[];
	return properties.reduce(
		(acc, path) => {
			acc[path] = nodesFromDocument(document, paths[path]);
			return acc;
		},
		{} as Record<XPathsKeys, xpath.SelectReturnType>,
	);
};

const domParser = new DOMParser({
	locator: {},
	errorHandler: {
		warning: () => {},
		error: () => {},
		fatalError: console.warn,
	},
});

type MetaTags = Record<XPathsKeys, string>;

const cacheKey = (url: string) => `meta:${url}`;

export const extractMetaTags = async (url: string): Promise<MetaTags> => {
	const cleanUrl = url.split("?", 2)[0];
	const urlKey = cacheKey(cleanUrl);
	const cached = await kv.get<MetaTags>(urlKey);
	if (cached) return cached;

	console.log(`Fetching ${url}`);

	const page = await fetch(url, {
		next: {
			revalidate: 24 * 60 * 60, // 24 hours
		},
	});

	const html = await page.text();
	const document = domParser.parseFromString(html);

	const properties = mapProperties(xpaths, document);

	let favicon = properties.favicon?.toString() ?? "";
	favicon =
		favicon &&
		(favicon.startsWith("http") ? favicon : new URL(favicon, url).toString());

	const image = properties.image?.toString() ?? "";

	properties.favicon = await imageToBase64(favicon, 32, 32);
	properties.image = image
		? await imageToBase64(image)
		: await imageToBase64(favicon); // fallback to favicon

	const previousValue = (await kv.get<MetaTags>(urlKey)) ?? properties;

	const newProperties = {
		...properties,
		image:
			properties.image === EMPTY_BASE64_IMAGE
				? previousValue.image
				: properties.image,
		favicon:
			properties.favicon === EMPTY_BASE64_IMAGE
				? previousValue.favicon
				: properties.favicon,
	} as MetaTags;

	kv.set(urlKey, newProperties, { ex: 1000 * 60 * 60 * 24 }); // 24 hours

	return newProperties;
};

const EMPTY_BASE64_IMAGE =
	"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const imageToBase64 = async (url: string, width = 300, height = 300) => {
	if (!url) return EMPTY_BASE64_IMAGE;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "image/*",
		},
	});

	if (!response.ok) {
		console.error(
			`Failed to fetch image: ${url}`,
			response.status,
			await response.text(),
		);
		return EMPTY_BASE64_IMAGE;
	}

	try {
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.startsWith("image")) {
			throw new Error("Invalid content type");
		}

		const blob = await response.arrayBuffer();
		const buffer = Buffer.from(blob);
		let base64: string;
		if (isIcoFavicon(url)) {
			base64 = buffer.toString("base64");
		} else {
			const resized = await sharp(buffer)
				.resize(width, height, {
					withoutEnlargement: true,
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				})
				.toBuffer();
			base64 = resized.toString("base64");
		}

		return `data:${contentType};base64,${base64}`;
	} catch (error) {
		console.error(`Failed to convert image to base64 url: ${url}`, error);
		return EMPTY_BASE64_IMAGE;
	}
};

const isIcoFavicon = (url: string) => url.endsWith(".ico");
