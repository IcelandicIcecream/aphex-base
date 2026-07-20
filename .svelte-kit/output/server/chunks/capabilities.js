//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/types/capabilities.js
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
	if (auth.type === "api_key") {
		if (Array.isArray(auth.capabilities) && auth.capabilities.length > 0) return new Set(auth.capabilities);
		const caps = /* @__PURE__ */ new Set(["document.read", "asset.read"]);
		if (auth.permissions.includes("write")) {
			caps.add("document.create");
			caps.add("document.update");
			caps.add("document.delete");
			caps.add("document.publish");
			caps.add("document.unpublish");
			caps.add("asset.upload");
			caps.add("asset.delete");
		}
		return caps;
	}
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
export { effectiveOrganizationRole as a, mergeCapabilityCatalog as c, defineCapability as i, normalizeCapabilities as l, BUILTIN_ROLE_NAMES as n, hasCapability as o, BUILTIN_ROLE_SEED as r, isInstanceRole as s, ALL_CAPABILITIES as t, resolveCapabilities as u };
