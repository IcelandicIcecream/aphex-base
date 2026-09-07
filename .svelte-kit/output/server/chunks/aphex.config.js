import { t as private_env } from "./shared-server.js";
import { t as db } from "./db.js";
import { n as emailConfig, t as email } from "./email.js";
import { i as cacheAdapter, n as authProvider } from "./auth.js";
import { a as createCMSConfig, i as createStorageAdapter } from "./server3.js";
import { t as plugins } from "./plugins.js";
import { t as schemaTypes } from "./schemaTypes.js";
import { createOpenAIAdapter } from "@aphexcms/ai-openai";
import { s3Storage } from "@aphexcms/storage-s3";
//#region src/lib/server/email/invitation-hook.ts
/**
* Wrap the built-in `/api/organizations/invitations` POST so a successful
* invite also dispatches the email. Email send is fire-and-forget — never
* blocks the response, never fails the invite.
*/
function registerInvitationEmailHook(app) {
	app.use("/organizations/invitations", async (c, next) => {
		if (c.req.method !== "POST") return next();
		const reqClone = c.req.raw.clone();
		await next();
		if (c.res.status !== 201) return;
		try {
			const body = await reqClone.json();
			const invitation = (await c.res.clone().json()).data;
			if (!invitation?.token) return;
			if (!email) return;
			const auth = c.var.auth;
			const { databaseAdapter } = c.var.aphexCMS;
			const orgName = (auth && auth.type !== "partial_session" ? await databaseAdapter.findOrganizationById(auth.organizationId) : null)?.name || "an organization";
			const inviteUrl = `${new URL(c.req.url).origin}/invite/${invitation.token}`;
			(async () => {
				try {
					const { html, text } = await emailConfig.invitation.render(orgName, body.role, inviteUrl);
					await email.send({
						from: emailConfig.from,
						to: body.email.toLowerCase(),
						subject: emailConfig.invitation.getSubject(orgName),
						html,
						text
					});
				} catch {}
			})();
		} catch {}
	});
}
//#endregion
//#region src/lib/server/storage/index.ts
var storageAdapter;
if (private_env.R2_BUCKET && private_env.R2_ENDPOINT && private_env.R2_ACCESS_KEY_ID && private_env.R2_SECRET_ACCESS_KEY) storageAdapter = s3Storage({
	bucket: private_env.R2_BUCKET,
	endpoint: private_env.R2_ENDPOINT,
	accessKeyId: private_env.R2_ACCESS_KEY_ID,
	secretAccessKey: private_env.R2_SECRET_ACCESS_KEY,
	publicUrl: private_env.R2_PUBLIC_URL || "",
	baseUrl: private_env.R2_CDN_URL || void 0
}).adapter;
else storageAdapter = createStorageAdapter("local", {
	basePath: private_env.APHEX_UPLOADS_DIR || "./uploads",
	baseUrl: "/uploads"
});
//#endregion
//#region aphex.config.ts
/**
* 👀 Preview perspective — the one knob to flip while developing. Change the return:
*
*   'auto'      → drafts while developing (when signed in), published otherwise;
*                 the visual editor still shows drafts via ?aphex-preview. Safe default.
*   'draft'     → always show unpublished drafts. "I want to see draft now."
*   'published' → always show the live/published site.
*
* Anonymous visitors ALWAYS get published regardless of this — drafts never leak.
* (Wired into `preview.resolvePerspective` below.)
*/
function previewAs() {
	return "auto";
}
/** `true`/`1`/`yes`/`on` (any case) — anything else, including unset, is false. */
function isTruthy(value) {
	return [
		"true",
		"1",
		"yes",
		"on"
	].includes((value ?? "").toLowerCase());
}
var agentAPIKey = private_env.AGENT_API_KEY?.trim();
var agentModel = private_env.AGENT_MODEL?.trim();
var agentBaseURL = private_env.AGENT_BASE_URL?.trim();
var aphex_config_default = createCMSConfig({
	schemaTypes,
	plugins,
	database: db,
	storage: storageAdapter,
	email,
	cache: cacheAdapter,
	aiProvider: agentAPIKey && agentModel ? createOpenAIAdapter({
		apiKey: agentAPIKey,
		baseURL: agentBaseURL
	}) : null,
	agentModel: agentAPIKey && agentModel ? agentModel : void 0,
	auth: {
		provider: authProvider,
		loginUrl: "/login"
	},
	security: {
		secretEncryptionKey: private_env.APHEX_SECRET_ENCRYPTION_KEY,
		assetSigningSecret: private_env.APHEX_ASSET_SIGNING_SECRET
	},
	jobs: {
		embedded: isTruthy(private_env.APHEX_EMBEDDED_WORKER),
		workerSecret: private_env.APHEX_WORKER_SECRET
	},
	preview: { resolvePerspective: ({ auth, url }) => {
		if (auth?.type !== "session") return "published";
		const mode = previewAs();
		if (mode === "draft") return "draft";
		if (mode === "published") return "published";
		if (process.env.NODE_ENV !== "production") return "draft";
		return url.searchParams.has("aphex-preview") ? "draft" : "published";
	} },
	graphql: {
		defaultPerspective: "draft",
		path: "/api/aphex-graphql"
	},
	upload: {
		direct: true,
		maxFileSize: 200 * 1024 * 1024
	},
	customization: { branding: { title: "Aphex" } },
	api: (app) => {
		registerInvitationEmailHook(app);
	}
});
//#endregion
export { aphex_config_default as t };
