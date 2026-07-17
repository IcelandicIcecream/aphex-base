import { a as user, c as organizations, o as invitations, r as drizzleDb, s as organizationMembers } from "../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
//#region src/lib/server/services/organization.ts
var organizationService = { 
/**
* Get organization with enriched member data (includes user details)
* This performs a join between CMS organizationMembers and auth user tables
*/
async getOrganizationWithMembers(organizationId) {
	const org = await drizzleDb.query.organizations.findFirst({ where: eq(organizations.id, organizationId) });
	if (!org) return null;
	return {
		organization: org,
		members: (await drizzleDb.select({
			member: organizationMembers,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				image: user.image
			},
			invitation: { email: invitations.email }
		}).from(organizationMembers).innerJoin(user, eq(organizationMembers.userId, user.id)).leftJoin(invitations, eq(organizationMembers.invitationId, invitations.id)).where(eq(organizationMembers.organizationId, organizationId))).map((m) => ({
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
	return {
		user: {
			id: auth.user.id,
			email: auth.user.email,
			name: auth.user.name,
			image: auth.user.image,
			role: auth.user.role,
			organizationRole: currentUserOrgRole
		},
		activeOrganization
	};
};
//#endregion
export { load };
