import { sequence } from "@sveltejs/kit/hooks";
import { redirect } from "@sveltejs/kit";
import "../chunks/string.js";
import { a as auth } from "../chunks/instance.js";
import { b as building } from "../chunks/environment.js";
import { c as cmsLogger, s as setLogger, a as setLogLevel } from "../chunks/date-utils.js";
import { A as AuthError } from "../chunks/service.js";
import { P as PermissionChecker, C as CollectionAPI, s as schemasRouter, d as documentsQueryRouter, a as documentsPublishRouter, b as documentVersionsRouter, e as documentsRouter, f as documentsByIdRouter, g as assetsBulkRouter, h as assetsReferencesRouter, i as assetsByIdRouter, j as assetsRouter, o as organizationsSwitchRouter, k as organizationsInvitationsRouter, l as organizationsMembersRouter, m as organizationsByIdRouter, n as organizationsRouter, r as rolesRouter, u as userPreferencesRouter, p as userRouter, c as createStorageAdapter } from "../chunks/user.js";
import sharp from "sharp";
import { B as BUILTIN_ROLE_NAMES, a as BUILTIN_ROLE_SEED } from "../chunks/capabilities.js";
import { v as validateSchemaReferences } from "../chunks/validator.js";
import { c as collectReferenceIds } from "../chunks/reference-walk.js";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import "../chunks/index2.js";
import "../chunks/instance2.js";
import { c as cmsConfig } from "../chunks/aphex.config.js";
class DocumentCache {
  adapter;
  constructor(adapter) {
    this.adapter = adapter;
  }
  async getDocument(orgId, docId) {
    return this.adapter.get(`doc:${orgId}:${docId}`);
  }
  async setDocument(orgId, docId, value) {
    await this.adapter.set(`doc:${orgId}:${docId}`, value);
  }
  async getQuery(orgId, collection, options) {
    return this.adapter.get(this.buildQueryKey(orgId, collection, options));
  }
  async setQuery(orgId, collection, options, value) {
    await this.adapter.set(this.buildQueryKey(orgId, collection, options), value);
  }
  async invalidateDocument(orgId, docId) {
    await this.adapter.delete(`doc:${orgId}:${docId}`);
  }
  async invalidateCollection(orgId, collection) {
    await this.adapter.invalidateByPrefix(`query:${orgId}:${collection}:`);
  }
  async flush() {
    await this.adapter.flush();
  }
  buildQueryKey(orgId, collection, options) {
    const normalized = JSON.stringify(options, (_, value) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return Object.keys(value).sort().reduce((sorted, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {});
      }
      return value;
    });
    return `query:${orgId}:${collection}:${normalized}`;
  }
}
class CMSEngine {
  db;
  config;
  constructor(config, dbAdapter) {
    this.config = config;
    this.db = dbAdapter;
  }
  // Update config dynamically (for schema hot-reloading)
  updateConfig(newConfig) {
    this.config = newConfig;
    cmsLogger.info("[CMS]", "Config updated:", {
      schemaTypes: newConfig.schemaTypes.length,
      documents: newConfig.schemaTypes.filter((t) => t.type === "document").length,
      objects: newConfig.schemaTypes.filter((t) => t.type === "object").length
    });
  }
  // Initialize CMS - register schema types in database
  async initialize() {
    cmsLogger.info("[CMS]", "Initializing...");
    validateSchemaReferences(this.config.schemaTypes);
    const existingSchemas = await this.db.listSchemas();
    const existingNames = new Set(existingSchemas.map((s) => s.name));
    const currentNames = new Set(this.config.schemaTypes.map((s) => s.name));
    for (const existingName of existingNames) {
      if (!currentNames.has(existingName)) {
        await this.db.deleteSchemaType(existingName);
      }
    }
    for (const schemaType of this.config.schemaTypes) {
      await this.db.registerSchemaType(schemaType);
    }
    cmsLogger.info("[CMS]", "Initialized successfully");
  }
  // Schema Type utility methods
  async getSchemaType(name) {
    return this.db.getSchemaType(name);
  }
  async listSchemas() {
    return this.db.listSchemas();
  }
  getSchemaTypeByName(name) {
    return this.config.schemaTypes.find((s) => s.name === name) || null;
  }
  async listDocumentTypes() {
    return this.db.listDocumentTypes();
  }
  async listObjectTypes() {
    return this.db.listObjectTypes();
  }
}
let cmsInstance = null;
function createCMS(config, dbAdapter) {
  if (!cmsInstance) {
    cmsInstance = new CMSEngine(config, dbAdapter);
  } else {
    cmsInstance.updateConfig(config);
  }
  return cmsInstance;
}
async function hydrateCapabilities(auth2, rolesService) {
  if (auth2.type !== "session")
    return;
  if (auth2.capabilities)
    return;
  auth2.capabilities = await rolesService.getCapabilities(auth2.organizationId, auth2.organizationRole);
}
async function handleAuthHook(event, config, authProvider, db, rolesService) {
  const path = event.url.pathname;
  if (path.startsWith("/admin")) {
    try {
      const session = await authProvider.requireSession(event.request, db);
      await hydrateCapabilities(session, rolesService);
      event.locals.auth = session;
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.code === "pending_invitations") {
          throw redirect(302, "/invitations");
        }
        const loginUrl = config.auth?.loginUrl || "/login";
        throw redirect(302, `${loginUrl}?error=${error.code}`);
      }
      throw redirect(302, config.auth?.loginUrl || "/login");
    }
  }
  if (path.startsWith("/assets/") || path.startsWith("/media/")) {
    let auth2 = await authProvider.getSession(event.request, db);
    if (!auth2) {
      auth2 = await authProvider.validateApiKey(event.request, db);
    }
    if (auth2) {
      await hydrateCapabilities(auth2, rolesService);
      event.locals.auth = auth2;
    }
  }
  if (path.startsWith("/api/")) {
    if (path.startsWith("/api/auth")) {
      return null;
    }
    const hasApiKey = event.request.headers.has("x-api-key");
    let auth2 = null;
    if (hasApiKey) {
      auth2 = await authProvider.validateApiKey(event.request, db);
    } else {
      auth2 = await authProvider.getSession(event.request, db);
    }
    const graphqlEndpoint = config.graphql !== false ? typeof config.graphql === "object" ? config.graphql.path ?? "/api/graphql" : "/api/graphql" : void 0;
    const protectedApiRoutes = [
      "/api/documents",
      "/api/assets",
      "/api/schemas",
      "/api/organizations",
      "/api/invitations",
      "/api/roles",
      "/api/settings",
      "/api/instance-settings"
    ];
    if (graphqlEndpoint) {
      protectedApiRoutes.push(graphqlEndpoint);
    }
    const isProtectedRoute = protectedApiRoutes.some((route) => path.startsWith(route));
    if (isProtectedRoute && !auth2) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (auth2 && ["POST", "PUT", "PATCH", "DELETE"].includes(event.request.method)) {
      const readOnlyPostEndpoints = ["/api/documents/query"];
      const isReadOnlyPost = readOnlyPostEndpoints.some((route) => path === route);
      if (!isReadOnlyPost) {
        if (graphqlEndpoint && path.startsWith(graphqlEndpoint)) {
          const requestBody = await event.request.clone().text();
          let isMutation = false;
          try {
            const parsed = JSON.parse(requestBody);
            const query = (parsed.query || "").trim();
            isMutation = query.startsWith("mutation");
          } catch {
            isMutation = requestBody.trim().startsWith("mutation");
          }
          if (isMutation && auth2.type === "api_key" && !auth2.permissions.includes("write")) {
            return new Response(JSON.stringify({ error: "Forbidden: Write permission required for mutations" }), {
              status: 403,
              headers: { "Content-Type": "application/json" }
            });
          }
        } else {
          if (auth2.type === "api_key" && !auth2.permissions.includes("write")) {
            return new Response(JSON.stringify({ error: "Forbidden: Write permission required" }), {
              status: 403,
              headers: { "Content-Type": "application/json" }
            });
          }
        }
      }
    }
    if (auth2) {
      await hydrateCapabilities(auth2, rolesService);
      event.locals.auth = auth2;
    }
  }
  if (!event.locals.auth) {
    try {
      const auth2 = await authProvider.getSession(event.request, db);
      if (auth2) {
        await hydrateCapabilities(auth2, rolesService);
        event.locals.auth = auth2;
      }
    } catch {
    }
  }
  return null;
}
function collectAssetRefs(value, acc = /* @__PURE__ */ new Set()) {
  if (!value || typeof value !== "object")
    return acc;
  if (Array.isArray(value)) {
    for (const v of value)
      collectAssetRefs(v, acc);
    return acc;
  }
  const obj = value;
  const ref = obj.asset?._ref;
  if (typeof ref === "string")
    acc.add(ref);
  for (const key in obj)
    collectAssetRefs(obj[key], acc);
  return acc;
}
function injectAssetData(value, resolved) {
  if (!value || typeof value !== "object")
    return;
  if (Array.isArray(value)) {
    for (const v of value)
      injectAssetData(v, resolved);
    return;
  }
  const obj = value;
  const asset = obj.asset;
  if (asset && typeof asset === "object" && typeof asset._ref === "string") {
    const hit = resolved.get(asset._ref);
    if (hit) {
      asset.url = hit.url;
      if (hit.alt != null)
        asset.alt = hit.alt;
    }
  }
  for (const key in obj)
    injectAssetData(obj[key], resolved);
}
class AssetService {
  storage;
  database;
  constructor(storage, database) {
    this.storage = storage;
    this.database = database;
  }
  /**
   * Upload and store an asset
   */
  async uploadAsset(organizationId, data) {
    const assetType = data.mimeType.startsWith("image/") ? "image" : "file";
    let width;
    let height;
    let metadata = {
      // Include field metadata for privacy checking
      ...data.metadata
    };
    if (assetType === "image") {
      try {
        const imageMetadata = await sharp(data.buffer, {
          limitInputPixels: 1e8
        }).metadata();
        width = imageMetadata.width;
        height = imageMetadata.height;
        metadata = {
          ...metadata,
          // Keep schemaType and fieldPath
          format: imageMetadata.format,
          space: imageMetadata.space,
          channels: imageMetadata.channels,
          density: imageMetadata.density,
          hasProfile: imageMetadata.hasProfile,
          hasAlpha: imageMetadata.hasAlpha
        };
        const stats = await sharp(data.buffer, { limitInputPixels: 1e8 }).stats();
        metadata.dominantColor = stats.dominant;
      } catch (error) {
        cmsLogger.warn("Could not extract image metadata:", error);
      }
    }
    const storageFile = await this.storage.store({
      buffer: data.buffer,
      filename: data.originalFilename,
      mimeType: data.mimeType,
      size: data.size
    });
    try {
      const asset = await this.database.createAsset({
        assetType,
        filename: storageFile.path.split("/").pop() || data.originalFilename,
        originalFilename: data.originalFilename,
        mimeType: data.mimeType,
        size: data.size,
        url: storageFile.url || "",
        // Empty for local storage initially
        path: storageFile.path,
        storageAdapter: this.storage.name,
        organizationId,
        width,
        height,
        metadata,
        title: data.title || void 0,
        description: data.description || void 0,
        alt: data.alt || void 0,
        creditLine: data.creditLine || void 0,
        createdBy: data.createdBy
      });
      if (!storageFile.url) {
        const cdnUrl = `/media/${asset.id}/${encodeURIComponent(asset.originalFilename)}`;
        asset.url = cdnUrl;
        await this.database.updateAsset(organizationId, asset.id, { url: cdnUrl });
      }
      return asset;
    } catch (error) {
      await this.storage.delete(storageFile.path);
      throw error;
    }
  }
  /**
   * Find asset by ID
   */
  async findAssetById(organizationId, id) {
    return await this.database.findAssetById(organizationId, id);
  }
  /**
   * Hydrate one or more documents in place so their images are renderable: every
   * `{ asset: { _ref } }` reachable in the docs gets its `url` (and default `alt`)
   * injected. This is what a public route's `load` calls before returning a document —
   * the frontend then reads `image.asset.url` directly, with no side-channel map. The
   * live editor preview performs the identical injection client-side, so SSR and preview
   * documents share one shape.
   *
   * Mutates the passed documents (they're request-scoped query results). Refs are
   * resolved once and de-duped across all docs in a single batch.
   */
  async injectAssetUrls(organizationId, ...docs) {
    const refs = /* @__PURE__ */ new Set();
    for (const doc of docs)
      collectAssetRefs(doc, refs);
    if (refs.size === 0)
      return;
    const resolved = /* @__PURE__ */ new Map();
    await Promise.all([...refs].map(async (ref) => {
      try {
        const asset = await this.findAssetById(organizationId, ref);
        if (asset?.url)
          resolved.set(ref, { url: asset.url, alt: asset.alt ?? void 0 });
      } catch {
      }
    }));
    for (const doc of docs)
      injectAssetData(doc, resolved);
  }
  /**
   * Find asset by ID globally (bypasses organization filter for public asset access)
   * Only available on PostgreSQL adapter with RLS bypass
   */
  async findAssetByIdGlobal(id) {
    if ("findAssetByIdGlobal" in this.database && typeof this.database.findAssetByIdGlobal === "function") {
      cmsLogger.debug("[AssetService] Using findAssetByIdGlobal from adapter");
      return await this.database.findAssetByIdGlobal(id);
    }
    cmsLogger.warn("[AssetService] findAssetByIdGlobal not supported by this database adapter");
    cmsLogger.warn("[AssetService] Database adapter type:", this.database.constructor.name);
    cmsLogger.warn("[AssetService] Available methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(this.database)));
    return null;
  }
  /**
   * Find multiple assets with filtering
   */
  async findAssets(organizationId, filters = {}) {
    return await this.database.findAssets(organizationId, filters);
  }
  /**
   * Delete asset (both file and database record)
   *
   * Note: If the asset was stored by a different adapter (e.g., switching from R2 to local),
   * file deletion may fail. The database record will still be removed for a clean state.
   */
  async deleteAsset(organizationId, id) {
    const asset = await this.database.findAssetById(organizationId, id);
    if (!asset) {
      return false;
    }
    if (asset.storageAdapter === this.storage.name) {
      try {
        await this.storage.delete(asset.path);
      } catch (error) {
        cmsLogger.warn(`Failed to delete file from storage: ${asset.path}`, error);
      }
    } else {
      cmsLogger.warn(`Asset ${id} was stored by '${asset.storageAdapter}' but current adapter is '${this.storage.name}'. File at ${asset.path} may need manual cleanup.`);
    }
    return await this.database.deleteAsset(organizationId, id);
  }
  /**
   * Update asset metadata
   */
  async updateAssetMetadata(organizationId, id, metadata) {
    return await this.database.updateAsset(organizationId, id, metadata);
  }
  /**
   * Get asset statistics
   */
  async getAssetStats(organizationId) {
    const [totalAssets, assetsByType, totalSize] = await Promise.all([
      this.database.countAssets(organizationId),
      this.database.countAssetsByType(organizationId),
      this.database.getTotalAssetsSize(organizationId)
    ]);
    return {
      totalAssets,
      totalImages: assetsByType.image || 0,
      totalFiles: assetsByType.file || 0,
      totalSize
    };
  }
  /**
   * Get health status of both storage and database
   */
  async getHealthStatus() {
    const [storageHealthy, databaseHealthy] = await Promise.all([
      this.storage.isHealthy(),
      this.database.isHealthy()
    ]);
    return {
      storage: storageHealthy,
      database: databaseHealthy
    };
  }
}
class RolesService {
  db;
  cache;
  ttl;
  static DEFAULT_TTL = 30;
  // 30 seconds — roles change infrequently but should pick up edits quickly.
  inflight = /* @__PURE__ */ new Map();
  constructor(db, cache = null, ttl = RolesService.DEFAULT_TTL) {
    this.db = db;
    this.cache = cache;
    this.ttl = ttl;
  }
  /**
   * Resolve the capability list for `(organizationId, roleName)`.
   *
   * Fallback order:
   *   1. Cache hit.
   *   2. DB lookup for the `(org, name)` row.
   *   3. Built-in seed if the name matches a built-in.
   *   4. Empty list — unknown role → no capabilities.
   */
  async getCapabilities(organizationId, roleName) {
    const key = cacheKey(organizationId, roleName);
    if (this.cache) {
      const cached = await this.cache.get(key);
      if (cached)
        return cached;
    }
    const existing = this.inflight.get(key);
    if (existing)
      return existing;
    const promise = this.resolveFromDb(organizationId, roleName).then(async (caps) => {
      if (this.cache)
        await this.cache.set(key, caps, this.ttl);
      this.inflight.delete(key);
      return caps;
    });
    this.inflight.set(key, promise);
    return promise;
  }
  /** List every role defined for an organization. */
  async listRoles(organizationId) {
    return this.db.listRoles(organizationId);
  }
  /** Idempotent — safe to call on every request if you want. */
  async ensureBuiltins(organizationId) {
    await this.db.seedBuiltinRoles(organizationId);
  }
  /** Invalidate cache entries for a single role. Call after mutation. */
  async invalidate(organizationId, roleName) {
    if (!this.cache)
      return;
    if (roleName) {
      await this.cache.delete(cacheKey(organizationId, roleName));
      return;
    }
    await this.cache.invalidateByPrefix(`roles:${organizationId}:`);
  }
  // ---- internals -----------------------------------------------------------
  async resolveFromDb(organizationId, roleName) {
    const row = await this.db.findRoleByName(organizationId, roleName);
    if (row) {
      cmsLogger.debug("[RBAC]", `Resolved role "${roleName}" in org=${organizationId} via DB (${row.capabilities.length} caps)`);
      return row.capabilities;
    }
    if (BUILTIN_ROLE_NAMES.includes(roleName)) {
      cmsLogger.warn("[RBAC]", `Role "${roleName}" not found in org=${organizationId} — using BUILTIN_ROLE_SEED fallback. Run ensureBuiltins.`);
      return [...BUILTIN_ROLE_SEED[roleName].capabilities];
    }
    cmsLogger.warn("[RBAC]", `Unknown role "${roleName}" in org=${organizationId} — granting no capabilities`);
    return [];
  }
}
function cacheKey(organizationId, roleName) {
  return `roles:${organizationId}:${roleName}`;
}
class HierarchyService {
  db;
  cache;
  ttl;
  static DEFAULT_TTL = 60;
  // 60 seconds
  inflight = /* @__PURE__ */ new Map();
  constructor(db, cache = null, ttl = HierarchyService.DEFAULT_TTL) {
    this.db = db;
    this.cache = cache;
    this.ttl = ttl;
  }
  async getChildOrganizations(parentOrganizationId) {
    if (!this.db.hierarchyEnabled) {
      return [];
    }
    const key = `hierarchy:${parentOrganizationId}`;
    if (this.cache) {
      const cached = await this.cache.get(key);
      if (cached)
        return cached;
    }
    const existing = this.inflight.get(key);
    if (existing)
      return existing;
    const promise = this.db.getChildOrganizations(parentOrganizationId).then(async (ids) => {
      if (this.cache) {
        await this.cache.set(key, ids, this.ttl);
      }
      this.inflight.delete(key);
      return ids;
    });
    this.inflight.set(key, promise);
    return promise;
  }
  /**
   * Get the parent org ID plus all its child org IDs.
   * Convenience for building filterOrganizationIds arrays.
   */
  async getOrgIdsWithChildren(organizationId) {
    const childIds = await this.getChildOrganizations(organizationId);
    return childIds.length > 0 ? [organizationId, ...childIds] : [organizationId];
  }
  async invalidate(parentOrganizationId) {
    if (this.cache) {
      await this.cache.delete(`hierarchy:${parentOrganizationId}`);
    }
  }
  async flush() {
    if (this.cache) {
      await this.cache.invalidateByPrefix("hierarchy:");
    }
  }
}
class VersionService {
  maxVersions;
  constructor(options) {
    this.maxVersions = options?.maxVersions ?? 25;
  }
  /**
   * Create a version snapshot and enforce rolling retention.
   */
  async createVersion(db, organizationId, documentId, eventType, data, userId) {
    if (!db.createDocumentVersion)
      return null;
    const version = await db.createDocumentVersion({
      documentId,
      organizationId,
      eventType,
      data,
      createdBy: userId
    });
    await this.enforceRetention(db, documentId, organizationId);
    return version;
  }
  /**
   * Save draft and create version atomically using adapter transaction.
   */
  async saveWithVersion(db, organizationId, documentId, data, userId) {
    if (db.withTransaction && db.createDocumentVersion) {
      const updated2 = await db.withTransaction(async (txAdapter) => {
        const result = await txAdapter.updateDocDraft(organizationId, documentId, data, userId);
        if (result) {
          await txAdapter.createDocumentVersion({
            documentId,
            organizationId,
            eventType: "draft",
            data,
            createdBy: userId
          });
        }
        return result;
      });
      if (updated2)
        await this.enforceRetention(db, documentId, organizationId);
      return updated2;
    }
    const updated = await db.updateDocDraft(organizationId, documentId, data, userId);
    if (updated) {
      await this.createVersion(db, organizationId, documentId, "draft", data, userId);
    }
    return updated;
  }
  /**
   * Publish and create version.
   */
  async publishWithVersion(db, organizationId, documentId) {
    const published = await db.publishDoc(organizationId, documentId);
    if (!published)
      return null;
    await this.createVersion(db, organizationId, documentId, "publish", published.publishedData, published.updatedBy);
    return published;
  }
  /**
   * Restore a version to draft. Creates a 'draft' version entry.
   */
  async restoreVersion(db, organizationId, documentId, versionNumber, userId) {
    if (!db.getDocumentVersion)
      return null;
    const version = await db.getDocumentVersion(organizationId, documentId, versionNumber);
    if (!version)
      return null;
    if (db.withTransaction && db.createDocumentVersion) {
      const restored2 = await db.withTransaction(async (txAdapter) => {
        const result = await txAdapter.updateDocDraft(organizationId, documentId, version.data, userId);
        if (result) {
          await txAdapter.createDocumentVersion({
            documentId,
            organizationId,
            eventType: "draft",
            data: version.data,
            createdBy: userId
          });
        }
        return result;
      });
      if (restored2)
        await this.enforceRetention(db, documentId, organizationId);
      return restored2;
    }
    const restored = await db.updateDocDraft(organizationId, documentId, version.data, userId);
    if (restored) {
      await this.createVersion(db, organizationId, documentId, "draft", version.data, userId);
    }
    return restored;
  }
  async listVersions(db, organizationId, documentId, options) {
    if (!db.listDocumentVersions)
      return { versions: [], total: 0 };
    return db.listDocumentVersions(organizationId, documentId, options);
  }
  async getVersion(db, organizationId, documentId, versionNumber) {
    if (!db.getDocumentVersion)
      return null;
    return db.getDocumentVersion(organizationId, documentId, versionNumber);
  }
  async enforceRetention(db, documentId, organizationId) {
    if (this.maxVersions <= 0)
      return;
    if (!db.listDocumentVersions || !db.deleteDocumentVersions)
      return;
    const { total, versions } = await db.listDocumentVersions(organizationId, documentId, {
      limit: 1e3,
      offset: 0
    });
    if (total <= this.maxVersions)
      return;
    const toDelete = versions.slice(this.maxVersions);
    if (toDelete.length > 0) {
      await db.deleteDocumentVersions(documentId, toDelete.map((v) => v.id));
    }
  }
}
class ReferencesService {
  databaseAdapter;
  constructor(databaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }
  /**
   * Sync the back-reference rows for a single document. Idempotent —
   * safe to call repeatedly with the same data.
   */
  async syncReferencesFor(organizationId, documentId, data, schema, registry) {
    try {
      const refIds = collectReferenceIds(data, schema, registry);
      await this.databaseAdapter.replaceReferencesFor(organizationId, documentId, refIds);
    } catch (err) {
      cmsLogger.error("[References]", "Failed to sync references for", documentId, err);
    }
  }
  /**
   * Boot-time backfill — if the references table is empty for an org,
   * scan every document and rebuild the index. Idempotent and cheap when
   * the index already has rows (the empty check short-circuits).
   *
   * Skipped silently in error paths — boot must keep going even if the
   * scan can't run (missing perms, connection issues, etc).
   */
  async backfillIfEmpty(organizationId, schemas, listAllDocuments) {
    try {
      const populated = await this.databaseAdapter.hasAnyReferences(organizationId);
      if (populated)
        return;
      const docs = await listAllDocuments();
      if (docs.length === 0)
        return;
      cmsLogger.info("[References]", `Backfilling reference index for ${docs.length} document(s) in org ${organizationId}`);
      for (const doc of docs) {
        const schema = schemas.find((s) => s.name === doc.type) ?? null;
        const refIds = collectReferenceIds(doc.data, schema, schemas);
        await this.databaseAdapter.replaceReferencesFor(organizationId, doc.id, refIds);
      }
      cmsLogger.info("[References]", "Backfill complete");
    } catch (err) {
      cmsLogger.error("[References]", "Backfill failed (continuing without index)", err);
    }
  }
}
const SYNC_COLLECTION_METHODS = /* @__PURE__ */ new Set(["getSingletonId"]);
class LocalAPI {
  config;
  collections = {};
  _collections = /* @__PURE__ */ new Map();
  userAdapter;
  systemAdapter;
  documentCache;
  hierarchyService;
  versionService;
  referencesService;
  permissions;
  schemas;
  constructor(config, userAdapter, systemAdapter) {
    this.config = config;
    this.userAdapter = userAdapter;
    this.systemAdapter = systemAdapter || null;
    this.documentCache = config.cache ? new DocumentCache(config.cache) : null;
    this.hierarchyService = new HierarchyService(userAdapter, config.cache);
    this.versionService = new VersionService({
      maxVersions: config.versioning?.maxVersions ?? 25
    });
    this.referencesService = new ReferencesService(userAdapter);
    this.schemas = new Map(config.schemaTypes.filter((schema) => schema.type === "document").map((schema) => [schema.name, schema]));
    this.permissions = new PermissionChecker(config, this.schemas);
    this.initializeCollections();
  }
  /**
   * Initialize collection APIs for all document schema types
   */
  initializeCollections() {
    const documentSchemas = this.config.schemaTypes.filter((s) => s.type === "document");
    for (const schema of documentSchemas) {
      const collectionAPI = new Proxy(new CollectionAPI(schema.name, this.userAdapter, schema, this.permissions, this.documentCache, this.hierarchyService, this.versionService, this.referencesService, this.config.schemaTypes), {
        get: (target, prop) => {
          const method = target[prop];
          if (typeof method === "function" && SYNC_COLLECTION_METHODS.has(prop)) {
            return method.bind(target);
          }
          if (typeof method === "function") {
            return async (...args) => {
              const context = args[0];
              const adapter = this.getAdapter(context);
              const api = new CollectionAPI(schema.name, adapter, schema, this.permissions, this.documentCache, this.hierarchyService, this.versionService, new ReferencesService(adapter), this.config.schemaTypes);
              return api[prop].apply(api, args);
            };
          }
          return method;
        }
      });
      this._collections.set(schema.name, collectionAPI);
      this.collections[schema.name] = collectionAPI;
    }
  }
  /**
   * Get the appropriate database adapter based on context
   * Uses system adapter if overrideAccess is true, otherwise uses user adapter
   */
  getAdapter(context) {
    if (context.overrideAccess && this.systemAdapter) {
      return this.systemAdapter;
    }
    return this.userAdapter;
  }
  /**
   * Get list of available collection names
   */
  getCollectionNames() {
    return Array.from(this.schemas.keys());
  }
  /**
   * Check if a collection exists
   */
  hasCollection(name) {
    return this.schemas.has(name);
  }
  /**
   * Get a collection by name (for dynamic access in route handlers and resolvers)
   */
  getCollection(name) {
    return this._collections.get(name);
  }
  /**
   * Get schema for a collection
   */
  getCollectionSchema(name) {
    return this.schemas.get(name);
  }
  /**
   * Find a document by ID without knowing its collection type.
   * Resolves org hierarchy and passes filterOrganizationIds to avoid RLS transactions.
   * Returns the raw document with its type, or null if not found.
   */
  async findDocumentById(context, id, options) {
    const adapter = this.getAdapter(context);
    const findOptions = { ...options };
    if (this.hierarchyService) {
      const orgIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
      findOptions.filterOrganizationIds = orgIds;
    }
    const rawDoc = await adapter.findByDocIdAdvanced(context.organizationId, id, findOptions);
    if (!rawDoc)
      return null;
    return { type: rawDoc.type, document: rawDoc };
  }
  /**
   * Find all documents that reference the given target — the back-reference
   * lookup that powers the unpublish guard. Returns lightweight rows
   * (id/type/status); callers fetch full docs separately if they need data.
   */
  async getBackReferences(context, refId) {
    const adapter = this.getAdapter(context);
    return adapter.findBackReferences(context.organizationId, refId);
  }
  /**
   * Batch lookup — fetch many documents by ID in one call. Routes through
   * each doc's collection so the returned shape matches `collection.findByID`
   * (perms applied, transformed, hidden fields stripped). Org hierarchy is
   * resolved once for the whole batch and threaded into each per-collection
   * call.
   *
   * Heterogeneous batches (mixed types) leave T as the default `unknown`;
   * homogeneous callers (e.g. an array-of-references-to-one-type) can
   * narrow it: `findDocumentsByIds<MenuItem>(ctx, ids)`.
   *
   * Missing/forbidden IDs are dropped from the result rather than thrown —
   * callers compare result length to input length to detect gaps. If/when
   * an adapter exposes a true `WHERE id IN (...)` batch we can short-circuit
   * the per-id collection round-trips here without changing call sites.
   */
  async findDocumentsByIds(context, ids, options) {
    if (ids.length === 0)
      return [];
    const adapter = this.getAdapter(context);
    let filterOrganizationIds = options?.filterOrganizationIds;
    if (!filterOrganizationIds && this.hierarchyService) {
      filterOrganizationIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
    }
    const typeLookups = await Promise.all(ids.map((id) => adapter.findByDocIdAdvanced(context.organizationId, id, { filterOrganizationIds }).then((row) => row ? { id, type: row.type } : null)));
    const docs = await Promise.all(typeLookups.map(async (lookup) => {
      if (!lookup)
        return null;
      const collection = this.getCollection(lookup.type);
      if (!collection)
        return null;
      try {
        return await collection.findByID(context, lookup.id, {
          ...options,
          filterOrganizationIds
        });
      } catch {
        return null;
      }
    }));
    return docs.filter((d) => d != null);
  }
}
let localAPIInstance = null;
function createLocalAPI(config, userAdapter, systemAdapter) {
  localAPIInstance = new LocalAPI(config, userAdapter, systemAdapter);
  return localAPIInstance;
}
function createAphexApi() {
  const app = new Hono().basePath("/api");
  app.use("*", bodyLimit({
    maxSize: 10 * 1024 * 1024,
    // 10MB for JSON endpoints
    onError: (c) => c.json({ success: false, error: "Request body too large (max 10MB)" }, 413)
  }));
  app.use("*", async (c, next) => {
    c.set("aphexCMS", c.env.aphexCMS);
    c.set("auth", c.env.auth);
    await next();
  });
  return app;
}
function mountAphexBuiltins(app) {
  app.route("/schemas", schemasRouter);
  app.route("/documents", documentsQueryRouter);
  app.route("/documents", documentsPublishRouter);
  app.route("/documents", documentVersionsRouter);
  app.route("/documents", documentsRouter);
  app.route("/documents", documentsByIdRouter);
  app.route("/assets", assetsBulkRouter);
  app.route("/assets", assetsReferencesRouter);
  app.route("/assets", assetsByIdRouter);
  app.route("/assets", assetsRouter);
  app.route("/organizations", organizationsSwitchRouter);
  app.route("/organizations", organizationsInvitationsRouter);
  app.route("/organizations", organizationsMembersRouter);
  app.route("/organizations", organizationsByIdRouter);
  app.route("/organizations", organizationsRouter);
  app.route("/roles", rolesRouter);
  app.route("/user", userPreferencesRouter);
  app.route("/user", userRouter);
  app.get("/aphex-health", async (c) => {
    try {
      const { databaseAdapter } = c.var.aphexCMS;
      const dbHealthy = await databaseAdapter.isHealthy();
      const status = dbHealthy ? "healthy" : "degraded";
      return c.json({ status, database: dbHealthy }, dbHealthy ? 200 : 503);
    } catch {
      return c.json({ status: "unhealthy", database: false }, 503);
    }
  });
}
function toHonoHandler(skHandler) {
  return async (c) => {
    const fakeEvent = {
      request: c.req.raw,
      url: new URL(c.req.url),
      params: c.req.param(),
      locals: {
        aphexCMS: c.var.aphexCMS,
        auth: c.var.auth
      },
      // No-op fallbacks — only used if a wrapped SK handler probes for them.
      setHeaders: () => void 0,
      getClientAddress: () => c.req.header("x-forwarded-for") ?? "127.0.0.1"
    };
    return skHandler(fakeEvent);
  };
}
let cmsInstances = null;
let schemaError = null;
let initPromise = null;
let activeConfig = null;
function checkSchemasDirty() {
  return false;
}
function createDefaultStorageAdapter() {
  return createStorageAdapter("local", {
    basePath: "./storage/assets",
    // Private storage - not in static/, not served in production
    baseUrl: ""
    // No direct URL - all access through /assets/{id}/{filename}
  });
}
function createCMSHook(config) {
  if (!config) {
    throw new Error("[CMS] createCMSHook received an undefined config. If this happens during HMR, the config module may not have re-executed yet.");
  }
  if (config.logger)
    setLogger(config.logger);
  if (config.logLevel)
    setLogLevel(config.logLevel);
  activeConfig = config;
  return async ({ event, resolve }) => {
    const currentConfig = activeConfig ?? config;
    if (cmsInstances && (checkSchemasDirty() || schemaError)) {
      cmsLogger.info("[CMS]", "Schema change detected, re-initializing...");
      if (cmsInstances.config.cache) {
        cmsInstances.config.cache.flush();
      }
      cmsInstances = null;
      schemaError = null;
      initPromise = null;
    }
    if (initPromise) {
      await initPromise;
    }
    if (!cmsInstances) {
      let resolveInit;
      initPromise = new Promise((r) => resolveInit = r);
      cmsLogger.info("[CMS]", "Initializing...");
      const databaseAdapter = currentConfig.database;
      const storageAdapter = currentConfig.storage ?? createDefaultStorageAdapter();
      const emailAdapter = currentConfig.email ?? null;
      const assetService = new AssetService(storageAdapter, databaseAdapter);
      const cmsEngine = createCMS(currentConfig, databaseAdapter);
      const rolesService = new RolesService(databaseAdapter, currentConfig.cache ?? null);
      const localAPI = createLocalAPI(currentConfig, databaseAdapter);
      const apiApp = createAphexApi();
      currentConfig.api?.(apiApp);
      mountAphexBuiltins(apiApp);
      try {
        await cmsEngine.initialize();
      } catch (error) {
        cmsLogger.error("[CMS]", "Failed to initialize:", error);
        schemaError = error instanceof Error ? error : new Error(String(error));
      }
      let graphqlSettings = null;
      if (currentConfig.graphql !== false) {
        try {
          const { createGraphQLHandler } = await import("../chunks/index10.js");
          const graphqlConfig = typeof currentConfig.graphql === "object" ? currentConfig.graphql : {};
          const result = await createGraphQLHandler({
            config: currentConfig,
            databaseAdapter,
            assetService,
            storageAdapter,
            emailAdapter,
            cmsEngine,
            localAPI,
            rolesService,
            logger: cmsLogger,
            auth: currentConfig.auth?.provider,
            apiApp
          }, currentConfig.schemaTypes, graphqlConfig);
          const rawPath = graphqlConfig.path ?? "/api/graphql";
          const fullPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
          const honoPath = fullPath.startsWith("/api") ? fullPath.slice("/api".length) || "/" : fullPath;
          apiApp.all(honoPath, toHonoHandler(result.handler));
          graphqlSettings = result.settings;
        } catch (error) {
          cmsLogger.error("[CMS]", "Failed to initialize GraphQL:", error);
        }
      }
      cmsInstances = {
        config: currentConfig,
        databaseAdapter,
        assetService,
        storageAdapter,
        emailAdapter,
        cmsEngine,
        localAPI,
        rolesService,
        logger: cmsLogger,
        auth: currentConfig.auth?.provider,
        graphqlSettings,
        apiApp
      };
      resolveInit();
    }
    if (cmsInstances) {
      cmsInstances.schemaError = schemaError;
    }
    event.locals.aphexCMS = cmsInstances;
    if (cmsInstances.auth) {
      const authResponse = await handleAuthHook(event, currentConfig, cmsInstances.auth, cmsInstances.databaseAdapter, cmsInstances.rolesService);
      if (authResponse)
        return authResponse;
    }
    return resolve(event);
  };
}
const svelteKitHandler = async ({ auth: auth2, event, resolve, building: building2 }) => {
  if (building2) return resolve(event);
  const { request, url } = event;
  if (isAuthPath(url.toString(), auth2.options)) return auth2.handler(request);
  return resolve(event);
};
function isAuthPath(url, options) {
  const _url = new URL(url);
  const baseURLStr = typeof options.baseURL === "string" ? options.baseURL : void 0;
  const baseURL = new URL(`${baseURLStr || _url.origin}${options.basePath || "/api/auth"}`);
  if (_url.origin !== baseURL.origin) return false;
  if (!_url.pathname.startsWith(baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`)) return false;
  return true;
}
const authHook = async ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth, building });
};
const aphexHook = createCMSHook(cmsConfig);
const routingHook = async ({ event, resolve }) => {
  if (event.url.pathname === "/") {
    throw redirect(302, "/admin");
  }
  return resolve(event);
};
const handle = sequence(authHook, aphexHook, routingHook);
export {
  handle
};
