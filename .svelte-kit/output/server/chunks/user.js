import { stat, mkdir, writeFile, unlink, readdir } from "fs/promises";
import { basename, join, dirname, resolve } from "path";
import { c as cmsLogger } from "./date-utils.js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v as validateDocumentData, a as authToContext } from "./auth-helpers.js";
import { c as collectReferenceIds } from "./reference-walk.js";
import { i as isInstanceRole, e as effectiveOrganizationRole, h as hasCapability, A as ALL_CAPABILITIES, n as normalizeCapabilities, B as BUILTIN_ROLE_NAMES } from "./capabilities.js";
import { z } from "zod";
const SINGLETON_NAMESPACE = "6f4d2c3b-7a51-4e62-9b1d-aphexsingleton";
function fnv1a64(input) {
  let h = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (let i = 0; i < input.length; i++) {
    h ^= BigInt(input.charCodeAt(i));
    h = h * prime & mask;
  }
  return h.toString(16).padStart(16, "0");
}
function singletonId(schemaName, organizationId) {
  const seed = `${SINGLETON_NAMESPACE}:${organizationId}:${schemaName}`;
  const a = fnv1a64(`${seed}:a`);
  const b = fnv1a64(`${seed}:b`);
  const hex = (a + b).slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `5${hex.slice(13, 16)}`,
    `${(parseInt(hex.slice(16, 18), 16) & 63 | 128).toString(16).padStart(2, "0")}${hex.slice(18, 20)}`,
    hex.slice(20, 32)
  ].join("-");
}
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
class LocalStorageAdapter {
  name = "local";
  config;
  constructor(config) {
    this.config = {
      basePath: config.basePath,
      baseUrl: config.baseUrl || "",
      maxFileSize: config.maxFileSize || DEFAULT_MAX_FILE_SIZE,
      options: config.options || {}
    };
  }
  /**
   * Strip path traversal sequences, keeping only the base filename.
   */
  sanitizeFilename(filename) {
    return basename(filename).replace(/^\.+/, "_");
  }
  /**
   * Generate unique filename preserving original name
   */
  async generateUniqueFilename(originalFilename) {
    const safe = this.sanitizeFilename(originalFilename);
    const { name, ext } = this.parseFilename(safe);
    let filename = safe;
    let counter = 1;
    while (await this.fileExistsOnDisk(filename)) {
      filename = `${name} (${counter})${ext}`;
      counter++;
    }
    return filename;
  }
  /**
   * Parse filename into name and extension
   */
  parseFilename(filename) {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return { name: filename, ext: "" };
    }
    return {
      name: filename.substring(0, lastDotIndex),
      ext: filename.substring(lastDotIndex)
    };
  }
  /**
   * Check if file exists on disk
   */
  async fileExistsOnDisk(filename) {
    try {
      const filePath = join(this.config.basePath, filename);
      await stat(filePath);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Store a file and return storage info
   */
  async store(data) {
    if (data.size > this.config.maxFileSize) {
      throw new Error(`File too large: ${data.size} bytes. Maximum size: ${this.config.maxFileSize} bytes`);
    }
    const filename = await this.generateUniqueFilename(data.filename);
    const filePath = join(this.config.basePath, filename);
    const url = "";
    cmsLogger.debug("[LocalStorageAdapter] Storing file:", {
      filename,
      filePath,
      note: "URL will be generated as /assets/{assetId}/{filename}",
      basePath: this.config.basePath
    });
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, data.buffer);
    return {
      path: filePath,
      url,
      // Empty - API will generate clean URL with asset ID
      size: data.size
    };
  }
  /**
   * Read a file from storage
   * Used by API endpoint to serve files
   */
  async getObject(path) {
    const resolved = resolve(path);
    const base = resolve(this.config.basePath);
    if (!resolved.startsWith(base + "/") && resolved !== base) {
      throw new Error("Access denied: path outside storage directory");
    }
    const { readFile } = await import("fs/promises");
    return await readFile(resolved);
  }
  /**
   * Delete a file from storage
   */
  async delete(path) {
    try {
      const resolved = resolve(path);
      const base = resolve(this.config.basePath);
      if (!resolved.startsWith(base + "/") && resolved !== base) {
        throw new Error("Access denied: path outside storage directory");
      }
      await unlink(resolved);
      return true;
    } catch (error) {
      cmsLogger.warn("Could not delete file from disk:", error);
      return false;
    }
  }
  /**
   * Check if file exists
   */
  async exists(path) {
    try {
      const resolved = resolve(path);
      const base = resolve(this.config.basePath);
      if (!resolved.startsWith(base + "/") && resolved !== base) {
        return false;
      }
      await stat(resolved);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Get public URL for a file path
   */
  getUrl(path) {
    const filename = path.split("/").pop() || "";
    return `${this.config.baseUrl}/${encodeURIComponent(filename)}`;
  }
  /**
   * Get storage information
   */
  async getStorageInfo() {
    try {
      const files = await readdir(this.config.basePath);
      let totalSize = 0;
      for (const file of files) {
        try {
          const filePath = join(this.config.basePath, file);
          const stats = await stat(filePath);
          if (stats.isFile()) {
            totalSize += stats.size;
          }
        } catch {
        }
      }
      return { totalSize };
    } catch (error) {
      cmsLogger.error("Error getting storage info:", error);
      return { totalSize: 0 };
    }
  }
  /**
   * Health check - test if we can write to storage
   */
  async isHealthy() {
    try {
      const testFile = join(this.config.basePath, `health-check-${Date.now()}.tmp`);
      await mkdir(dirname(testFile), { recursive: true });
      await writeFile(testFile, "health check");
      await unlink(testFile);
      return true;
    } catch (error) {
      cmsLogger.error("Storage health check failed:", error);
      return false;
    }
  }
}
class LocalStorageProvider {
  name = "local";
  createAdapter(config) {
    return new LocalStorageAdapter(config);
  }
}
class StorageProviderRegistry {
  providers = /* @__PURE__ */ new Map();
  constructor() {
    this.register(new LocalStorageProvider());
  }
  register(provider) {
    this.providers.set(provider.name.toLowerCase(), provider);
  }
  get(name) {
    return this.providers.get(name.toLowerCase());
  }
  list() {
    return Array.from(this.providers.keys());
  }
}
const storageProviders = new StorageProviderRegistry();
function createStorageAdapter(providerName, config) {
  const provider = storageProviders.get(providerName);
  if (!provider) {
    const available = storageProviders.list();
    throw new Error(`Unknown storage provider: ${providerName}. Available providers: ${available.join(", ")}`);
  }
  return provider.createAdapter(config);
}
function hiddenReadFields(schema, auth) {
  const hidden = /* @__PURE__ */ new Set();
  if (!auth)
    return hidden;
  if (isInstanceRole(auth))
    return hidden;
  const role = effectiveOrganizationRole(auth);
  for (const field of schema.fields) {
    const list = field.access?.read;
    if (!list)
      continue;
    if (!role || !list.includes(role))
      hidden.add(field.name);
  }
  return hidden;
}
function hiddenWriteFields(schema, auth) {
  const hidden = /* @__PURE__ */ new Set();
  if (!auth)
    return hidden;
  if (isInstanceRole(auth))
    return hidden;
  const role = effectiveOrganizationRole(auth);
  for (const field of schema.fields) {
    const list = field.access?.update;
    if (!list)
      continue;
    if (!role || !list.includes(role))
      hidden.add(field.name);
  }
  return hidden;
}
function dropLockedWrites(data, locked) {
  if (locked.size === 0)
    return data;
  const copy = {};
  for (const [key, value] of Object.entries(data)) {
    if (locked.has(key))
      continue;
    copy[key] = value;
  }
  return copy;
}
const EMPTY_SET = /* @__PURE__ */ new Set();
function applyHiddenToResult(result, hidden) {
  if (hidden.size === 0)
    return result;
  return {
    ...result,
    docs: result.docs.map((d) => applyHiddenToDoc(d, hidden))
  };
}
function applyHiddenToDoc(doc, hidden) {
  if (!doc || typeof doc !== "object")
    return doc;
  const copy = {};
  for (const [key, value] of Object.entries(doc)) {
    if (hidden.has(key))
      continue;
    copy[key] = value;
  }
  return copy;
}
function transformDocument(doc, perspective = "draft", hiddenFields) {
  const raw = perspective === "draft" ? doc.draftData : doc.publishedData;
  const data = raw;
  return {
    id: doc.id,
    ...data,
    // Include metadata fields
    _meta: {
      type: doc.type,
      status: doc.status,
      organizationId: doc.organizationId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy,
      updatedBy: doc.updatedBy,
      publishedAt: doc.publishedAt,
      publishedHash: doc.publishedHash
    }
  };
}
class SingletonOperationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SingletonOperationError";
  }
}
class CollectionAPI {
  collectionName;
  databaseAdapter;
  _schema;
  permissions;
  documentCache;
  hierarchyService;
  versionService;
  referencesService;
  schemaRegistry;
  constructor(collectionName, databaseAdapter, _schema, permissions, documentCache, hierarchyService, versionService, referencesService, schemaRegistry) {
    this.collectionName = collectionName;
    this.databaseAdapter = databaseAdapter;
    this._schema = _schema;
    this.permissions = permissions;
    this.documentCache = documentCache;
    this.hierarchyService = hierarchyService;
    this.versionService = versionService;
    this.referencesService = referencesService;
    this.schemaRegistry = schemaRegistry;
    this.permissions.validateCollection(collectionName);
  }
  /**
   * Refresh the back-reference index for this doc using the freshly-saved
   * draftData. Best-effort: failures are logged inside the service and
   * never thrown — a stale ref index doesn't block the user's save.
   */
  async syncReferences(organizationId, documentId, data) {
    if (!this.referencesService)
      return;
    await this.referencesService.syncReferencesFor(organizationId, documentId, data, this._schema, this.schemaRegistry ?? []);
  }
  /**
   * Get the schema for this collection
   */
  get schema() {
    return this._schema;
  }
  /**
   * Compute the deterministic id of the canonical row for this singleton
   * collection within a specific organization. Returns `undefined` for
   * regular (non-singleton) schemas. Surfaced for migrations and tests;
   * normal usage should prefer `get()`.
   */
  getSingletonId(context) {
    return this._schema.singleton ? singletonId(this._schema.name, context.organizationId) : void 0;
  }
  /**
   * Resolve the singleton document. Lazy-creates an empty draft on first
   * call so callers always get a row back. Only valid for schemas marked
   * `singleton: true`; throws on regular collections.
   */
  async get(context, options) {
    if (!this._schema.singleton) {
      throw new SingletonOperationError(`get() is only valid on singleton schemas. '${this.collectionName}' is not a singleton.`);
    }
    const id = singletonId(this._schema.name, context.organizationId);
    const existing = await this.findByID(context, id, options);
    if (existing)
      return existing;
    const created = await this.create(context, {}, { id });
    return created.document;
  }
  /**
   * Find multiple documents with advanced filtering and pagination
   *
   * @example
   * ```typescript
   * const result = await api.collections.pages.find(
   *   { organizationId: 'org_123', user },
   *   {
   *     where: {
   *       status: { equals: 'published' },
   *       'author.name': { contains: 'John' }
   *     },
   *     limit: 20,
   *     sort: '-publishedAt'
   *   }
   * );
   * ```
   */
  async find(context, options = {}) {
    if (this._schema.singleton) {
      const doc = await this.get(context, {
        perspective: options.perspective,
        depth: options.depth
      });
      return {
        docs: [doc],
        totalDocs: 1,
        limit: 1,
        offset: 0,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      };
    }
    await this.permissions.canRead(context, this.collectionName);
    const perspective = options.perspective || "draft";
    const hidden = this.resolveHiddenReadFields(context);
    if (perspective === "published" && this.documentCache) {
      const cached = await this.documentCache.getQuery(context.organizationId, this.collectionName, options);
      if (cached)
        return applyHiddenToResult(cached, hidden);
    }
    const findOptions = { ...options };
    if (this.hierarchyService && !findOptions.filterOrganizationIds) {
      const orgIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
      findOptions.filterOrganizationIds = orgIds;
    }
    const result = await this.databaseAdapter.findManyDocAdvanced(context.organizationId, this.collectionName, findOptions);
    const unfilteredDocs = result.docs.map((doc) => transformDocument(doc, perspective));
    const unfilteredResult = {
      ...result,
      docs: unfilteredDocs
    };
    if (perspective === "published" && this.documentCache) {
      await this.documentCache.setQuery(context.organizationId, this.collectionName, options, unfilteredResult);
    }
    return applyHiddenToResult(unfilteredResult, hidden);
  }
  resolveHiddenReadFields(context) {
    if (context.overrideAccess)
      return EMPTY_SET;
    return hiddenReadFields(this._schema, context.auth);
  }
  resolveHiddenWriteFields(context) {
    if (context.overrideAccess)
      return EMPTY_SET;
    return hiddenWriteFields(this._schema, context.auth);
  }
  /**
   * Find a single document by ID
   *
   * @example
   * ```typescript
   * const page = await api.collections.pages.findByID(
   *   { organizationId: 'org_123', user },
   *   'doc_123',
   *   { depth: 1, perspective: 'published' }
   * );
   * ```
   */
  async findByID(context, id, options) {
    await this.permissions.canRead(context, this.collectionName);
    const perspective = options?.perspective || "draft";
    const hidden = this.resolveHiddenReadFields(context);
    if (perspective === "published" && this.documentCache) {
      const cached = await this.documentCache.getDocument(context.organizationId, id);
      if (cached)
        return applyHiddenToDoc(cached, hidden);
    }
    const findOptions = { ...options };
    if (this.hierarchyService && !findOptions.filterOrganizationIds) {
      const orgIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
      findOptions.filterOrganizationIds = orgIds;
    }
    const result = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id, findOptions);
    if (!result) {
      return null;
    }
    const unfiltered = transformDocument(result, perspective);
    if (perspective === "published" && this.documentCache) {
      await this.documentCache.setDocument(context.organizationId, id, unfiltered);
    }
    const transformed = applyHiddenToDoc(unfiltered, hidden);
    return transformed;
  }
  /**
   * Count documents matching a where clause
   *
   * @example
   * ```typescript
   * const count = await api.collections.pages.count(
   *   { organizationId: 'org_123', user },
   *   { where: { status: { equals: 'published' } } }
   * );
   * ```
   */
  async count(context, options) {
    await this.permissions.canRead(context, this.collectionName);
    return this.databaseAdapter.countDocuments(context.organizationId, this.collectionName, options?.where);
  }
  /**
   * Create a new document
   *
   * @example
   * ```typescript
   * const result = await api.collections.pages.create(
   *   { organizationId: 'org_123', user },
   *   {
   *     title: 'New Page',
   *     slug: 'new-page',
   *     content: []
   *   }
   * );
   * // result.document - the created document
   * // result.validation - validation results
   * ```
   */
  async create(context, data, options) {
    if (this._schema.singleton) {
      const id = singletonId(this._schema.name, context.organizationId);
      const existing = await this.findByID(context, id, { perspective: "draft" });
      if (existing) {
        return {
          document: existing,
          validation: {
            isValid: true,
            errors: [],
            normalizedData: existing
          }
        };
      }
      options = { ...options, id };
    }
    await this.permissions.canCreate(context, this.collectionName);
    const locked = this.resolveHiddenWriteFields(context);
    const filteredData = dropLockedWrites(data, locked);
    const validationResult = await validateDocumentData(this._schema, filteredData, {
      context: filteredData
    });
    if (options?.publish) {
      await this.permissions.canPublish(context, this.collectionName);
      if (!validationResult.isValid) {
        const errorMessage = validationResult.errors.map((e) => `${e.field}: ${e.errors.join(", ")}`).join("; ");
        throw new Error(`Cannot publish: validation errors - ${errorMessage}`);
      }
    }
    const document = await this.databaseAdapter.createDocument({
      organizationId: context.organizationId,
      type: this.collectionName,
      draftData: validationResult.normalizedData,
      createdBy: context.user?.id,
      id: options?.id
    });
    await this.syncReferences(context.organizationId, document.id, validationResult.normalizedData);
    if (this.versionService && !options?.skipVersioning) {
      await this.versionService.createVersion(this.databaseAdapter, context.organizationId, document.id, "draft", validationResult.normalizedData, context.user?.id);
    }
    if (options?.publish) {
      const published = this.versionService && !options?.skipVersioning ? await this.versionService.publishWithVersion(this.databaseAdapter, context.organizationId, document.id) : await this.databaseAdapter.publishDoc(context.organizationId, document.id);
      if (published) {
        if (this.documentCache) {
          await this.documentCache.invalidateDocument(context.organizationId, document.id);
          await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
        }
        return {
          document: transformDocument(published, "published"),
          validation: validationResult
        };
      }
    }
    if (this.documentCache) {
      await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
    }
    return {
      document: transformDocument(document, "draft"),
      validation: validationResult
    };
  }
  /**
   * Update an existing document
   *
   * @example
   * ```typescript
   * const result = await api.collections.pages.update(
   *   { organizationId: 'org_123', user },
   *   'doc_123',
   *   { title: 'Updated Title' },
   *   { publish: true }
   * );
   * // result.document - the updated document
   * // result.validation - validation results
   * ```
   */
  async update(context, id, data, options) {
    const existingDoc = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
    if (!existingDoc) {
      return null;
    }
    await this.permissions.canUpdate(context, this.collectionName, existingDoc);
    const locked = this.resolveHiddenWriteFields(context);
    const filteredData = dropLockedWrites(data, locked);
    const schemaFieldNames = new Set(this._schema.fields.map((f) => f.name));
    const cleanedExisting = {};
    for (const [key, value] of Object.entries(existingDoc.draftData || {})) {
      if (schemaFieldNames.has(key)) {
        cleanedExisting[key] = value;
      }
    }
    const mergedData = { ...cleanedExisting, ...filteredData };
    const validationResult = await validateDocumentData(this._schema, mergedData, mergedData);
    const document = this.versionService && !options?.skipVersioning ? await this.versionService.saveWithVersion(this.databaseAdapter, context.organizationId, id, validationResult.normalizedData, context.user?.id) : await this.databaseAdapter.updateDocDraft(context.organizationId, id, validationResult.normalizedData, context.user?.id);
    if (!document) {
      return null;
    }
    await this.syncReferences(context.organizationId, id, validationResult.normalizedData);
    if (options?.publish) {
      await this.permissions.canPublish(context, this.collectionName, document);
      if (!validationResult.isValid) {
        const errorMessage = validationResult.errors.map((e) => `${e.field}: ${e.errors.join(", ")}`).join("; ");
        throw new Error(`Cannot publish: validation errors - ${errorMessage}`);
      }
      const published = this.versionService && !options?.skipVersioning ? await this.versionService.publishWithVersion(this.databaseAdapter, context.organizationId, document.id) : await this.databaseAdapter.publishDoc(context.organizationId, document.id);
      if (published) {
        if (this.documentCache) {
          await this.documentCache.invalidateDocument(context.organizationId, id);
          await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
        }
        return {
          document: transformDocument(published, "published"),
          validation: validationResult
        };
      }
    }
    return {
      document: transformDocument(document, "draft"),
      validation: validationResult
    };
  }
  /**
   * Delete a document
   *
   * @example
   * ```typescript
   * const deleted = await api.collections.pages.delete(
   *   { organizationId: 'org_123', user },
   *   'doc_123'
   * );
   * ```
   */
  async delete(context, id) {
    if (this._schema.singleton && id === singletonId(this._schema.name, context.organizationId)) {
      throw new SingletonOperationError(`Cannot delete the singleton document for '${this._schema.name}'. Remove the singleton flag from the schema first.`);
    }
    const existing = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
    if (!existing)
      return false;
    await this.permissions.canDelete(context, this.collectionName, existing);
    const result = await this.databaseAdapter.deleteDocById(context.organizationId, id);
    if (result && this.documentCache) {
      await this.documentCache.invalidateDocument(context.organizationId, id);
      await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
    }
    return result;
  }
  /**
   * Publish a document
   *
   * @example
   * ```typescript
   * const published = await api.collections.pages.publish(
   *   { organizationId: 'org_123', user },
   *   'doc_123'
   * );
   * ```
   */
  async publish(context, id) {
    const document = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
    if (!document || !document.draftData) {
      throw new Error("Document not found or has no draft content to publish");
    }
    await this.permissions.canPublish(context, this.collectionName, document);
    const validationResult = await validateDocumentData(this._schema, document.draftData, document.draftData);
    if (!validationResult.isValid) {
      const errorMessage = validationResult.errors.map((e) => `${e.field}: ${e.errors.join(", ")}`).join("; ");
      throw new Error(`Cannot publish: validation errors - ${errorMessage}`);
    }
    const refIds = collectReferenceIds(document.draftData);
    if (refIds.length > 0) {
      const unpublished = [];
      for (const refId of refIds) {
        const refDoc = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, refId);
        if (refDoc && !refDoc.publishedData) {
          const data = refDoc.draftData;
          const title = data?.title || data?.name || refDoc.id;
          unpublished.push({ id: refDoc.id, type: refDoc.type, title });
        }
      }
      if (unpublished.length > 0) {
        const names = unpublished.map((d) => `"${d.title}" (${d.type})`).join(", ");
        throw new Error(`Cannot publish — ${unpublished.length} referenced document(s) are not published: ${names}`);
      }
    }
    const publishedDocument = this.versionService ? await this.versionService.publishWithVersion(this.databaseAdapter, context.organizationId, id) : await this.databaseAdapter.publishDoc(context.organizationId, id);
    if (!publishedDocument) {
      return null;
    }
    if (this.documentCache) {
      await this.documentCache.invalidateDocument(context.organizationId, id);
      await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
    }
    return transformDocument(publishedDocument, "published");
  }
  /**
   * Unpublish a document
   *
   * @example
   * ```typescript
   * const unpublished = await api.collections.pages.unpublish(
   *   { organizationId: 'org_123', user },
   *   'doc_123'
   * );
   * ```
   */
  async unpublish(context, id) {
    const existing = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
    if (!existing)
      return null;
    await this.permissions.canUnpublish(context, this.collectionName, existing);
    const document = await this.databaseAdapter.unpublishDoc(context.organizationId, id);
    if (!document) {
      return null;
    }
    if (this.documentCache) {
      await this.documentCache.invalidateDocument(context.organizationId, id);
      await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
    }
    return transformDocument(document, "draft");
  }
}
class PermissionError extends Error {
  operation;
  resource;
  constructor(message, operation, resource) {
    super(message);
    this.operation = operation;
    this.resource = resource;
    this.name = "PermissionError";
  }
}
const OPERATION_CAPABILITY = {
  read: "document.read",
  create: "document.create",
  update: "document.update",
  delete: "document.delete",
  publish: "document.publish",
  unpublish: "document.unpublish"
};
const OPERATION_LABEL = {
  read: "view",
  create: "create",
  update: "edit",
  delete: "delete",
  publish: "publish",
  unpublish: "unpublish"
};
function denialMessage(operations, collectionName) {
  const actions = operations.map((op) => OPERATION_LABEL[op]);
  const action = actions.length === 1 ? actions[0] : actions.length === 2 ? `${actions[0]} or ${actions[1]}` : `${actions.slice(0, -1).join(", ")}, or ${actions[actions.length - 1]}`;
  return `You don't have permission to ${action} ${collectionName} documents. Ask an admin if you need access.`;
}
class PermissionChecker {
  _config;
  schemas;
  constructor(_config, schemas) {
    this._config = _config;
    this.schemas = schemas;
  }
  get config() {
    return this._config;
  }
  async canRead(context, collectionName, doc) {
    await this.assert(context, collectionName, "read", doc);
  }
  async canCreate(context, collectionName) {
    await this.assert(context, collectionName, "create");
  }
  async canUpdate(context, collectionName, doc) {
    await this.assert(context, collectionName, "update", doc);
  }
  /**
   * @deprecated Prefer `canCreate` or `canUpdate` — this method conflates the
   * two and was only kept for legacy call sites. It now aliases `canUpdate`
   * for safety (update is the more restrictive default for mutation).
   */
  async canWrite(context, collectionName, doc) {
    await this.canUpdate(context, collectionName, doc);
  }
  async canDelete(context, collectionName, doc) {
    await this.assert(context, collectionName, "delete", doc);
  }
  async canPublish(context, collectionName, doc) {
    await this.assert(context, collectionName, "publish", doc);
  }
  async canUnpublish(context, collectionName, doc) {
    await this.assert(context, collectionName, "unpublish", doc);
  }
  validateCollection(collectionName) {
    if (!this.schemas.has(collectionName)) {
      throw new Error(`Collection "${collectionName}" not found in schema. Available collections: ${Array.from(this.schemas.keys()).join(", ")}`);
    }
  }
  // ---- internals -----------------------------------------------------------
  async assert(context, collectionName, operation, doc) {
    if (context.overrideAccess)
      return;
    const auth = this.requireAuth(context, operation, collectionName);
    if (this.isAllowed(auth, collectionName, operation, doc))
      return;
    this.logDenial(auth, operation, collectionName, [OPERATION_CAPABILITY[operation]]);
    throw new PermissionError(denialMessage([operation], collectionName), operation, collectionName);
  }
  logDenial(auth, operation, collectionName, missingCapabilities) {
    const who = auth.type === "session" ? `user=${auth.user.id} role="${auth.organizationRole}"` : auth.type === "api_key" ? `apiKey=${auth.keyId}` : auth.type;
    const caps = "capabilities" in auth && Array.isArray(auth.capabilities) ? auth.capabilities.join(",") : "(none)";
    cmsLogger.warn("[RBAC]", `DENY ${operation} on "${collectionName}" — ${who} has=[${caps}] needs=[${missingCapabilities.join("|")}]`);
  }
  requireAuth(context, operation, collectionName) {
    if (!context.auth) {
      throw new PermissionError(`You must be signed in to ${OPERATION_LABEL[operation]} ${collectionName} documents.`, operation, collectionName);
    }
    return context.auth;
  }
  /**
   * Evaluate an access rule for a given operation.
   *
   * Three kinds of declared rules:
   *   - `OrganizationRole[]` — role allowlist (as before).
   *   - `(ctx) => boolean` — arbitrary policy, receives auth + optional doc.
   *     Use for ownership rules like `doc.createdBy === auth.user.id`.
   *   - `undefined` — fall back to capability check.
   *
   * A declared-but-excluded role/policy for a session caller is an explicit
   * deny; the capability map does not re-grant access.
   */
  isAllowed(auth, collectionName, operation, doc) {
    const schema = this.schemas.get(collectionName);
    const declared = schema?.access?.[operation];
    if (declared) {
      if (typeof declared === "function") {
        try {
          return declared({ auth, doc });
        } catch (err) {
          cmsLogger.error("[RBAC]", `access policy for "${collectionName}.${operation}" threw:`, err);
          return false;
        }
      }
      const role = effectiveOrganizationRole(auth);
      if (role && declared.includes(role))
        return true;
      if (auth.type === "session" && role) {
        return false;
      }
    }
    return hasCapability(auth, OPERATION_CAPABILITY[operation]);
  }
}
const schemasRouter = new Hono().get("/", (c) => {
  const { cmsEngine } = c.var.aphexCMS;
  const schemas = cmsEngine.config.schemaTypes;
  return c.json({ success: true, data: schemas });
}).get("/:type", (c) => {
  const type = c.req.param("type");
  const { cmsEngine } = c.var.aphexCMS;
  if (!type) {
    return c.json({ error: "Schema type is required" }, 400);
  }
  cmsLogger.debug("GETTING SCHEMA TYPE FROM: ", type);
  const schema = cmsEngine.getSchemaTypeByName(type);
  cmsLogger.debug("SCHEMA: ", schema);
  if (!schema) {
    return c.json({ error: `Schema type '${type}' not found` }, 404);
  }
  return c.json({ success: true, data: schema });
});
const jsonRecord = z.record(z.string(), z.unknown());
const documentMetaSchema = z.object({
  status: z.enum(["draft", "published", "unpublished"]),
  publishedAt: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  publishedHash: z.string().nullable().optional(),
  draftHash: z.string().nullable().optional()
}).passthrough();
const documentSchema = z.object({
  id: z.string(),
  type: z.string(),
  draftData: jsonRecord.nullable().optional(),
  publishedData: jsonRecord.nullable().optional(),
  _meta: documentMetaSchema.optional()
}).passthrough();
const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean()
});
const listDocumentsQuery = z.object({
  type: z.string().optional(),
  docType: z.string().optional(),
  // legacy alias
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  // legacy alias for pageSize
  depth: z.coerce.number().int().min(0).max(5).optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
  perspective: z.enum(["draft", "published"]).optional(),
  includeChildOrganizations: z.union([z.boolean(), z.enum(["true", "false"])]).optional().transform((v) => v === true || v === "true")
});
z.object({
  success: z.literal(true),
  data: z.array(documentSchema),
  pagination: paginationMetaSchema
});
const getDocumentsByIdsQuery = z.object({
  ids: z.string().transform((v) => v.split(",").filter(Boolean)).refine((arr) => arr.length > 0 && arr.length <= 100, {
    message: "ids must contain between 1 and 100 entries"
  })
});
const createDocumentRequest = z.object({
  type: z.string().min(1),
  draftData: jsonRecord.optional(),
  data: jsonRecord.optional(),
  publish: z.boolean().optional()
}).refine((v) => v.draftData !== void 0 || v.data !== void 0, {
  message: "Either draftData or data is required"
});
z.object({
  success: z.literal(true),
  data: documentSchema,
  validation: z.unknown().optional()
});
z.object({
  success: z.literal(true),
  data: documentSchema
});
const updateDocumentRequest = z.object({
  draftData: jsonRecord.optional(),
  data: jsonRecord.optional(),
  publish: z.boolean().optional()
}).refine((v) => v.draftData !== void 0 || v.data !== void 0, {
  message: "Either draftData or data is required"
});
z.object({
  success: z.literal(true),
  data: documentSchema,
  validation: z.unknown().optional()
});
z.object({
  success: z.literal(true),
  message: z.string().optional()
});
z.object({
  success: z.literal(true),
  data: documentSchema,
  message: z.string().optional()
});
z.object({
  success: z.literal(true),
  data: documentSchema,
  message: z.string().optional()
});
const queryDocumentsRequest = z.object({
  type: z.string().min(1),
  where: z.unknown().optional(),
  select: z.unknown().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(500).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  depth: z.coerce.number().int().min(0).max(5).optional(),
  perspective: z.enum(["draft", "published"]).optional(),
  includeChildOrganizations: z.boolean().optional()
});
const listVersionsQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional()
});
const documentVersionSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  organizationId: z.string(),
  versionNumber: z.number(),
  eventType: z.enum(["draft", "publish", "restore"]),
  data: jsonRecord.nullable(),
  createdBy: z.string().nullable(),
  createdByName: z.string().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).nullable()
}).passthrough();
z.object({
  success: z.literal(true),
  data: z.array(documentVersionSchema),
  total: z.number()
});
z.object({
  success: z.literal(true),
  data: documentVersionSchema
});
z.object({
  success: z.literal(true),
  data: documentSchema,
  message: z.string().optional()
});
const DEFAULT_PAGE_SIZE$1 = 20;
const DEFAULT_PAGE$1 = 1;
const documentsRouter = new Hono().get("/", zValidator("query", listDocumentsQuery, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid query parameters",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const q = c.req.valid("query");
    const docType = q.type ?? q.docType;
    const status = q.status;
    const sortParam = Array.isArray(q.sort) ? q.sort.join(",") : q.sort;
    const perspective = q.perspective ?? "draft";
    const includeChildOrganizations = q.includeChildOrganizations;
    const page = q.page ?? DEFAULT_PAGE$1;
    const pageSize = q.pageSize ?? q.limit ?? DEFAULT_PAGE_SIZE$1;
    const offset = (page - 1) * pageSize;
    const depth = q.depth ?? 0;
    if (!docType) {
      return c.json({
        success: false,
        error: "Bad Request",
        message: "Document type is required. Use ?type=page or ?docType=page"
      }, 400);
    }
    const collection = localAPI.getCollection(docType);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${docType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
      }, 400);
    }
    const where = {};
    if (status) {
      where.status = { equals: status };
    }
    const result = await collection.find(context, {
      where: Object.keys(where).length > 0 ? where : void 0,
      limit: pageSize,
      offset,
      depth,
      sort: sortParam || void 0,
      perspective,
      includeChildOrganizations
    });
    return c.json({
      success: true,
      data: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pageSize: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (error) {
    cmsLogger.error("Failed to fetch documents:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to fetch documents",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).get("/by-ids", zValidator("query", getDocumentsByIdsQuery, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid query parameters",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const { ids } = c.req.valid("query");
    const docs = await localAPI.findDocumentsByIds(context, ids);
    return c.json({ success: true, data: docs });
  } catch (error) {
    cmsLogger.error("Failed to batch-fetch documents:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to fetch documents",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/", zValidator("json", createDocumentRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const parsed = c.req.valid("json");
    const documentType = parsed.type;
    const documentData = parsed.draftData ?? parsed.data;
    const shouldPublish = parsed.publish ?? false;
    const collection = localAPI.getCollection(documentType);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${documentType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
      }, 400);
    }
    const result = await collection.create(context, documentData, {
      publish: shouldPublish
    });
    return c.json({
      success: true,
      data: result.document,
      validation: result.validation
    }, 201);
  } catch (error) {
    cmsLogger.error("Failed to create document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    if (error instanceof Error && error.message.includes("validation errors")) {
      return c.json({ success: false, error: "Validation failed", message: error.message }, 400);
    }
    return c.json({
      success: false,
      error: "Failed to create document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const documentsByIdRouter = new Hono().get("/:id", async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Document ID is required" }, 400);
    }
    const depthParam = c.req.query("depth");
    const depth = depthParam ? Math.max(0, Math.min(parseInt(depthParam), 5)) : 0;
    const perspective = c.req.query("perspective") || "draft";
    const result = await localAPI.findDocumentById(context, id);
    if (!result) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    const collection = localAPI.getCollection(result.type);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${result.type}' not found`
      }, 400);
    }
    const document = await collection.findByID(context, id, { depth, perspective });
    if (!document) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    return c.json({ success: true, data: document });
  } catch (error) {
    cmsLogger.error("Failed to fetch document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to fetch document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).put("/:id", zValidator("json", updateDocumentRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Document ID is required" }, 400);
    }
    const parsed = c.req.valid("json");
    const documentData = parsed.draftData ?? parsed.data;
    if (!documentData) {
      return c.json({ success: false, error: "Document data is required" }, 400);
    }
    const shouldPublish = parsed.publish ?? false;
    const found = await localAPI.findDocumentById(context, id);
    if (!found) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    const collection = localAPI.getCollection(found.type);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${found.type}' not found`
      }, 400);
    }
    const result = await collection.update(context, id, documentData, {
      publish: shouldPublish
    });
    if (!result) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    return c.json({
      success: true,
      data: result.document,
      validation: result.validation
    });
  } catch (error) {
    cmsLogger.error("Failed to update document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    if (error instanceof Error && error.message.includes("validation errors")) {
      return c.json({ success: false, error: "Validation failed", message: error.message }, 400);
    }
    return c.json({
      success: false,
      error: "Failed to update document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/:id", async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Document ID is required" }, 400);
    }
    const result = await localAPI.findDocumentById(context, id);
    if (!result) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    const collection = localAPI.getCollection(result.type);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${result.type}' not found`
      }, 400);
    }
    const success = await collection.delete(context, id);
    if (!success) {
      return c.json({ success: false, error: "Document not found" }, 404);
    }
    return c.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    cmsLogger.error("Failed to delete document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    if (error instanceof SingletonOperationError) {
      return c.json({ success: false, error: "Singleton document", message: error.message }, 400);
    }
    return c.json({
      success: false,
      error: "Failed to delete document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).get("/:id/back-references", async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Document ID is required" }, 400);
    }
    const refs = await localAPI.getBackReferences(context, id);
    return c.json({ success: true, data: refs });
  } catch (error) {
    cmsLogger.error("Failed to fetch back-references:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to fetch back-references",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const documentsPublishRouter = new Hono().post("/:id/publish", async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({
        success: false,
        error: "Missing document ID",
        message: "Document ID is required"
      }, 400);
    }
    const found = await localAPI.findDocumentById(context, id);
    if (!found) {
      return c.json({
        success: false,
        error: "Document not found",
        message: "Document may not exist"
      }, 404);
    }
    const collection = localAPI.getCollection(found.type);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${found.type}' not found`
      }, 400);
    }
    const publishedDocument = await collection.publish(context, id);
    if (!publishedDocument) {
      return c.json({
        success: false,
        error: "Document not found or cannot be published",
        message: "Document may not have draft content to publish"
      }, 404);
    }
    return c.json({
      success: true,
      data: publishedDocument,
      message: "Document published successfully"
    });
  } catch (error) {
    cmsLogger.error("Failed to publish document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    if (error instanceof Error && error.message.includes("validation errors")) {
      return c.json({
        success: false,
        error: "Cannot publish: validation errors",
        message: error.message
      }, 400);
    }
    return c.json({
      success: false,
      error: "Failed to publish document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/:id/publish", async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({
        success: false,
        error: "Missing document ID",
        message: "Document ID is required"
      }, 400);
    }
    const found = await localAPI.findDocumentById(context, id);
    if (!found) {
      return c.json({
        success: false,
        error: "Document not found",
        message: `No document found with ID: ${id}`
      }, 404);
    }
    const collection = localAPI.getCollection(found.type);
    if (!collection) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${found.type}' not found`
      }, 400);
    }
    const unpublishedDocument = await collection.unpublish(context, id);
    if (!unpublishedDocument) {
      return c.json({
        success: false,
        error: "Document not found",
        message: `No document found with ID: ${id}`
      }, 404);
    }
    return c.json({
      success: true,
      data: unpublishedDocument,
      message: "Document unpublished successfully"
    });
  } catch (error) {
    cmsLogger.error("Failed to unpublish document:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to unpublish document",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;
const documentsQueryRouter = new Hono().post("/query", zValidator("json", queryDocumentsRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Bad Request",
      message: "Document type is required in request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const body = c.req.valid("json");
    const documentType = body.type;
    if (!localAPI.hasCollection(documentType)) {
      return c.json({
        success: false,
        error: "Invalid document type",
        message: `Collection '${documentType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
      }, 400);
    }
    const page = body.page ?? DEFAULT_PAGE;
    const pageSize = body.pageSize ?? body.limit ?? DEFAULT_PAGE_SIZE;
    const offset = body.offset !== void 0 ? body.offset : (page - 1) * pageSize;
    const findOptions = {
      where: body.where,
      limit: pageSize,
      offset,
      sort: body.sort,
      depth: body.depth ?? 0,
      select: body.select,
      perspective: body.perspective ?? "draft",
      includeChildOrganizations: body.includeChildOrganizations
    };
    const result = await localAPI.getCollection(documentType).find(context, findOptions);
    return c.json({
      success: true,
      data: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pageSize: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (error) {
    cmsLogger.error("Failed to query documents:", error);
    if (error instanceof PermissionError) {
      return c.json({ success: false, error: "Forbidden", message: error.message }, 403);
    }
    return c.json({
      success: false,
      error: "Failed to query documents",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const documentVersionsRouter = new Hono().get("/:id/versions", zValidator("query", listVersionsQuery, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid query parameters",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { localAPI, databaseAdapter } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Document ID is required" }, 400);
    }
    const q = c.req.valid("query");
    const limit = q.limit ?? 25;
    const offset = q.offset ?? 0;
    const result = await localAPI.versionService.listVersions(databaseAdapter, context.organizationId, id, { limit, offset });
    const userIds = [...new Set(result.versions.map((v) => v.createdBy).filter(Boolean))];
    const userMap = /* @__PURE__ */ new Map();
    if (userIds.length > 0 && c.var.aphexCMS.auth) {
      await Promise.all(userIds.map(async (userId) => {
        if (userId.startsWith("apikey:")) {
          userMap.set(userId, "API Key");
          return;
        }
        try {
          const user = await c.var.aphexCMS.auth.getUserById(userId);
          if (user) {
            userMap.set(userId, user.name || user.email);
          }
        } catch {
        }
      }));
    }
    const versionsWithUsers = result.versions.map((v) => ({
      ...v,
      createdByName: v.createdBy ? userMap.get(v.createdBy) || null : null
    }));
    return c.json({
      success: true,
      data: versionsWithUsers,
      total: result.total
    });
  } catch (error) {
    cmsLogger.error("Failed to list document versions:", error);
    return c.json({ success: false, error: "Failed to list versions" }, 500);
  }
}).get("/:id/versions/:version", async (c) => {
  try {
    const { localAPI, databaseAdapter } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    const version = c.req.param("version");
    if (!id || !version) {
      return c.json({ success: false, error: "Document ID and version number are required" }, 400);
    }
    const versionNumber = parseInt(version);
    if (isNaN(versionNumber)) {
      return c.json({ success: false, error: "Version must be a number" }, 400);
    }
    const result = await localAPI.versionService.getVersion(databaseAdapter, context.organizationId, id, versionNumber);
    if (!result) {
      return c.json({ success: false, error: "Version not found" }, 404);
    }
    return c.json({ success: true, data: result });
  } catch (error) {
    cmsLogger.error("Failed to get document version:", error);
    return c.json({ success: false, error: "Failed to get version" }, 500);
  }
}).post("/:id/versions/:version/restore", async (c) => {
  try {
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasCapability(auth, "document.update")) {
      return c.json({ success: false, error: "Forbidden: document.update capability required" }, 403);
    }
    const { localAPI, databaseAdapter } = c.var.aphexCMS;
    const context = authToContext(c.var.auth);
    const id = c.req.param("id");
    const version = c.req.param("version");
    if (!id || !version) {
      return c.json({ success: false, error: "Document ID and version number are required" }, 400);
    }
    const versionNumber = parseInt(version);
    if (isNaN(versionNumber)) {
      return c.json({ success: false, error: "Version must be a number" }, 400);
    }
    const document = await localAPI.versionService.restoreVersion(databaseAdapter, context.organizationId, id, versionNumber, context.user?.id);
    if (!document) {
      return c.json({ success: false, error: "Version not found or restore failed" }, 404);
    }
    return c.json({
      success: true,
      data: document,
      message: `Restored to version ${versionNumber}`
    });
  } catch (error) {
    cmsLogger.error("Failed to restore document version:", error);
    return c.json({ success: false, error: "Failed to restore version" }, 500);
  }
});
function detectMimeType(buffer) {
  if (buffer.length < 4)
    return null;
  if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) {
    return "application/pdf";
  }
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return "image/png";
  }
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return "image/jpeg";
  }
  if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 && (buffer[4] === 55 || buffer[4] === 57) && buffer[5] === 97) {
    return "image/gif";
  }
  if (buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80) {
    return "image/webp";
  }
  if (buffer.length >= 12) {
    const ftypStr = buffer.subarray(4, 8).toString("ascii");
    if (ftypStr === "ftyp") {
      const brand = buffer.subarray(8, 12).toString("ascii");
      if (brand === "avif")
        return "image/avif";
      if (brand === "heic" || brand === "heix")
        return "image/heic";
      if (brand.startsWith("mp4") || brand === "isom")
        return "video/mp4";
    }
  }
  const head = buffer.subarray(0, Math.min(buffer.length, 256)).toString("utf-8");
  if (head.trimStart().startsWith("<") && head.includes("<svg")) {
    return "image/svg+xml";
  }
  if (buffer[0] === 80 && buffer[1] === 75 && buffer[2] === 3 && buffer[3] === 4) {
    return detectZipFormat(buffer);
  }
  if (buffer[0] === 208 && buffer[1] === 207 && buffer[2] === 17 && buffer[3] === 224) {
    return "application/msword";
  }
  if (buffer[0] === 0 && buffer[1] === 97 && buffer[2] === 115 && buffer[3] === 109) {
    return "application/wasm";
  }
  if (buffer[0] === 127 && buffer[1] === 69 && buffer[2] === 76 && buffer[3] === 70) {
    return "application/x-executable";
  }
  if (buffer[0] === 207 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 206 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 207 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 206) {
    return "application/x-executable";
  }
  if (buffer[0] === 77 && buffer[1] === 90) {
    return "application/x-executable";
  }
  if (buffer[0] === 35 && buffer[1] === 33) {
    return "application/x-shellscript";
  }
  return null;
}
function detectZipFormat(buffer) {
  const content = buffer.subarray(0, Math.min(buffer.length, 2e3)).toString("binary");
  if (content.includes("word/"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (content.includes("xl/"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (content.includes("ppt/"))
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  return "application/zip";
}
const BLOCKED_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/x-executable",
  "application/x-shellscript",
  "application/wasm",
  "application/x-msdos-program",
  "application/x-msdownload",
  "text/html",
  "application/xhtml+xml",
  "text/xml",
  "application/xml"
]);
const BLOCKED_EXTENSIONS = /* @__PURE__ */ new Set([
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".scr",
  ".pif",
  ".sh",
  ".bash",
  ".zsh",
  ".csh",
  ".ksh",
  ".app",
  ".command",
  ".action",
  ".ps1",
  ".psm1",
  ".psd1",
  ".vbs",
  ".vbe",
  ".js",
  ".jse",
  ".wsf",
  ".wsh",
  ".reg",
  ".inf",
  ".hta",
  ".wasm",
  ".html",
  ".htm",
  ".xhtml",
  ".shtml",
  ".xml",
  ".xsl",
  ".mhtml"
]);
function validateFile(buffer, filename, clientMimeType, options = {}) {
  const lowerName = filename.toLowerCase();
  const ext = lowerName.substring(lowerName.lastIndexOf("."));
  const detectedMimeType = detectMimeType(buffer);
  const allExts = lowerName.match(/\.[^.]+/g) || [];
  for (const e of allExts) {
    if (BLOCKED_EXTENSIONS.has(e)) {
      return { valid: false, error: `File type "${e}" is not allowed`, detectedMimeType };
    }
  }
  if (detectedMimeType && BLOCKED_MIME_TYPES.has(detectedMimeType)) {
    return {
      valid: false,
      error: `File content detected as "${detectedMimeType}" which is not allowed`,
      detectedMimeType
    };
  }
  if (detectedMimeType && clientMimeType) {
    const detectedBase = detectedMimeType.split("/")[0];
    const clientBase = clientMimeType.split("/")[0];
    if (detectedMimeType === "application/x-executable" && clientBase !== "application") {
      return {
        valid: false,
        error: "File content does not match the declared type",
        detectedMimeType
      };
    }
    if (clientBase === "image" && detectedBase !== "image" && detectedMimeType !== null) {
      return {
        valid: false,
        error: `File content is "${detectedMimeType}" but was uploaded as an image`,
        detectedMimeType
      };
    }
  }
  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const mimeToCheck = detectedMimeType || clientMimeType;
    const isAllowed = options.allowedMimeTypes.some((allowed) => {
      if (allowed.endsWith("/*")) {
        const prefix = allowed.slice(0, -2);
        return mimeToCheck.startsWith(prefix);
      }
      if (allowed.startsWith(".")) {
        return ext === allowed.toLowerCase();
      }
      return mimeToCheck === allowed;
    });
    if (!isAllowed) {
      return {
        valid: false,
        error: `File type "${mimeToCheck}" is not allowed. Accepted: ${options.allowedMimeTypes.join(", ")}`,
        detectedMimeType
      };
    }
  }
  if (options.maxSize && buffer.length > options.maxSize) {
    const maxMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File exceeds maximum size of ${maxMB} MB`,
      detectedMimeType
    };
  }
  return { valid: true, detectedMimeType };
}
const assetSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  assetType: z.string(),
  filename: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  path: z.string(),
  storageAdapter: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  metadata: z.unknown().nullable().optional(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  alt: z.string().nullable(),
  creditLine: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]).nullable(),
  updatedAt: z.union([z.string(), z.date()]).nullable()
}).passthrough();
const assetReferenceSchema = z.object({
  documentId: z.string(),
  type: z.string(),
  title: z.string(),
  status: z.string().nullable()
});
const listAssetsQuery = z.object({
  assetType: z.enum(["image", "file"]).optional(),
  mimeType: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional()
});
z.object({
  success: z.literal(true),
  data: z.array(assetSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean()
  })
});
z.object({
  success: z.literal(true),
  data: assetSchema
});
const updateAssetRequest = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  alt: z.string().optional(),
  creditLine: z.string().optional()
});
z.object({
  success: z.literal(true),
  data: assetSchema
});
z.object({
  success: z.literal(true)
});
const bulkDeleteAssetsRequest = z.object({
  ids: z.array(z.string()).min(1).max(100)
});
z.object({
  success: z.literal(true),
  data: z.object({
    deleted: z.number(),
    failed: z.number()
  })
});
z.object({
  success: z.literal(true),
  data: z.object({
    references: z.array(assetReferenceSchema),
    total: z.number()
  })
});
const assetReferenceCountsRequest = z.object({
  ids: z.array(z.string())
});
z.object({
  success: z.literal(true),
  data: z.record(z.string(), z.number())
});
const assetsRouter = new Hono().get("/", zValidator("query", listAssetsQuery, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid query parameters",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { assetService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const q = c.req.valid("query");
    const filters = {
      assetType: q.assetType,
      mimeType: q.mimeType,
      search: q.search,
      limit: q.limit ?? 20,
      offset: q.offset ?? 0
    };
    const { databaseAdapter } = c.var.aphexCMS;
    const [fetchedAssets, total] = await Promise.all([
      assetService.findAssets(auth.organizationId, filters),
      databaseAdapter.countAssets(auth.organizationId, {
        assetType: filters.assetType,
        mimeType: filters.mimeType,
        search: filters.search
      })
    ]);
    const pageSize = filters.limit || 20;
    const currentPage = Math.floor(filters.offset / pageSize) + 1;
    const totalPages = Math.ceil(total / pageSize);
    return c.json({
      success: true,
      data: fetchedAssets,
      pagination: {
        total,
        page: currentPage,
        pageSize,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    cmsLogger.error("Failed to fetch assets:", error);
    return c.json({
      success: false,
      error: "Failed to fetch assets",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/", async (c) => {
  try {
    const { assetService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasCapability(auth, "asset.upload")) {
      return c.json({ success: false, error: "Forbidden: asset.upload capability required" }, 403);
    }
    const formData = await c.req.formData();
    const file = formData.get("file");
    if (!file) {
      return c.json({ success: false, error: "No file provided" }, 400);
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const SERVER_MAX_FILE_SIZE = 50 * 1024 * 1024;
    const allowedMimeTypesRaw = formData.get("allowedMimeTypes");
    const maxSizeRaw = formData.get("maxSize");
    const allowedMimeTypes = allowedMimeTypesRaw ? JSON.parse(allowedMimeTypesRaw) : void 0;
    const clientMaxSize = maxSizeRaw ? parseInt(maxSizeRaw, 10) : void 0;
    const maxSize = clientMaxSize ? Math.min(clientMaxSize, SERVER_MAX_FILE_SIZE) : SERVER_MAX_FILE_SIZE;
    const validation = validateFile(buffer, file.name, file.type, {
      allowedMimeTypes,
      maxSize
    });
    if (!validation.valid) {
      return c.json({ success: false, error: validation.error }, 400);
    }
    const safeMimeType = validation.detectedMimeType || "application/octet-stream";
    const title = formData.get("title") || void 0;
    const description = formData.get("description") || void 0;
    const alt = formData.get("alt") || void 0;
    const creditLine = formData.get("creditLine") || void 0;
    const schemaType = formData.get("schemaType") || void 0;
    const fieldPath = formData.get("fieldPath") || void 0;
    const targetOrganizationId = auth.organizationId;
    const uploadData = {
      organizationId: targetOrganizationId,
      buffer,
      originalFilename: file.name,
      mimeType: safeMimeType,
      size: file.size,
      title,
      description,
      alt,
      creditLine,
      createdBy: auth.type === "session" ? auth.user.id : void 0,
      metadata: {
        schemaType,
        fieldPath
      }
    };
    const asset = await assetService.uploadAsset(targetOrganizationId, uploadData);
    return c.json({ success: true, data: asset });
  } catch (error) {
    cmsLogger.error("Asset upload failed:", error);
    return c.json({
      success: false,
      error: "Asset upload failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const assetsByIdRouter = new Hono().get("/:id", async (c) => {
  try {
    const { assetService } = c.var.aphexCMS;
    const auth = c.var.auth;
    const id = c.req.param("id");
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!id) {
      return c.json({ success: false, error: "Asset ID is required" }, 400);
    }
    const asset = await assetService.findAssetById(auth.organizationId, id);
    if (!asset) {
      return c.json({ success: false, error: "Asset not found" }, 404);
    }
    return c.json({ success: true, data: asset });
  } catch (error) {
    cmsLogger.error("[Asset API] Error fetching asset:", error);
    return c.json({ success: false, error: "Failed to fetch asset" }, 500);
  }
}).delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { assetService, databaseAdapter, localAPI } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasCapability(auth, "asset.delete")) {
      return c.json({ success: false, error: "Forbidden: asset.delete capability required" }, 403);
    }
    if (!id) {
      return c.json({ success: false, error: "Asset ID is required" }, 400);
    }
    if (databaseAdapter.findDocumentsReferencingAsset) {
      const knownTypes = localAPI.getCollectionNames();
      const refs = await databaseAdapter.findDocumentsReferencingAsset(auth.organizationId, id, knownTypes);
      if (refs.length > 0) {
        return c.json({
          success: false,
          error: `Cannot delete asset — it is referenced by ${refs.length} document${refs.length > 1 ? "s" : ""}`
        }, 409);
      }
    }
    const result = await assetService.deleteAsset(auth.organizationId, id);
    if (!result) {
      return c.json({ success: false, error: "Asset not found or could not be deleted" }, 404);
    }
    if (databaseAdapter.clearAssetFromPublishedData) {
      const cleared = await databaseAdapter.clearAssetFromPublishedData(auth.organizationId, id);
      console.log(`[Asset Delete] Cleared asset ${id} from ${cleared} document(s) publishedData`);
    } else {
      console.log(`[Asset Delete] clearAssetFromPublishedData not available on adapter`);
    }
    return c.json({ success: true });
  } catch (error) {
    cmsLogger.error("Error deleting asset:", error);
    return c.json({ success: false, error: "Failed to delete asset" }, 500);
  }
}).patch("/:id", zValidator("json", updateAssetRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { assetService } = c.var.aphexCMS;
    const auth = c.var.auth;
    const id = c.req.param("id");
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasCapability(auth, "asset.upload")) {
      return c.json({ success: false, error: "Forbidden: asset.upload capability required" }, 403);
    }
    if (!id) {
      return c.json({ success: false, error: "Asset ID is required" }, 400);
    }
    const { title, description, alt, creditLine } = c.req.valid("json");
    let updatedAsset;
    if (auth.type === "session") {
      updatedAsset = await assetService.updateAssetMetadata(auth.organizationId, id, {
        title,
        description,
        alt,
        creditLine,
        updatedBy: auth.user.id
      });
    } else {
      updatedAsset = await assetService.updateAssetMetadata(auth.organizationId, id, {
        title,
        description,
        alt,
        creditLine,
        updatedBy: auth.keyId
      });
    }
    if (!updatedAsset) {
      return c.json({ success: false, error: "Asset not found" }, 404);
    }
    return c.json({ success: true, data: updatedAsset });
  } catch (error) {
    cmsLogger.error("Error updating asset:", error);
    return c.json({ success: false, error: "Failed to update asset" }, 500);
  }
});
const assetsBulkRouter = new Hono().delete("/bulk", zValidator("json", bulkDeleteAssetsRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "No asset IDs provided",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { assetService, databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasCapability(auth, "asset.delete")) {
      return c.json({ success: false, error: "Forbidden: asset.delete capability required" }, 403);
    }
    const { ids } = c.req.valid("json");
    let referencedIds = [];
    if (databaseAdapter.countDocumentReferencesForAssets) {
      const counts = await databaseAdapter.countDocumentReferencesForAssets(auth.organizationId, ids);
      referencedIds = ids.filter((id) => (counts[id] || 0) > 0);
    }
    if (referencedIds.length > 0) {
      return c.json({
        success: false,
        error: `Cannot delete ${referencedIds.length} asset${referencedIds.length > 1 ? "s" : ""} because ${referencedIds.length > 1 ? "they are" : "it is"} still referenced by documents`,
        referencedIds
      }, 409);
    }
    const results = { deleted: 0, failed: 0 };
    for (const id of ids) {
      try {
        const result = await assetService.deleteAsset(auth.organizationId, id);
        if (result) {
          results.deleted++;
        } else {
          results.failed++;
        }
      } catch {
        results.failed++;
      }
    }
    return c.json({ success: true, data: results });
  } catch (error) {
    cmsLogger.error("Bulk delete failed:", error);
    return c.json({ success: false, error: "Bulk delete failed" }, 500);
  }
});
const assetsReferencesRouter = new Hono().get("/:id/references", async (c) => {
  try {
    const { databaseAdapter, localAPI } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const id = c.req.param("id");
    if (!id) {
      return c.json({ success: false, error: "Asset ID is required" }, 400);
    }
    if (!databaseAdapter.findDocumentsReferencingAsset) {
      return c.json({ success: true, data: { references: [], total: 0 } });
    }
    const knownTypes = localAPI.getCollectionNames();
    const references = await databaseAdapter.findDocumentsReferencingAsset(auth.organizationId, id, knownTypes);
    return c.json({
      success: true,
      data: {
        references,
        total: references.length
      }
    });
  } catch (error) {
    cmsLogger.error("Failed to find asset references:", error);
    return c.json({ success: false, error: "Failed to find asset references" }, 500);
  }
}).post("/references/counts", zValidator("json", assetReferenceCountsRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter, localAPI } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type === "partial_session") {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const { ids } = c.req.valid("json");
    if (ids.length === 0) {
      return c.json({ success: true, data: {} });
    }
    if (!databaseAdapter.countDocumentReferencesForAssets) {
      const counts2 = {};
      for (const id of ids)
        counts2[id] = 0;
      return c.json({ success: true, data: counts2 });
    }
    const knownTypes = localAPI.getCollectionNames();
    const counts = await databaseAdapter.countDocumentReferencesForAssets(auth.organizationId, ids, knownTypes);
    return c.json({ success: true, data: counts });
  } catch (error) {
    cmsLogger.error("Failed to count asset references:", error);
    return c.json({ success: false, error: "Failed to count asset references" }, 500);
  }
});
const roleNameSchema$1 = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9 _-]+$/);
const organizationRoleSchema = roleNameSchema$1;
const invitableRoleSchema = roleNameSchema$1.refine((v) => v !== "owner", {
  message: "owner cannot be assigned via invitation"
});
const metadataSchema = z.record(z.string(), z.unknown());
const createOrganizationRequest = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  metadata: metadataSchema.nullable().optional(),
  parentOrganizationId: z.string().optional()
});
const updateOrganizationRequest = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  metadata: metadataSchema.nullable().optional()
}).refine((v) => v.name !== void 0 || v.slug !== void 0 || v.metadata !== void 0, {
  message: "At least one field (name, slug, metadata) is required"
});
const switchOrganizationRequest = z.object({
  organizationId: z.string().min(1)
});
const inviteMemberRequest = z.object({
  email: z.string().email(),
  role: invitableRoleSchema
});
const cancelInvitationRequest = z.object({
  invitationId: z.string().min(1)
});
const removeMemberRequest = z.object({
  userId: z.string().min(1)
});
const updateMemberRoleRequest = z.object({
  userId: z.string().min(1),
  role: organizationRoleSchema
});
const organizationsRouter = new Hono().get("/", async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const memberships = await databaseAdapter.findUserOrganizations(auth.user.id);
    const organizations = memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      metadata: m.organization.metadata,
      role: m.member.role,
      joinedAt: m.member.createdAt,
      isActive: m.organization.id === auth.organizationId
    }));
    return c.json({ success: true, data: organizations });
  } catch (error) {
    cmsLogger.error("Failed to fetch organizations:", error);
    return c.json({
      success: false,
      error: "Failed to fetch organizations",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/", zValidator("json", createOrganizationRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "Organization name and slug are required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (auth.user.role !== "super_admin") {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "Only super admins can create organizations"
      }, 403);
    }
    const body = c.req.valid("json");
    const existingOrg = await databaseAdapter.findOrganizationBySlug(body.slug);
    if (existingOrg) {
      return c.json({
        success: false,
        error: "Slug already exists",
        message: `Organization with slug '${body.slug}' already exists`
      }, 409);
    }
    const newOrganization = await databaseAdapter.createOrganization({
      name: body.name,
      slug: body.slug,
      metadata: body.metadata || null,
      parentOrganizationId: auth.organizationId,
      createdBy: auth.user.id
    });
    await databaseAdapter.seedBuiltinRoles(newOrganization.id);
    await databaseAdapter.addMember({
      organizationId: newOrganization.id,
      userId: auth.user.id,
      role: "owner"
    });
    await databaseAdapter.updateUserSession(auth.user.id, newOrganization.id);
    return c.json({ success: true, data: newOrganization }, 201);
  } catch (error) {
    cmsLogger.error("Failed to create organization:", error);
    return c.json({
      success: false,
      error: "Failed to create organization",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const organizationsByIdRouter = new Hono().get("/:id", async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    const id = c.req.param("id");
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!id) {
      return c.json({
        success: false,
        error: "Missing required field",
        message: "Organization ID is required"
      }, 400);
    }
    const membership = await databaseAdapter.findUserMembership(auth.user.id, id);
    if (!membership) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You are not a member of this organization"
      }, 403);
    }
    const organization = await databaseAdapter.findOrganizationById(id);
    if (!organization) {
      return c.json({ success: false, error: "Organization not found" }, 404);
    }
    return c.json({ success: true, data: organization });
  } catch (error) {
    cmsLogger.error("Failed to fetch organization:", error);
    return c.json({
      success: false,
      error: "Failed to fetch organization",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).patch("/:id", zValidator("json", updateOrganizationRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    const id = c.req.param("id");
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!id) {
      return c.json({
        success: false,
        error: "Missing required field",
        message: "Organization ID is required"
      }, 400);
    }
    const membership = await databaseAdapter.findUserMembership(auth.user.id, id);
    if (!membership || !hasCapability(auth, "org.settings")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to update organization settings"
      }, 403);
    }
    const body = c.req.valid("json");
    if (body.slug) {
      const existingOrg = await databaseAdapter.findOrganizationBySlug(body.slug);
      if (existingOrg && existingOrg.id !== id) {
        return c.json({
          success: false,
          error: "Slug already exists",
          message: `Organization with slug '${body.slug}' already exists`
        }, 409);
      }
    }
    const updateData = {};
    if (body.name !== void 0)
      updateData.name = body.name;
    if (body.slug !== void 0)
      updateData.slug = body.slug;
    if (body.metadata !== void 0)
      updateData.metadata = body.metadata;
    const updatedOrganization = await databaseAdapter.updateOrganization(id, updateData);
    if (!updatedOrganization) {
      return c.json({ success: false, error: "Organization not found" }, 404);
    }
    return c.json({ success: true, data: updatedOrganization });
  } catch (error) {
    cmsLogger.error("Failed to update organization:", error);
    return c.json({
      success: false,
      error: "Failed to update organization",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/:id", async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    const id = c.req.param("id");
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!id) {
      return c.json({
        success: false,
        error: "Missing required field",
        message: "Organization ID is required"
      }, 400);
    }
    const membership = await databaseAdapter.findUserMembership(auth.user.id, id);
    if (!membership || membership.role !== "owner") {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "Only owners can delete an organization"
      }, 403);
    }
    const members = await databaseAdapter.findOrganizationMembers(id);
    for (const member of members) {
      const userSession = await databaseAdapter.findUserSession(member.userId);
      if (userSession?.activeOrganizationId === id) {
        const otherOrgs = await databaseAdapter.findUserOrganizations(member.userId);
        const remainingOrgs = otherOrgs.filter((org) => org.organization.id !== id);
        if (remainingOrgs.length > 0 && remainingOrgs[0]) {
          await databaseAdapter.updateUserSession(member.userId, remainingOrgs[0].organization.id);
        } else {
          await databaseAdapter.deleteUserSession(member.userId);
        }
      }
    }
    await databaseAdapter.removeAllMembers(id);
    await databaseAdapter.removeAllInvitations(id);
    await databaseAdapter.deleteOrganization(id);
    return c.json({ success: true, message: "Organization deleted successfully" });
  } catch (error) {
    cmsLogger.error("Failed to delete organization:", error);
    return c.json({
      success: false,
      error: "Failed to delete organization",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const organizationsInvitationsRouter = new Hono().post("/invitations", zValidator("json", inviteMemberRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "email and role are required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "member.invite")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to invite members"
      }, 403);
    }
    const body = c.req.valid("json");
    const roleRow = await databaseAdapter.findRoleByName(auth.organizationId, body.role);
    if (!roleRow) {
      return c.json({
        success: false,
        error: "Unknown role",
        message: `No role named "${body.role}" in this organization`
      }, 400);
    }
    if (body.email.toLowerCase() === auth.user.email.toLowerCase()) {
      return c.json({
        success: false,
        error: "Invalid invitation",
        message: "You cannot invite yourself"
      }, 400);
    }
    if (c.var.aphexCMS.auth) {
      const existingUser = await c.var.aphexCMS.auth.getUserByEmail(body.email);
      if (existingUser) {
        const existingMembership = await databaseAdapter.findUserMembership(existingUser.id, auth.organizationId);
        if (existingMembership) {
          return c.json({
            success: false,
            error: "Already a member",
            message: "This user is already a member of the organization"
          }, 400);
        }
      }
    }
    const existingInvitations = await databaseAdapter.findOrganizationInvitations(auth.organizationId);
    const pendingInvitation = existingInvitations.find((inv) => inv.email.toLowerCase() === body.email.toLowerCase() && inv.acceptedAt === null);
    if (pendingInvitation) {
      return c.json({
        success: false,
        error: "Already invited",
        message: "This email has already been invited to the organization"
      }, 400);
    }
    const token = crypto.randomUUID();
    const invitation = await databaseAdapter.createInvitation({
      organizationId: auth.organizationId,
      email: body.email.toLowerCase(),
      role: body.role,
      invitedBy: auth.user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      // 7 days
    });
    return c.json({
      success: true,
      data: invitation,
      message: "Invitation created successfully."
    }, 201);
  } catch (error) {
    cmsLogger.error("Failed to create invitation:", error);
    return c.json({
      success: false,
      error: "Failed to create invitation",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/invitations", zValidator("json", cancelInvitationRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Missing required field",
      message: "invitationId is required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "member.invite")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to cancel invitations"
      }, 403);
    }
    const body = c.req.valid("json");
    const deleted = await databaseAdapter.deleteInvitation(body.invitationId, auth.organizationId);
    if (!deleted) {
      return c.json({ success: false, error: "Invitation not found" }, 404);
    }
    return c.json({ success: true, message: "Invitation canceled successfully" });
  } catch (error) {
    cmsLogger.error("Failed to cancel invitation:", error);
    return c.json({
      success: false,
      error: "Failed to cancel invitation",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const organizationsMembersRouter = new Hono().get("/members", async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const members = await databaseAdapter.findOrganizationMembers(auth.organizationId);
    return c.json({ success: true, data: members });
  } catch (error) {
    cmsLogger.error("Failed to fetch organization members:", error);
    return c.json({
      success: false,
      error: "Failed to fetch members",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/members", zValidator("json", removeMemberRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Missing required field",
      message: "userId is required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "member.remove")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to remove members"
      }, 403);
    }
    const body = c.req.valid("json");
    if (body.userId === auth.user.id) {
      return c.json({
        success: false,
        error: "Invalid operation",
        message: "You cannot remove yourself from the organization"
      }, 400);
    }
    const targetMember = await databaseAdapter.findUserMembership(body.userId, auth.organizationId);
    if (!targetMember) {
      return c.json({
        success: false,
        error: "Member not found",
        message: "User is not a member of this organization"
      }, 404);
    }
    if (auth.organizationRole === "admin" && targetMember.role === "owner") {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "Admins cannot remove owners"
      }, 403);
    }
    const removed = await databaseAdapter.removeMember(auth.organizationId, body.userId);
    if (!removed) {
      return c.json({ success: false, error: "Failed to remove member" }, 500);
    }
    const userSession = await databaseAdapter.findUserSession(body.userId);
    if (userSession?.activeOrganizationId === auth.organizationId) {
      cmsLogger.debug(`[Organizations]: Clearing user session for ${body.userId} - removed from active org ${auth.organizationId}`);
      const otherOrgs = await databaseAdapter.findUserOrganizations(body.userId);
      if (otherOrgs.length > 0 && otherOrgs[0]) {
        await databaseAdapter.updateUserSession(body.userId, otherOrgs[0].organization.id);
        cmsLogger.debug(`[Organizations]: Set org ${otherOrgs[0].organization.id} as new active org for ${body.userId}`);
      } else {
        await databaseAdapter.deleteUserSession(body.userId);
        cmsLogger.debug(`[Organizations]: Deleted user session for ${body.userId} - no remaining organizations`);
      }
    }
    return c.json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    cmsLogger.error("Failed to remove member:", error);
    return c.json({
      success: false,
      error: "Failed to remove member",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).patch("/members", zValidator("json", updateMemberRoleRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "userId and role are required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "member.changeRole")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to change member roles"
      }, 403);
    }
    const body = c.req.valid("json");
    if (body.role === "owner" && auth.organizationRole !== "owner") {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "Only owners can promote members to owner"
      }, 403);
    }
    const roleRow = await databaseAdapter.findRoleByName(auth.organizationId, body.role);
    if (!roleRow) {
      return c.json({
        success: false,
        error: "Unknown role",
        message: `No role named "${body.role}" in this organization`
      }, 400);
    }
    if (body.userId === auth.user.id) {
      return c.json({
        success: false,
        error: "Invalid operation",
        message: "You cannot change your own role"
      }, 400);
    }
    const targetMember = await databaseAdapter.findUserMembership(body.userId, auth.organizationId);
    if (!targetMember) {
      return c.json({
        success: false,
        error: "Member not found",
        message: "User is not a member of this organization"
      }, 404);
    }
    if (auth.organizationRole === "admin" && targetMember.role === "owner") {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "Admins cannot modify owner roles"
      }, 403);
    }
    const updatedMember = await databaseAdapter.updateMemberRole(auth.organizationId, body.userId, body.role);
    if (!updatedMember) {
      return c.json({ success: false, error: "Failed to update role" }, 500);
    }
    return c.json({ success: true, data: updatedMember });
  } catch (error) {
    cmsLogger.error("Failed to update member role:", error);
    return c.json({
      success: false,
      error: "Failed to update role",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const organizationsSwitchRouter = new Hono().post("/switch", zValidator("json", switchOrganizationRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Missing required field",
      message: "organizationId is required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const body = c.req.valid("json");
    const membership = await databaseAdapter.findUserMembership(auth.user.id, body.organizationId);
    if (!membership) {
      return c.json({
        success: false,
        error: "Access denied",
        message: "You are not a member of this organization"
      }, 403);
    }
    await databaseAdapter.updateUserSession(auth.user.id, body.organizationId);
    const organization = await databaseAdapter.findOrganizationById(body.organizationId);
    return c.json({
      success: true,
      data: {
        organizationId: body.organizationId,
        organizationName: organization?.name,
        role: membership.role
      }
    });
  } catch (error) {
    cmsLogger.error("Failed to switch organization:", error);
    return c.json({
      success: false,
      error: "Failed to switch organization",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const capabilitySchema = z.enum(ALL_CAPABILITIES);
const roleNameSchema = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9 _-]+$/, {
  message: "Role name may only contain letters, numbers, spaces, underscores, and hyphens"
});
const createRoleRequest = z.object({
  name: roleNameSchema,
  description: z.string().max(500).nullable().optional(),
  capabilities: z.array(capabilitySchema).default([])
}).transform((v) => ({ ...v, capabilities: normalizeCapabilities(v.capabilities) }));
const updateRoleRequest = z.object({
  description: z.string().max(500).nullable().optional(),
  capabilities: z.array(capabilitySchema).optional()
}).refine((v) => v.description !== void 0 || v.capabilities !== void 0, {
  message: "At least one field (description, capabilities) is required"
}).transform((v) => ({
  ...v,
  capabilities: v.capabilities ? normalizeCapabilities(v.capabilities) : void 0
}));
const rolesRouter = new Hono().get("/", async (c) => {
  try {
    const { rolesService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const roles = await rolesService.listRoles(auth.organizationId);
    return c.json({ success: true, data: roles });
  } catch (error) {
    cmsLogger.error("Failed to list roles:", error);
    return c.json({
      success: false,
      error: "Failed to list roles",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/", zValidator("json", createRoleRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "name and capabilities are required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter, rolesService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "role.manage")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to manage roles"
      }, 403);
    }
    const body = c.req.valid("json");
    if (BUILTIN_ROLE_NAMES.includes(body.name)) {
      return c.json({
        success: false,
        error: "Reserved name",
        message: `"${body.name}" is a built-in role name. Edit the existing role instead.`
      }, 409);
    }
    const existing = await databaseAdapter.findRoleByName(auth.organizationId, body.name);
    if (existing) {
      return c.json({
        success: false,
        error: "Conflict",
        message: `A role named "${body.name}" already exists in this organization.`
      }, 409);
    }
    const role = await databaseAdapter.createRole({
      organizationId: auth.organizationId,
      name: body.name,
      description: body.description ?? null,
      capabilities: body.capabilities,
      isBuiltIn: false
    });
    await rolesService.invalidate(auth.organizationId, body.name);
    return c.json({ success: true, data: role }, 201);
  } catch (error) {
    cmsLogger.error("Failed to create role:", error);
    return c.json({
      success: false,
      error: "Failed to create role",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).patch("/:name", zValidator("json", updateRoleRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter, rolesService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "role.manage")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to manage roles"
      }, 403);
    }
    const name = c.req.param("name");
    if (!name) {
      return c.json({
        success: false,
        error: "Invalid request",
        message: "Role name is required"
      }, 400);
    }
    const body = c.req.valid("json");
    const updated = await databaseAdapter.updateRole(auth.organizationId, name, body);
    if (!updated) {
      return c.json({
        success: false,
        error: "Not found",
        message: `No role named "${name}" in this organization`
      }, 404);
    }
    await rolesService.invalidate(auth.organizationId, name);
    return c.json({ success: true, data: updated });
  } catch (error) {
    cmsLogger.error("Failed to update role:", error);
    return c.json({
      success: false,
      error: "Failed to update role",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).delete("/:name", async (c) => {
  try {
    const { databaseAdapter, rolesService } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!hasCapability(auth, "role.manage")) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to manage roles"
      }, 403);
    }
    const name = c.req.param("name");
    if (!name) {
      return c.json({
        success: false,
        error: "Invalid request",
        message: "Role name is required"
      }, 400);
    }
    if (BUILTIN_ROLE_NAMES.includes(name)) {
      return c.json({
        success: false,
        error: "Forbidden",
        message: `"${name}" is a built-in role and cannot be deleted.`
      }, 403);
    }
    const members = await databaseAdapter.findOrganizationMembers(auth.organizationId);
    const inUseByMember = members.some((m) => m.role === name);
    const invitations = await databaseAdapter.findOrganizationInvitations(auth.organizationId);
    const inUseByInvitation = invitations.some((i) => i.role === name && !i.acceptedAt);
    if (inUseByMember || inUseByInvitation) {
      return c.json({
        success: false,
        error: "Role in use",
        message: `Cannot delete "${name}": reassign affected members or invitations first.`
      }, 409);
    }
    const deleted = await databaseAdapter.deleteRole(auth.organizationId, name);
    if (!deleted) {
      return c.json({
        success: false,
        error: "Not found",
        message: `No role named "${name}" in this organization`
      }, 404);
    }
    await rolesService.invalidate(auth.organizationId, name);
    return c.json({ success: true, message: "Role deleted" });
  } catch (error) {
    cmsLogger.error("Failed to delete role:", error);
    return c.json({
      success: false,
      error: "Failed to delete role",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const updateUserRequest = z.object({
  name: z.string().min(1)
});
const updateUserPreferencesRequest = z.object({
  includeChildOrganizations: z.boolean().optional()
}).strict();
const requestPasswordResetRequest = z.object({
  email: z.string().email(),
  redirectTo: z.string().optional()
});
const resetPasswordRequest = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8)
});
const userPreferencesRouter = new Hono().get("/cms-preference", async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const userProfile = await databaseAdapter.findUserProfileById(auth.user.id);
    return c.json({ success: true, data: userProfile?.preferences || {} });
  } catch (error) {
    cmsLogger.error("Failed to get user preferences:", error);
    return c.json({
      success: false,
      error: "Failed to get user preferences",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).patch("/cms-preference", zValidator("json", updateUserPreferencesRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "Invalid preference values",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const { databaseAdapter } = c.var.aphexCMS;
    const auth = c.var.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    const body = c.req.valid("json");
    await databaseAdapter.updateUserPreferences(auth.user.id, body);
    const userProfile = await databaseAdapter.findUserProfileById(auth.user.id);
    return c.json({ success: true, data: userProfile?.preferences || {} });
  } catch (error) {
    cmsLogger.error("Failed to update user preferences:", error);
    return c.json({
      success: false,
      error: "Failed to update user preferences",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});
const userRouter = new Hono().patch("/", zValidator("json", updateUserRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Invalid request body",
      message: "name is required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const auth = c.var.auth;
    const provider = c.var.aphexCMS.auth;
    if (!auth || auth.type !== "session") {
      return c.json({
        success: false,
        error: "Unauthorized",
        message: "Session authentication required"
      }, 401);
    }
    if (!provider) {
      return c.json({
        success: false,
        error: "Auth provider not configured"
      }, 500);
    }
    const { name } = c.req.valid("json");
    await provider.changeUserName(auth.user.id, name);
    return c.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    cmsLogger.error("Failed to update user:", error);
    return c.json({
      success: false,
      error: "Failed to update user",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/request-password-reset", zValidator("json", requestPasswordResetRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Missing required field",
      message: "email is required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const provider = c.var.aphexCMS.auth;
    if (!provider) {
      return c.json({ success: false, error: "Auth provider not configured" }, 500);
    }
    const { email, redirectTo } = c.req.valid("json");
    await provider.requestPasswordReset(email, redirectTo);
    return c.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent"
    });
  } catch (error) {
    cmsLogger.error("Failed to request password reset:", error);
    return c.json({
      success: false,
      error: "Failed to request password reset",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
}).post("/reset-password", zValidator("json", resetPasswordRequest, (result, c) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: "Missing required fields",
      message: "token and newPassword are required",
      issues: result.error.issues
    }, 400);
  }
}), async (c) => {
  try {
    const provider = c.var.aphexCMS.auth;
    if (!provider) {
      return c.json({ success: false, error: "Auth provider not configured" }, 500);
    }
    const { token, newPassword } = c.req.valid("json");
    await provider.resetPassword(token, newPassword);
    return c.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    cmsLogger.error("Failed to reset password:", error);
    return c.json({
      success: false,
      error: "Failed to reset password",
      message: error instanceof Error ? error.message : "Invalid or expired token"
    }, 500);
  }
});
export {
  CollectionAPI as C,
  PermissionChecker as P,
  documentsPublishRouter as a,
  documentVersionsRouter as b,
  createStorageAdapter as c,
  documentsQueryRouter as d,
  documentsRouter as e,
  documentsByIdRouter as f,
  assetsBulkRouter as g,
  assetsReferencesRouter as h,
  assetsByIdRouter as i,
  assetsRouter as j,
  organizationsInvitationsRouter as k,
  organizationsMembersRouter as l,
  organizationsByIdRouter as m,
  organizationsRouter as n,
  organizationsSwitchRouter as o,
  userRouter as p,
  rolesRouter as r,
  schemasRouter as s,
  userPreferencesRouter as u
};
