import { t as private_env } from "../chunks/shared-server.js";
import { t as building } from "../chunks/internal2.js";
import { t as cmsLogger } from "../chunks/logger.js";
import "../chunks/dist.js";
import { t as auth } from "../chunks/auth.js";
import { n as createCMSHook } from "../chunks/server3.js";
import { n as systemContext } from "../chunks/auth-helpers.js";
import { n as bootstrapPolicy } from "../chunks/auth.config.js";
import { t as aphex_config_default } from "../chunks/aphex.config.js";
import { sequence } from "@sveltejs/kit/hooks";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
//#region ../../node_modules/.pnpm/better-auth@1.6.25_@opentelemetry+api@1.9.0_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9_c15da60c156c14277b69caa5d3a63f80/node_modules/better-auth/dist/integrations/svelte-kit.mjs
var svelteKitHandler = async ({ auth, event, resolve, building }) => {
	if (building) return resolve(event);
	const { request, url } = event;
	if (isAuthPath(url.toString(), auth.options)) return auth.handler(request);
	return resolve(event);
};
function isAuthPath(url, options) {
	const _url = new URL(url);
	const baseURLStr = typeof options.baseURL === "string" ? options.baseURL : void 0;
	const baseURL = new URL(`${baseURLStr || _url.origin}${options.basePath || "/api/auth"}`);
	if (_url.origin !== baseURL.origin) return false;
	if (!_url.pathname.startsWith(baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`)) return false;
	return true;
}
//#endregion
//#region src/lib/server/seed/index.ts
/**
* First-run seed for the base template.
*
* `seedOnFirstRun(locals)` is wired into `hooks.server.ts`. It runs once per
* process, and only when the site is completely untouched: the first organization
* exists and holds no example page. That makes it safe to leave
* enabled — it can populate exactly one moment in a site's life, right after the
* first signup, and can never stomp anything a person made.
*
* The base template's content model is a single example `page` type, so the seed
* creates one welcome page. As you grow your own schemas, grow this file with
* them (add your types to SEEDED_TYPES so their presence blocks re-seeding) —
* or delete the directory and the seed hook if you don't want seeding at all.
* Kill switch without deleting: set `APHEX_SEED=false`.
*/
/** Content whose presence proves the site has moved beyond its automatic empty singleton. */
var SEEDED_TYPES = ["page"];
/**
* The seed's bundled images, in `./assets/`.
*
* Resolved relative to *this module*, not the working directory: the seed runs from
* wherever the server was started, and a `resolve('static/…')` only works while that
* happens to be the project root. They live outside `static/` on purpose — anything
* under `static/` is served publicly — and they are PNGs rather than the SVGs the marks
* were drawn as, because `image/svg+xml` is not in the CMS's default accepted types (an
* SVG is a document that can carry script, so uploading one is a stored-XSS risk).
*/
var assetsDir = fileURLToPath(new URL("./assets/", import.meta.url));
var imageValue = (id, alt) => id ? {
	_type: "image",
	asset: {
		_type: "reference",
		_ref: id
	},
	alt
} : void 0;
/**
* Create the example content: a single welcome page.
*
* `content` is Portable Text, so it is written as blocks rather than a string —
* every block and span needs its own `_key`. Keep this in step with the `page`
* schema: a field renamed there and not here seeds a document with a dead field
* and an empty body, which looks like a broken install on someone's first run.
*/
async function seedContent(aphex, context) {
	const uploadBundledImage = async (file, originalFilename, mimeType, alt) => {
		try {
			const buffer = await readFile(assetsDir + file);
			return (await aphex.assetService.uploadAsset(context.organizationId, {
				buffer,
				originalFilename,
				mimeType,
				size: buffer.length,
				alt
			})).id;
		} catch (error) {
			console.warn(`[seed] Could not upload bundled image ${originalFilename}:`, error);
			return null;
		}
	};
	const [wordmarkId, markId] = await Promise.all([uploadBundledImage("logo.png", "aphex-wordmark.png", "image/png", "Aphex"), uploadBundledImage("mark.png", "aphex-mark.png", "image/png", "Aphex mark")]);
	const settings = aphex.localAPI.collections.siteSettings;
	await settings.get(context, { perspective: "draft" });
	const settingsId = settings.getSingletonId(context);
	if (settingsId) await settings.update(context, settingsId, {
		title: "Aphex",
		description: "A starter site built on AphexCMS — the CMS and the site are the same SvelteKit app.",
		logo: imageValue(wordmarkId, "Aphex"),
		favicon: imageValue(markId, "Aphex mark"),
		logoHeight: 40
	}, { publish: true });
	await aphex.localAPI.collections.page.create(context, {
		title: "Welcome to Aphex",
		slug: "welcome",
		excerpt: "Your CMS and your site are the same app. This page is stored as Portable Text and rendered by the route it lives at.",
		coverImage: imageValue(wordmarkId, "Aphex"),
		content: [
			{
				_type: "block",
				_key: "intro",
				style: "normal",
				children: [
					{
						_type: "span",
						_key: "intro-1",
						text: "This page was created on first run so the studio has something to show. It was stored as Portable Text and rendered by ",
						marks: []
					},
					{
						_type: "span",
						_key: "intro-2",
						text: "src/routes/(site)/[slug]/+page.svelte",
						marks: ["code"]
					},
					{
						_type: "span",
						_key: "intro-3",
						text: " — the same SvelteKit app that serves the admin.",
						marks: []
					}
				]
			},
			{
				_type: "block",
				_key: "h-schema",
				style: "h2",
				children: [{
					_type: "span",
					_key: "h-schema-1",
					text: "What the schema shows off",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "schema-lede",
				style: "normal",
				children: [{
					_type: "span",
					_key: "schema-lede-1",
					text: "Open this page in the studio and you will find three tabs across the top — Content, Media, SEO. Those are field groups. The fields cover most of what you would reach for:",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "li-rich",
				style: "normal",
				listItem: "bullet",
				level: 1,
				children: [{
					_type: "span",
					_key: "li-rich-1",
					text: "Rich text",
					marks: ["strong"]
				}, {
					_type: "span",
					_key: "li-rich-2",
					text: " — an array of blocks, not a field type. Headings, lists, quotes, inline code and links all live in here.",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "li-slug",
				style: "normal",
				listItem: "bullet",
				level: 1,
				children: [{
					_type: "span",
					_key: "li-slug-1",
					text: "A slug",
					marks: ["strong"]
				}, {
					_type: "span",
					_key: "li-slug-2",
					text: " derived from the title as you type, stored as a plain string.",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "li-image",
				style: "normal",
				listItem: "bullet",
				level: 1,
				children: [{
					_type: "span",
					_key: "li-image-1",
					text: "An image field",
					marks: ["strong"]
				}, {
					_type: "span",
					_key: "li-image-2",
					text: " wired to the asset browser, with alt text per placement.",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "quote",
				style: "blockquote",
				children: [{
					_type: "span",
					_key: "quote-1",
					text: "Delete this page and the page schema once your own content model exists. Nothing else depends on them.",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "h-next",
				style: "h2",
				children: [{
					_type: "span",
					_key: "h-next-1",
					text: "Where to go next",
					marks: []
				}]
			},
			{
				_type: "block",
				_key: "docs",
				style: "normal",
				children: [
					{
						_type: "span",
						_key: "docs-1",
						text: "The ",
						marks: []
					},
					{
						_type: "span",
						_key: "docs-2",
						text: "Aphex documentation",
						marks: ["docs-link"]
					},
					{
						_type: "span",
						_key: "docs-3",
						text: " covers schemas, the Local API, deployment and the rest. Schemas live in src/lib/schemaTypes/, and the query behind this page is a dozen lines of Local API in +page.server.ts — no HTTP round-trip.",
						marks: []
					}
				],
				markDefs: [{
					_key: "docs-link",
					_type: "link",
					href: "https://docs.getaphex.com",
					blank: true
				}]
			},
			{
				_type: "block",
				_key: "agents",
				style: "normal",
				children: [
					{
						_type: "span",
						_key: "agents-1",
						text: "If you are pointing an AI agent at this project, read ",
						marks: []
					},
					{
						_type: "span",
						_key: "agents-2",
						text: "AGENTS.md",
						marks: ["code"]
					},
					{
						_type: "span",
						_key: "agents-3",
						text: " first — this CMS describes its own schema over MCP, so an agent never has to guess. Content is stored as ",
						marks: []
					},
					{
						_type: "span",
						_key: "agents-4",
						text: "Portable Text",
						marks: ["pt-link"]
					},
					{
						_type: "span",
						_key: "agents-5",
						text: ".",
						marks: []
					}
				],
				markDefs: [{
					_key: "pt-link",
					_type: "link",
					href: "https://portabletext.org",
					blank: true
				}]
			}
		],
		seoTitle: "Welcome to Aphex",
		seoDescription: "A starter page demonstrating field groups, rich text, slugs and images in AphexCMS."
	}, { publish: true });
	return { pages: 1 };
}
/**
* Per-process latch. `'done'` means "decided" — either we seeded, or the site was
* already touched. A pending promise dedupes concurrent first requests. `null`
* means "no organization yet, check again next request" (pre-signup; signup
* creates the org mid-request, so the decision lands on the request after it).
*/
var seedState = null;
/** Seed example content the first time the app runs against an untouched site. */
function seedOnFirstRun(locals) {
	if (seedState === "done") return Promise.resolve();
	if (seedState) return seedState;
	const attempt = (async () => {
		const { databaseAdapter } = locals.aphexCMS;
		const org = (await databaseAdapter.findAllOrganizations())[0];
		if (!org) {
			seedState = null;
			return;
		}
		const counts = await databaseAdapter.getDocCountsByType(org.id);
		if (SEEDED_TYPES.some((type) => (counts[type] ?? 0) > 0)) {
			seedState = "done";
			return;
		}
		console.log("[seed] Fresh site detected — creating example content…");
		const created = await seedContent(locals.aphexCMS, systemContext(org.id));
		console.log(`[seed] Done: ${created.pages} page.`);
		seedState = "done";
	})().catch((error) => {
		console.error("[seed] Failed to seed example content:", error);
		seedState = "done";
	});
	seedState = attempt;
	return attempt;
}
/** Whether the first-run seed is enabled (kill switch: `APHEX_SEED=false`). */
function seedEnabled() {
	return private_env.APHEX_SEED !== "false";
}
//#endregion
//#region src/hooks.server.ts
var authHook = async ({ event, resolve }) => {
	return svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});
};
var aphexHook = createCMSHook(aphex_config_default);
var seedHook = async ({ event, resolve }) => {
	if (!building && seedEnabled()) await seedOnFirstRun(event.locals);
	return resolve(event);
};
var bootstrapPrepared = false;
var bootstrapHook = async ({ event, resolve }) => {
	if (!building && !bootstrapPrepared) {
		bootstrapPrepared = true;
		try {
			await bootstrapPolicy.prepare?.(event.locals.aphexCMS.databaseAdapter);
		} catch (error) {
			cmsLogger.error("[Bootstrap]", "Failed to prepare bootstrap policy:", error);
		}
	}
	return resolve(event);
};
var handle = sequence(authHook, aphexHook, bootstrapHook, seedHook);
//#endregion
export { handle };
