import { error } from "@sveltejs/kit";
//#region src/routes/(protected)/admin/settings/roles/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw error(401, "Not authenticated");
	const { rolesService, partResolver } = locals.aphexCMS;
	return {
		roles: await rolesService.listRoles(auth.organizationId),
		canManageRoles: auth.capabilities?.includes("role.manage") ?? false,
		capabilityCatalog: partResolver.capabilityCatalog()
	};
};
//#endregion
export { load };
