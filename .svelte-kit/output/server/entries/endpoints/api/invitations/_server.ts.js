import "../../../../chunks/dist.js";
import { i as isPendingInvitation } from "../../../../chunks/invitation-status.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/invitations/+server.ts
var GET = async ({ locals }) => {
	try {
		const { databaseAdapter } = locals.aphexCMS;
		const auth = locals.auth;
		if (!auth || auth.type === "api_key") return json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, { status: 401 });
		const pending = (await databaseAdapter.findInvitationsByEmail(auth.user.email)).filter((inv) => isPendingInvitation(inv));
		return json({
			success: true,
			data: await Promise.all(pending.map(async (inv) => {
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
			}))
		});
	} catch (error) {
		console.error("Failed to fetch invitations:", error);
		return json({
			success: false,
			error: "Failed to fetch invitations",
			message: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
};
//#endregion
export { GET };
