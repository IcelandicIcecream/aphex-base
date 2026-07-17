import { t as aphex_config_default } from "../../../../chunks/aphex.config.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/admin/+layout.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw new Error("No session found");
	const db = locals.aphexCMS.databaseAdapter;
	const userOrgMemberships = await db.findUserOrganizations(auth.user.id);
	if (userOrgMemberships.length === 0 && auth.user.role !== "super_admin") throw redirect(302, "/invitations");
	const instanceSettings = await db.getInstanceSettings();
	const organizations = userOrgMemberships.map((membership) => ({
		id: membership.organization.id,
		name: membership.organization.name,
		slug: membership.organization.slug,
		role: membership.member.role,
		isActive: membership.organization.id === auth.organizationId,
		metadata: membership.organization.metadata
	}));
	const activeOrganization = organizations.find((org) => org.isActive);
	const canCreateOrganization = auth.user.role === "super_admin" || (instanceSettings.allowUserOrgCreation ?? false);
	return {
		auth,
		title: aphex_config_default.customization?.branding?.title || "Aphex CMS",
		organizations,
		activeOrganization,
		canCreateOrganization,
		faviconUrl: null,
		rbac: {
			role: auth.organizationRole,
			capabilities: auth.capabilities ?? []
		}
	};
};
//#endregion
export { load };
