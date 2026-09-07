import "../../../chunks/dist.js";
import { i as isPendingInvitation } from "../../../chunks/invitation-status.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/invitations/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type === "api_key") throw redirect(302, "/login");
	const { databaseAdapter } = locals.aphexCMS;
	const pending = (await databaseAdapter.findInvitationsByEmail(auth.user.email)).filter((inv) => isPendingInvitation(inv)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	return {
		pendingInvitations: await Promise.all(pending.map(async (inv) => {
			const org = await databaseAdapter.findOrganizationById(inv.organizationId);
			return {
				id: inv.id,
				organizationId: inv.organizationId,
				organizationName: org?.name ?? "Unknown",
				organizationSlug: org?.slug ?? "",
				role: inv.role,
				email: inv.email,
				expiresAt: inv.expiresAt,
				createdAt: inv.createdAt
			};
		})),
		hasOrganization: auth.type === "session",
		user: {
			email: auth.user.email,
			name: auth.user.name
		}
	};
};
//#endregion
export { load };
