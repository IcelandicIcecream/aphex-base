import { c as cmsLogger } from "../../../../../chunks/date-utils.js";
import "@sveltejs/kit";
import "../../../../../chunks/user.js";
import "sharp";
import "hono";
import "hono/body-limit";
const GET = async ({ params, locals, setHeaders, request }) => {
  try {
    const { assetService, databaseAdapter, storageAdapter, cmsEngine, config } = locals.aphexCMS;
    let auth = locals.auth;
    const { id, filename } = params;
    cmsLogger.debug("[Asset CDN]", "Request for asset:", id, filename);
    if (!auth) {
      const apiKey = request.headers.get("x-api-key");
      if (apiKey && config.auth?.provider) {
        try {
          const apiKeyAuth = await config.auth.provider.validateApiKey(request, databaseAdapter);
          if (apiKeyAuth) {
            auth = apiKeyAuth;
            cmsLogger.debug("[Asset CDN]", "Authenticated via API key");
          }
        } catch (err) {
          cmsLogger.warn("[Asset CDN]", "API key validation failed:", err);
        }
      }
    }
    if (!id) {
      return new Response("Asset ID is required", { status: 400 });
    }
    const asset = await assetService.findAssetByIdGlobal(id);
    if (!asset) {
      cmsLogger.warn("[Asset CDN]", "Asset not found:", id);
      return new Response("Asset not found", { status: 404 });
    }
    const organizationId = auth && auth.type !== "partial_session" ? auth.organizationId : void 0;
    let isPrivate = false;
    const schemaType = asset.metadata?.schemaType;
    const fieldPath = asset.metadata?.fieldPath;
    if (schemaType && fieldPath) {
      const schema = cmsEngine.getSchemaTypeByName(schemaType);
      if (schema && schema.fields) {
        const findField = (fields, path) => {
          const parts = path.split(".");
          let current = null;
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            current = fields.find((f) => f.name === part);
            if (!current)
              return null;
            if (i < parts.length - 1) {
              if (current.type === "object" && current.fields) {
                fields = current.fields;
              } else {
                return null;
              }
            }
          }
          return current;
        };
        const field = findField(schema.fields, fieldPath);
        if (field && field.type === "image") {
          isPrivate = field.private === true;
        } else {
          cmsLogger.warn("[Asset CDN]", `Could not find field: ${schemaType}.${fieldPath}`);
        }
      }
    }
    cmsLogger.debug("[Asset CDN]", "Asset privacy:", { isPrivate, schemaType, fieldPath });
    if (isPrivate && !organizationId) {
      cmsLogger.warn("[Asset CDN]", "Private asset accessed without auth");
      return new Response("Unauthorized - This asset is private", { status: 401 });
    }
    if (isPrivate && organizationId) {
      let hasAccess = organizationId === asset.organizationId;
      if (!hasAccess && databaseAdapter.getChildOrganizations) {
        const childOrgs = await databaseAdapter.getChildOrganizations(organizationId);
        hasAccess = childOrgs.includes(asset.organizationId);
      }
      if (!hasAccess) {
        cmsLogger.warn("[Asset CDN]", "Forbidden: org mismatch for private asset");
        return new Response("Forbidden", { status: 403 });
      }
    }
    if (asset.url && asset.url.startsWith("http")) {
      return new Response(null, {
        status: 302,
        headers: { Location: asset.url }
      });
    }
    if (!storageAdapter?.getObject) {
      cmsLogger.error("[Asset CDN]", "Storage adapter does not support getObject");
      return new Response("Storage adapter does not support file serving", { status: 500 });
    }
    const fileBuffer = await storageAdapter.getObject(asset.path);
    const rawFilename = asset.originalFilename || asset.filename;
    const asciiFallback = rawFilename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
    const utf8Encoded = encodeURIComponent(rawFilename);
    const safeInlineTypes = ["image/", "application/pdf", "video/", "audio/"];
    const canInline = asset.mimeType && asset.mimeType !== "image/svg+xml" && safeInlineTypes.some((t) => asset.mimeType.startsWith(t));
    const disposition = canInline ? "inline" : "attachment";
    setHeaders({
      "Content-Type": asset.mimeType || "application/octet-stream",
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `${disposition}; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`,
      "X-Content-Type-Options": "nosniff",
      ...asset.mimeType?.startsWith("image/") && {
        "Accept-Ranges": "bytes"
      }
    });
    const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
    return new Response(arrayBuffer);
  } catch (error) {
    cmsLogger.error("[Asset CDN]", "Error serving asset:", error);
    return new Response("Failed to serve asset", { status: 500 });
  }
};
export {
  GET
};
