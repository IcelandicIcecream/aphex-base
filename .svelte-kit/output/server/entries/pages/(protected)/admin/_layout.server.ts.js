import { n as systemContext } from "../../../../chunks/auth-helpers.js";
import { t as aphex_config_default } from "../../../../chunks/aphex.config.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/admin/+layout.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw redirect(302, "/login");
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
	const title = aphex_config_default.customization?.branding?.title || "Aphex CMS";
	const agentEnabled = !!aphex_config_default.aiProvider;
	let faviconUrl = null;
	try {
		const context = systemContext(auth.organizationId);
		const settings = await locals.aphexCMS.localAPI.collections.siteSettings.get(context, { perspective: "published" });
		await locals.aphexCMS.assetService.injectAssetUrls(auth.organizationId, settings);
		faviconUrl = settings?.favicon?.asset?.url ?? null;
	} catch {
		faviconUrl = null;
	}
	return {
		auth,
		title,
		organizations,
		activeOrganization,
		canCreateOrganization,
		faviconUrl,
		agentEnabled,
		rbac: {
			role: auth.organizationRole,
			capabilities: auth.capabilities ?? []
		}
	};
};
//#endregion
export { load };
