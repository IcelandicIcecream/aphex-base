import { n as private_env } from "./shared-server.js";
import { t as db } from "./db.js";
import { i as createStorageAdapter } from "./server.js";
import { t as createPartResolver } from "./resolver.js";
import { a as emailConfig, i as email, r as cacheAdapter } from "./service.js";
import { t as authProvider } from "./auth.js";
import { t as plugins } from "./plugins.js";
import { t as schemaTypes } from "./schemaTypes.js";
import { s3Storage } from "@aphexcms/storage-s3";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.5.2_6aae2b0bc5f037c66cc3c68e11b93a28/node_modules/@aphexcms/cms-core/dist/config.js
function createCMSConfig(config) {
	const resolver = createPartResolver(config.plugins ?? []);
	const pluginSchemas = resolver.schemaTypes();
	const mergedSchemas = resolver.applySchemaTransforms([...config.schemaTypes, ...pluginSchemas]);
	return {
		...config,
		schemaTypes: mergedSchemas,
		storage: config.storage ?? null,
		customization: {
			branding: {
				title: "Aphex CMS",
				...config.customization?.branding
			},
			...config.customization
		}
	};
}
//#endregion
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
	basePath: "./static/uploads",
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
var aphex_config_default = createCMSConfig({
	schemaTypes,
	plugins,
	database: db,
	storage: storageAdapter,
	email,
	cache: cacheAdapter,
	auth: {
		provider: authProvider,
		loginUrl: "/login"
	},
	security: { secretEncryptionKey: private_env.APHEX_SECRET_ENCRYPTION_KEY },
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
	customization: { branding: { title: "Aphex" } },
	api: (app) => {
		registerInvitationEmailHook(app);
	}
});
//#endregion
export { aphex_config_default as t };
