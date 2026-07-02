import { d as drizzleDb, a as apikey } from "../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import { h as hasCapability } from "../../../../../../chunks/capabilities.js";
import "../../../../../../chunks/date-utils.js";
import "../../../../../../chunks/instance2.js";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw new Error("No session found");
  }
  if (!hasCapability(auth, "apiKey.manage")) {
    throw error(403, "You do not have permission to manage API keys");
  }
  const userApiKeys = await drizzleDb.query.apikey.findMany({
    where: eq(apikey.referenceId, auth.user.id),
    columns: {
      id: true,
      name: true,
      metadata: true,
      expiresAt: true,
      lastRequest: true,
      createdAt: true
    },
    orderBy: (apikey2, { desc }) => [desc(apikey2.createdAt)]
  });
  const apiKeysWithPermissions = userApiKeys.map((key) => {
    let metadata = key.metadata;
    if (typeof metadata === "string") {
      metadata = JSON.parse(metadata);
      if (typeof metadata === "string") {
        metadata = JSON.parse(metadata);
      }
    }
    metadata = metadata || null;
    return {
      ...key,
      permissions: metadata?.permissions || [],
      organizationId: metadata?.organizationId
    };
  }).filter((key) => auth.type === "session" && key.organizationId === auth.organizationId);
  return {
    apiKeys: apiKeysWithPermissions
  };
};
export {
  load
};
