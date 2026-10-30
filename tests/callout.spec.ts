import { readFileSync } from "node:fs";
import { transform } from "@astrojs/compiler-rs";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { expect, test } from "@playwright/test";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import remarkDirective from "remark-directive";
import ts from "typescript";
import { addCalloutComponent } from "../src/lib/add-callout-component";

let renderCallout: (props: Record<string, unknown>) => Promise<string>;

test.beforeAll(async () => {
	// Compile the real component, then render it with Astro's installed runtime.
	const filename = new URL(
		"../src/components/mdx/Callout.astro",
		import.meta.url,
	);
	const compiled = transform(readFileSync(filename, "utf8"), {
		filename: filename.pathname,
		internalURL: import.meta.resolve("astro/compiler-runtime"),
		resolvePath: (specifier) => specifier,
		resultScopedSlot: true,
	});
	const { outputText } = ts.transpileModule(compiled.code, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ESNext,
		},
	});
	const { default: Callout } = await import(
		`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
	);
	const container = await AstroContainer.create();
	renderCallout = (props) =>
		container.renderToString(Callout, {
			props,
			slots: { default: "<p>Callout body</p>" },
		});
});

const markdown = await createMarkdownProcessor({
	syntaxHighlight: false,
	remarkPlugins: [remarkDirective, addCalloutComponent],
});

test("callout aliases and explicit types preserve author content", async () => {
	for (const [directive, type] of [
		['callout{type="warning"}', "warning"],
		["info", "info"],
		["warning", "warning"],
		["note", "note"],
		["tip", "tip"],
		["check", "check"],
		['note{type="tip"}', "tip"],
	]) {
		const { code } = await markdown.render(
			`:::${directive}\nA **message**.\n:::`,
		);
		const document = new JSDOM(code).window.document;
		const callouts = document.querySelectorAll("callout");
		expect(callouts).toHaveLength(1);
		expect(callouts[0].getAttribute("type")).toBe(type);
		expect(callouts[0].querySelector("strong")?.textContent).toBe("message");
		const rendered = new JSDOM(
			await renderCallout({ type: callouts[0].getAttribute("type") }),
		).window.document;
		expect(rendered.querySelector("svg")?.getAttribute("aria-label")).toBe(
			type.charAt(0).toUpperCase() + type.slice(1),
		);
	}
});

test("unrelated directives and unsupported callout types are left alone", async () => {
	for (const directive of [
		"unrelated",
		'unrelated{type="warning"}',
		'callout{type="unsupported"}',
		'note{type="unsupported"}',
		'note{type=""}',
		'callout{type="constructor"}',
	]) {
		const { code } = await markdown.render(
			`:::${directive}\nKeep **content**.\n:::`,
		);
		const document = new JSDOM(code).window.document;
		expect(document.querySelector("callout")).toBeNull();
		expect(document.querySelector("strong")?.textContent).toBe("content");
	}
});

test("all callout variants render their title, body and labelled icon", async () => {
	for (const type of ["info", "warning", "note", "tip", "check"]) {
		const document = new JSDOM(await renderCallout({ type, title: "A title" }))
			.window.document;
		const svg = document.querySelector("svg")!;
		expect(svg.getAttribute("role")).toBe("img");
		expect(svg.getAttribute("aria-label")).toBe(
			type.charAt(0).toUpperCase() + type.slice(1),
		);
		expect(document.querySelector("h3")?.textContent?.trim()).toBe("A title");
		expect(document.querySelector(".prose")?.textContent?.trim()).toBe(
			"Callout body",
		);
	}
});
