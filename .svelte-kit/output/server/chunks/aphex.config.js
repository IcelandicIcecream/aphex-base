import { p as private_env } from "./shared-server.js";
import { c as createPartResolver, s as schemaTypes } from "./index10.js";
import "./date-utils.js";
import "@sveltejs/kit";
import { a as createStorageAdapter } from "./user.js";
import "sharp";
import "hono";
import "hono/body-limit";
import { p as plugins } from "./plugins.js";
import { a as authService } from "./service.js";
import { e as emailConfig, d as email, f as cacheAdapter } from "./instance.js";
import { b as db } from "./index2.js";
import { s3Storage } from "@aphexcms/storage-s3";
function createCMSConfig(config) {
  const resolver = createPartResolver(config.plugins ?? []);
  const pluginSchemas = resolver.schemaTypes();
  const mergedSchemas = resolver.applySchemaTransforms([...config.schemaTypes, ...pluginSchemas]);
  return {
    // Start with the user's config and apply defaults for missing properties
    ...config,
    schemaTypes: mergedSchemas,
    storage: config.storage ?? null,
    // Default to null if not provided
    customization: {
      branding: {
        title: "Aphex CMS",
        ...config.customization?.branding
      },
      ...config.customization
    }
  };
}
const authProvider = {
  getSession: (request, db2) => authService.getSession(request, db2),
  requireSession: (request, db2) => authService.requireSession(request, db2),
  validateApiKey: (request) => authService.validateApiKey(request),
  requireApiKey: (request, db2, permission) => authService.requireApiKey(request, db2, permission),
  getUserById: (userId) => authService.getUserById(userId),
  getUserByEmail: (email2) => authService.getUserByEmail(email2),
  changeUserName: (userId, name) => authService.changeUserName(userId, name),
  changeUserImage: (userId, image) => authService.changeUserImage(userId, image),
  requestPasswordReset: (email2, redirectTo) => authService.requestPasswordReset(email2, redirectTo),
  resetPassword: (token, newPassword) => authService.resetPassword(token, newPassword)
};
function registerInvitationEmailHook(app) {
  app.use("/organizations/invitations", async (c, next) => {
    if (c.req.method !== "POST") return next();
    const reqClone = c.req.raw.clone();
    await next();
    if (c.res.status !== 201) return;
    try {
      const body = await reqClone.json();
      const result = await c.res.clone().json();
      const invitation = result.data;
      if (!invitation?.token) return;
      const auth = c.var.auth;
      const { databaseAdapter } = c.var.aphexCMS;
      const org = auth && auth.type !== "partial_session" ? await databaseAdapter.findOrganizationById(auth.organizationId) : null;
      const orgName = org?.name || "an organization";
      const inviteUrl = `${new URL(c.req.url).origin}/invite/${invitation.token}`;
      void (async () => {
        try {
          const { html, text } = await emailConfig.invitation.render(orgName, body.role, inviteUrl);
          await email.send({
            from: emailConfig.from,
            to: body.email.toLowerCase(),
            subject: emailConfig.invitation.getSubject(orgName),
            html,
            text
          });
        } catch {
        }
      })();
    } catch {
    }
  });
}
let storageAdapter;
if (private_env.R2_BUCKET && private_env.R2_ENDPOINT && private_env.R2_ACCESS_KEY_ID && private_env.R2_SECRET_ACCESS_KEY) {
  storageAdapter = s3Storage({
    bucket: private_env.R2_BUCKET,
    endpoint: private_env.R2_ENDPOINT,
    accessKeyId: private_env.R2_ACCESS_KEY_ID,
    secretAccessKey: private_env.R2_SECRET_ACCESS_KEY,
    publicUrl: private_env.R2_PUBLIC_URL || "",
    baseUrl: private_env.R2_CDN_URL || void 0
  }).adapter;
} else {
  storageAdapter = createStorageAdapter("local", {
    basePath: "./static/uploads",
    baseUrl: "/uploads"
  });
}
const cmsConfig = createCMSConfig({
  schemaTypes,
  plugins,
  // Provide the shared database and storage adapter instances directly.
  // These are created once in their respective /lib/server/.. files.
  database: db,
  storage: storageAdapter,
  email,
  cache: cacheAdapter,
  auth: {
    provider: authProvider,
    loginUrl: "/login"
    // Redirect here when unauthenticated
  },
  security: {
    // Encrypts plugin `secret` settings at rest (AES-256-GCM). Optional — when
    // unset, secret settings fields are disabled (read-only) rather than stored as
    // plaintext. Keep it stable across deploys; rotating it orphans existing secrets.
    // Read via `$env/dynamic/private` — SvelteKit does NOT put `.env` into process.env.
    secretEncryptionKey: private_env.APHEX_SECRET_ENCRYPTION_KEY
  },
  // Reads the PREVIEW_AS knob above. The CMS hook runs this once per request and
  // stores the result on `locals.previewPerspective`, which site loads inherit via
  // `siteContext`. Queries that pass an explicit perspective (e.g. the sitemap) win.
  preview: {
    resolvePerspective: ({ auth, url }) => {
      if (auth?.type !== "session") return "published";
      if (process.env.NODE_ENV !== "production") return "draft";
      return url.searchParams.has("aphex-preview") ? "draft" : "published";
    }
  },
  // GraphQL is built-in and enabled by default.
  // Set to false to disable, or pass config: { defaultPerspective: 'draft', path: '/api/graphql' }
  graphql: {
    defaultPerspective: "draft",
    path: "/api/aphex-graphql"
  },
  customization: {
    branding: {
      title: "Aphex"
    }
  },
  // Wrap built-in handlers with side effects (e.g. send the invitation
  // email after the invite is created). Runs BEFORE built-in routes mount.
  api: (app) => {
    registerInvitationEmailHook(app);
  }
});
export {
  cmsConfig as c
};
