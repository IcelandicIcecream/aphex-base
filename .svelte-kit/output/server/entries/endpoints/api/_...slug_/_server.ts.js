//#region src/routes/api/[...slug]/+server.ts
/**
* Catch-all forwarder: any `/api/**` request that doesn't match a specific
* `+server.ts` falls through here and gets handed to the Aphex Hono app.
*
* SvelteKit prefers specific routes over catch-alls, so existing per-endpoint
* shims continue to win during the migration. Once a route is ported into
* the Hono app, deleting its specific `+server.ts` flips traffic over.
*/
var handler = ({ request, locals, getClientAddress }) => {
	const apiApp = locals.aphexCMS?.apiApp;
	if (!apiApp) return new Response("CMS not initialized", { status: 503 });
	try {
		request.headers.set("x-forwarded-for", getClientAddress());
	} catch {}
	return apiApp.fetch(request, {
		aphexCMS: locals.aphexCMS,
		auth: locals.auth ?? null
	});
};
var GET = handler;
var POST = handler;
var PUT = handler;
var DELETE = handler;
var PATCH = handler;
var OPTIONS = handler;
var HEAD = handler;
//#endregion
export { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT };
