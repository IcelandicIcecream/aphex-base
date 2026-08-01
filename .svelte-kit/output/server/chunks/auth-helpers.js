//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/local-api/auth-helpers.js
/**
* Convert SvelteKit locals.auth to LocalAPIContext
*
* This helper bridges the gap between the authentication system
* (handled in the app layer and enriched by handleAuthHook) and
* the LocalAPI's context-based approach.
*
* Preserves the full Auth object in context.auth so custom permission
* logic can access any custom fields added via module augmentation.
*
* @param auth - Auth object from locals.auth (already validated by handleAuthHook)
* @returns LocalAPIContext for use with LocalAPI operations
*
* @example
* ```typescript
* // In a SvelteKit route handler
* import { authToContext } from '@aphexcms/cms-core/local-api';
*
* export const GET: RequestHandler = async ({ locals }) => {
*   const api = locals.aphexCMS.localAPI;
*   const context = authToContext(locals.auth);
*
*   const pages = await api.collections.page.find(context, {
*     where: { status: { equals: 'published' } }
*   });
*
*   return json({ data: pages });
* };
* ```
*/
function authToContext(auth) {
	if (!auth) throw new Error("Authentication required");
	if (auth.type === "session") return {
		organizationId: auth.organizationId,
		user: auth.user,
		auth
	};
	if (auth.type === "api_key") return {
		organizationId: auth.organizationId,
		user: {
			id: `apikey:${auth.keyId}`,
			email: `apikey-${auth.name}@system`,
			name: auth.name,
			role: auth.permissions.includes("write") ? "editor" : "viewer"
		},
		auth
	};
	throw new Error("Unknown auth type");
}
/**
* Create a system context for operations that bypass normal permissions
* Use this for seed scripts, cron jobs, migrations, and other system-level operations
*
* @param organizationId - Organization ID for the operation
* @returns LocalAPIContext with overrideAccess: true
*
* @example
* ```typescript
* // In a seed script
* import { systemContext } from '@aphexcms/cms-core/local-api';
*
* const api = getLocalAPI();
* const context = systemContext('org_123');
*
* await api.collections.page.create(context, {
*   data: { title: 'Home', slug: 'home' },
*   publish: true
* });
* ```
*/
function systemContext(organizationId) {
	return {
		organizationId,
		overrideAccess: true
	};
}
//#endregion
export { systemContext as n, authToContext as t };
