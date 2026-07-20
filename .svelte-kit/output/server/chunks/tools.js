import { a as effectiveOrganizationRole, o as hasCapability, s as isInstanceRole } from "./capabilities.js";
import { a as validateDocumentData, i as isFieldRequired, n as VALID_FIELD_TYPES, r as validateSchemaReferences, t as RESERVED_FIELDS } from "./validator.js";
import { t as cmsLogger } from "./logger.js";
import { t as documentPublished } from "./catalog.js";
import { t as collectReferenceIds } from "./reference-walk.js";
import { n as systemContext } from "./auth-helpers.js";
import { n as toPascalCase } from "./string-case.js";
import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/schema-utils/singleton.js
var SINGLETON_NAMESPACE = "6f4d2c3b-7a51-4e62-9b1d-aphexsingleton";
/**
* 64-bit FNV-1a over a UTF-8 string, returned as 16 hex chars. Synchronous
* and isomorphic — no Node `crypto` import, so it can ride along into the
* client bundle via the schema-utils barrel without breaking Vite SSR.
*/
function fnv1a64(input) {
	let h = 14695981039346656037n;
	const prime = 1099511628211n;
	const mask = 18446744073709551615n;
	for (let i = 0; i < input.length; i++) {
		h ^= BigInt(input.charCodeAt(i));
		h = h * prime & mask;
	}
	return h.toString(16).padStart(16, "0");
}
/**
* Deterministic UUID-shaped id for a singleton schema, scoped to a specific
* organization. Each org gets its own canonical row id, so multi-tenant
* deployments don't collide on the global `documents.id` primary key. Same
* (schemaName, organizationId) always resolves to the same id, so the
* singleton document survives across deploys.
*
* The hash is not cryptographic — collision space is the (org, schema-name)
* set, which is small enough that FNV-1a is more than sufficient.
*/
function singletonId(schemaName, organizationId) {
	const seed = `${SINGLETON_NAMESPACE}:${organizationId}:${schemaName}`;
	const hex = (fnv1a64(`${seed}:a`) + fnv1a64(`${seed}:b`)).slice(0, 32);
	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		`5${hex.slice(13, 16)}`,
		`${(parseInt(hex.slice(16, 18), 16) & 63 | 128).toString(16).padStart(2, "0")}${hex.slice(18, 20)}`,
		hex.slice(20, 32)
	].join("-");
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/cache/document-cache.js
/**
* Document-aware cache wrapper.
* Translates document/collection operations into generic key-value calls on the underlying CacheAdapter.
*/
var DocumentCache = class {
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
		return `query:${orgId}:${collection}:${JSON.stringify(options, (_, value) => {
			if (value && typeof value === "object" && !Array.isArray(value)) return Object.keys(value).sort().reduce((sorted, key) => {
				sorted[key] = value[key];
				return sorted;
			}, {});
			return value;
		})}`;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/services/hierarchy-service.js
/**
* HierarchyService — caches organization parent→child lookups
* using the shared CacheAdapter.
*
* Lives in cms-core so every adapter (PostgreSQL, SQLite, MongoDB)
* benefits from the same caching without reimplementing it.
*/
var HierarchyService = class HierarchyService {
	db;
	cache;
	ttl;
	static DEFAULT_TTL = 60;
	inflight = /* @__PURE__ */ new Map();
	constructor(db, cache = null, ttl = HierarchyService.DEFAULT_TTL) {
		this.db = db;
		this.cache = cache;
		this.ttl = ttl;
	}
	async getChildOrganizations(parentOrganizationId) {
		if (!this.db.hierarchyEnabled) return [];
		const key = `hierarchy:${parentOrganizationId}`;
		if (this.cache) {
			const cached = await this.cache.get(key);
			if (cached) return cached;
		}
		const existing = this.inflight.get(key);
		if (existing) return existing;
		const promise = this.db.getChildOrganizations(parentOrganizationId).then(async (ids) => {
			if (this.cache) await this.cache.set(key, ids, this.ttl);
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
		if (this.cache) await this.cache.delete(`hierarchy:${parentOrganizationId}`);
	}
	async flush() {
		if (this.cache) await this.cache.invalidateByPrefix("hierarchy:");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/events/emit.js
/**
* Emit `document.published` (and its outbox row) for a freshly published document. MUST be
* called on a TRANSACTION handle (from `withTransaction`) so the event commits atomically with
* the publish it describes — the transactional-outbox guarantee. Shared by every publish path,
* versioned and non-versioned alike, so the fact fires whenever a publish happens regardless of
* whether a version snapshot was taken.
*/
async function emitDocumentPublished(tx, organizationId, doc) {
	await tx.appendEvent({
		organizationId,
		type: documentPublished.type,
		payload: documentPublished.parse({
			documentId: doc.id,
			documentType: doc.type,
			publishedHash: doc.publishedHash ?? null
		}),
		createdBy: doc.updatedBy
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/services/version-service.js
/**
* VersionService — orchestrates document versioning with rolling retention.
*
* Stateless regarding the adapter — each method receives the adapter to use.
* This allows CollectionAPI to pass whichever adapter is active (user or system),
* ensuring proper RLS context propagation.
*/
var VersionService = class {
	maxVersions;
	constructor(options) {
		this.maxVersions = options?.maxVersions ?? 25;
	}
	/**
	* Create a version snapshot and enforce rolling retention.
	*/
	async createVersion(db, organizationId, documentId, eventType, data, userId) {
		if (!db.createDocumentVersion) return null;
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
	* Write a version snapshot on an already-transactional adapter. The caller owns
	* the transaction boundary and retention (call `enforceRetentionFor` post-commit).
	* No-op when the adapter has no versioning support.
	*/
	async snapshotTx(tx, organizationId, documentId, eventType, data, userId) {
		if (!tx.createDocumentVersion) return;
		await tx.createDocumentVersion({
			documentId,
			organizationId,
			eventType,
			data,
			createdBy: userId
		});
	}
	/**
	* Publish + snapshot on an already-transactional adapter. Caller owns the tx
	* and retention. Returns the published document (or null if publish was a no-op).
	*/
	async publishTx(tx, organizationId, documentId) {
		const result = await tx.publishDoc(organizationId, documentId);
		if (result) {
			await this.snapshotTx(tx, organizationId, documentId, "publish", result.publishedData, result.updatedBy);
			await emitDocumentPublished(tx, organizationId, result);
		}
		return result;
	}
	/**
	* Public retention trigger for callers that manage their own transaction and
	* therefore can't rely on `saveWithVersion`/`publishWithVersion` to run it.
	*/
	async enforceRetentionFor(db, organizationId, documentId) {
		await this.enforceRetention(db, documentId, organizationId);
	}
	/**
	* Save draft and create version atomically using adapter transaction.
	*/
	async saveWithVersion(db, organizationId, documentId, data, userId) {
		if (!db.createDocumentVersion) return db.updateDocDraft(organizationId, documentId, data, userId);
		const updated = await db.withTransaction(async (txAdapter) => {
			const result = await txAdapter.updateDocDraft(organizationId, documentId, data, userId);
			if (result) await this.snapshotTx(txAdapter, organizationId, documentId, "draft", data, userId);
			return result;
		});
		if (updated) await this.enforceRetention(db, documentId, organizationId);
		return updated;
	}
	/**
	* Publish and create version.
	*/
	async publishWithVersion(db, organizationId, documentId) {
		if (!db.createDocumentVersion) return db.publishDoc(organizationId, documentId);
		const published = await db.withTransaction((txAdapter) => this.publishTx(txAdapter, organizationId, documentId));
		if (published) await this.enforceRetention(db, documentId, organizationId);
		return published;
	}
	/**
	* Restore a version to draft. Creates a 'draft' version entry.
	*/
	async restoreVersion(db, organizationId, documentId, versionNumber, userId) {
		if (!db.getDocumentVersion) return null;
		const version = await db.getDocumentVersion(organizationId, documentId, versionNumber);
		if (!version) return null;
		if (!db.createDocumentVersion) return db.updateDocDraft(organizationId, documentId, version.data, userId);
		const restored = await db.withTransaction(async (txAdapter) => {
			const result = await txAdapter.updateDocDraft(organizationId, documentId, version.data, userId);
			if (result) await this.snapshotTx(txAdapter, organizationId, documentId, "draft", version.data, userId);
			return result;
		});
		if (restored) await this.enforceRetention(db, documentId, organizationId);
		return restored;
	}
	async listVersions(db, organizationId, documentId, options) {
		if (!db.listDocumentVersions) return {
			versions: [],
			total: 0
		};
		return db.listDocumentVersions(organizationId, documentId, options);
	}
	async getVersion(db, organizationId, documentId, versionNumber) {
		if (!db.getDocumentVersion) return null;
		return db.getDocumentVersion(organizationId, documentId, versionNumber);
	}
	async enforceRetention(db, documentId, organizationId) {
		if (this.maxVersions <= 0) return;
		if (!db.listDocumentVersions || !db.deleteDocumentVersions) return;
		const { total, versions } = await db.listDocumentVersions(organizationId, documentId, {
			limit: 1e3,
			offset: 0
		});
		if (total <= this.maxVersions) return;
		const toDelete = versions.slice(this.maxVersions);
		if (toDelete.length > 0) await db.deleteDocumentVersions(documentId, toDelete.map((v) => v.id));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/services/references-service.js
/**
* Maintains the back-reference index. After every doc save the collection-API
* calls into here with the doc's draftData (the freshly-saved version) and
* its schema; we walk the data via the schema-aware walker, dedupe the
* resulting ref IDs, and atomically replace the rows for that referencer.
*
* Failures are logged but never thrown — a stale ref index is bad UX (the
* publish/unpublish guards may be wrong), but it shouldn't block the user's
* save. The boot-time backfill catches up gaps when the studio restarts.
*/
var ReferencesService = class {
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
			if (await this.databaseAdapter.hasAnyReferences(organizationId)) return;
			const docs = await listAllDocuments();
			if (docs.length === 0) return;
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
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/local-api/hooks.js
/**
* Run a phase of document hooks in order, threading the (possibly transformed)
* data through each. Returns the final data. A hook that throws aborts the write.
*/
async function runDocumentHooks(hooks, args) {
	if (!hooks?.length) return args.data;
	let data = args.data;
	for (const hook of hooks) data = await hook({
		...args,
		data
	});
	return data;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/jobs/document-jobs.js
/** Reserved built-in job types. Scheduling uses these; the worker maps them to the handlers below. */
var DOCUMENT_PUBLISH_JOB = "document.publish";
var DOCUMENT_UNPUBLISH_JOB = "document.unpublish";
/** Payload for document.publish / document.unpublish jobs — identifiers only, never content. */
var documentJobPayload = z.object({
	documentId: z.string(),
	documentType: z.string()
});
/**
* Built-in handlers for scheduled publish/unpublish.
*
* Runs as the system (override access) — the permission check already happened when the
* job was scheduled. Publish routes through `CollectionAPI.publish`, so it re-runs
* validation + reference guards + cache invalidation and emits `document.published`
* inside the publish transaction, exactly like a manual publish. A handler throw is a
* job failure: the runner retries with backoff or dead-letters it (e.g. a doc whose
* references became unpublished before the scheduled time fails validation and retries).
*/
function createDocumentJobHandlers(deps) {
	const { localAPI } = deps;
	return {
		[DOCUMENT_PUBLISH_JOB]: async ({ job }) => {
			const { documentId, documentType } = documentJobPayload.parse(job.payload);
			const collection = localAPI.getCollection(documentType);
			if (!collection) throw new Error(`Unknown collection "${documentType}" for job ${job.id}`);
			await collection.publish(systemContext(job.organizationId), documentId);
		},
		[DOCUMENT_UNPUBLISH_JOB]: async ({ job }) => {
			const { documentId, documentType } = documentJobPayload.parse(job.payload);
			const collection = localAPI.getCollection(documentType);
			if (!collection) throw new Error(`Unknown collection "${documentType}" for job ${job.id}`);
			await collection.unpublish(systemContext(job.organizationId), documentId);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/field-access.js
/**
* Return the set of field names the caller may NOT read.
* Fields with no `access.read` list are readable by default.
*/
function hiddenReadFields(schema, auth) {
	const hidden = /* @__PURE__ */ new Set();
	if (!auth) return hidden;
	if (isInstanceRole(auth)) return hidden;
	const role = effectiveOrganizationRole(auth);
	for (const field of schema.fields) {
		const list = field.access?.read;
		if (!list) continue;
		if (!role || !list.includes(role)) hidden.add(field.name);
	}
	return hidden;
}
/**
* Return the set of field names the caller may NOT write.
* Fields with no `access.update` list are writable by default.
*/
function hiddenWriteFields(schema, auth) {
	const hidden = /* @__PURE__ */ new Set();
	if (!auth) return hidden;
	if (isInstanceRole(auth)) return hidden;
	const role = effectiveOrganizationRole(auth);
	for (const field of schema.fields) {
		const list = field.access?.update;
		if (!list) continue;
		if (!role || !list.includes(role)) hidden.add(field.name);
	}
	return hidden;
}
/**
* Strip read-hidden fields from a document payload shape in place.
* Safe to call on undefined / non-object values (returns the input).
*/
function stripHiddenFields(data, hidden) {
	if (!data || typeof data !== "object" || hidden.size === 0) return data;
	const copy = { ...data };
	for (const name of hidden) delete copy[name];
	return copy;
}
/**
* Remove write-locked fields from incoming mutation data. Prevents a caller
* with collection-level update from silently overwriting fields the schema
* protects at the field level.
*/
function dropLockedWrites(data, locked) {
	if (locked.size === 0) return data;
	const copy = {};
	for (const [key, value] of Object.entries(data)) {
		if (locked.has(key)) continue;
		copy[key] = value;
	}
	return copy;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/local-api/collection-api.js
var EMPTY_SET = /* @__PURE__ */ new Set();
/**
* Re-project a FindResult through a hidden-fields filter without mutating
* the shared (potentially cached) original.
*/
function applyHiddenToResult(result, hidden) {
	if (hidden.size === 0) return result;
	return {
		...result,
		docs: result.docs.map((d) => applyHiddenToDoc(d, hidden))
	};
}
function applyHiddenToDoc(doc, hidden) {
	if (!doc || typeof doc !== "object") return doc;
	const copy = {};
	for (const [key, value] of Object.entries(doc)) {
		if (hidden.has(key)) continue;
		copy[key] = value;
	}
	return copy;
}
/**
* Transform a raw database document into a typed document with data extracted
* based on perspective (draft or published). Optionally strips field-level
* read-restricted fields from the data payload.
*/
function transformDocument(doc, perspective = "draft", hiddenFields) {
	const raw = perspective === "draft" ? doc.draftData : doc.publishedData;
	const data = hiddenFields && hiddenFields.size > 0 ? stripHiddenFields(raw, hiddenFields) : raw;
	return {
		id: doc.id,
		...data,
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
/**
* Thrown when a caller tries to perform an operation that's invalid for a
* singleton schema (e.g. delete the canonical row, or call `get()` on a
* non-singleton collection). Route handlers translate this to HTTP 400.
*/
var SingletonOperationError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SingletonOperationError";
	}
};
/**
* Collection API - provides type-safe operations for a single collection
* Generic type T represents the document type for this collection
*/
var CollectionAPI = class {
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
		if (!this.referencesService) return;
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
		if (!this._schema.singleton) throw new SingletonOperationError(`get() is only valid on singleton schemas. '${this.collectionName}' is not a singleton.`);
		const id = singletonId(this._schema.name, context.organizationId);
		const existing = await this.findByID(context, id, options);
		if (existing) return existing;
		return (await this.create(context, {}, { id })).document;
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
		if (this._schema.singleton) return {
			docs: [await this.get(context, {
				perspective: options.perspective,
				depth: options.depth
			})],
			totalDocs: 1,
			limit: 1,
			offset: 0,
			page: 1,
			totalPages: 1,
			hasNextPage: false,
			hasPrevPage: false
		};
		await this.permissions.canRead(context, this.collectionName);
		const perspective = options.perspective || context.perspective || "draft";
		const hidden = this.resolveHiddenReadFields(context);
		if (perspective === "published" && this.documentCache) {
			const cached = await this.documentCache.getQuery(context.organizationId, this.collectionName, options);
			if (cached) return applyHiddenToResult(cached, hidden);
		}
		const findOptions = { ...options };
		if (this.hierarchyService && !findOptions.filterOrganizationIds) findOptions.filterOrganizationIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
		const result = await this.databaseAdapter.findManyDocAdvanced(context.organizationId, this.collectionName, findOptions);
		const unfilteredDocs = result.docs.map((doc) => transformDocument(doc, perspective));
		const unfilteredResult = {
			...result,
			docs: unfilteredDocs
		};
		if (perspective === "published" && this.documentCache) await this.documentCache.setQuery(context.organizationId, this.collectionName, options, unfilteredResult);
		return applyHiddenToResult(unfilteredResult, hidden);
	}
	resolveHiddenReadFields(context) {
		if (context.overrideAccess) return EMPTY_SET;
		return hiddenReadFields(this._schema, context.auth);
	}
	resolveHiddenWriteFields(context) {
		if (context.overrideAccess) return EMPTY_SET;
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
		const perspective = options?.perspective || context.perspective || "draft";
		const hidden = this.resolveHiddenReadFields(context);
		if (perspective === "published" && this.documentCache) {
			const cached = await this.documentCache.getDocument(context.organizationId, id);
			if (cached) return applyHiddenToDoc(cached, hidden);
		}
		const findOptions = { ...options };
		if (this.hierarchyService && !findOptions.filterOrganizationIds) findOptions.filterOrganizationIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
		const result = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id, findOptions);
		if (!result) return null;
		const unfiltered = transformDocument(result, perspective);
		if (perspective === "published" && this.documentCache) await this.documentCache.setDocument(context.organizationId, id, unfiltered);
		return applyHiddenToDoc(unfiltered, hidden);
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
			if (existing) return {
				document: existing,
				validation: {
					isValid: true,
					errors: [],
					normalizedData: existing
				}
			};
			options = {
				...options,
				id
			};
		}
		await this.permissions.canCreate(context, this.collectionName);
		const filteredData = dropLockedWrites(data, this.resolveHiddenWriteFields(context));
		const hookedData = await runDocumentHooks(this._schema.hooks?.beforeValidate, {
			data: filteredData,
			operation: "create",
			originalDoc: null,
			context: {
				organizationId: context.organizationId,
				userId: context.user?.id
			},
			schema: this._schema
		});
		const validationResult = await validateDocumentData(this._schema, hookedData);
		if (options?.publish) {
			await this.permissions.canPublish(context, this.collectionName);
			if (!validationResult.isValid) {
				const errorMessage = validationResult.errors.map((e) => `${e.field}: ${e.errors.join(", ")}`).join("; ");
				throw new Error(`Cannot publish: validation errors - ${errorMessage}`);
			}
		}
		const versionService = options?.skipVersioning ? void 0 : this.versionService;
		if (options?.publish) {
			const { document, published } = await this.databaseAdapter.withTransaction(async (tx) => {
				const document = await tx.createDocument({
					organizationId: context.organizationId,
					type: this.collectionName,
					draftData: validationResult.normalizedData,
					createdBy: context.user?.id,
					id: options?.id
				});
				if (versionService) await versionService.snapshotTx(tx, context.organizationId, document.id, "draft", validationResult.normalizedData, context.user?.id);
				let published;
				if (versionService) published = await versionService.publishTx(tx, context.organizationId, document.id);
				else {
					published = await tx.publishDoc(context.organizationId, document.id);
					if (published) await emitDocumentPublished(tx, context.organizationId, published);
				}
				return {
					document,
					published
				};
			});
			await this.syncReferences(context.organizationId, document.id, validationResult.normalizedData);
			if (versionService) await versionService.enforceRetentionFor(this.databaseAdapter, context.organizationId, document.id);
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
			if (this.documentCache) await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
			return {
				document: transformDocument(document, "draft"),
				validation: validationResult
			};
		}
		const document = await this.databaseAdapter.createDocument({
			organizationId: context.organizationId,
			type: this.collectionName,
			draftData: validationResult.normalizedData,
			createdBy: context.user?.id,
			id: options?.id
		});
		await this.syncReferences(context.organizationId, document.id, validationResult.normalizedData);
		if (versionService) await versionService.createVersion(this.databaseAdapter, context.organizationId, document.id, "draft", validationResult.normalizedData, context.user?.id);
		if (this.documentCache) await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
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
		if (!existingDoc) return null;
		await this.permissions.canUpdate(context, this.collectionName, existingDoc);
		const filteredData = dropLockedWrites(data, this.resolveHiddenWriteFields(context));
		const schemaFieldNames = new Set(this._schema.fields.map((f) => f.name));
		const cleanedExisting = {};
		for (const [key, value] of Object.entries(existingDoc.draftData || {})) if (schemaFieldNames.has(key)) cleanedExisting[key] = value;
		const mergedData = {
			...cleanedExisting,
			...filteredData
		};
		const hookedData = await runDocumentHooks(this._schema.hooks?.beforeValidate, {
			data: mergedData,
			operation: "update",
			originalDoc: existingDoc.draftData ?? null,
			context: {
				organizationId: context.organizationId,
				userId: context.user?.id
			},
			schema: this._schema
		});
		const validationResult = await validateDocumentData(this._schema, hookedData);
		const document = this.versionService && !options?.skipVersioning ? await this.versionService.saveWithVersion(this.databaseAdapter, context.organizationId, id, validationResult.normalizedData, context.user?.id) : await this.databaseAdapter.updateDocDraft(context.organizationId, id, validationResult.normalizedData, context.user?.id);
		if (!document) return null;
		await this.syncReferences(context.organizationId, id, validationResult.normalizedData);
		if (options?.publish) {
			await this.permissions.canPublish(context, this.collectionName, document);
			if (!validationResult.isValid) {
				const errorMessage = validationResult.errors.map((e) => `${e.field}: ${e.errors.join(", ")}`).join("; ");
				throw new Error(`Cannot publish: validation errors - ${errorMessage}`);
			}
			const published = this.versionService && !options?.skipVersioning ? await this.versionService.publishWithVersion(this.databaseAdapter, context.organizationId, document.id) : await this.publishWithoutVersion(context.organizationId, document.id);
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
		if (this._schema.singleton && id === singletonId(this._schema.name, context.organizationId)) throw new SingletonOperationError(`Cannot delete the singleton document for '${this._schema.name}'. Remove the singleton flag from the schema first.`);
		const existing = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
		if (!existing) return false;
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
	/**
	* Publish without a version snapshot — the branch taken when there's no version service or
	* the caller passed `skipVersioning`. Still emits `document.published` (and its outbox row)
	* atomically with the publish, so the domain fact fires on EVERY publish path, not only the
	* versioned one. The versioned branch emits the same event from `versionService.publishTx`.
	*/
	async publishWithoutVersion(organizationId, id) {
		return this.databaseAdapter.withTransaction(async (tx) => {
			const published = await tx.publishDoc(organizationId, id);
			if (published) await emitDocumentPublished(tx, organizationId, published);
			return published;
		});
	}
	async publish(context, id) {
		const document = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
		if (!document || !document.draftData) throw new Error("Document not found or has no draft content to publish");
		await this.permissions.canPublish(context, this.collectionName, document);
		const validationResult = await validateDocumentData(this._schema, document.draftData);
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
					unpublished.push({
						id: refDoc.id,
						type: refDoc.type,
						title
					});
				}
			}
			if (unpublished.length > 0) {
				const names = unpublished.map((d) => `"${d.title}" (${d.type})`).join(", ");
				throw new Error(`Cannot publish — ${unpublished.length} referenced document(s) are not published: ${names}`);
			}
		}
		const publishedDocument = this.versionService ? await this.versionService.publishWithVersion(this.databaseAdapter, context.organizationId, id) : await this.publishWithoutVersion(context.organizationId, id);
		if (!publishedDocument) return null;
		if (this.documentCache) {
			await this.documentCache.invalidateDocument(context.organizationId, id);
			await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
		}
		await this.cancelPendingScheduleOfType(context.organizationId, id, DOCUMENT_PUBLISH_JOB);
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
		if (!existing) return null;
		await this.permissions.canUnpublish(context, this.collectionName, existing);
		const document = await this.databaseAdapter.unpublishDoc(context.organizationId, id);
		if (!document) return null;
		if (this.documentCache) {
			await this.documentCache.invalidateDocument(context.organizationId, id);
			await this.documentCache.invalidateCollection(context.organizationId, this.collectionName);
		}
		await this.cancelPendingScheduleOfType(context.organizationId, id, DOCUMENT_UNPUBLISH_JOB);
		return transformDocument(document, "draft");
	}
	/**
	* Pending scheduled publish/unpublish jobs for one document. Scheduled jobs are few
	* and `pending` is a small set, so filtering the org's pending jobs by documentId in
	* memory is cheap and avoids a dialect-specific JSON query on the hot editor path.
	*/
	async pendingScheduledFor(organizationId, documentId) {
		return (await this.databaseAdapter.listJobs({
			organizationId,
			status: "pending",
			limit: 200
		})).items.filter((j) => (j.type === "document.publish" || j.type === "document.unpublish") && j.payload.documentId === documentId);
	}
	/**
	* Cancel any pending schedule of ONE direction for a document — used when a manual
	* publish/unpublish supersedes a schedule of the same kind. Only same-direction is
	* cancelled on purpose: "publish now, auto-unpublish Friday" and "unpublish now,
	* republish Monday" are legitimate future transitions, so a manual publish leaves a
	* pending unpublish (and vice versa) alone. Without this, the queued job would fire at
	* `runAt` and re-run the same transition — re-emitting `document.published`/`unpublished`
	* and firing every consumer a second time (duplicate notifications, webhooks, cache busts).
	*/
	async cancelPendingScheduleOfType(organizationId, documentId, jobType) {
		const pending = await this.pendingScheduledFor(organizationId, documentId);
		for (const job of pending) if (job.type === jobType) await this.databaseAdapter.cancelJob(organizationId, job.id);
	}
	/**
	* Schedule a publish for a future `runAt`. Enqueues a `document.publish` job; the
	* worker runs `publish()` at that time (re-validating, guarding references, emitting
	* `document.published`). The permission check happens NOW — you must be able to publish
	* to schedule one — so an unauthorized caller can't queue work to run later as the system.
	* Actual publish-time validation still runs then, so a doc that goes invalid before
	* `runAt` simply fails/retries rather than publishing bad content.
	*
	* Replace semantics: any existing pending schedule for this document is cancelled first,
	* so a document has at most one pending schedule (rescheduling can't double-publish).
	*/
	async schedulePublish(context, id, runAt) {
		const document = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
		if (!document) throw new Error("Document not found");
		await this.permissions.canPublish(context, this.collectionName, document);
		for (const existing of await this.pendingScheduledFor(context.organizationId, id)) await this.databaseAdapter.cancelJob(context.organizationId, existing.id);
		return this.databaseAdapter.scheduleJob({
			organizationId: context.organizationId,
			type: DOCUMENT_PUBLISH_JOB,
			payload: {
				documentId: id,
				documentType: this.collectionName
			},
			runAt,
			createdBy: context.user?.id ?? null
		});
	}
	/** Schedule an unpublish for a future `runAt`. Permission-checked now; replaces any existing pending schedule. */
	async scheduleUnpublish(context, id, runAt) {
		const document = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
		if (!document) throw new Error("Document not found");
		await this.permissions.canUnpublish(context, this.collectionName, document);
		for (const existing of await this.pendingScheduledFor(context.organizationId, id)) await this.databaseAdapter.cancelJob(context.organizationId, existing.id);
		return this.databaseAdapter.scheduleJob({
			organizationId: context.organizationId,
			type: DOCUMENT_UNPUBLISH_JOB,
			payload: {
				documentId: id,
				documentType: this.collectionName
			},
			runAt,
			createdBy: context.user?.id ?? null
		});
	}
	/** Pending scheduled publish/unpublish jobs for a document (read-gated) — for the editor's schedule indicator. */
	async getScheduled(context, id) {
		await this.permissions.canRead(context, this.collectionName);
		return this.pendingScheduledFor(context.organizationId, id);
	}
	/** Cancel all pending scheduled publish/unpublish jobs for a document. Returns how many were cancelled. */
	async cancelScheduled(context, id) {
		const document = await this.databaseAdapter.findByDocIdAdvanced(context.organizationId, id);
		if (!document) throw new Error("Document not found");
		await this.permissions.canPublish(context, this.collectionName, document);
		const pending = await this.pendingScheduledFor(context.organizationId, id);
		for (const job of pending) await this.databaseAdapter.cancelJob(context.organizationId, job.id);
		return pending.length;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/local-api/permissions.js
var PermissionError = class extends Error {
	operation;
	resource;
	constructor(message, operation, resource) {
		super(message);
		this.operation = operation;
		this.resource = resource;
		this.name = "PermissionError";
	}
};
var OPERATION_CAPABILITY = {
	read: "document.read",
	create: "document.create",
	update: "document.update",
	delete: "document.delete",
	publish: "document.publish",
	unpublish: "document.unpublish"
};
var OPERATION_LABEL = {
	read: "view",
	create: "create",
	update: "edit",
	delete: "delete",
	publish: "publish",
	unpublish: "unpublish"
};
function denialMessage(operations, collectionName) {
	const actions = operations.map((op) => OPERATION_LABEL[op]);
	return `You don't have permission to ${actions.length === 1 ? actions[0] : actions.length === 2 ? `${actions[0]} or ${actions[1]}` : `${actions.slice(0, -1).join(", ")}, or ${actions[actions.length - 1]}`} ${collectionName} documents. Ask an admin if you need access.`;
}
var PermissionChecker = class {
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
		if (!this.schemas.has(collectionName)) throw new Error(`Collection "${collectionName}" not found in schema. Available collections: ${Array.from(this.schemas.keys()).join(", ")}`);
	}
	async assert(context, collectionName, operation, doc) {
		if (context.overrideAccess) return;
		const auth = this.requireAuth(context, operation, collectionName);
		if (this.isAllowed(auth, collectionName, operation, doc)) return;
		this.logDenial(auth, operation, collectionName, [OPERATION_CAPABILITY[operation]]);
		throw new PermissionError(denialMessage([operation], collectionName), operation, collectionName);
	}
	logDenial(auth, operation, collectionName, missingCapabilities) {
		const who = auth.type === "session" ? `user=${auth.user.id} role="${auth.organizationRole}"` : auth.type === "api_key" ? `apiKey=${auth.keyId}` : auth.type;
		const caps = "capabilities" in auth && Array.isArray(auth.capabilities) ? auth.capabilities.join(",") : "(none)";
		cmsLogger.warn("[RBAC]", `DENY ${operation} on "${collectionName}" — ${who} has=[${caps}] needs=[${missingCapabilities.join("|")}]`);
	}
	requireAuth(context, operation, collectionName) {
		if (!context.auth) throw new PermissionError(`You must be signed in to ${OPERATION_LABEL[operation]} ${collectionName} documents.`, operation, collectionName);
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
		const declared = this.schemas.get(collectionName)?.access?.[operation];
		if (declared) {
			if (typeof declared === "function") try {
				return declared({
					auth,
					doc
				});
			} catch (err) {
				cmsLogger.error("[RBAC]", `access policy for "${collectionName}.${operation}" threw:`, err);
				return false;
			}
			const role = effectiveOrganizationRole(auth);
			if (role && declared.includes(role)) return true;
			if (auth.type === "session" && role) return false;
		}
		return hasCapability(auth, OPERATION_CAPABILITY[operation]);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/local-api/index.js
/**
* CollectionAPI methods that compute synchronously and don't touch the DB.
* The LocalAPI proxy bypasses its async-adapter-swap wrapper for these so
* callers get the real sync return value back instead of a Promise.
*
* Keep this list opt-in (by name) so we never accidentally bypass an actual
* DB-touching method.
*/
var SYNC_COLLECTION_METHODS = /* @__PURE__ */ new Set(["getSingletonId"]);
/**
* Local API - provides a unified, type-safe interface for all CMS operations
*
* This is the single source of truth for data operations in Aphex CMS.
* GraphQL and REST APIs should be thin wrappers around this Local API.
*
* @example
* ```typescript
* // Initialize
* const api = await getLocalAPI(config);
*
* // Query documents
* const pages = await api.collections.pages.find(
*   { organizationId: 'org_123', user },
*   { where: { status: { equals: 'published' } } }
* );
*
* // Create document
* const newPage = await api.collections.pages.create(
*   { organizationId: 'org_123', user },
*   { title: 'Hello', slug: 'hello' }
* );
*
* // System operation (bypasses RLS)
* const allPages = await api.collections.pages.find(
*   { organizationId: 'org_123', overrideAccess: true },
*   { limit: 100 }
* );
* ```
*/
var LocalAPI = class {
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
		this.versionService = new VersionService({ maxVersions: config.versioning?.maxVersions ?? 25 });
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
			const collectionAPI = new Proxy(new CollectionAPI(schema.name, this.userAdapter, schema, this.permissions, this.documentCache, this.hierarchyService, this.versionService, this.referencesService, this.config.schemaTypes), { get: (target, prop) => {
				const method = target[prop];
				if (typeof method === "function" && SYNC_COLLECTION_METHODS.has(prop)) return method.bind(target);
				if (typeof method === "function") return async (...args) => {
					const context = args[0];
					const adapter = this.getAdapter(context);
					const api = new CollectionAPI(schema.name, adapter, schema, this.permissions, this.documentCache, this.hierarchyService, this.versionService, new ReferencesService(adapter), this.config.schemaTypes);
					return api[prop].apply(api, args);
				};
				return method;
			} });
			this._collections.set(schema.name, collectionAPI);
			this.collections[schema.name] = collectionAPI;
		}
	}
	/**
	* Get the appropriate database adapter based on context
	* Uses system adapter if overrideAccess is true, otherwise uses user adapter
	*/
	getAdapter(context) {
		if (context.overrideAccess && this.systemAdapter) return this.systemAdapter;
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
		if (this.hierarchyService) findOptions.filterOrganizationIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
		const rawDoc = await adapter.findByDocIdAdvanced(context.organizationId, id, findOptions);
		if (!rawDoc) return null;
		return {
			type: rawDoc.type,
			document: rawDoc
		};
	}
	/**
	* Find all documents that reference the given target — the back-reference
	* lookup that powers the unpublish guard. Returns lightweight rows
	* (id/type/status); callers fetch full docs separately if they need data.
	*/
	async getBackReferences(context, refId) {
		return this.getAdapter(context).findBackReferences(context.organizationId, refId);
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
		if (ids.length === 0) return [];
		const adapter = this.getAdapter(context);
		let filterOrganizationIds = options?.filterOrganizationIds;
		if (!filterOrganizationIds && this.hierarchyService) filterOrganizationIds = await this.hierarchyService.getOrgIdsWithChildren(context.organizationId);
		const typeLookups = await Promise.all(ids.map((id) => adapter.findByDocIdAdvanced(context.organizationId, id, { filterOrganizationIds }).then((row) => row ? {
			id,
			type: row.type
		} : null)));
		return (await Promise.all(typeLookups.map(async (lookup) => {
			if (!lookup) return null;
			const collection = this.getCollection(lookup.type);
			if (!collection) return null;
			try {
				return await collection.findByID(context, lookup.id, {
					...options,
					filterOrganizationIds
				});
			} catch {
				return null;
			}
		}))).filter((d) => d != null);
	}
};
var localAPIInstance = null;
/**
* Create and initialize the Local API
*
* @param config - CMS configuration
* @param userAdapter - Standard database adapter (respects RLS)
* @param systemAdapter - Optional system adapter (bypasses RLS) for system operations
* @returns LocalAPI instance
*
* @example
* ```typescript
* // Basic usage (single adapter)
* const api = createLocalAPI(config, userDb);
*
* // With system adapter for RLS bypass
* const api = createLocalAPI(config, userDb, systemDb);
* ```
*/
function createLocalAPI(config, userAdapter, systemAdapter) {
	localAPIInstance = new LocalAPI(config, userAdapter, systemAdapter);
	return localAPIInstance;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/mime-detect.js
/**
* Detect MIME type from file magic bytes (file signatures).
* Returns the detected MIME type, or null if unknown.
*/
function detectMimeType(buffer) {
	if (buffer.length < 4) return null;
	if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) return "application/pdf";
	if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) return "image/png";
	if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "image/jpeg";
	if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 && (buffer[4] === 55 || buffer[4] === 57) && buffer[5] === 97) return "image/gif";
	if (buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80) return "image/webp";
	if (buffer.length >= 12) {
		if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
			const brand = buffer.subarray(8, 12).toString("ascii");
			if (brand === "avif") return "image/avif";
			if (brand === "heic" || brand === "heix") return "image/heic";
			if (brand.startsWith("mp4") || brand === "isom") return "video/mp4";
		}
	}
	const head = buffer.subarray(0, Math.min(buffer.length, 256)).toString("utf-8");
	if (head.trimStart().startsWith("<") && head.includes("<svg")) return "image/svg+xml";
	if (buffer[0] === 80 && buffer[1] === 75 && buffer[2] === 3 && buffer[3] === 4) return detectZipFormat(buffer);
	if (buffer[0] === 208 && buffer[1] === 207 && buffer[2] === 17 && buffer[3] === 224) return "application/msword";
	if (buffer[0] === 0 && buffer[1] === 97 && buffer[2] === 115 && buffer[3] === 109) return "application/wasm";
	if (buffer[0] === 127 && buffer[1] === 69 && buffer[2] === 76 && buffer[3] === 70) return "application/x-executable";
	if (buffer[0] === 207 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 206 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 207 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 206) return "application/x-executable";
	if (buffer[0] === 77 && buffer[1] === 90) return "application/x-executable";
	if (buffer[0] === 35 && buffer[1] === 33) return "application/x-shellscript";
	return null;
}
/**
* Detect specific format within a ZIP container.
*/
function detectZipFormat(buffer) {
	const content = buffer.subarray(0, Math.min(buffer.length, 2e3)).toString("binary");
	if (content.includes("word/")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
	if (content.includes("xl/")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	if (content.includes("ppt/")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
	return "application/zip";
}
/**
* Blocked MIME types that should never be uploaded.
*/
var BLOCKED_MIME_TYPES = /* @__PURE__ */ new Set([
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
/**
* Blocked file extensions (regardless of MIME type).
*/
var BLOCKED_EXTENSIONS = /* @__PURE__ */ new Set([
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
/**
* Validate an uploaded file's actual content against allowed types.
* Checks magic bytes, not just the client-provided MIME type.
*/
function validateFile(buffer, filename, clientMimeType, options = {}) {
	const lowerName = filename.toLowerCase();
	const ext = lowerName.substring(lowerName.lastIndexOf("."));
	const detectedMimeType = detectMimeType(buffer);
	const allExts = lowerName.match(/\.[^.]+/g) || [];
	for (const e of allExts) if (BLOCKED_EXTENSIONS.has(e)) return {
		valid: false,
		error: `File type "${e}" is not allowed`,
		detectedMimeType
	};
	if (detectedMimeType && BLOCKED_MIME_TYPES.has(detectedMimeType)) return {
		valid: false,
		error: `File content detected as "${detectedMimeType}" which is not allowed`,
		detectedMimeType
	};
	if (detectedMimeType && clientMimeType) {
		const detectedBase = detectedMimeType.split("/")[0];
		const clientBase = clientMimeType.split("/")[0];
		if (detectedMimeType === "application/x-executable" && clientBase !== "application") return {
			valid: false,
			error: "File content does not match the declared type",
			detectedMimeType
		};
		if (clientBase === "image" && detectedBase !== "image" && detectedMimeType !== null) return {
			valid: false,
			error: `File content is "${detectedMimeType}" but was uploaded as an image`,
			detectedMimeType
		};
	}
	if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
		const mimeToCheck = detectedMimeType || clientMimeType;
		if (!options.allowedMimeTypes.some((allowed) => {
			if (allowed.endsWith("/*")) {
				const prefix = allowed.slice(0, -2);
				return mimeToCheck.startsWith(prefix);
			}
			if (allowed.startsWith(".")) return ext === allowed.toLowerCase();
			return mimeToCheck === allowed;
		})) return {
			valid: false,
			error: `File type "${mimeToCheck}" is not allowed. Accepted: ${options.allowedMimeTypes.join(", ")}`,
			detectedMimeType
		};
	}
	if (options.maxSize && buffer.length > options.maxSize) return {
		valid: false,
		error: `File exceeds maximum size of ${(options.maxSize / (1024 * 1024)).toFixed(1)} MB`,
		detectedMimeType
	};
	return {
		valid: true,
		detectedMimeType
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/type-gen.js
/**
* Map Aphex field types to TypeScript types
*/
function mapFieldTypeToTS(field, schemaMap, opts = {}) {
	const { inArray = false, resolved = false, parentSchemaName, blockContentFields } = opts;
	switch (field.type) {
		case "string":
		case "text":
		case "slug":
		case "url": return "string";
		case "number": return "number";
		case "boolean": return "boolean";
		case "date": return "string";
		case "datetime": return "string";
		case "image": return "ImageValue";
		case "file": return "FileValue";
		case "array": {
			if (!("of" in field) || !field.of || field.of.length === 0) return "unknown[]";
			if (field.of.some((item) => item.type === "block")) {
				if (parentSchemaName && blockContentFields) {
					const info = blockContentFields.find((f) => f.schemaName === parentSchemaName && f.fieldName === field.name);
					if (info) return getBlockContentArrayType(info);
				}
				return "PortableTextBlock[]";
			}
			const types = field.of.map((item) => {
				if (item.type === "reference") {
					const targets = item.to?.map((t) => {
						return schemaMap.get(t.type) ? toPascalCase(t.type) : null;
					}).filter((s) => !!s) ?? [];
					if (targets.length === 0) return resolved ? "unknown" : "Reference<unknown>";
					const union = targets.join(" | ");
					if (resolved) return targets.length === 1 ? targets[0] : `(${union})`;
					return targets.length === 1 ? `Reference<${targets[0]}>` : `Reference<${union}>`;
				}
				const refSchema = schemaMap.get(item.type);
				if (refSchema && refSchema.type === "object") {
					const useResolved = resolved && hasReferences(refSchema, schemaMap);
					return `(${toPascalCase(item.type) + (useResolved ? "Resolved" : "")} & { _key?: string })`;
				}
				return mapFieldTypeToTS(item, schemaMap, {
					inArray: true,
					resolved
				});
			}).filter((t) => t !== "unknown");
			if (types.length === 0) return "unknown[]";
			return types.length === 1 ? `${types[0]}[]` : `Array<${types.join(" | ")}>`;
		}
		case "object":
			if (!("fields" in field) || !field.fields) return "Record<string, unknown>";
			return `{\n${inArray ? "  _key?: string;\n  _type?: string;\n" : ""}${field.fields.map((f) => {
				const tsType = mapFieldTypeToTS(f, schemaMap, { resolved });
				const optional = isFieldOptional(f) ? "?" : "";
				return `  ${f.name}${optional}: ${tsType};`;
			}).join("\n")}\n}`;
		case "reference": {
			const targets = field.to?.map((t) => schemaMap.get(t.type) ? toPascalCase(t.type) : null).filter((s) => !!s) ?? [];
			if (resolved) {
				if (targets.length === 0) return "unknown";
				return targets.length === 1 ? targets[0] : targets.join(" | ");
			}
			if (targets.length === 0) return "Reference<unknown>";
			const union = targets.join(" | ");
			return targets.length === 1 ? `Reference<${targets[0]}>` : `Reference<${union}>`;
		}
		default: return "unknown";
	}
}
/**
* The depth=0 write shape (TypeScript type string) for a single field, e.g.
* `string` for a slug, `Reference<author>` for a reference, `ImageValue` for an
* image. Same mapping `generate-types` uses to emit `generated-types.ts`, so
* agent-facing schema introspection (MCP `get_schema`) can derive value shapes
* from the one source of truth instead of hand-authoring a parallel list.
*/
function fieldWriteShape(field, schemas) {
	return mapFieldTypeToTS(field, new Map(schemas.map((s) => [s.name, s])), {});
}
/**
* Determine if a field is optional based on validation rules
*/
function isFieldOptional(field) {
	return !isFieldRequired(field);
}
function getBlockContentArrayType(field) {
	const types = ["PortableTextBlock"];
	for (const bt of field.blockTypes) types.push(bt.interfaceName);
	if (field.hasImage) types.push("PortableTextImageBlock");
	if (types.length === 1) return "PortableTextBlock[]";
	return `Array<\n    | ${types.join("\n    | ")}\n  >`;
}
/**
* True if the schema (or any object schema reachable from it) contains a
* reference field. Used to skip emitting `*Resolved` variants for schemas
* that have nothing to resolve.
*/
function hasReferences(schema, schemaMap, visited = /* @__PURE__ */ new Set()) {
	if (visited.has(schema.name)) return false;
	visited.add(schema.name);
	return schema.fields.some((f) => fieldHasReferences(f, schemaMap, visited));
}
function fieldHasReferences(field, schemaMap, visited) {
	if (field.type === "reference") return true;
	if (field.type === "array" && "of" in field && field.of) return field.of.some((item) => {
		if (item.type === "reference") return true;
		const named = schemaMap.get(item.type);
		if (named && named.type === "object") return hasReferences(named, schemaMap, visited);
		return fieldHasReferences(item, schemaMap, visited);
	});
	if (field.type === "object" && "fields" in field && field.fields) return field.fields.some((f) => fieldHasReferences(f, schemaMap, visited));
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/components/admin/fields/richtext/block-defaults.js
var DEFAULT_BLOCK_STYLES = [
	"normal",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"blockquote"
];
var DEFAULT_BLOCK_DECORATORS = [
	"strong",
	"em",
	"underline",
	"strike-through",
	"code"
];
var DEFAULT_BLOCK_LISTS = ["bullet", "number"];
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/mcp/tools.js
var ok = (data) => ({ content: [{
	type: "text",
	text: JSON.stringify(data, null, 2)
}] });
var fail = (message) => ({
	content: [{
		type: "text",
		text: message
	}],
	isError: true
});
function asString(args, key) {
	const v = args[key];
	return typeof v === "string" && v.length > 0 ? v : null;
}
function asRecord(args, key) {
	const v = args[key];
	return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
var perspectiveArg = (v) => v === "published" ? "published" : "draft";
/** Walk a schema's fields (depth-limited) and collect reference edges from the real field data. */
function collectReferences(schemaName, fields, edges, prefix = "") {
	for (const f of fields) {
		const path = prefix ? `${prefix}.${f.name}` : f.name;
		if (f.type === "reference") edges.push({
			from: schemaName,
			path,
			to: f.to.map((t) => t.type)
		});
		else if (f.type === "array") {
			for (const ref of f.of) if (ref.to && ref.to.length > 0) edges.push({
				from: schemaName,
				path: `${path}[]`,
				to: ref.to.map((t) => t.type)
			});
		} else if (f.type === "object") collectReferences(schemaName, f.fields, edges, path);
	}
}
/**
* Portable Text is an open spec (portabletext.org), so we do NOT re-document the
* block/span/mark node shape here — we point at the spec. What we DO surface is
* the part that is NOT in the spec and IS specific to this schema: the allowed
* block styles, mark decorators/annotations, and custom block types — all derived
* live from the schema. Returns null if the schema has no rich-text fields.
*/
function portableTextGuide(schema) {
	const buildCustomExample = (ref) => {
		const example = {
			_type: ref.type,
			_key: "<unique>"
		};
		for (const f of ref.fields ?? []) example[f.name] = `<${f.type}>`;
		return example;
	};
	const fields = {};
	for (const field of schema.fields) {
		if (field.type !== "array") continue;
		const block = field.of.find((o) => o.type === "block");
		if (!block) continue;
		fields[field.name] = {
			styles: block.styles?.map((s) => s.value) ?? DEFAULT_BLOCK_STYLES,
			decorators: block.marks?.decorators?.map((d) => d.value) ?? DEFAULT_BLOCK_DECORATORS,
			lists: block.lists?.map((l) => l.value) ?? DEFAULT_BLOCK_LISTS,
			annotations: ["link", ...block.marks?.annotations?.map((a) => a.name) ?? []],
			customBlockTypes: field.of.filter((o) => o.type !== "block").map((o) => ({
				type: o.type,
				example: buildCustomExample(o)
			}))
		};
	}
	if (Object.keys(fields).length === 0) return null;
	return {
		spec: "https://portabletext.org",
		note: "These fields are Portable Text (an open spec — follow it for the block/span/mark node shape). Every array item needs a unique string `_key`. The values below are this schema's specifics, not part of the spec: allowed block `style`s, mark decorators/annotations, and custom block types you can insert between text blocks.",
		fields
	};
}
var SHAPE_LEGEND = {
	ImageValue: "{ _type: 'image', asset: { _type: 'reference', _ref: '<assetId>' }, alt?: string }",
	FileValue: "{ _type: 'file', asset: { _type: 'reference', _ref: '<assetId>' } }",
	"Reference<…>": "{ _type: 'reference', _ref: '<documentId of the referenced type>' }",
	"PortableTextBlock[]": "Portable Text (portabletext.org) — see the `portableText` section of this response for allowed styles/marks/blocks. Every array item needs a unique string `_key`."
};
/**
* Per-field write shapes (the depth=0 JSON an agent should send), derived from
* the same `fieldWriteShape`/type-generator mapping that emits `generated-types.ts`
* — so slug reads as `string`, a reference as `Reference<author>`, an image as
* `ImageValue`, never a guess. Attaches only the legend entries actually used.
*/
function buildWriteShapes(schema, allSchemas) {
	const writeShapes = {};
	for (const field of schema.fields) if (field.type === "date") writeShapes[field.name] = "string (ISO date, YYYY-MM-DD)";
	else if (field.type === "datetime") writeShapes[field.name] = "string (ISO datetime UTC, YYYY-MM-DDTHH:mm:ssZ)";
	else writeShapes[field.name] = fieldWriteShape(field, allSchemas);
	const used = Object.values(writeShapes).join(" ");
	const shapeLegend = {};
	for (const [alias, shape] of Object.entries(SHAPE_LEGEND)) {
		const needle = alias === "Reference<…>" ? "Reference<" : alias;
		if (used.includes(needle)) shapeLegend[alias] = shape;
	}
	return {
		writeShapes,
		shapeLegend
	};
}
/**
* Build the content-plane tools for one authenticated request.
* Safe to expose against a live instance: all writes go through LocalAPI, so a
* read-only API key is rejected by the permission layer, not by this registry.
*/
function buildContentTools({ aphexCMS, context }) {
	const api = aphexCMS.localAPI;
	const { assetService } = aphexCMS;
	const orgId = context.organizationId;
	return [
		{
			name: "describe_cms",
			description: "Orientation for building against this CMS: all content types and their relationships, the valid field-type vocabulary, and what this API key is allowed to do. Call this first. All data is derived live from the running config — never stale. For exact field/schema TypeScript signatures, read the SchemaType and Field types from the `@aphexcms/cms-core` package (and the real schemas in src/lib/schemaTypes/*.ts).",
			inputSchema: {},
			handler: async () => {
				const schemas = aphexCMS.config.schemaTypes;
				const edges = [];
				for (const s of schemas) collectReferences(s.name, s.fields, edges);
				const documentTypes = schemas.filter((s) => s.type === "document").map((s) => ({
					name: s.name,
					title: s.title,
					singleton: s.type === "document" ? s.singleton ?? false : false,
					fieldCount: s.fields.length
				}));
				const objectTypes = schemas.filter((s) => s.type === "object").map((s) => ({
					name: s.name,
					title: s.title,
					fieldCount: s.fields.length
				}));
				const auth = context.auth;
				const capabilities = auth?.type === "api_key" ? {
					authType: "api_key",
					canWrite: auth.permissions.includes("write"),
					permissions: auth.permissions,
					capabilities: auth.capabilities
				} : auth?.type === "session" ? {
					authType: "session",
					canWrite: true,
					capabilities: auth.capabilities
				} : {
					authType: "unknown",
					canWrite: false
				};
				return ok({
					organizationId: orgId,
					documentTypes,
					objectTypes,
					referenceGraph: edges,
					validFieldTypes: VALID_FIELD_TYPES,
					reservedFieldNames: RESERVED_FIELDS,
					capabilities,
					typeReference: "Import SchemaType/Field from '@aphexcms/cms-core' for exact per-field-type props and validation Rule API; TypeScript enforces them. Read existing schemas in src/lib/schemaTypes/*.ts as working examples."
				});
			}
		},
		{
			name: "list_collections",
			description: "List the document collections (content types) available in this CMS, with their names and titles.",
			inputSchema: {},
			handler: async () => {
				return ok({ collections: api.getCollectionNames().map((name) => {
					const schema = api.getCollectionSchema(name);
					return {
						name,
						title: schema?.title ?? name,
						singleton: schema?.singleton ?? false
					};
				}) });
			}
		},
		{
			name: "get_schema",
			description: "Get the field schema for one collection, so you know the shape to use when creating or updating its documents. Returns { schema, portableText? } — `portableText` is present when the type has rich-text (block) fields and links the open Portable Text spec plus this schema's allowed styles/marks/custom block types.",
			inputSchema: { collection: z.string().describe("Collection name") },
			handler: async (args) => {
				const collection = asString(args, "collection");
				if (!collection) return fail("Missing required string argument: collection");
				const schema = api.getCollectionSchema(collection);
				if (!schema) return fail(`Unknown collection: ${collection}`);
				const portableText = portableTextGuide(schema);
				const { writeShapes, shapeLegend } = buildWriteShapes(schema, aphexCMS.config.schemaTypes);
				return ok({
					schema,
					writeShapes,
					...Object.keys(shapeLegend).length > 0 ? { shapeLegend } : {},
					...portableText ? { portableText } : {}
				});
			}
		},
		{
			name: "validate_document",
			description: "Dry-run: validate document `data` against its collection schema WITHOUT saving, using the same validator as create/update. Returns field-level errors so you can fix them before create_document/update_document.",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				data: z.record(z.string(), z.unknown()).describe("Document field values to validate")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const data = asRecord(args, "data");
				if (!collection || !data) return fail("Missing required arguments: collection (string), data (object)");
				const schema = api.getCollectionSchema(collection);
				if (!schema) return fail(`Unknown collection: ${collection}`);
				try {
					const result = await validateDocumentData(schema, data);
					return ok({
						isValid: result.isValid,
						errors: result.errors
					});
				} catch (err) {
					return fail(`Validation failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "validate_schema",
			description: "Validate a proposed schema definition (structure, field types, references, reserved field names) against the current CMS, WITHOUT writing a file. Use before writing a schema .ts file. Pass the schema as JSON — validation-rule functions are not needed for structural validation.",
			inputSchema: { schema: z.record(z.string(), z.unknown()).describe("Proposed SchemaType as JSON (type, name, title, fields, …)") },
			handler: async (args) => {
				const proposed = asRecord(args, "schema");
				if (!proposed) return fail("Missing required argument: schema (object)");
				const all = [...aphexCMS.config.schemaTypes, proposed];
				try {
					validateSchemaReferences(all);
					return ok({
						isValid: true,
						errors: []
					});
				} catch (err) {
					return ok({
						isValid: false,
						errors: (err instanceof Error ? err.message : String(err)).split("\n")
					});
				}
			}
		},
		{
			name: "query_documents",
			description: "Query documents in a collection. Supports where filters, sorting, pagination, and draft/published perspective.",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				where: z.record(z.string(), z.unknown()).optional().describe("Filter conditions (LocalAPI Where syntax)"),
				limit: z.number().optional().describe("Max results (default 50)"),
				offset: z.number().optional().describe("Results to skip (default 0)"),
				sort: z.string().optional().describe("Sort field; prefix '-' for descending, e.g. '-updatedAt'"),
				perspective: z.enum(["draft", "published"]).optional().describe("Which content to read (default draft)")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				if (!collection) return fail("Missing required string argument: collection");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				const where = asRecord(args, "where") ?? void 0;
				const limit = typeof args.limit === "number" ? args.limit : void 0;
				const offset = typeof args.offset === "number" ? args.offset : void 0;
				const sort = asString(args, "sort") ?? void 0;
				try {
					return ok(await col.find(context, {
						where,
						limit,
						offset,
						sort,
						perspective: perspectiveArg(args.perspective)
					}));
				} catch (err) {
					return fail(`Query failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "get_document",
			description: "Get a single document by id from a collection.",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				id: z.string().describe("Document id"),
				perspective: z.enum(["draft", "published"]).optional()
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const id = asString(args, "id");
				if (!collection || !id) return fail("Missing required string arguments: collection, id");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				try {
					const doc = await col.findByID(context, id, { perspective: perspectiveArg(args.perspective) });
					if (!doc) return fail(`Document not found: ${collection}/${id}`);
					return ok(doc);
				} catch (err) {
					return fail(`Get failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "create_document",
			description: "Create a document in a collection. Pass field values in `data` (matching the collection schema). Set publish:true to publish immediately, otherwise it is saved as a draft.",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				data: z.record(z.string(), z.unknown()).describe("Field values matching the collection schema"),
				publish: z.boolean().optional().describe("Publish immediately (default false)")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const data = asRecord(args, "data");
				if (!collection || !data) return fail("Missing required arguments: collection (string), data (object)");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				try {
					return ok(await col.create(context, data, { publish: args.publish === true }));
				} catch (err) {
					return fail(`Create failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "update_document",
			description: "Update fields on an existing document. Only include the fields you want to change in `data`. Set publish:true to publish the result.",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				id: z.string().describe("Document id"),
				data: z.record(z.string(), z.unknown()).describe("Partial field values to update"),
				publish: z.boolean().optional().describe("Publish after updating (default false)")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const id = asString(args, "id");
				const data = asRecord(args, "data");
				if (!collection || !id || !data) return fail("Missing required arguments: collection, id (strings), data (object)");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				try {
					const result = await col.update(context, id, data, { publish: args.publish === true });
					if (!result) return fail(`Document not found: ${collection}/${id}`);
					return ok(result);
				} catch (err) {
					return fail(`Update failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "publish_document",
			description: "Publish a document (copies its current draft to the published perspective).",
			inputSchema: {
				collection: z.string().describe("Collection name"),
				id: z.string().describe("Document id")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const id = asString(args, "id");
				if (!collection || !id) return fail("Missing required string arguments: collection, id");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				try {
					const doc = await col.publish(context, id);
					if (!doc) return fail(`Document not found: ${collection}/${id}`);
					return ok(doc);
				} catch (err) {
					return fail(`Publish failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "get_singleton",
			description: "Get a singleton document (a type where exactly one exists, e.g. site settings — flagged `singleton: true` in describe_cms). No id needed; the canonical row is resolved (and lazily created empty on first access). Use this instead of get_document for singletons.",
			inputSchema: {
				collection: z.string().describe("Singleton collection name"),
				perspective: z.enum(["draft", "published"]).optional()
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				if (!collection) return fail("Missing required string argument: collection");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				try {
					return ok(await col.get(context, { perspective: perspectiveArg(args.perspective) }));
				} catch (err) {
					return fail(err instanceof Error ? err.message : String(err));
				}
			}
		},
		{
			name: "update_singleton",
			description: "Update a singleton document (e.g. site settings). No id needed — the canonical row is resolved by type. Include only the fields to change in `data`. Set publish:true to publish the result. Use this instead of update_document for singletons.",
			inputSchema: {
				collection: z.string().describe("Singleton collection name"),
				data: z.record(z.string(), z.unknown()).describe("Partial field values to update"),
				publish: z.boolean().optional().describe("Publish after updating (default false)")
			},
			handler: async (args) => {
				const collection = asString(args, "collection");
				const data = asRecord(args, "data");
				if (!collection || !data) return fail("Missing required arguments: collection (string), data (object)");
				const col = api.getCollection(collection);
				if (!col) return fail(`Unknown collection: ${collection}`);
				const id = col.getSingletonId(context);
				if (!id) return fail(`'${collection}' is not a singleton. Use update_document instead.`);
				try {
					await col.get(context);
					const result = await col.update(context, id, data, { publish: args.publish === true });
					if (!result) return fail(`Failed to update singleton '${collection}'.`);
					return ok(result);
				} catch (err) {
					return fail(`Update failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "list_assets",
			description: "List media assets (images and files) in this organization, optionally filtered.",
			inputSchema: {
				search: z.string().optional().describe("Filter by filename/text"),
				assetType: z.enum(["image", "file"]).optional(),
				limit: z.number().optional(),
				offset: z.number().optional()
			},
			handler: async (args) => {
				const search = asString(args, "search") ?? void 0;
				const assetType = args.assetType === "image" || args.assetType === "file" ? args.assetType : void 0;
				const limit = typeof args.limit === "number" ? args.limit : void 0;
				const offset = typeof args.offset === "number" ? args.offset : void 0;
				try {
					const assets = await assetService.findAssets(orgId, {
						search,
						assetType,
						limit,
						offset
					});
					return ok({
						assets,
						count: assets.length
					});
				} catch (err) {
					return fail(`List assets failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		},
		{
			name: "upload_asset",
			description: "Upload an image or file from base64 data and get back a ready-to-reference value. The response includes `imageValue` and `fileValue` — drop the matching one straight into a document field (e.g. a blog post `coverImage`, an author `avatar`, or an inline `image` block) via update_document. File type is verified from the actual bytes, not the declared name.",
			inputSchema: {
				data: z.string().min(1).describe("Base64-encoded file contents (no data: URI prefix)."),
				filename: z.string().min(1).describe("Original filename, e.g. \"cover.png\". Its extension helps typing."),
				mimeType: z.string().optional().describe("Declared MIME type. Optional — the bytes are sniffed regardless."),
				alt: z.string().optional().describe("Default alt text, shared across every placement."),
				title: z.string().optional(),
				description: z.string().optional()
			},
			handler: async (args) => {
				const base64 = asString(args, "data");
				const filename = asString(args, "filename");
				if (!base64) return fail("'data' (base64 file contents) is required.");
				if (!filename) return fail("'filename' is required.");
				let buffer;
				try {
					buffer = Buffer.from(base64, "base64");
				} catch {
					return fail("'data' is not valid base64.");
				}
				if (buffer.length === 0) return fail("'data' decoded to zero bytes.");
				const declaredMime = asString(args, "mimeType") ?? "";
				const validation = validateFile(buffer, filename, declaredMime);
				if (!validation.valid) return fail(`Upload rejected: ${validation.error ?? "file failed validation."}`);
				const mimeType = validation.detectedMimeType || declaredMime || "application/octet-stream";
				try {
					const asset = await assetService.uploadAsset(orgId, {
						buffer,
						originalFilename: filename,
						mimeType,
						size: buffer.length,
						alt: asString(args, "alt") ?? void 0,
						title: asString(args, "title") ?? void 0,
						description: asString(args, "description") ?? void 0,
						createdBy: context.user?.id
					});
					const ref = {
						_type: "reference",
						_ref: asset.id
					};
					return ok({
						asset,
						imageValue: {
							_type: "image",
							asset: ref
						},
						fileValue: {
							_type: "file",
							asset: ref
						}
					});
				} catch (err) {
					return fail(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
		}
	];
}
//#endregion
export { SingletonOperationError as a, PermissionError as i, validateFile as n, createDocumentJobHandlers as o, createLocalAPI as r, buildContentTools as t };
