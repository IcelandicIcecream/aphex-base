import { t as authService } from "../../../../../chunks/service.js";
//#region src/routes/(protected)/admin/organizations/+page.server.ts
var load = async ({ locals }) => {
	const { databaseAdapter } = locals.aphexCMS;
	const auth = locals.auth;
	if (!auth || auth.type !== "session") return { organizations: [] };
	const memberships = await databaseAdapter.findUserOrganizations(auth.user.id);
	return { organizations: await Promise.all(memberships.map(async (membership) => {
		const members = await databaseAdapter.findOrganizationMembers(membership.organization.id);
		const owner = members.find((m) => m.role === "owner");
		let ownerEmail;
		if (owner) ownerEmail = (await authService.getUserById(owner.userId))?.email;
		return {
			id: membership.organization.id,
			name: membership.organization.name,
			slug: membership.organization.slug,
			role: membership.member.role,
			isActive: membership.organization.id === auth.organizationId,
			memberCount: members.length,
			ownerEmail
		};
	})) };
};
//#endregion
export { load };
