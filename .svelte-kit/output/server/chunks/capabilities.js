const ALL_CAPABILITIES = [
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
function defineCapability(id, meta = {}) {
  return {
    id,
    title: meta.title || prettifyCapabilityId(id),
    description: meta.description,
    group: meta.group
  };
}
function prettifyCapabilityId(id) {
  const last = id.split(/[.:]/).pop() ?? id;
  const spaced = last.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
const BUILTIN_CAPABILITY_DEFS = [
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
function mergeCapabilityCatalog(extra = []) {
  const byId = /* @__PURE__ */ new Map();
  for (const def of [...BUILTIN_CAPABILITY_DEFS, ...extra]) {
    if (!byId.has(def.id))
      byId.set(def.id, def);
  }
  return [...byId.values()];
}
const BUILTIN_ROLE_NAMES = [
  "owner",
  "admin",
  "editor",
  "viewer"
];
const BUILTIN_ROLE_SEED = {
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
const DOCUMENT_WRITE_CAPS = [
  "document.create",
  "document.update",
  "document.delete",
  "document.publish",
  "document.unpublish"
];
const ASSET_WRITE_CAPS = ["asset.upload", "asset.delete"];
function normalizeCapabilities(caps) {
  const set = new Set(caps);
  if (DOCUMENT_WRITE_CAPS.some((c) => set.has(c)))
    set.add("document.read");
  if (ASSET_WRITE_CAPS.some((c) => set.has(c)))
    set.add("asset.read");
  return Array.from(set);
}
const INSTANCE_ROLE_OVERRIDES = /* @__PURE__ */ new Set(["super_admin", "admin"]);
function isInstanceRole(auth) {
  return auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role);
}
function hasCapability(auth, capability) {
  return resolveCapabilities(auth).has(capability);
}
function resolveCapabilities(auth) {
  if (auth.type === "partial_session")
    return EMPTY;
  if ("capabilities" in auth && Array.isArray(auth.capabilities)) {
    return new Set(auth.capabilities);
  }
  if (auth.type === "session" && INSTANCE_ROLE_OVERRIDES.has(auth.user.role)) {
    return new Set(ALL_CAPABILITIES);
  }
  if (auth.type === "api_key") {
    if (Array.isArray(auth.capabilities) && auth.capabilities.length > 0) {
      return new Set(auth.capabilities);
    }
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
function effectiveOrganizationRole(auth) {
  if (auth.type !== "session")
    return null;
  if (INSTANCE_ROLE_OVERRIDES.has(auth.user.role))
    return "owner";
  return auth.organizationRole ?? null;
}
const EMPTY = /* @__PURE__ */ new Set();
export {
  ALL_CAPABILITIES as A,
  BUILTIN_ROLE_NAMES as B,
  BUILTIN_ROLE_SEED as a,
  defineCapability as d,
  effectiveOrganizationRole as e,
  hasCapability as h,
  isInstanceRole as i,
  mergeCapabilityCatalog as m,
  normalizeCapabilities as n,
  resolveCapabilities as r
};
