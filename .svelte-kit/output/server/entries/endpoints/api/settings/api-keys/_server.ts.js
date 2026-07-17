import { json } from "@sveltejs/kit";
import { a as authService } from "../../../../../chunks/service.js";
import { z } from "zod";
import { n as normalizeCapabilities, h as hasCapability } from "../../../../../chunks/capabilities.js";
import { c as capabilitySchema } from "../../../../../chunks/user.js";
import "../../../../../chunks/date-utils.js";
import "../../../../../chunks/instance2.js";
const apiKeyPermissionSchema = z.enum(["read", "write"]);
const apiKeyCapabilitySchema = capabilitySchema;
const createApiKeyRequest = z.object({
  name: z.string().min(1),
  permissions: z.array(apiKeyPermissionSchema).optional(),
  capabilities: z.array(apiKeyCapabilitySchema).optional(),
  expiresInDays: z.number().int().positive().optional()
}).refine((v) => v.permissions && v.permissions.length > 0 || v.capabilities && v.capabilities.length > 0, { message: "Provide at least one of `permissions` or `capabilities`." }).transform((v) => ({
  ...v,
  permissions: v.permissions ? v.permissions.includes("write") ? ["read", "write"] : ["read"] : void 0,
  capabilities: v.capabilities ? normalizeCapabilities(v.capabilities) : void 0
}));
const GET = async ({ locals }) => {
  if (!locals.auth || locals.auth.type !== "session") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { databaseAdapter } = locals.aphexCMS;
    const apiKeys = await authService.listApiKeys(databaseAdapter, locals.auth.user.id);
    return json({ success: true, data: apiKeys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return json({ error: "Failed to fetch API keys" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  if (!locals.auth || locals.auth.type !== "session") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const auth = locals.auth;
  try {
    if (!hasCapability(auth, "apiKey.manage")) {
      return json(
        {
          error: "Forbidden",
          message: "You do not have permission to create API keys"
        },
        { status: 403 }
      );
    }
    const rawBody = await request.json();
    const parsed = createApiKeyRequest.safeParse(rawBody);
    if (!parsed.success) {
      return json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const apiKey = await authService.createApiKey(auth.user.id, auth.organizationId, parsed.data);
    return json({ success: true, data: { apiKey } });
  } catch (error) {
    console.error("Error creating API key:", error);
    return json({ error: "Failed to create API key" }, { status: 500 });
  }
};
export {
  GET,
  POST
};
