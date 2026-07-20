import { n as auth } from "../../../../../../chunks/service.js";
import "../../../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/settings/api-keys/[id]/+server.ts
var DELETE = async ({ params, request, locals }) => {
	if (!locals.auth || locals.auth.type !== "session") return json({ error: "Unauthorized" }, { status: 401 });
	const session = locals.auth;
	try {
		const { databaseAdapter } = locals.aphexCMS;
		const orgRole = (await databaseAdapter.findUserOrganizations(session.user.id)).find((m) => m.organization.id === session.organizationId)?.member.role;
		if (orgRole !== "owner" && orgRole !== "admin" && orgRole !== "editor") return json({
			error: "Forbidden",
			message: "Only organization owners, admins, and editors can delete API keys"
		}, { status: 403 });
		const { id } = params;
		if (!id) return json({ error: "ID not found in params" }, { status: 400 });
		if ((await auth.api.deleteApiKey({
			body: { keyId: id },
			headers: request.headers
		})).success) return json({ success: true });
		return json({ error: "Failed to delete API key" }, { status: 500 });
	} catch (error) {
		console.error("Error deleting API key:", error);
		return json({ error: "Failed to delete API key" }, { status: 500 });
	}
};
//#endregion
export { DELETE };
