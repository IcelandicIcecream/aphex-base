import { i as apikey, r as drizzleDb } from "../../../../../../chunks/db.js";
import { p as hasCapability } from "../../../../../../chunks/validator.js";
import "../../../../../../chunks/dist.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/(protected)/admin/settings/api-keys/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw new Error("No session found");
	if (!hasCapability(auth, "apiKey.manage")) throw error(403, "You do not have permission to manage API keys");
	return { apiKeys: (await drizzleDb.query.apikey.findMany({
		where: eq(apikey.referenceId, auth.user.id),
		columns: {
			id: true,
			name: true,
			metadata: true,
			expiresAt: true,
			lastRequest: true,
			createdAt: true
		},
		orderBy: (apikey, { desc }) => [desc(apikey.createdAt)]
	})).map((key) => {
		let metadata = key.metadata;
		if (typeof metadata === "string") {
			metadata = JSON.parse(metadata);
			if (typeof metadata === "string") metadata = JSON.parse(metadata);
		}
		metadata = metadata || null;
		return {
			...key,
			permissions: metadata?.permissions || [],
			organizationId: metadata?.organizationId
		};
	}).filter((key) => auth.type === "session" && key.organizationId === auth.organizationId) };
};
//#endregion
export { load };
