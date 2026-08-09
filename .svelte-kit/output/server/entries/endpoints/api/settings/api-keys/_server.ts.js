import { l as normalizeCapabilities, s as hasCapability } from "../../../../../chunks/resolver.js";
import "../../../../../chunks/dist.js";
import { r as capabilitySchema } from "../../../../../chunks/server3.js";
import { t as authService } from "../../../../../chunks/service.js";
import { json } from "@sveltejs/kit";
import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/api/schemas/api-keys.js
var apiKeyPermissionSchema = z.enum(["read", "write"]);
var apiKeyCapabilitySchema = capabilitySchema;
var createApiKeyRequest = z.object({
	name: z.string().min(1),
	permissions: z.array(apiKeyPermissionSchema).optional(),
	capabilities: z.array(apiKeyCapabilitySchema).optional(),
	expiresInDays: z.number().int().positive().optional()
}).refine((v) => v.permissions && v.permissions.length > 0 || v.capabilities && v.capabilities.length > 0, { message: "Provide at least one of `permissions` or `capabilities`." }).transform((v) => ({
	...v,
	permissions: v.permissions ? v.permissions.includes("write") ? ["read", "write"] : ["read"] : void 0,
	capabilities: v.capabilities ? normalizeCapabilities(v.capabilities) : void 0
}));
//#endregion
//#region src/routes/api/settings/api-keys/+server.ts
var GET = async ({ locals }) => {
	if (!locals.auth || locals.auth.type !== "session") return json({ error: "Unauthorized" }, { status: 401 });
	try {
		const { databaseAdapter } = locals.aphexCMS;
		return json({
			success: true,
			data: await authService.listApiKeys(databaseAdapter, locals.auth.user.id)
		});
	} catch (error) {
		console.error("Error fetching API keys:", error);
		return json({ error: "Failed to fetch API keys" }, { status: 500 });
	}
};
var POST = async ({ request, locals }) => {
	if (!locals.auth || locals.auth.type !== "session") return json({ error: "Unauthorized" }, { status: 401 });
	const auth = locals.auth;
	try {
		if (!hasCapability(auth, "apiKey.manage")) return json({
			error: "Forbidden",
			message: "You do not have permission to create API keys"
		}, { status: 403 });
		const rawBody = await request.json();
		const parsed = createApiKeyRequest.safeParse(rawBody);
		if (!parsed.success) return json({
			error: "Invalid input",
			issues: parsed.error.issues
		}, { status: 400 });
		return json({
			success: true,
			data: { apiKey: await authService.createApiKey(auth.user.id, auth.organizationId, parsed.data) }
		});
	} catch (error) {
		console.error("Error creating API key:", error);
		return json({ error: "Failed to create API key" }, { status: 500 });
	}
};
//#endregion
export { GET, POST };
