import { s as hasCapability } from "../../../../chunks/resolver.js";
import "../../../../chunks/server3.js";
import { redirect } from "@sveltejs/kit";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.10.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/types/auth.js
/**
* Does the user have *any* mutating capability?
*
* Coarse-grained on purpose: this is for UI gating where you just want to
* decide whether to show the entire edit/upload surface. Don't use it to
* authorise a specific mutation — the server's PermissionChecker does that
* per-operation (canCreate vs canUpdate vs canDelete, etc).
*/
function canWrite(auth) {
	return hasCapability(auth, "document.create") || hasCapability(auth, "document.update") || hasCapability(auth, "document.delete") || hasCapability(auth, "asset.upload");
}
/**
* Is this session effectively read-only?
*
* Inverse of `canWrite`. Named for historical reasons — prefer `canWrite()`
* for positive checks; `isViewer()` remains available for call sites that
* read more naturally in the negative (e.g. `isReadOnly={isViewer(auth)}`).
*/
function isViewer(auth) {
	return !canWrite(auth);
}
//#endregion
//#region src/routes/(protected)/admin/+page.server.ts
async function load({ locals }) {
	try {
		const { cmsEngine, databaseAdapter } = locals.aphexCMS;
		const auth = locals.auth;
		if (!auth) redirect(307, "/login");
		const schemaError = locals.aphexCMS.schemaError;
		if (schemaError) return {
			documentTypes: [],
			schemaError: { message: schemaError.message },
			graphqlSettings: null,
			isReadOnly: false,
			userPreferences: null
		};
		const documentTypes = await cmsEngine.listDocumentTypes();
		const userPreferences = (await databaseAdapter.findUserProfileById(auth.type == "session" ? auth.user.id : ""))?.preferences || {};
		return {
			documentTypes,
			schemaError: null,
			graphqlSettings: locals.aphexCMS?.graphqlSettings ?? null,
			isReadOnly: auth?.type === "session" ? isViewer(auth) : false,
			userPreferences
		};
	} catch (error) {
		console.error("Failed to load schema types:", error);
		return {
			documentTypes: [],
			schemaError: { message: error instanceof Error ? error.message : "Unknown schema error" },
			graphqlSettings: null,
			isReadOnly: false,
			userPreferences: null
		};
	}
}
//#endregion
export { load };
