const systemTheme = matchMedia("(prefers-color-scheme: dark)");
function applyTheme(dark: boolean) {
	document.documentElement.classList.toggle("dark", dark);
	const frame = document.querySelector<HTMLIFrameElement>(
		"iframe.giscus-frame",
	);
	frame?.contentWindow?.postMessage(
		{ giscus: { setConfig: { theme: dark ? "dark" : "light" } } },
		"https://giscus.app",
	);
}
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
	const dark = !document.documentElement.classList.contains("dark");
	applyTheme(dark);
	try {
		localStorage.setItem("theme", dark ? "dark" : "light");
	} catch {
		/* Theme still works without storage. */
	}
});
systemTheme.addEventListener("change", (event) => {
	try {
		if (!["dark", "light"].includes(localStorage.getItem("theme") ?? ""))
			applyTheme(event.matches);
	} catch {
		applyTheme(event.matches);
	}
});
window.addEventListener("storage", (event) => {
	if (event.key === "theme")
		applyTheme(
			event.newValue === "dark" ||
				((!event.newValue || event.newValue === "system") &&
					systemTheme.matches),
		);
});
document.addEventListener("click", async (event) => {
	const button = (event.target as Element).closest<HTMLButtonElement>(
		"[data-copy], [data-copy-code], [data-wrap-code-toggle]",
	);
	if (!button) return;
	const block = button.closest<HTMLElement>("[data-code-block]");
	if (button.hasAttribute("data-wrap-code-toggle")) {
		const enabled = block?.dataset.wrapCode !== "true";
		if (block) block.dataset.wrapCode = String(enabled);
		button.setAttribute("aria-pressed", String(enabled));
		return;
	}
	const text =
		button.dataset.copy ?? block?.querySelector("code")?.textContent ?? "";
	if (button.dataset.copyState) return;
	const originalTitle = button.title;
	const feedback = button.parentElement?.querySelector<HTMLElement>(
		"[data-copy-feedback]",
	);
	const status =
		button.parentElement?.querySelector<HTMLElement>("[data-copy-status]");
	let message = "Copié";
	try {
		await navigator.clipboard.writeText(text);
		button.dataset.copyState = "success";
	} catch {
		button.dataset.copyState = "error";
		message = "La copie a échoué";
	}
	if (status) status.textContent = message;
	if (feedback) {
		feedback.querySelector("[data-copy-message]")!.textContent = message;
		feedback.hidden = false;
		button.setAttribute("aria-describedby", feedback.id);
	} else button.title = message;
	setTimeout(() => {
		delete button.dataset.copyState;
		if (status) status.textContent = "";
		if (feedback) {
			feedback.hidden = true;
			button.removeAttribute("aria-describedby");
		} else button.title = originalTitle;
	}, 2000);
});

const comments = document.querySelector<HTMLElement>("#comments");
if (comments) {
	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			observer.disconnect();
			const script = document.createElement("script");
			script.src = "https://giscus.app/client.js";
			script.async = true;
			script.crossOrigin = "anonymous";
			Object.assign(script.dataset, {
				repo: "vahor/vahor.fr-comments",
				repoId: "R_kgDOLxpd7Q",
				category: "Announcements",
				categoryId: "DIC_kwDOLxpd7c4Ce2zK",
				mapping: "pathname",
				strict: "0",
				reactionsEnabled: "1",
				emitMetadata: "0",
				inputPosition: "top",
				theme: document.documentElement.classList.contains("dark")
					? "dark"
					: "light",
				lang: "fr",
				loading: "lazy",
			});
			comments.append(script);
		},
		{ rootMargin: "200px" },
	);
	observer.observe(comments);
}
