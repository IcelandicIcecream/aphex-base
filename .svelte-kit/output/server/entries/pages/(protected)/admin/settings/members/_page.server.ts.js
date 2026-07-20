//#region src/routes/(protected)/admin/settings/members/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw new Error("No session found");
	const { databaseAdapter, rolesService } = locals.aphexCMS;
	let pendingInvitations = [];
	if (auth.organizationId) pendingInvitations = (await databaseAdapter.findOrganizationInvitations(auth.organizationId)).filter((inv) => !inv.acceptedAt && inv.expiresAt && inv.expiresAt > /* @__PURE__ */ new Date());
	const inviteRoles = (auth.organizationId ? await rolesService.listRoles(auth.organizationId) : []).filter((r) => r.name !== "owner").map((r) => ({
		name: r.name,
		description: r.description
	}));
	return {
		pendingInvitations,
		inviteRoles
	};
};
//#endregion
export { load };
