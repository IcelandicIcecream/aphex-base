import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/types/capabilities.js
/**
* Enumerate every capability. Useful for owner seeding and validation.
*/
var ALL_CAPABILITIES = [
	"document.read",
	"document.create",
	"document.update",
	"document.delete",
	"document.publish",
	"document.unpublish",
	"asset.read",
	"asset.upload",
	"asset.delete",
	"member.invite",
	"member.remove",
	"member.changeRole",
	"apiKey.manage",
	"role.manage",
	"org.settings",
	"plugin.settings.manage"
];
/**
* Define a capability with metadata. Plugins pass these to the `aphex/capabilities`
* part so their permissions appear (and are assignable) in the roles UI.
*
* @example
* defineCapability('forms.export', { title: 'Export submissions', group: 'Forms' })
*/
function defineCapability(id, meta = {}) {
	return {
		id,
		title: meta.title || prettifyCapabilityId(id),
		description: meta.description,
		group: meta.group
	};
}
/** Fallback label for a bare id: `document.publish` → `Publish` (last segment, title-cased). */
function prettifyCapabilityId(id) {
	const spaced = (id.split(/[.:]/).pop() ?? id).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
/** The built-in capability catalog — metadata for every core capability. */
var BUILTIN_CAPABILITY_DEFS = [
	{
		id: "document.read",
		title: "Read documents",
		group: "Documents",
		description: "View documents and their content."
	},
	{
		id: "document.create",
		title: "Create documents",
		group: "Documents",
		description: "Create new documents."
	},
	{
		id: "document.update",
		title: "Edit documents",
		group: "Documents",
		description: "Edit existing documents."
	},
	{
		id: "document.delete",
		title: "Delete documents",
		group: "Documents",
		description: "Delete documents."
	},
	{
		id: "document.publish",
		title: "Publish documents",
		group: "Documents",
		description: "Publish drafts to the live site."
	},
	{
		id: "document.unpublish",
		title: "Unpublish documents",
		group: "Documents",
		description: "Revert published documents to draft."
	},
	{
		id: "asset.read",
		title: "View assets",
		group: "Assets",
		description: "Browse the media library."
	},
	{
		id: "asset.upload",
		title: "Upload assets",
		group: "Assets",
		description: "Upload files to the media library."
	},
	{
		id: "asset.delete",
		title: "Delete assets",
		group: "Assets",
		description: "Delete files from the media library."
	},
	{
		id: "member.invite",
		title: "Invite members",
		group: "Organization",
		description: "Invite people to the organization."
	},
	{
		id: "member.remove",
		title: "Remove members",
		group: "Organization",
		description: "Remove people from the organization."
	},
	{
		id: "member.changeRole",
		title: "Change member roles",
		group: "Organization",
		description: "Change a member's role."
	},
	{
		id: "apiKey.manage",
		title: "Manage API keys",
		group: "Organization",
		description: "Create and revoke API keys."
	},
	{
		id: "role.manage",
		title: "Manage roles",
		group: "Organization",
		description: "Create and edit custom roles."
	},
	{
		id: "org.settings",
		title: "Edit settings",
		group: "Organization",
		description: "Change organization settings."
	},
	{
		id: "plugin.settings.manage",
		title: "Manage plugin settings",
		group: "Organization",
		description: "View and edit configuration and secrets for installed plugins."
	}
];
/**
* Merge the built-in catalog with extra (plugin) definitions, deduped by id — the
* first definition of an id wins, so plugins can't silently redefine a core cap.
*/
function mergeCapabilityCatalog(extra = []) {
	const byId = /* @__PURE__ */ new Map();
	for (const def of [...BUILTIN_CAPABILITY_DEFS, ...extra]) if (!byId.has(def.id)) byId.set(def.id, def);
	return [...byId.values()];
}
/**
* Built-in role names. These are the guaranteed defaults every org receives.
* Custom role names are any other string.
*/
var BUILTIN_ROLE_NAMES = [
	"owner",
	"admin",
	"editor",
	"viewer"
];
/**
* Seed data for the four built-in roles.
*
* For viewer/editor/admin this is the **default floor** — the set of capabilities
* a freshly-created org starts with. Once seeded, rows live in `cms_roles` and can
* be edited by admins via the Roles UI; they are never force-updated afterwards,
* so a capability added by a later core upgrade is not granted retroactively.
*
* `owner` is different: it is an **invariant**, not a floor. It is always the whole
* of ALL_CAPABILITIES, is rejected by the roles PATCH route, and is reconciled on
* every boot (see CMSEngine.reconcileBuiltinRoles) so new capabilities reach orgs
* that were seeded before those capabilities existed.
*
* Also acts as the defense-in-depth fallback: if a role lookup misses (e.g.
* a row got deleted out-of-band for a built-in name), the checker falls back
* to this map rather than locking the org out.
*/
var BUILTIN_ROLE_SEED = {
	viewer: {
		description: "Read-only access to documents and assets.",
		capabilities: ["document.read", "asset.read"]
	},
	editor: {
		description: "Create, edit, and publish content.",
		capabilities: [
			"document.read",
			"document.create",
			"document.update",
			"document.delete",
			"document.publish",
			"document.unpublish",
			"asset.read",
			"asset.upload",
			"asset.delete"
		]
	},
	admin: {
		description: "All content permissions plus member and settings management.",
		capabilities: [
			"document.read",
			"document.create",
			"document.update",
			"document.delete",
			"document.publish",
			"document.unpublish",
			"asset.read",
			"asset.upload",
			"asset.delete",
			"member.invite",
			"member.remove",
			"member.changeRole",
			"apiKey.manage",
			"role.manage",
			"org.settings",
			"plugin.settings.manage"
		]
	},
	owner: {
		description: "Full access including organization deletion.",
		capabilities: ALL_CAPABILITIES
	}
};
/**
* Write capabilities that imply a matching read. Keeps the UI/API from
* producing degenerate roles/keys that can mutate a resource but not see it.
*/
var DOCUMENT_WRITE_CAPS = [
	"document.create",
	"document.update",
	"document.delete",
	"document.publish",
	"document.unpublish"
];
var ASSET_WRITE_CAPS = ["asset.upload", "asset.delete"];
/**
* Idempotently expand a capability list so that any write cap drags in the
* corresponding read. Used by both the role schema and the API-key schema.
* Accepts `string[]` since a granted list may include plugin capability ids; the
* built-in read/write implications only touch known core ids and pass others through.
*/
function normalizeCapabilities(caps) {
	const set = new Set(caps);
	if (DOCUMENT_WRITE_CAPS.some((c) => set.has(c))) set.add("document.read");
	if (ASSET_WRITE_CAPS.some((c) => set.has(c))) set.add("asset.read");
	return Array.from(set);
}
/**
* Instance roles that override everything else.
*
* `super_admin` and `admin` on the user profile receive the full capability
* set regardless of their per-org role. Keeps the "break glass" path usable
* even if an admin accidentally locks their own role down.
*/
var INSTANCE_ROLE_OVERRIDES = /* @__PURE__ */ new Set(["super_admin", "admin"]);
function isInstanceRole(auth) {
	return auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role);
}
/**
* Check whether an Auth already has a capability.
*
* Expects `auth.capabilities` to have been populated by the auth hook via
* RolesService. If absent (e.g. legacy call site), falls back to the built-in
* seed for the org role so behavior remains safe.
*/
function hasCapability(auth, capability) {
	return resolveCapabilities(auth).has(capability);
}
/** What the coarse `read` scope buys a key. */
var API_KEY_READ_CAPABILITIES = ["document.read", "asset.read"];
/** What the coarse `write` scope adds on top. */
var API_KEY_WRITE_CAPABILITIES = [
	"document.create",
	"document.update",
	"document.delete",
	"document.publish",
	"document.unpublish",
	"asset.upload",
	"asset.delete"
];
/**
* Expand an API key's coarse `read`/`write` scopes into capabilities.
*
* The compatibility path for keys issued before the capability model existed,
* and the default for keys created without an explicit allowlist.
*
* **This expansion is not itself a permission check.** It says what the scopes
* mean, not what the key's owner may actually do — the caller is responsible for
* intersecting the result with the owner's grantable set before trusting it, or
* a `write` key would confer `document.delete` to an owner whose role never had
* it. `AuthService.validateApiKey` does that clamp; anything else deriving
* capabilities from scopes must too.
*/
function coarseApiKeyCapabilities(permissions) {
	const caps = [...API_KEY_READ_CAPABILITIES];
	if (permissions.includes("write")) caps.push(...API_KEY_WRITE_CAPABILITIES);
	return caps;
}
/**
* Resolve the effective capability set for an Auth.
*
* Precedence:
*   1. `auth.capabilities` (pre-resolved by the auth hook) — authoritative.
*   2. Instance-role override (super_admin/admin) → all capabilities.
*   3. API keys → derived from `read`/`write` scopes.
*   4. Session fallback → built-in seed for the org role.
*   5. Partial session → empty set.
*/
function resolveCapabilities(auth) {
	if (auth.type === "partial_session") return EMPTY;
	if ("capabilities" in auth && Array.isArray(auth.capabilities)) return new Set(auth.capabilities);
	if (auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role)) return new Set(ALL_CAPABILITIES);
	if (auth.type === "api_key") return new Set(coarseApiKeyCapabilities(auth.permissions));
	const builtin = BUILTIN_ROLE_SEED[auth.organizationRole];
	return builtin ? new Set(builtin.capabilities) : EMPTY;
}
/**
* Resolve the effective organization role name for an Auth, honoring
* instance-role overrides. Returns the role name as a string — built-in or
* custom — or `null` for partial sessions and API keys.
*
* Used by schema-level access lists: an allowlist like
* `['admin','owner','Testing']` is matched literally against this value, so
* custom role names participate just like built-ins do.
*/
function effectiveOrganizationRole(auth) {
	if (auth.type !== "session") return null;
	if (INSTANCE_ROLE_OVERRIDES.has(auth.user.role)) return "owner";
	return auth.organizationRole ?? null;
}
var EMPTY = /* @__PURE__ */ new Set();
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/events/define-event.js
function defineEvent(type, schema) {
	return {
		type,
		schema,
		parse: (payload) => schema.parse(payload)
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/events/catalog.js
/** Emitted after a document's draft is copied to published, inside the publish transaction. */
var documentPublished = defineEvent("document.published", z.object({
	documentId: z.string(),
	documentType: z.string(),
	publishedHash: z.string().nullable()
}));
/**
* Emitted when a user account is deleted, once per organization they belonged to — the
* erasure fan-out point. Consumers react by removing whatever that user left behind in
* *their* organization, so "delete my account" reaches per-org data without the deletion
* path having to know every consumer that cares.
*
* Carries `image` because it can't be looked up afterwards: the account row is gone by the
* time a consumer runs, taking the only pointer to the avatar asset with it. This is the
* one case where the payload holds a value rather than an identifier, and it's still not a
* secret — it's the same public CDN path the profile served.
*/
var userDeleted = defineEvent("user.deleted", z.object({
	userId: z.string(),
	email: z.string().nullable(),
	/** The profile image as stored, or null. `/media/<assetId>/<filename>` when it's ours. */
	image: z.string().nullable()
}));
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/events/built-in-consumers.js
/** Extract the asset id from an avatar path, or null if it isn't one of ours. */
function avatarAssetId(image) {
	return /^\/media\/([^/]+)\//.exec(image)?.[1] ?? null;
}
/** Every consumer core ships. Seeded into the part resolver ahead of plugin parts. */
var BUILT_IN_EVENT_CONSUMERS = [{
	implements: "aphex/event/consumer",
	id: "aphex.erase-user-avatar",
	events: [userDeleted.type],
	async handler({ event, assetService, logger }) {
		const image = event.payload.image;
		if (typeof image !== "string" || !image) return;
		const assetId = avatarAssetId(image);
		if (!assetId) {
			logger.warn("[erase-user-avatar]", `User ${event.payload.userId} had a non-asset avatar (${image}); nothing to erase automatically.`);
			return;
		}
		if (!assetService) throw new Error(`Cannot erase avatar asset ${assetId}: no asset service is configured on this host.`);
		const deleted = await assetService.deleteAsset(event.organizationId, assetId);
		logger.info("[erase-user-avatar]", deleted ? `Erased avatar asset ${assetId} for deleted user ${event.payload.userId}` : `Avatar asset ${assetId} was already gone for user ${event.payload.userId}`);
	}
}];
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.9.0_173235d9579f197e78425a9e1db71cc6/node_modules/@aphexcms/cms-core/dist/plugins/resolver.js
function createPartResolver(plugins = []) {
	const allParts = [...BUILT_IN_EVENT_CONSUMERS, ...plugins.flatMap((p) => p.parts ?? [])];
	const seen = /* @__PURE__ */ new Map();
	for (const part of allParts) if ("id" in part && typeof part.id === "string") {
		const bucket = seen.get(part.implements) ?? /* @__PURE__ */ new Set();
		if (bucket.has(part.id)) throw new Error(`Duplicate plugin part id "${part.id}" for ${part.implements}. Part ids must be unique per extension point.`);
		bucket.add(part.id);
		seen.set(part.implements, bucket);
	}
	const settingsIds = /* @__PURE__ */ new Set();
	for (const part of allParts) {
		if (part.implements !== "aphex/settings") continue;
		if (settingsIds.has(part.pluginId)) throw new Error(`Duplicate plugin settings declaration for "${part.pluginId}". Each plugin may declare settings once.`);
		settingsIds.add(part.pluginId);
	}
	const agentToolNames = /* @__PURE__ */ new Set();
	for (const part of allParts) {
		if (part.implements !== "aphex/agent/tool") continue;
		if (agentToolNames.has(part.definition.name)) throw new Error(`Duplicate agent tool name "${part.definition.name}". Tool names must be unique across all plugins.`);
		agentToolNames.add(part.definition.name);
	}
	const getParts = (kind) => allParts.filter((p) => p.implements === kind);
	const hasCaps = (required, caps, overrideAccess) => overrideAccess || !required || required.length === 0 || required.every((c) => caps.includes(c));
	return {
		plugins,
		getParts,
		schemaTypes: () => getParts("aphex/schema").flatMap((p) => p.schemas),
		applySchemaTransforms: (schemas) => getParts("aphex/schema/transform").reduce((acc, part) => part.transform(acc), schemas),
		serverRoutes: () => getParts("aphex/server/route"),
		capabilities: () => {
			const set = /* @__PURE__ */ new Set();
			for (const p of getParts("aphex/capabilities")) for (const c of p.capabilities) set.add(typeof c === "string" ? c : c.id);
			return [...set];
		},
		capabilityCatalog: () => {
			const pluginDefs = [];
			for (const p of getParts("aphex/capabilities")) for (const c of p.capabilities) pluginDefs.push(typeof c === "string" ? defineCapability(c) : c);
			return mergeCapabilityCatalog(pluginDefs);
		},
		documentActions: ({ schemaName, capabilities = [], overrideAccess = false }) => getParts("aphex/document/action").filter((a) => !a.appliesTo || a.appliesTo.includes(schemaName)).filter((a) => hasCaps(a.requiredCapabilities, capabilities, overrideAccess)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		adminTools: ({ capabilities = [], overrideAccess = false } = {}) => getParts("aphex/admin/tool").filter((t) => hasCaps(t.requiredCapabilities, capabilities, overrideAccess)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		fieldComponent: (input) => getParts("aphex/field/component").find((f) => f.input === input),
		settingsDeclarations: () => getParts("aphex/settings"),
		settingsDeclaration: (pluginId) => getParts("aphex/settings").find((s) => s.pluginId === pluginId),
		jobHandlers: () => getParts("aphex/job/handler").reduce((acc, part) => ({
			...acc,
			...part.handlers
		}), {}),
		eventConsumers: () => getParts("aphex/event/consumer"),
		consumersForEvent: (eventType) => getParts("aphex/event/consumer").filter((c) => c.events.includes(eventType)),
		agentToolsForCapabilities: (capabilities, overrideAccess = false) => getParts("aphex/agent/tool").filter((t) => hasCaps(t.definition.requiredCapabilities, capabilities, overrideAccess))
	};
}
//#endregion
export { BUILTIN_ROLE_SEED as a, isInstanceRole as c, BUILTIN_ROLE_NAMES as i, normalizeCapabilities as l, documentPublished as n, effectiveOrganizationRole as o, ALL_CAPABILITIES as r, hasCapability as s, createPartResolver as t, resolveCapabilities as u };
