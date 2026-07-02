import { h as hasCapability } from "../../../../chunks/capabilities.js";
import "../../../../chunks/date-utils.js";
import { redirect } from "@sveltejs/kit";
import "../../../../chunks/user.js";
import "sharp";
import "hono";
import "hono/body-limit";
function canWrite(auth) {
  return hasCapability(auth, "document.create") || hasCapability(auth, "document.update") || hasCapability(auth, "document.delete") || hasCapability(auth, "asset.upload");
}
function isViewer(auth) {
  return !canWrite(auth);
}
async function load({ locals }) {
  try {
    const { cmsEngine, databaseAdapter } = locals.aphexCMS;
    const auth = locals.auth;
    if (!auth) {
      redirect(307, "/login");
    }
    const schemaError = locals.aphexCMS.schemaError;
    if (schemaError) {
      return {
        documentTypes: [],
        schemaError: {
          message: schemaError.message
        },
        graphqlSettings: null,
        isReadOnly: false,
        userPreferences: null
      };
    }
    const documentTypes = await cmsEngine.listDocumentTypes();
    const userProfile = await databaseAdapter.findUserProfileById(
      auth.type == "session" ? auth.user.id : ""
    );
    const userPreferences = userProfile?.preferences || {};
    const graphqlSettings = locals.aphexCMS?.graphqlSettings ?? null;
    const isReadOnly = auth?.type === "session" ? isViewer(auth) : false;
    return {
      documentTypes,
      schemaError: null,
      graphqlSettings,
      isReadOnly,
      userPreferences
    };
  } catch (error) {
    console.error("Failed to load schema types:", error);
    return {
      documentTypes: [],
      schemaError: {
        message: error instanceof Error ? error.message : "Unknown schema error"
      },
      graphqlSettings: null,
      isReadOnly: false,
      userPreferences: null
    };
  }
}
export {
  load
};
