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
  "org.settings"
];
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
      "org.settings"
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
  effectiveOrganizationRole as e,
  hasCapability as h,
  isInstanceRole as i,
  normalizeCapabilities as n
};
