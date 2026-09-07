import { a as cms_schema_exports, i as auth_schema_exports, r as drizzleDb } from "../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
//#region src/lib/server/services/organization.ts
var organizationService = { 
/**
* Get organization with enriched member data (includes user details)
* This performs a join between CMS organizationMembers and auth user tables
*/
async getOrganizationWithMembers(organizationId) {
	const org = await drizzleDb.query.organizations.findFirst({ where: eq(cms_schema_exports.organizations.id, organizationId) });
	if (!org) return null;
	return {
		organization: org,
		members: (await drizzleDb.select({
			member: cms_schema_exports.organizationMembers,
			user: {
				id: auth_schema_exports.user.id,
				email: auth_schema_exports.user.email,
				name: auth_schema_exports.user.name,
				image: auth_schema_exports.user.image
			},
			invitation: { email: cms_schema_exports.invitations.email }
		}).from(cms_schema_exports.organizationMembers).innerJoin(auth_schema_exports.user, eq(cms_schema_exports.organizationMembers.userId, auth_schema_exports.user.id)).leftJoin(cms_schema_exports.invitations, eq(cms_schema_exports.organizationMembers.invitationId, cms_schema_exports.invitations.id)).where(eq(cms_schema_exports.organizationMembers.organizationId, organizationId))).map((m) => ({
			member: m.member,
			user: {
				id: m.user.id,
				email: m.user.email,
				name: m.user.name,
				image: m.user.image
			},
			invitedEmail: m.invitation?.email || null
		}))
	};
} };
//#endregion
//#region src/routes/(protected)/admin/settings/+layout.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw new Error("No session found");
	let activeOrganization = null;
	let currentUserOrgRole = null;
	if (auth.organizationId) {
		const orgData = await organizationService.getOrganizationWithMembers(auth.organizationId);
		if (orgData) {
			activeOrganization = {
				...orgData.organization,
				members: orgData.members.map((m) => ({
					...m.member,
					user: m.user,
					invitedEmail: m.invitedEmail
				}))
			};
			currentUserOrgRole = orgData.members.find((m) => m.user.id === auth.user.id)?.member.role || null;
		}
	}
	const provider = locals.aphexCMS.auth;
	const { name, image } = (provider ? await provider.getUserById(auth.user.id) : null) ?? {
		name: auth.user.name,
		image: auth.user.image
	};
	return {
		user: {
			id: auth.user.id,
			email: auth.user.email,
			name,
			image,
			role: auth.user.role,
			organizationRole: currentUserOrgRole
		},
		activeOrganization
	};
};
//#endregion
export { load };
