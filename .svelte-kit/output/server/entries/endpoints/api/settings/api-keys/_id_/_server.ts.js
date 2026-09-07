import { s as hasCapability } from "../../../../../../chunks/resolver.js";
import "../../../../../../chunks/dist.js";
import { r as authService } from "../../../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
import { ApiKeyRevocationError } from "@aphexcms/auth";
//#region src/routes/api/settings/api-keys/[id]/+server.ts
var DELETE = async ({ params, locals }) => {
	if (!locals.auth || locals.auth.type !== "session") return json({ error: "Unauthorized" }, { status: 401 });
	const session = locals.auth;
	try {
		if (!hasCapability(session, "apiKey.manage")) return json({
			error: "Forbidden",
			message: "You do not have permission to delete API keys"
		}, { status: 403 });
		const { id } = params;
		if (!id) return json({ error: "ID not found in params" }, { status: 400 });
		if (await authService.deleteApiKey(session.user.id, id)) return json({ success: true });
		return json({ error: "Failed to delete API key" }, { status: 500 });
	} catch (error) {
		if (error instanceof ApiKeyRevocationError) {
			console.error("Incomplete API key revocation:", error);
			return json({
				error: "Revocation incomplete",
				message: error.message
			}, { status: 500 });
		}
		console.error("Error deleting API key:", error);
		return json({ error: "Failed to delete API key" }, { status: 500 });
	}
};
//#endregion
export { DELETE };
