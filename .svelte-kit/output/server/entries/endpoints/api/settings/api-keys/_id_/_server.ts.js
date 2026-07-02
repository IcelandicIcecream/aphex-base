import { json } from "@sveltejs/kit";
import { a as auth } from "../../../../../../chunks/instance.js";
import "../../../../../../chunks/index2.js";
import "../../../../../../chunks/date-utils.js";
import "../../../../../../chunks/user.js";
import "sharp";
import "hono";
import "hono/body-limit";
import "../../../../../../chunks/instance2.js";
const DELETE = async ({ params, request, locals }) => {
  if (!locals.auth || locals.auth.type !== "session") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = locals.auth;
  try {
    const { databaseAdapter } = locals.aphexCMS;
    const memberships = await databaseAdapter.findUserOrganizations(session.user.id);
    const currentMembership = memberships.find((m) => m.organization.id === session.organizationId);
    const orgRole = currentMembership?.member.role;
    if (orgRole !== "owner" && orgRole !== "admin" && orgRole !== "editor") {
      return json(
        {
          error: "Forbidden",
          message: "Only organization owners, admins, and editors can delete API keys"
        },
        { status: 403 }
      );
    }
    const { id } = params;
    if (!id) {
      return json({ error: "ID not found in params" }, { status: 400 });
    }
    const data = await auth.api.deleteApiKey({
      body: {
        keyId: id
        // required
      },
      headers: request.headers
    });
    if (data.success) {
      return json({ success: true });
    }
    return json({ error: "Failed to delete API key" }, { status: 500 });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return json({ error: "Failed to delete API key" }, { status: 500 });
  }
};
export {
  DELETE
};
