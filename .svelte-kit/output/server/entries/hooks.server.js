import { n as private_env } from "../chunks/shared-server.js";
import { t as building } from "../chunks/environment.js";
import { n as createCMSHook } from "../chunks/server.js";
import { n as auth } from "../chunks/service.js";
import { t as aphex_config_default } from "../chunks/aphex.config.js";
import { i as systemContext } from "../chunks/string-case.js";
import "../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
//#region ../../node_modules/.pnpm/better-auth@1.5.3_584b0f4c925959313cfa969886210541/node_modules/better-auth/dist/integrations/svelte-kit.mjs
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
* exists and holds zero documents of any seeded type. That makes it safe to leave
* enabled — it can populate exactly one moment in a site's life, right after the
* first signup, and can never stomp anything a person made.
*
* The base template's content model is a single example `page` type, so the seed
* creates one welcome page. As you grow your own schemas, grow this file with
* them (add your types to SEEDED_TYPES so their presence blocks re-seeding) —
* or delete the directory and the seed hook if you don't want seeding at all.
* Kill switch without deleting: set `APHEX_SEED=false`.
*/
/** The document types the seed creates — and the types whose presence blocks it. */
var SEEDED_TYPES = ["page"];
/** Create the example content: a single welcome page. */
async function seedContent(aphex, context) {
	await aphex.localAPI.collections.page.create(context, {
		title: "Welcome to Aphex",
		slug: "welcome",
		body: "This page was created automatically on first run so the admin has something to show.\n\nEdit or delete it, then make the content model your own: schemas live in src/lib/schemaTypes/, and `pnpm generate:types` keeps the frontend honest about them."
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
var routingHook = async ({ event, resolve }) => {
	if (event.url.pathname === "/") throw redirect(302, "/admin");
	return resolve(event);
};
var handle = sequence(authHook, aphexHook, seedHook, routingHook);
//#endregion
export { handle };
