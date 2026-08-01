import { l as normalizeCapabilities, n as BUILTIN_ROLE_NAMES, o as hasCapability, r as BUILTIN_ROLE_SEED, t as ALL_CAPABILITIES, u as resolveCapabilities } from "./capabilities.js";
import { r as validateSchemaReferences } from "./validator.js";
import { n as setLogLevel, r as setLogger, t as cmsLogger } from "./logger.js";
import { t as settingsListItems } from "./settings.js";
import { a as PermissionError, i as createLocalAPI, n as resolveAgentTools, o as SingletonOperationError, r as validateFile, s as createDocumentJobHandlers } from "./tools.js";
import "./schema-utils.js";
import { n as toConsumerJobHandler, r as toDeliveryPayload, t as consumerJobType } from "./consumer.js";
import { t as createPartResolver } from "./resolver.js";
import { t as authToContext } from "./auth-helpers.js";
import "./graphql.js";
import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { basename, dirname, join, resolve } from "path";
import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import sharp from "sharp";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { zValidator } from "@hono/zod-validator";
import { streamSSE } from "hono/streaming";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/auth/auth-errors.js
var AuthError = class extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "AuthError";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/engine.js
var CMSEngine = class {
	db;
	config;
	constructor(config, dbAdapter) {
		this.config = config;
		this.db = dbAdapter;
	}
	updateConfig(newConfig) {
		this.config = newConfig;
		cmsLogger.info("[CMS]", "Config updated:", {
			schemaTypes: newConfig.schemaTypes.length,
			documents: newConfig.schemaTypes.filter((t) => t.type === "document").length,
			objects: newConfig.schemaTypes.filter((t) => t.type === "object").length
		});
	}
	async initialize() {
		cmsLogger.info("[CMS]", "Initializing...");
		validateSchemaReferences(this.config.schemaTypes);
		const existingSchemas = await this.db.listSchemas();
		const existingNames = new Set(existingSchemas.map((s) => s.name));
		const currentNames = new Set(this.config.schemaTypes.map((s) => s.name));
		for (const existingName of existingNames) if (!currentNames.has(existingName)) await this.db.deleteSchemaType(existingName);
		for (const schemaType of this.config.schemaTypes) await this.db.registerSchemaType(schemaType);
		await this.reconcileBuiltinRoles();
		cmsLogger.info("[CMS]", "Initialized successfully");
	}
	/**
	* Every capability this install recognises: core's built-ins plus whatever the
	* registered plugins declare.
	*
	* `ALL_CAPABILITIES` is core-only and static, so on its own it would leave an
	* owner unable to hold a capability its own plugins declared — owner would end up
	* with strictly fewer permissions than admin, who can be granted plugin
	* capabilities through the roles UI.
	*/
	ownerCapabilities() {
		const declared = createPartResolver(this.config.plugins ?? []).capabilityCatalog().map((def) => def.id);
		return Array.from(/* @__PURE__ */ new Set([...ALL_CAPABILITIES, ...declared]));
	}
	/**
	* Re-seed built-in roles for every existing organization.
	*
	* Org creation seeds roles once, which means an org created before a
	* capability existed never learns about it — that is why an owner could be
	* missing `plugin.settings.manage` after upgrading core. Re-seeding on boot
	* closes that gap: it inserts any missing built-in row and reconciles `owner`
	* back to the full capability set, which now includes plugin-declared
	* capabilities. Editable roles (admin/editor/viewer) are left as the operator
	* configured them.
	*
	* Because this runs on every boot, installing or removing a plugin is enough to
	* bring owners in line with the capabilities that plugin declares.
	*
	* Idempotent and cheap — orgs are few and this is four rows each — so it runs
	* unconditionally rather than behind a schema-version check.
	*/
	async reconcileBuiltinRoles() {
		const organizations = await this.db.findAllOrganizations();
		const ownerCaps = this.ownerCapabilities();
		for (const org of organizations) await this.db.seedBuiltinRoles(org.id, ownerCaps);
		if (organizations.length > 0) cmsLogger.info("[CMS]", `Reconciled built-in roles for ${organizations.length} org(s) (owner: ${ownerCaps.length} capabilities)`);
	}
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
};
var cmsInstance = null;
function createCMS(config, dbAdapter) {
	if (!cmsInstance) cmsInstance = new CMSEngine(config, dbAdapter);
	else cmsInstance.updateConfig(config);
	return cmsInstance;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/auth/auth-hooks.js
/**
* Populate `auth.capabilities` for session auth via RolesService.
* Runs once per request so downstream permission checks stay synchronous.
* No-op for API keys and partial sessions — `resolveCapabilities` handles
* those shapes directly.
*/
async function hydrateCapabilities(auth, rolesService) {
	if (auth.type !== "session") return;
	if (auth.capabilities) return;
	auth.capabilities = await rolesService.getCapabilities(auth.organizationId, auth.organizationRole);
}
async function handleAuthHook(event, config, authProvider, db, rolesService) {
	const path = event.url.pathname;
	if (path.startsWith("/admin")) try {
		const session = await authProvider.requireSession(event.request, db);
		await hydrateCapabilities(session, rolesService);
		event.locals.auth = session;
	} catch (error) {
		if (error instanceof AuthError) {
			if (error.code === "pending_invitations") throw redirect(302, "/invitations");
			throw redirect(302, `${config.auth?.loginUrl || "/login"}?error=${error.code}`);
		}
		throw redirect(302, config.auth?.loginUrl || "/login");
	}
	if (path.startsWith("/assets/") || path.startsWith("/media/")) {
		let auth = await authProvider.getSession(event.request, db);
		if (!auth) auth = await authProvider.validateApiKey(event.request, db);
		if (auth) {
			await hydrateCapabilities(auth, rolesService);
			event.locals.auth = auth;
		}
	}
	if (path.startsWith("/api/")) {
		if (path.startsWith("/api/auth")) return null;
		const hasApiKey = event.request.headers.has("x-api-key");
		let auth = null;
		if (hasApiKey) auth = await authProvider.validateApiKey(event.request, db);
		else auth = await authProvider.getSession(event.request, db);
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
		if (graphqlEndpoint) protectedApiRoutes.push(graphqlEndpoint);
		if (protectedApiRoutes.some((route) => path.startsWith(route)) && !auth) return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		if (auth && [
			"POST",
			"PUT",
			"PATCH",
			"DELETE"
		].includes(event.request.method)) {
			if (!["/api/documents/query"].some((route) => path === route)) {
				if (graphqlEndpoint && path.startsWith(graphqlEndpoint)) {
					const requestBody = await event.request.clone().text();
					let isMutation = false;
					try {
						isMutation = (JSON.parse(requestBody).query || "").trim().startsWith("mutation");
					} catch {
						isMutation = requestBody.trim().startsWith("mutation");
					}
					if (isMutation && auth.type === "api_key" && !auth.permissions.includes("write")) return new Response(JSON.stringify({ error: "Forbidden: Write permission required for mutations" }), {
						status: 403,
						headers: { "Content-Type": "application/json" }
					});
				} else if (auth.type === "api_key" && !auth.permissions.includes("write")) return new Response(JSON.stringify({ error: "Forbidden: Write permission required" }), {
					status: 403,
					headers: { "Content-Type": "application/json" }
				});
			}
		}
		if (auth) {
			await hydrateCapabilities(auth, rolesService);
			event.locals.auth = auth;
		}
	}
	if (!event.locals.auth) try {
		const auth = await authProvider.getSession(event.request, db);
		if (auth) {
			await hydrateCapabilities(auth, rolesService);
			event.locals.auth = auth;
		}
	} catch {}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/preview/perspective.js
/**
* Resolve the content perspective for a SvelteKit load function.
*
* Returns `'draft'` only when the `?aphex-preview` query param is present
* AND the request carries a valid authenticated session — so unauthenticated
* visitors who manually append the param always get published content.
*
* @example
* // +page.server.ts
* import { getPreviewPerspective } from '@aphexcms/cms-core/server';
*
* export const load = async ({ locals, url }) => {
*   const perspective = getPreviewPerspective(locals.auth, url);
*   const post = await api.findOne({ perspective });
* };
*/
function getPreviewPerspective(auth, url) {
	const isAuthenticated = auth?.type === "session";
	return url.searchParams.has("aphex-preview") && isAuthenticated ? "draft" : "published";
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/storage/adapters/local-storage-adapter.js
var DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
/**
* Pure local file system storage adapter - only handles files
*/
var LocalStorageAdapter = class {
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
		if (lastDotIndex === -1) return {
			name: filename,
			ext: ""
		};
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
			await stat(join(this.config.basePath, filename));
			return true;
		} catch {
			return false;
		}
	}
	/**
	* Store a file and return storage info
	*/
	async store(data) {
		if (data.size > this.config.maxFileSize) throw new Error(`File too large: ${data.size} bytes. Maximum size: ${this.config.maxFileSize} bytes`);
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
		if (!resolved.startsWith(base + "/") && resolved !== base) throw new Error("Access denied: path outside storage directory");
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
			if (!resolved.startsWith(base + "/") && resolved !== base) throw new Error("Access denied: path outside storage directory");
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
			if (!resolved.startsWith(base + "/") && resolved !== base) return false;
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
			for (const file of files) try {
				const stats = await stat(join(this.config.basePath, file));
				if (stats.isFile()) totalSize += stats.size;
			} catch {}
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
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/storage/providers/storage.js
/**
* Local file system provider
*/
var LocalStorageProvider = class {
	name = "local";
	createAdapter(config) {
		return new LocalStorageAdapter(config);
	}
};
/**
* Storage provider registry
*/
var StorageProviderRegistry = class {
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
};
/**
* Global storage provider registry
*
* External packages can register custom storage providers:
*
* @example
* ```typescript
* import { storageProviders } from '@aphexcms/cms-core/server';
* import { R2StorageProvider } from '@aphexcms/storage-r2';
*
* // Register before creating config
* storageProviders.register(new R2StorageProvider());
* ```
*/
var storageProviders = new StorageProviderRegistry();
/**
* Factory function to create storage adapters
*/
function createStorageAdapter(providerName, config) {
	const provider = storageProviders.get(providerName);
	if (!provider) {
		const available = storageProviders.list();
		throw new Error(`Unknown storage provider: ${providerName}. Available providers: ${available.join(", ")}`);
	}
	return provider.createAdapter(config);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/preview/assets.js
/**
* Collect every asset `_ref` reachable in a value. Image and file fields, and
* portable-text image blocks, all carry `{ asset: { _ref } }`, so one generic walk
* covers them — callers never enumerate field paths by hand.
*/
function collectAssetRefs(value, acc = /* @__PURE__ */ new Set()) {
	if (!value || typeof value !== "object") return acc;
	if (Array.isArray(value)) {
		for (const v of value) collectAssetRefs(v, acc);
		return acc;
	}
	const obj = value;
	const ref = obj.asset?._ref;
	if (typeof ref === "string") acc.add(ref);
	for (const key in obj) collectAssetRefs(obj[key], acc);
	return acc;
}
/**
* Inject resolved `{ url, alt }` onto every `{ asset: { _ref } }` in a value, in place.
* After this, `image.asset.url` / `image.asset.alt` are populated so the frontend reads
* them directly. Mutates the value — pass a clone (e.g. `$state.snapshot`) if the input
* must be preserved. Refs absent from `resolved` are left untouched.
*/
function injectAssetData(value, resolved) {
	if (!value || typeof value !== "object") return;
	if (Array.isArray(value)) {
		for (const v of value) injectAssetData(v, resolved);
		return;
	}
	const obj = value;
	const asset = obj.asset;
	if (asset && typeof asset === "object" && typeof asset._ref === "string") {
		const hit = resolved.get(asset._ref);
		if (hit) {
			asset.url = hit.url;
			if (hit.alt != null) asset.alt = hit.alt;
		}
	}
	for (const key in obj) injectAssetData(obj[key], resolved);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/services/asset-service.js
/**
* Asset service - coordinates storage and database operations
* Maintains separation of concerns while providing unified asset management
*/
var AssetService = class {
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
		let metadata = { ...data.metadata };
		if (assetType === "image") try {
			const imageMetadata = await sharp(data.buffer, { limitInputPixels: 1e8 }).metadata();
			width = imageMetadata.width;
			height = imageMetadata.height;
			metadata = {
				...metadata,
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
		for (const doc of docs) collectAssetRefs(doc, refs);
		if (refs.size === 0) return;
		const resolved = /* @__PURE__ */ new Map();
		await Promise.all([...refs].map(async (ref) => {
			try {
				const asset = await this.findAssetById(organizationId, ref);
				if (asset?.url) resolved.set(ref, {
					url: asset.url,
					alt: asset.alt ?? void 0
				});
			} catch {}
		}));
		for (const doc of docs) injectAssetData(doc, resolved);
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
		if (!asset) return false;
		if (asset.storageAdapter === this.storage.name) try {
			await this.storage.delete(asset.path);
		} catch (error) {
			cmsLogger.warn(`Failed to delete file from storage: ${asset.path}`, error);
		}
		else cmsLogger.warn(`Asset ${id} was stored by '${asset.storageAdapter}' but current adapter is '${this.storage.name}'. File at ${asset.path} may need manual cleanup.`);
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
		const [storageHealthy, databaseHealthy] = await Promise.all([this.storage.isHealthy(), this.database.isHealthy()]);
		return {
			storage: storageHealthy,
			database: databaseHealthy
		};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/services/roles-service.js
/**
* RolesService — caches per-org role capability lookups.
*
* Mirrors HierarchyService's shape so both services share cache and
* in-flight deduplication patterns.
*/
var RolesService = class RolesService {
	db;
	cache;
	ttl;
	static DEFAULT_TTL = 30;
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
			if (cached) return cached;
		}
		const existing = this.inflight.get(key);
		if (existing) return existing;
		const promise = this.resolveFromDb(organizationId, roleName).then(async (caps) => {
			if (this.cache) await this.cache.set(key, caps, this.ttl);
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
		if (!this.cache) return;
		if (roleName) {
			await this.cache.delete(cacheKey(organizationId, roleName));
			return;
		}
		await this.cache.invalidateByPrefix(`roles:${organizationId}:`);
	}
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
};
function cacheKey(organizationId, roleName) {
	return `roles:${organizationId}:${roleName}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/security/secret-crypto.js
var VERSION = "v1";
var ALGORITHM = "aes-256-gcm";
var IV_BYTES = 12;
/** Derive a 32-byte AES key from an arbitrary-length configured secret. */
function deriveKey(secret) {
	return createHash("sha256").update(secret, "utf8").digest();
}
/**
* Encrypt a plaintext string into a self-describing envelope
* `v1:<iv>:<authTag>:<ciphertext>` (base64 segments). Safe to store as an ordinary
* string in the settings blob.
*/
function encryptSecret(plaintext, secret) {
	const key = deriveKey(secret);
	const iv = randomBytes(IV_BYTES);
	const cipher = createCipheriv(ALGORITHM, key, iv);
	const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return [
		VERSION,
		iv.toString("base64"),
		authTag.toString("base64"),
		ciphertext.toString("base64")
	].join(":");
}
/**
* Decrypt an envelope produced by {@link encryptSecret}. Throws if the envelope is
* malformed, the version is unknown, or authentication fails (wrong key / tampering).
*/
function decryptSecret(envelope, secret) {
	const parts = envelope.split(":");
	const [version, ivB64, tagB64, ctB64] = parts;
	if (parts.length !== 4 || version !== VERSION || !ivB64 || !tagB64 || !ctB64) throw new Error("Malformed or unsupported secret envelope");
	const decipher = createDecipheriv(ALGORITHM, deriveKey(secret), Buffer.from(ivB64, "base64"));
	decipher.setAuthTag(Buffer.from(tagB64, "base64"));
	return Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]).toString("utf8");
}
/**
* Whether a stored value looks like one of our encryption envelopes. Lets the service
* tell "already-encrypted ciphertext" from "a value that still needs encrypting"
* without trying to decrypt.
*/
function isEncryptedSecret(value) {
	return typeof value === "string" && value.startsWith(`${VERSION}:`);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/services/plugin-settings-service.js
/** Placeholder shown to the client for a secret that has a stored value. */
var SECRET_MASK = "••••••";
var isSecret = (f) => f.type === "secret";
/**
* Static default for a field — its `initialValue` when that's a plain value (not a
* function/thunk). Secrets never carry a default.
*/
function fieldDefault(field) {
	if (isSecret(field)) return void 0;
	const initial = field.initialValue;
	return typeof initial === "function" ? void 0 : initial;
}
/** Build the defaults object from a declaration's fields (skips undefined). */
function defaultsFor(fields) {
	const out = {};
	for (const field of fields) {
		const value = fieldDefault(field);
		if (value !== void 0) out[field.name] = value;
	}
	return out;
}
/** Raised when a submitted value doesn't match its declared field type. */
var PluginSettingsValidationError = class extends Error {
	issues;
	constructor(issues) {
		super(`Invalid plugin settings: ${issues.join("; ")}`);
		this.issues = issues;
		this.name = "PluginSettingsValidationError";
	}
};
/**
* Check one submitted value against its declared field type, returning an error
* message or `null`.
*
* The declaration is the contract, so the host enforces it here rather than leaving
* every plugin to re-guard values it already described. Without this a `string` field
* would happily store an object, and the plugin would find out at request time, deep
* in its own code, with no useful trace back to the save that caused it.
*
* `null` is always allowed — it's how the panel represents "cleared".
*/
function checkValue(field, value) {
	if (value === null) return null;
	switch (field.type) {
		case "string": {
			if (typeof value !== "string") return `"${field.name}" must be a string`;
			const items = settingsListItems(field);
			if (items.length > 0 && !items.some((item) => item.value === value)) return `"${field.name}" must be one of: ${items.map((i) => i.value).join(", ")}`;
			return null;
		}
		case "text":
			if (typeof value !== "string") return `"${field.name}" must be a string`;
			return null;
		case "number":
			if (typeof value !== "number" || !Number.isFinite(value)) return `"${field.name}" must be a finite number`;
			if (field.min !== void 0 && value < field.min) return `"${field.name}" must be >= ${field.min}`;
			if (field.max !== void 0 && value > field.max) return `"${field.name}" must be <= ${field.max}`;
			return null;
		case "boolean":
			if (typeof value !== "boolean") return `"${field.name}" must be a boolean`;
			return null;
		case "secret":
			if (typeof value !== "string") return `"${field.name}" must be a string`;
			return null;
	}
}
var PluginSettingsService = class {
	db;
	resolver;
	encryptionKey;
	constructor(db, resolver, encryptionKey = null) {
		this.db = db;
		this.resolver = resolver;
		this.encryptionKey = encryptionKey;
	}
	/** Whether secret fields can be stored/read (an encryption key is configured). */
	get secretsEnabled() {
		return typeof this.encryptionKey === "string" && this.encryptionKey.length > 0;
	}
	secretFieldNames(declaration) {
		return new Set(declaration.fields.filter(isSecret).map((f) => f.name));
	}
	/**
	* Effective values for injection into plugin **server** code: declared defaults
	* overlaid with stored values, with secrets **decrypted** to plaintext. Secrets
	* that can't be decrypted (no key, or a bad envelope) are omitted, never returned
	* as ciphertext. This is the sensitive read — never send its result to a client.
	*/
	async get(organizationId, pluginId) {
		const declaration = this.resolver.settingsDeclaration(pluginId);
		const stored = await this.db.getPluginSettings(organizationId, pluginId) ?? {};
		const merged = {
			...declaration ? defaultsFor(declaration.fields) : {},
			...stored
		};
		if (!declaration) return merged;
		const secrets = this.secretFieldNames(declaration);
		for (const name of secrets) {
			const value = merged[name];
			if (!isEncryptedSecret(value)) {
				delete merged[name];
				continue;
			}
			if (!this.secretsEnabled) {
				delete merged[name];
				continue;
			}
			try {
				merged[name] = decryptSecret(value, this.encryptionKey);
			} catch (error) {
				cmsLogger.error(`Failed to decrypt secret "${pluginId}.${name}":`, error);
				delete merged[name];
			}
		}
		return merged;
	}
	/**
	* Effective values for the **client/API**: same merge, but secrets are **masked** —
	* a stored secret becomes {@link SECRET_MASK}, an unset one an empty string. Plaintext
	* secrets never cross this boundary.
	*/
	async getMasked(organizationId, pluginId) {
		const declaration = this.resolver.settingsDeclaration(pluginId);
		const stored = await this.db.getPluginSettings(organizationId, pluginId) ?? {};
		const merged = {
			...declaration ? defaultsFor(declaration.fields) : {},
			...stored
		};
		if (declaration) for (const name of this.secretFieldNames(declaration)) merged[name] = isEncryptedSecret(merged[name]) ? SECRET_MASK : "";
		return merged;
	}
	/**
	* Resolve for the admin surface: the declaration plus masked values plus whether
	* secrets are enabled. `declaration: null` when the plugin declares no settings.
	*/
	async resolve(organizationId, pluginId) {
		return {
			declaration: this.resolver.settingsDeclaration(pluginId) ?? null,
			values: await this.getMasked(organizationId, pluginId),
			secretsEnabled: this.secretsEnabled
		};
	}
	/**
	* Persist a partial edit. Only declared field names are accepted, and each value is
	* type-checked against its declaration — an invalid patch is rejected whole, never
	* applied in part, so a failed save can't leave settings half-written. Secret fields
	* are encrypted; a blank or still-masked secret submission means "leave unchanged"
	* (so the client never has to echo the real value back). Returns the new **masked**
	* values — a save response never leaks a plaintext secret.
	*
	* @throws {PluginSettingsValidationError} when a value doesn't match its field type.
	*/
	async save(organizationId, pluginId, patch) {
		const declaration = this.resolver.settingsDeclaration(pluginId);
		if (!declaration) throw new Error(`Plugin "${pluginId}" has not declared any settings.`);
		const fieldsByName = new Map(declaration.fields.map((f) => [f.name, f]));
		const secrets = this.secretFieldNames(declaration);
		const next = { ...await this.db.getPluginSettings(organizationId, pluginId) ?? {} };
		const issues = [];
		const pending = [];
		for (const [key, value] of Object.entries(patch)) {
			const field = fieldsByName.get(key);
			if (!field) continue;
			if (secrets.has(key)) {
				if (value === "" || value === "••••••" || value == null) continue;
				if (!this.secretsEnabled) throw new Error(`Cannot store secret "${pluginId}.${key}": no secretEncryptionKey configured.`);
			}
			const issue = checkValue(field, value);
			if (issue) issues.push(issue);
			else pending.push([key, value]);
		}
		if (issues.length > 0) throw new PluginSettingsValidationError(issues);
		for (const [key, value] of pending) next[key] = secrets.has(key) ? encryptSecret(String(value), this.encryptionKey) : value;
		await this.db.setPluginSettings(organizationId, pluginId, next);
		return this.getMasked(organizationId, pluginId);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/jobs/run-due-jobs.js
var DEFAULT_BATCH_SIZE = 10;
var DEFAULT_LEASE_MS = 3e4;
var DEFAULT_BASE_BACKOFF_MS = 1e3;
var DEFAULT_MAX_BACKOFF_MS = 3600 * 1e3;
/**
* Exponential backoff with jitter. `attempts` is 1-based (the claim already bumped it),
* so the first retry waits ~base, the second ~2×base, capped at `max`. Up to 25% of
* extra jitter spreads retries so a batch that failed together doesn't re-thunder as one.
*/
function backoffMs(attempts, base, max) {
	const exp = Math.min(max, base * 2 ** (attempts - 1));
	const jitter = Math.random() * exp * .25;
	return Math.min(max, exp + jitter);
}
async function runDueJobs(options) {
	const { databaseAdapter, handlers, logger, workerId, organizationId } = options;
	const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
	const leaseMs = options.leaseMs ?? DEFAULT_LEASE_MS;
	const baseBackoffMs = options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
	const maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
	const now = options.now ?? /* @__PURE__ */ new Date();
	const claimed = await databaseAdapter.claimDueJobs({
		organizationId,
		limit: batchSize,
		workerId,
		leaseMs,
		now
	});
	const result = {
		claimed: claimed.length,
		completed: 0,
		retried: 0,
		failed: 0
	};
	for (const job of claimed) {
		const handler = handlers[job.type];
		if (!handler) {
			logger.error("[jobs]", `No handler registered for job type "${job.type}" (job ${job.id}); dead-lettering.`);
			await databaseAdapter.failJob(job.organizationId, job.id, { error: `No handler registered for job type "${job.type}"` });
			result.failed++;
			continue;
		}
		try {
			await handler({
				job,
				databaseAdapter,
				logger
			});
			await databaseAdapter.completeJob(job.organizationId, job.id);
			result.completed++;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (job.attempts >= job.maxAttempts) {
				logger.error("[jobs]", `Job ${job.id} (${job.type}) failed permanently after ${job.attempts}/${job.maxAttempts} attempts: ${message}`);
				await databaseAdapter.failJob(job.organizationId, job.id, { error: message });
				result.failed++;
			} else {
				const delay = backoffMs(job.attempts, baseBackoffMs, maxBackoffMs);
				const runAt = new Date(now.getTime() + delay);
				logger.warn("[jobs]", `Job ${job.id} (${job.type}) failed (attempt ${job.attempts}/${job.maxAttempts}); retrying in ${Math.round(delay)}ms: ${message}`);
				await databaseAdapter.retryJob(job.organizationId, job.id, {
					runAt,
					error: message
				});
				result.retried++;
			}
		}
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/jobs/relay.js
var DEFAULT_RELAY_BATCH_SIZE = 100;
/**
* Drain one bounded batch of the outbox, fanning each event out to its subscribed consumers.
* Runs one pass and returns — the caller (the same tick as `runJobsBatch`) owns cadence.
*/
async function relayOutbox(services, options = {}) {
	const { databaseAdapter, logger, partResolver } = services;
	const batchSize = options.batchSize ?? DEFAULT_RELAY_BATCH_SIZE;
	const rows = await databaseAdapter.listUnprocessedOutbox({
		organizationId: options.organizationId,
		limit: batchSize
	});
	const result = {
		relayed: 0,
		enqueued: 0
	};
	for (const row of rows) {
		const consumers = partResolver.consumersForEvent(row.eventType);
		const payload = toDeliveryPayload({
			id: row.eventId,
			type: row.eventType,
			organizationId: row.organizationId,
			payload: row.payload,
			correlationId: row.correlationId,
			causationId: row.causationId,
			createdBy: row.createdBy,
			createdAt: row.createdAt
		});
		try {
			await databaseAdapter.withTransaction(async (tx) => {
				for (const consumer of consumers) await tx.scheduleJob({
					organizationId: row.organizationId,
					type: consumerJobType(consumer.id),
					payload,
					idempotencyKey: `evt:${row.eventId}:${consumer.id}`,
					maxAttempts: consumer.maxAttempts,
					correlationId: row.correlationId,
					causationId: row.eventId,
					createdBy: row.createdBy
				});
				await tx.markOutboxProcessed(row.organizationId, row.id);
			});
			result.relayed++;
			result.enqueued += consumers.length;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error("[relay]", `Failed to relay event ${row.eventId} (${row.eventType}); will retry next pass: ${message}`);
		}
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/jobs/run-batch.js
/**
* Run one full worker tick: relay the outbox, then run one bounded batch of due jobs with the
* fully-assembled handler map.
*
* Relaying FIRST means a delivery job an event spawns this tick is already `pending` when the
* job pass runs, so a just-published document's consumers can fire in the same tick rather than
* waiting for the next — at the cost of nothing, since a slow consumer is still its own job.
*
* Handler precedence (later wins): core's built-in handlers (scheduled publish/unpublish) →
* plugin event-consumer deliveries (`aphex/consumer:<id>`) → plugin job handlers
* (`aphex/job/handler`) → the app's `config.jobs.handlers`. So an app can override a plugin,
* and a plugin can override a built-in — the app always has the final say. Consumer delivery
* types are namespaced, so they can't actually collide with the others.
*/
async function runJobsBatch(services, options = {}) {
	const { config, databaseAdapter, logger, localAPI, partResolver, pluginSettingsService } = services;
	const emailAdapter = services.emailAdapter ?? null;
	const relay = await relayOutbox(services, {
		organizationId: options.organizationId,
		batchSize: config.jobs?.relayBatchSize
	});
	const consumerHandlers = {};
	for (const consumer of partResolver.eventConsumers()) consumerHandlers[consumerJobType(consumer.id)] = toConsumerJobHandler(consumer.handler, {
		pluginSettingsService,
		emailAdapter
	});
	return {
		...await runDueJobs({
			databaseAdapter,
			handlers: {
				...createDocumentJobHandlers({ localAPI }),
				...consumerHandlers,
				...partResolver.jobHandlers(),
				...config.jobs?.handlers ?? {}
			},
			logger,
			workerId: options.workerId ?? `runner-${randomUUID()}`,
			organizationId: options.organizationId,
			batchSize: config.jobs?.batchSize,
			leaseMs: config.jobs?.leaseMs
		}),
		relay
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/jobs/embedded-runner.js
/**
* Start the loop. Ticks NEVER overlap: while a tick is in flight the next interval fire is
* skipped, so a slow batch can't stack runs on top of each other. A thrown error in a tick is
* logged and swallowed — the loop must survive a transient DB blip and keep going. The interval
* is `unref`'d where supported so it never keeps the process alive on its own.
*/
function startEmbeddedJobRunner(options) {
	const intervalMs = options.intervalMs ?? 3e3;
	const { logger, getServices } = options;
	let running = false;
	let stopped = false;
	const tick = async () => {
		if (running || stopped) return;
		const services = getServices();
		if (!services) return;
		running = true;
		try {
			const result = await runJobsBatch(services, { workerId: "embedded" });
			if (result.claimed > 0 || result.relay.enqueued > 0) logger.debug(`[jobs:embedded] relayed=${result.relay.enqueued} claimed=${result.claimed} completed=${result.completed} failed=${result.failed} retried=${result.retried}`);
		} catch (error) {
			logger.error("[jobs:embedded] tick failed:", error);
		} finally {
			running = false;
		}
	};
	const handle = setInterval(tick, intervalMs);
	handle.unref?.();
	logger.info(`[jobs:embedded] in-process job loop started (every ${intervalMs}ms)`);
	return { stop() {
		stopped = true;
		clearInterval(handle);
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/schemas.js
var schemasRouter = new Hono().get("/", (c) => {
	const { cmsEngine } = c.var.aphexCMS;
	const schemas = cmsEngine.config.schemaTypes;
	return c.json({
		success: true,
		data: schemas
	});
}).get("/:type", (c) => {
	const type = c.req.param("type");
	const { cmsEngine } = c.var.aphexCMS;
	if (!type) return c.json({ error: "Schema type is required" }, 400);
	cmsLogger.debug("GETTING SCHEMA TYPE FROM: ", type);
	const schema = cmsEngine.getSchemaTypeByName(type);
	cmsLogger.debug("SCHEMA: ", schema);
	if (!schema) return c.json({ error: `Schema type '${type}' not found` }, 404);
	return c.json({
		success: true,
		data: schema
	});
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/documents.js
var jsonRecord = z.record(z.string(), z.unknown());
var documentMetaSchema = z.object({
	status: z.enum([
		"draft",
		"published",
		"unpublished"
	]),
	publishedAt: z.string().nullable().optional(),
	updatedAt: z.string().optional(),
	createdAt: z.string().optional(),
	publishedHash: z.string().nullable().optional(),
	draftHash: z.string().nullable().optional(),
	revision: z.number().optional()
}).passthrough();
var documentSchema = z.object({
	id: z.string(),
	type: z.string(),
	draftData: jsonRecord.nullable().optional(),
	publishedData: jsonRecord.nullable().optional(),
	_meta: documentMetaSchema.optional()
}).passthrough();
var paginationMetaSchema = z.object({
	total: z.number(),
	page: z.number(),
	pageSize: z.number(),
	totalPages: z.number(),
	hasNextPage: z.boolean(),
	hasPrevPage: z.boolean()
});
var listDocumentsQuery = z.object({
	type: z.string().optional(),
	docType: z.string().optional(),
	status: z.string().optional(),
	page: z.coerce.number().int().min(1).optional(),
	pageSize: z.coerce.number().int().min(1).max(200).optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
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
var getDocumentsByIdsQuery = z.object({ ids: z.string().transform((v) => v.split(",").filter(Boolean)).refine((arr) => arr.length > 0 && arr.length <= 100, { message: "ids must contain between 1 and 100 entries" }) });
var createDocumentRequest = z.object({
	type: z.string().min(1),
	draftData: jsonRecord.optional(),
	data: jsonRecord.optional(),
	publish: z.boolean().optional()
}).refine((v) => v.draftData !== void 0 || v.data !== void 0, { message: "Either draftData or data is required" });
z.object({
	success: z.literal(true),
	data: documentSchema,
	validation: z.unknown().optional()
});
z.object({
	success: z.literal(true),
	data: documentSchema
});
var updateDocumentRequest = z.object({
	draftData: jsonRecord.optional(),
	data: jsonRecord.optional(),
	publish: z.boolean().optional(),
	expectedRevision: z.number().optional()
}).refine((v) => v.draftData !== void 0 || v.data !== void 0, { message: "Either draftData or data is required" });
z.object({
	success: z.literal(true),
	data: documentSchema,
	validation: z.unknown().optional()
});
z.object({
	success: z.literal(true),
	message: z.string().optional()
});
var publishDocumentRequest = z.object({ expectedRevision: z.number().optional() });
z.object({
	success: z.literal(true),
	data: documentSchema,
	message: z.string().optional()
});
var unpublishDocumentRequest = z.object({ expectedRevision: z.number().optional() });
z.object({
	success: z.literal(true),
	data: documentSchema,
	message: z.string().optional()
});
var queryDocumentsRequest = z.object({
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
var listVersionsQuery = z.object({
	limit: z.coerce.number().int().min(1).max(200).optional(),
	offset: z.coerce.number().int().min(0).optional()
});
var documentVersionSchema = z.object({
	id: z.string(),
	documentId: z.string(),
	organizationId: z.string(),
	versionNumber: z.number(),
	eventType: z.enum([
		"draft",
		"publish",
		"restore"
	]),
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
var restoreVersionRequest = z.object({ expectedRevision: z.number().optional() });
z.object({
	success: z.literal(true),
	data: documentSchema,
	message: z.string().optional()
});
var scheduleDocumentRequest = z.object({
	/** Which action to run at `runAt`. */
	action: z.enum(["publish", "unpublish"]),
	/** ISO-8601 timestamp for when the action should run. */
	runAt: z.string().datetime()
});
z.object({
	success: z.literal(true),
	data: z.object({
		jobId: z.string(),
		type: z.string(),
		runAt: z.string(),
		status: z.string()
	}),
	message: z.string().optional()
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/documents.js
var DEFAULT_PAGE_SIZE$1 = 20;
var DEFAULT_PAGE$1 = 1;
var documentsRouter = new Hono().get("/", zValidator("query", listDocumentsQuery, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid query parameters",
		issues: result.error.issues
	}, 400);
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
		if (!docType) return c.json({
			success: false,
			error: "Bad Request",
			message: "Document type is required. Use ?type=page or ?docType=page"
		}, 400);
		const collection = localAPI.getCollection(docType);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${docType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
		}, 400);
		const where = {};
		if (status) where.status = { equals: status };
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
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to fetch documents",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).get("/by-ids", zValidator("query", getDocumentsByIdsQuery, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid query parameters",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const { ids } = c.req.valid("query");
		const docs = await localAPI.findDocumentsByIds(context, ids);
		return c.json({
			success: true,
			data: docs
		});
	} catch (error) {
		cmsLogger.error("Failed to batch-fetch documents:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to fetch documents",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).post("/", zValidator("json", createDocumentRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const parsed = c.req.valid("json");
		const documentType = parsed.type;
		const documentData = parsed.draftData ?? parsed.data;
		const shouldPublish = parsed.publish ?? false;
		const collection = localAPI.getCollection(documentType);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${documentType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
		}, 400);
		const result = await collection.create(context, documentData, { publish: shouldPublish });
		return c.json({
			success: true,
			data: result.document,
			validation: result.validation
		}, 201);
	} catch (error) {
		cmsLogger.error("Failed to create document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		if (error instanceof Error && error.message.includes("validation errors")) return c.json({
			success: false,
			error: "Validation failed",
			message: error.message
		}, 400);
		return c.json({
			success: false,
			error: "Failed to create document",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/db/interfaces/document.js
/**
* Thrown when a write's `expectedRevision` no longer matches the document's
* current revision — another writer (a second tab, an AI agent, a concurrent
* request) saved in between the caller's read and this write. Callers should
* surface this distinctly from a validation error: re-fetch and let the user
* decide, never silently retry with an overwrite.
*/
var RevisionConflictError = class extends Error {
	documentId;
	expectedRevision;
	currentRevision;
	constructor(message, documentId, expectedRevision, currentRevision) {
		super(message);
		this.documentId = documentId;
		this.expectedRevision = expectedRevision;
		this.currentRevision = currentRevision;
		this.name = "RevisionConflictError";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/documents-by-id.js
var documentsByIdRouter = new Hono().get("/:id", async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Document ID is required"
		}, 400);
		const depthParam = c.req.query("depth");
		const depth = depthParam ? Math.max(0, Math.min(parseInt(depthParam), 5)) : 0;
		const perspective = c.req.query("perspective") || "draft";
		const result = await localAPI.findDocumentById(context, id);
		if (!result) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(result.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${result.type}' not found`
		}, 400);
		const document = await collection.findByID(context, id, {
			depth,
			perspective
		});
		if (!document) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		return c.json({
			success: true,
			data: document
		});
	} catch (error) {
		cmsLogger.error("Failed to fetch document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to fetch document",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).put("/:id", zValidator("json", updateDocumentRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Document ID is required"
		}, 400);
		const parsed = c.req.valid("json");
		const documentData = parsed.draftData ?? parsed.data;
		if (!documentData) return c.json({
			success: false,
			error: "Document data is required"
		}, 400);
		const shouldPublish = parsed.publish ?? false;
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${found.type}' not found`
		}, 400);
		const result = await collection.update(context, id, documentData, {
			publish: shouldPublish,
			expectedRevision: parsed.expectedRevision
		});
		if (!result) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		return c.json({
			success: true,
			data: result.document,
			validation: result.validation
		});
	} catch (error) {
		cmsLogger.error("Failed to update document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		if (error instanceof RevisionConflictError) return c.json({
			success: false,
			error: "Conflict",
			message: error.message,
			currentRevision: error.currentRevision
		}, 409);
		if (error instanceof Error && error.message.includes("validation errors")) return c.json({
			success: false,
			error: "Validation failed",
			message: error.message
		}, 400);
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
		if (!id) return c.json({
			success: false,
			error: "Document ID is required"
		}, 400);
		const result = await localAPI.findDocumentById(context, id);
		if (!result) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(result.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${result.type}' not found`
		}, 400);
		if (!await collection.delete(context, id)) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		return c.json({
			success: true,
			message: "Document deleted successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to delete document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		if (error instanceof SingletonOperationError) return c.json({
			success: false,
			error: "Singleton document",
			message: error.message
		}, 400);
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
		if (!id) return c.json({
			success: false,
			error: "Document ID is required"
		}, 400);
		const refs = await localAPI.getBackReferences(context, id);
		return c.json({
			success: true,
			data: refs
		});
	} catch (error) {
		cmsLogger.error("Failed to fetch back-references:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to fetch back-references",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/documents-publish.js
var documentsPublishRouter = new Hono().post("/:id/schedule", async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Missing document ID"
		}, 400);
		const parsed = scheduleDocumentRequest.safeParse(await c.req.json().catch(() => null));
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid request",
			issues: parsed.error.issues
		}, 400);
		const { action, runAt } = parsed.data;
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${found.type}' not found`
		}, 400);
		const when = new Date(runAt);
		const job = action === "publish" ? await collection.schedulePublish(context, id, when) : await collection.scheduleUnpublish(context, id, when);
		return c.json({
			success: true,
			data: {
				jobId: job.id,
				type: job.type,
				runAt: job.runAt.toISOString(),
				status: job.status
			},
			message: `Document ${action} scheduled for ${job.runAt.toISOString()}`
		});
	} catch (error) {
		cmsLogger.error("Failed to schedule document action:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to schedule document action",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).get("/:id/schedule", async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Missing document ID"
		}, 400);
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type"
		}, 400);
		const jobs = await collection.getScheduled(context, id);
		return c.json({
			success: true,
			data: jobs.map((j) => ({
				jobId: j.id,
				type: j.type,
				runAt: j.runAt.toISOString(),
				status: j.status,
				createdAt: j.createdAt.toISOString()
			}))
		});
	} catch (error) {
		cmsLogger.error("Failed to read document schedule:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to read document schedule"
		}, 500);
	}
}).delete("/:id/schedule", async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Missing document ID"
		}, 400);
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found"
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type"
		}, 400);
		const cancelled = await collection.cancelScheduled(context, id);
		return c.json({
			success: true,
			data: { cancelled }
		});
	} catch (error) {
		cmsLogger.error("Failed to cancel document schedule:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to cancel document schedule"
		}, 500);
	}
}).post("/:id/publish", async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Missing document ID",
			message: "Document ID is required"
		}, 400);
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found",
			message: "Document may not exist"
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${found.type}' not found`
		}, 400);
		const body = await c.req.json().catch(() => ({}));
		const parsed = publishDocumentRequest.safeParse(body);
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid request",
			issues: parsed.error.issues
		}, 400);
		const publishedDocument = await collection.publish(context, id, { expectedRevision: parsed.data.expectedRevision });
		if (!publishedDocument) return c.json({
			success: false,
			error: "Document not found or cannot be published",
			message: "Document may not have draft content to publish"
		}, 404);
		return c.json({
			success: true,
			data: publishedDocument,
			message: "Document published successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to publish document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		if (error instanceof RevisionConflictError) return c.json({
			success: false,
			error: "Conflict",
			message: error.message,
			currentRevision: error.currentRevision
		}, 409);
		if (error instanceof Error && error.message.includes("validation errors")) return c.json({
			success: false,
			error: "Cannot publish: validation errors",
			message: error.message
		}, 400);
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
		if (!id) return c.json({
			success: false,
			error: "Missing document ID",
			message: "Document ID is required"
		}, 400);
		const found = await localAPI.findDocumentById(context, id);
		if (!found) return c.json({
			success: false,
			error: "Document not found",
			message: `No document found with ID: ${id}`
		}, 404);
		const collection = localAPI.getCollection(found.type);
		if (!collection) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${found.type}' not found`
		}, 400);
		const body = await c.req.json().catch(() => ({}));
		const parsed = unpublishDocumentRequest.safeParse(body);
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid request",
			issues: parsed.error.issues
		}, 400);
		const unpublishedDocument = await collection.unpublish(context, id, { expectedRevision: parsed.data.expectedRevision });
		if (!unpublishedDocument) return c.json({
			success: false,
			error: "Document not found",
			message: `No document found with ID: ${id}`
		}, 404);
		return c.json({
			success: true,
			data: unpublishedDocument,
			message: "Document unpublished successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to unpublish document:", error);
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		if (error instanceof RevisionConflictError) return c.json({
			success: false,
			error: "Conflict",
			message: error.message,
			currentRevision: error.currentRevision
		}, 409);
		return c.json({
			success: false,
			error: "Failed to unpublish document",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/documents-query.js
var DEFAULT_PAGE_SIZE = 20;
var DEFAULT_PAGE = 1;
/**
* POST /api/documents/query — Advanced document querying with complex
* filters. Body shape mirrors LocalAPI's `FindOptions`.
*/
var documentsQueryRouter = new Hono().post("/query", zValidator("json", queryDocumentsRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Bad Request",
		message: "Document type is required in request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { localAPI } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const body = c.req.valid("json");
		const documentType = body.type;
		if (!localAPI.hasCollection(documentType)) return c.json({
			success: false,
			error: "Invalid document type",
			message: `Collection '${documentType}' not found. Available: ${localAPI.getCollectionNames().join(", ")}`
		}, 400);
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
		if (error instanceof PermissionError) return c.json({
			success: false,
			error: "Forbidden",
			message: error.message
		}, 403);
		return c.json({
			success: false,
			error: "Failed to query documents",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/document-versions.js
var documentVersionsRouter = new Hono().get("/:id/versions", zValidator("query", listVersionsQuery, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid query parameters",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { localAPI, databaseAdapter } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Document ID is required"
		}, 400);
		const q = c.req.valid("query");
		const limit = q.limit ?? 25;
		const offset = q.offset ?? 0;
		const result = await localAPI.versionService.listVersions(databaseAdapter, context.organizationId, id, {
			limit,
			offset
		});
		const userIds = [...new Set(result.versions.map((v) => v.createdBy).filter(Boolean))];
		const userMap = /* @__PURE__ */ new Map();
		if (userIds.length > 0 && c.var.aphexCMS.auth) await Promise.all(userIds.map(async (userId) => {
			if (userId.startsWith("apikey:")) {
				userMap.set(userId, "API Key");
				return;
			}
			try {
				const user = await c.var.aphexCMS.auth.getUserById(userId);
				if (user) userMap.set(userId, user.name || user.email);
			} catch {}
		}));
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
		return c.json({
			success: false,
			error: "Failed to list versions"
		}, 500);
	}
}).get("/:id/versions/:version", async (c) => {
	try {
		const { localAPI, databaseAdapter } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		const version = c.req.param("version");
		if (!id || !version) return c.json({
			success: false,
			error: "Document ID and version number are required"
		}, 400);
		const versionNumber = parseInt(version);
		if (isNaN(versionNumber)) return c.json({
			success: false,
			error: "Version must be a number"
		}, 400);
		const result = await localAPI.versionService.getVersion(databaseAdapter, context.organizationId, id, versionNumber);
		if (!result) return c.json({
			success: false,
			error: "Version not found"
		}, 404);
		return c.json({
			success: true,
			data: result
		});
	} catch (error) {
		cmsLogger.error("Failed to get document version:", error);
		return c.json({
			success: false,
			error: "Failed to get version"
		}, 500);
	}
}).post("/:id/versions/:version/restore", async (c) => {
	try {
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!hasCapability(auth, "document.update")) return c.json({
			success: false,
			error: "Forbidden: document.update capability required"
		}, 403);
		const { localAPI, databaseAdapter } = c.var.aphexCMS;
		const context = authToContext(c.var.auth);
		const id = c.req.param("id");
		const version = c.req.param("version");
		if (!id || !version) return c.json({
			success: false,
			error: "Document ID and version number are required"
		}, 400);
		const versionNumber = parseInt(version);
		if (isNaN(versionNumber)) return c.json({
			success: false,
			error: "Version must be a number"
		}, 400);
		const body = await c.req.json().catch(() => ({}));
		const parsed = restoreVersionRequest.safeParse(body);
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid request",
			issues: parsed.error.issues
		}, 400);
		const document = await localAPI.versionService.restoreVersion(databaseAdapter, context.organizationId, id, versionNumber, context.user?.id, parsed.data.expectedRevision);
		if (!document) return c.json({
			success: false,
			error: "Version not found or restore failed"
		}, 404);
		return c.json({
			success: true,
			data: document,
			message: `Restored to version ${versionNumber}`
		});
	} catch (error) {
		cmsLogger.error("Failed to restore document version:", error);
		if (error instanceof RevisionConflictError) return c.json({
			success: false,
			error: "Conflict",
			message: error.message,
			currentRevision: error.currentRevision
		}, 409);
		return c.json({
			success: false,
			error: "Failed to restore version"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/assets.js
var assetSchema = z.object({
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
var assetReferenceSchema = z.object({
	documentId: z.string(),
	type: z.string(),
	title: z.string(),
	status: z.string().nullable()
});
var listAssetsQuery = z.object({
	assetType: z.enum(["image", "file"]).optional(),
	mimeType: z.string().optional(),
	search: z.string().optional(),
	includeSystem: z.union([z.boolean(), z.enum(["true", "false"]).transform((value) => value === "true")]).optional(),
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
var updateAssetRequest = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	alt: z.string().optional(),
	creditLine: z.string().optional()
});
z.object({
	success: z.literal(true),
	data: assetSchema
});
z.object({ success: z.literal(true) });
var bulkDeleteAssetsRequest = z.object({ ids: z.array(z.string()).min(1).max(100) });
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
var assetReferenceCountsRequest = z.object({ ids: z.array(z.string()) });
z.object({
	success: z.literal(true),
	data: z.record(z.string(), z.number())
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/assets.js
var assetsRouter = new Hono().get("/", zValidator("query", listAssetsQuery, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid query parameters",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { assetService } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		const q = c.req.valid("query");
		const filters = {
			assetType: q.assetType,
			mimeType: q.mimeType,
			search: q.search,
			includeSystem: q.includeSystem ?? false,
			limit: q.limit ?? 20,
			offset: q.offset ?? 0
		};
		const { databaseAdapter } = c.var.aphexCMS;
		const [fetchedAssets, total] = await Promise.all([assetService.findAssets(auth.organizationId, filters), databaseAdapter.countAssets(auth.organizationId, {
			assetType: filters.assetType,
			mimeType: filters.mimeType,
			search: filters.search,
			includeSystem: filters.includeSystem
		})]);
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
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!hasCapability(auth, "asset.upload")) return c.json({
			success: false,
			error: "Forbidden: asset.upload capability required"
		}, 403);
		const formData = await c.req.formData();
		const file = formData.get("file");
		if (!file) return c.json({
			success: false,
			error: "No file provided"
		}, 400);
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
		if (!validation.valid) return c.json({
			success: false,
			error: validation.error
		}, 400);
		const safeMimeType = validation.detectedMimeType || "application/octet-stream";
		const title = formData.get("title") || void 0;
		const description = formData.get("description") || void 0;
		const alt = formData.get("alt") || void 0;
		const creditLine = formData.get("creditLine") || void 0;
		const schemaType = formData.get("schemaType") || void 0;
		const fieldPath = formData.get("fieldPath") || void 0;
		const system = formData.get("system") === "true" || void 0;
		const usage = formData.get("usage") || void 0;
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
				fieldPath,
				system,
				usage
			}
		};
		const asset = await assetService.uploadAsset(targetOrganizationId, uploadData);
		return c.json({
			success: true,
			data: asset
		});
	} catch (error) {
		cmsLogger.error("Asset upload failed:", error);
		return c.json({
			success: false,
			error: "Asset upload failed",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/assets-by-id.js
var assetsByIdRouter = new Hono().get("/:id", async (c) => {
	try {
		const { assetService } = c.var.aphexCMS;
		const auth = c.var.auth;
		const id = c.req.param("id");
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!id) return c.json({
			success: false,
			error: "Asset ID is required"
		}, 400);
		const asset = await assetService.findAssetById(auth.organizationId, id);
		if (!asset) return c.json({
			success: false,
			error: "Asset not found"
		}, 404);
		return c.json({
			success: true,
			data: asset
		});
	} catch (error) {
		cmsLogger.error("[Asset API] Error fetching asset:", error);
		return c.json({
			success: false,
			error: "Failed to fetch asset"
		}, 500);
	}
}).delete("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const { assetService, databaseAdapter, localAPI } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!hasCapability(auth, "asset.delete")) return c.json({
			success: false,
			error: "Forbidden: asset.delete capability required"
		}, 403);
		if (!id) return c.json({
			success: false,
			error: "Asset ID is required"
		}, 400);
		if (databaseAdapter.findDocumentsReferencingAsset) {
			const knownTypes = localAPI.getCollectionNames();
			const refs = await databaseAdapter.findDocumentsReferencingAsset(auth.organizationId, id, knownTypes);
			if (refs.length > 0) return c.json({
				success: false,
				error: `Cannot delete asset — it is referenced by ${refs.length} document${refs.length > 1 ? "s" : ""}`
			}, 409);
		}
		if (!await assetService.deleteAsset(auth.organizationId, id)) return c.json({
			success: false,
			error: "Asset not found or could not be deleted"
		}, 404);
		if (databaseAdapter.clearAssetFromPublishedData) {
			const cleared = await databaseAdapter.clearAssetFromPublishedData(auth.organizationId, id);
			console.log(`[Asset Delete] Cleared asset ${id} from ${cleared} document(s) publishedData`);
		} else console.log(`[Asset Delete] clearAssetFromPublishedData not available on adapter`);
		return c.json({ success: true });
	} catch (error) {
		cmsLogger.error("Error deleting asset:", error);
		return c.json({
			success: false,
			error: "Failed to delete asset"
		}, 500);
	}
}).patch("/:id", zValidator("json", updateAssetRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { assetService } = c.var.aphexCMS;
		const auth = c.var.auth;
		const id = c.req.param("id");
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!hasCapability(auth, "asset.upload")) return c.json({
			success: false,
			error: "Forbidden: asset.upload capability required"
		}, 403);
		if (!id) return c.json({
			success: false,
			error: "Asset ID is required"
		}, 400);
		const { title, description, alt, creditLine } = c.req.valid("json");
		let updatedAsset;
		if (auth.type === "session") updatedAsset = await assetService.updateAssetMetadata(auth.organizationId, id, {
			title,
			description,
			alt,
			creditLine,
			updatedBy: auth.user.id
		});
		else updatedAsset = await assetService.updateAssetMetadata(auth.organizationId, id, {
			title,
			description,
			alt,
			creditLine,
			updatedBy: auth.keyId
		});
		if (!updatedAsset) return c.json({
			success: false,
			error: "Asset not found"
		}, 404);
		return c.json({
			success: true,
			data: updatedAsset
		});
	} catch (error) {
		cmsLogger.error("Error updating asset:", error);
		return c.json({
			success: false,
			error: "Failed to update asset"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/assets-bulk.js
var assetsBulkRouter = new Hono().delete("/bulk", zValidator("json", bulkDeleteAssetsRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "No asset IDs provided",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { assetService, databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		if (!hasCapability(auth, "asset.delete")) return c.json({
			success: false,
			error: "Forbidden: asset.delete capability required"
		}, 403);
		const { ids } = c.req.valid("json");
		let referencedIds = [];
		if (databaseAdapter.countDocumentReferencesForAssets) {
			const counts = await databaseAdapter.countDocumentReferencesForAssets(auth.organizationId, ids);
			referencedIds = ids.filter((id) => (counts[id] || 0) > 0);
		}
		if (referencedIds.length > 0) return c.json({
			success: false,
			error: `Cannot delete ${referencedIds.length} asset${referencedIds.length > 1 ? "s" : ""} because ${referencedIds.length > 1 ? "they are" : "it is"} still referenced by documents`,
			referencedIds
		}, 409);
		const results = {
			deleted: 0,
			failed: 0
		};
		for (const id of ids) try {
			if (await assetService.deleteAsset(auth.organizationId, id)) results.deleted++;
			else results.failed++;
		} catch {
			results.failed++;
		}
		return c.json({
			success: true,
			data: results
		});
	} catch (error) {
		cmsLogger.error("Bulk delete failed:", error);
		return c.json({
			success: false,
			error: "Bulk delete failed"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/assets-references.js
/**
* Asset references endpoints. Two distinct paths sharing one router file:
*   - GET  /:id/references          → docs that reference one asset
*   - POST /references/counts       → batch reference counts for many ids
*
* Mounted under `/assets`, so the wire paths are
* `/api/assets/:id/references` and `/api/assets/references/counts`.
*
* Order matters in createAphexApi(): mount this BEFORE assetsByIdRouter so
* `/references/counts` doesn't get captured as `:id = "references"`.
*/
var assetsReferencesRouter = new Hono().get("/:id/references", async (c) => {
	try {
		const { databaseAdapter, localAPI } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		const id = c.req.param("id");
		if (!id) return c.json({
			success: false,
			error: "Asset ID is required"
		}, 400);
		if (!databaseAdapter.findDocumentsReferencingAsset) return c.json({
			success: true,
			data: {
				references: [],
				total: 0
			}
		});
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
		return c.json({
			success: false,
			error: "Failed to find asset references"
		}, 500);
	}
}).post("/references/counts", zValidator("json", assetReferenceCountsRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter, localAPI } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Unauthorized"
		}, 401);
		const { ids } = c.req.valid("json");
		if (ids.length === 0) return c.json({
			success: true,
			data: {}
		});
		if (!databaseAdapter.countDocumentReferencesForAssets) {
			const counts = {};
			for (const id of ids) counts[id] = 0;
			return c.json({
				success: true,
				data: counts
			});
		}
		const knownTypes = localAPI.getCollectionNames();
		const counts = await databaseAdapter.countDocumentReferencesForAssets(auth.organizationId, ids, knownTypes);
		return c.json({
			success: true,
			data: counts
		});
	} catch (error) {
		cmsLogger.error("Failed to count asset references:", error);
		return c.json({
			success: false,
			error: "Failed to count asset references"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/organizations.js
var roleNameSchema$1 = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9 _-]+$/);
var organizationRoleSchema = roleNameSchema$1;
var invitableRoleSchema = roleNameSchema$1.refine((v) => v !== "owner", { message: "owner cannot be assigned via invitation" });
var metadataSchema = z.record(z.string(), z.unknown());
var createOrganizationRequest = z.object({
	name: z.string().min(1),
	slug: z.string().min(1),
	metadata: metadataSchema.nullable().optional(),
	parentOrganizationId: z.string().optional()
});
var updateOrganizationRequest = z.object({
	name: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	metadata: metadataSchema.nullable().optional()
}).refine((v) => v.name !== void 0 || v.slug !== void 0 || v.metadata !== void 0, { message: "At least one field (name, slug, metadata) is required" });
var switchOrganizationRequest = z.object({ organizationId: z.string().min(1) });
var inviteMemberRequest = z.object({
	email: z.string().email(),
	role: invitableRoleSchema
});
var cancelInvitationRequest = z.object({ invitationId: z.string().min(1) });
var removeMemberRequest = z.object({ userId: z.string().min(1) });
var updateMemberRoleRequest = z.object({
	userId: z.string().min(1),
	role: organizationRoleSchema
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/organizations.js
var organizationsRouter = new Hono().get("/", async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const organizations = (await databaseAdapter.findUserOrganizations(auth.user.id)).map((m) => ({
			id: m.organization.id,
			name: m.organization.name,
			slug: m.organization.slug,
			metadata: m.organization.metadata,
			role: m.member.role,
			joinedAt: m.member.createdAt,
			isActive: m.organization.id === auth.organizationId
		}));
		return c.json({
			success: true,
			data: organizations
		});
	} catch (error) {
		cmsLogger.error("Failed to fetch organizations:", error);
		return c.json({
			success: false,
			error: "Failed to fetch organizations",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).post("/", zValidator("json", createOrganizationRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "Organization name and slug are required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (auth.user.role !== "super_admin") return c.json({
			success: false,
			error: "Forbidden",
			message: "Only super admins can create organizations"
		}, 403);
		const body = c.req.valid("json");
		if (await databaseAdapter.findOrganizationBySlug(body.slug)) return c.json({
			success: false,
			error: "Slug already exists",
			message: `Organization with slug '${body.slug}' already exists`
		}, 409);
		const newOrganization = await databaseAdapter.createOrganization({
			name: body.name,
			slug: body.slug,
			metadata: body.metadata || null,
			parentOrganizationId: auth.organizationId,
			createdBy: auth.user.id
		});
		await databaseAdapter.seedBuiltinRoles(newOrganization.id, c.var.aphexCMS.cmsEngine.ownerCapabilities());
		await databaseAdapter.addMember({
			organizationId: newOrganization.id,
			userId: auth.user.id,
			role: "owner"
		});
		await databaseAdapter.updateUserSession(auth.user.id, newOrganization.id);
		return c.json({
			success: true,
			data: newOrganization
		}, 201);
	} catch (error) {
		cmsLogger.error("Failed to create organization:", error);
		return c.json({
			success: false,
			error: "Failed to create organization",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/organizations-by-id.js
var organizationsByIdRouter = new Hono().get("/:id", async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		const id = c.req.param("id");
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!id) return c.json({
			success: false,
			error: "Missing required field",
			message: "Organization ID is required"
		}, 400);
		if (!await databaseAdapter.findUserMembership(auth.user.id, id)) return c.json({
			success: false,
			error: "Forbidden",
			message: "You are not a member of this organization"
		}, 403);
		const organization = await databaseAdapter.findOrganizationById(id);
		if (!organization) return c.json({
			success: false,
			error: "Organization not found"
		}, 404);
		return c.json({
			success: true,
			data: organization
		});
	} catch (error) {
		cmsLogger.error("Failed to fetch organization:", error);
		return c.json({
			success: false,
			error: "Failed to fetch organization",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).patch("/:id", zValidator("json", updateOrganizationRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		const id = c.req.param("id");
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!id) return c.json({
			success: false,
			error: "Missing required field",
			message: "Organization ID is required"
		}, 400);
		if (!await databaseAdapter.findUserMembership(auth.user.id, id) || !hasCapability(auth, "org.settings")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to update organization settings"
		}, 403);
		const body = c.req.valid("json");
		if (body.slug) {
			const existingOrg = await databaseAdapter.findOrganizationBySlug(body.slug);
			if (existingOrg && existingOrg.id !== id) return c.json({
				success: false,
				error: "Slug already exists",
				message: `Organization with slug '${body.slug}' already exists`
			}, 409);
		}
		const updateData = {};
		if (body.name !== void 0) updateData.name = body.name;
		if (body.slug !== void 0) updateData.slug = body.slug;
		if (body.metadata !== void 0) updateData.metadata = body.metadata;
		const updatedOrganization = await databaseAdapter.updateOrganization(id, updateData);
		if (!updatedOrganization) return c.json({
			success: false,
			error: "Organization not found"
		}, 404);
		return c.json({
			success: true,
			data: updatedOrganization
		});
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
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!id) return c.json({
			success: false,
			error: "Missing required field",
			message: "Organization ID is required"
		}, 400);
		const membership = await databaseAdapter.findUserMembership(auth.user.id, id);
		if (!membership || membership.role !== "owner") return c.json({
			success: false,
			error: "Forbidden",
			message: "Only owners can delete an organization"
		}, 403);
		const members = await databaseAdapter.findOrganizationMembers(id);
		for (const member of members) if ((await databaseAdapter.findUserSession(member.userId))?.activeOrganizationId === id) {
			const remainingOrgs = (await databaseAdapter.findUserOrganizations(member.userId)).filter((org) => org.organization.id !== id);
			if (remainingOrgs.length > 0 && remainingOrgs[0]) await databaseAdapter.updateUserSession(member.userId, remainingOrgs[0].organization.id);
			else await databaseAdapter.deleteUserSession(member.userId);
		}
		await databaseAdapter.removeAllMembers(id);
		await databaseAdapter.removeAllInvitations(id);
		await databaseAdapter.deleteOrganization(id);
		return c.json({
			success: true,
			message: "Organization deleted successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to delete organization:", error);
		return c.json({
			success: false,
			error: "Failed to delete organization",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/organizations-invitations.js
/**
* Note: in studio, invitations are wrapped by a SvelteKit `+server.ts`
* that adds email sending after the invite row is created. While that
* shim exists, this Hono router sits dormant (specific SK routes win
* over the catch-all). Phase 5 moves the wrapper into `config.api`.
*/
var organizationsInvitationsRouter = new Hono().post("/invitations", zValidator("json", inviteMemberRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "email and role are required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "member.invite")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to invite members"
		}, 403);
		const body = c.req.valid("json");
		if (!await databaseAdapter.findRoleByName(auth.organizationId, body.role)) return c.json({
			success: false,
			error: "Unknown role",
			message: `No role named "${body.role}" in this organization`
		}, 400);
		if (body.email.toLowerCase() === auth.user.email.toLowerCase()) return c.json({
			success: false,
			error: "Invalid invitation",
			message: "You cannot invite yourself"
		}, 400);
		if (c.var.aphexCMS.auth) {
			const existingUser = await c.var.aphexCMS.auth.getUserByEmail(body.email);
			if (existingUser) {
				if (await databaseAdapter.findUserMembership(existingUser.id, auth.organizationId)) return c.json({
					success: false,
					error: "Already a member",
					message: "This user is already a member of the organization"
				}, 400);
			}
		}
		if ((await databaseAdapter.findOrganizationInvitations(auth.organizationId)).find((inv) => inv.email.toLowerCase() === body.email.toLowerCase() && inv.acceptedAt === null)) return c.json({
			success: false,
			error: "Already invited",
			message: "This email has already been invited to the organization"
		}, 400);
		const token = crypto.randomUUID();
		const invitation = await databaseAdapter.createInvitation({
			organizationId: auth.organizationId,
			email: body.email.toLowerCase(),
			role: body.role,
			invitedBy: auth.user.id,
			token,
			expiresAt: new Date(Date.now() + 10080 * 60 * 1e3)
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
	if (!result.success) return c.json({
		success: false,
		error: "Missing required field",
		message: "invitationId is required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "member.invite")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to cancel invitations"
		}, 403);
		const body = c.req.valid("json");
		if (!await databaseAdapter.deleteInvitation(body.invitationId, auth.organizationId)) return c.json({
			success: false,
			error: "Invitation not found"
		}, 404);
		return c.json({
			success: true,
			message: "Invitation canceled successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to cancel invitation:", error);
		return c.json({
			success: false,
			error: "Failed to cancel invitation",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/organizations-members.js
var organizationsMembersRouter = new Hono().get("/members", async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const members = await databaseAdapter.findOrganizationMembers(auth.organizationId);
		return c.json({
			success: true,
			data: members
		});
	} catch (error) {
		cmsLogger.error("Failed to fetch organization members:", error);
		return c.json({
			success: false,
			error: "Failed to fetch members",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).delete("/members", zValidator("json", removeMemberRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Missing required field",
		message: "userId is required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "member.remove")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to remove members"
		}, 403);
		const body = c.req.valid("json");
		if (body.userId === auth.user.id) return c.json({
			success: false,
			error: "Invalid operation",
			message: "You cannot remove yourself from the organization"
		}, 400);
		const targetMember = await databaseAdapter.findUserMembership(body.userId, auth.organizationId);
		if (!targetMember) return c.json({
			success: false,
			error: "Member not found",
			message: "User is not a member of this organization"
		}, 404);
		if (auth.organizationRole === "admin" && targetMember.role === "owner") return c.json({
			success: false,
			error: "Forbidden",
			message: "Admins cannot remove owners"
		}, 403);
		if (!await databaseAdapter.removeMember(auth.organizationId, body.userId)) return c.json({
			success: false,
			error: "Failed to remove member"
		}, 500);
		if ((await databaseAdapter.findUserSession(body.userId))?.activeOrganizationId === auth.organizationId) {
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
		return c.json({
			success: true,
			message: "Member removed successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to remove member:", error);
		return c.json({
			success: false,
			error: "Failed to remove member",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).patch("/members", zValidator("json", updateMemberRoleRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "userId and role are required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "member.changeRole")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to change member roles"
		}, 403);
		const body = c.req.valid("json");
		if (body.role === "owner" && auth.organizationRole !== "owner") return c.json({
			success: false,
			error: "Forbidden",
			message: "Only owners can promote members to owner"
		}, 403);
		if (!await databaseAdapter.findRoleByName(auth.organizationId, body.role)) return c.json({
			success: false,
			error: "Unknown role",
			message: `No role named "${body.role}" in this organization`
		}, 400);
		if (body.userId === auth.user.id) return c.json({
			success: false,
			error: "Invalid operation",
			message: "You cannot change your own role"
		}, 400);
		const targetMember = await databaseAdapter.findUserMembership(body.userId, auth.organizationId);
		if (!targetMember) return c.json({
			success: false,
			error: "Member not found",
			message: "User is not a member of this organization"
		}, 404);
		if (auth.organizationRole === "admin" && targetMember.role === "owner") return c.json({
			success: false,
			error: "Forbidden",
			message: "Admins cannot modify owner roles"
		}, 403);
		const updatedMember = await databaseAdapter.updateMemberRole(auth.organizationId, body.userId, body.role);
		if (!updatedMember) return c.json({
			success: false,
			error: "Failed to update role"
		}, 500);
		return c.json({
			success: true,
			data: updatedMember
		});
	} catch (error) {
		cmsLogger.error("Failed to update member role:", error);
		return c.json({
			success: false,
			error: "Failed to update role",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/organizations-switch.js
var organizationsSwitchRouter = new Hono().post("/switch", zValidator("json", switchOrganizationRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Missing required field",
		message: "organizationId is required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const body = c.req.valid("json");
		const membership = await databaseAdapter.findUserMembership(auth.user.id, body.organizationId);
		if (!membership) return c.json({
			success: false,
			error: "Access denied",
			message: "You are not a member of this organization"
		}, 403);
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
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/roles.js
var capabilitySchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9]+([.:][a-zA-Z0-9]+)+$/, { message: "Invalid capability id format" });
var roleNameSchema = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9 _-]+$/, { message: "Role name may only contain letters, numbers, spaces, underscores, and hyphens" });
var createRoleRequest = z.object({
	name: roleNameSchema,
	description: z.string().max(500).nullable().optional(),
	capabilities: z.array(capabilitySchema).default([])
}).transform((v) => ({
	...v,
	capabilities: normalizeCapabilities(v.capabilities)
}));
var updateRoleRequest = z.object({
	description: z.string().max(500).nullable().optional(),
	capabilities: z.array(capabilitySchema).optional()
}).refine((v) => v.description !== void 0 || v.capabilities !== void 0, { message: "At least one field (description, capabilities) is required" }).transform((v) => ({
	...v,
	capabilities: v.capabilities ? normalizeCapabilities(v.capabilities) : void 0
}));
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/roles.js
/**
* Authoritative capability validation against the runtime registry. The zod schema
* only guards the id *format*; this rejects ids that don't actually exist in the
* catalog (built-in + plugin-declared), so a role can't be granted a phantom
* capability. Returns a 400 Response to short-circuit, or null when all are valid.
*/
function rejectUnknownCapabilities(c, caps) {
	const known = new Set(c.var.aphexCMS.partResolver.capabilityCatalog().map((d) => d.id));
	const unknown = caps.filter((cap) => !known.has(cap));
	if (unknown.length === 0) return null;
	return c.json({
		success: false,
		error: "Unknown capability",
		message: `These capabilities are not registered: ${unknown.join(", ")}`,
		unknownCapabilities: unknown
	}, 400);
}
/**
* Roles router. Combines `/roles` (list, create) and `/roles/:name`
* (update, delete) so the wire URLs are
* `/api/roles` and `/api/roles/:name`.
*
* Note: built-in role names cannot be deleted; they're seeded on every
* org and a custom row with the same name would be unreachable.
*/
var rolesRouter = new Hono().get("/", async (c) => {
	try {
		const { rolesService } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const roles = await rolesService.listRoles(auth.organizationId);
		return c.json({
			success: true,
			data: roles
		});
	} catch (error) {
		cmsLogger.error("Failed to list roles:", error);
		return c.json({
			success: false,
			error: "Failed to list roles",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).post("/", zValidator("json", createRoleRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "name and capabilities are required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter, rolesService } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "role.manage")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to manage roles"
		}, 403);
		const body = c.req.valid("json");
		const badCaps = rejectUnknownCapabilities(c, body.capabilities);
		if (badCaps) return badCaps;
		if (BUILTIN_ROLE_NAMES.includes(body.name)) return c.json({
			success: false,
			error: "Reserved name",
			message: `"${body.name}" is a built-in role name. Edit the existing role instead.`
		}, 409);
		if (await databaseAdapter.findRoleByName(auth.organizationId, body.name)) return c.json({
			success: false,
			error: "Conflict",
			message: `A role named "${body.name}" already exists in this organization.`
		}, 409);
		const role = await databaseAdapter.createRole({
			organizationId: auth.organizationId,
			name: body.name,
			description: body.description ?? null,
			capabilities: body.capabilities,
			isBuiltIn: false
		});
		await rolesService.invalidate(auth.organizationId, body.name);
		return c.json({
			success: true,
			data: role
		}, 201);
	} catch (error) {
		cmsLogger.error("Failed to create role:", error);
		return c.json({
			success: false,
			error: "Failed to create role",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).patch("/:name", zValidator("json", updateRoleRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter, rolesService } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "role.manage")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to manage roles"
		}, 403);
		const name = c.req.param("name");
		if (!name) return c.json({
			success: false,
			error: "Invalid request",
			message: "Role name is required"
		}, 400);
		const body = c.req.valid("json");
		if (name === "owner" && body.capabilities !== void 0) return c.json({
			success: false,
			error: "Forbidden",
			message: "\"owner\" always holds every capability and its permissions cannot be changed. Create a custom role to grant narrower access."
		}, 403);
		if (body.capabilities) {
			const badCaps = rejectUnknownCapabilities(c, body.capabilities);
			if (badCaps) return badCaps;
		}
		const updated = await databaseAdapter.updateRole(auth.organizationId, name, body);
		if (!updated) return c.json({
			success: false,
			error: "Not found",
			message: `No role named "${name}" in this organization`
		}, 404);
		await rolesService.invalidate(auth.organizationId, name);
		return c.json({
			success: true,
			data: updated
		});
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
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!hasCapability(auth, "role.manage")) return c.json({
			success: false,
			error: "Forbidden",
			message: "You do not have permission to manage roles"
		}, 403);
		const name = c.req.param("name");
		if (!name) return c.json({
			success: false,
			error: "Invalid request",
			message: "Role name is required"
		}, 400);
		if (BUILTIN_ROLE_NAMES.includes(name)) return c.json({
			success: false,
			error: "Forbidden",
			message: `"${name}" is a built-in role and cannot be deleted.`
		}, 403);
		const inUseByMember = (await databaseAdapter.findOrganizationMembers(auth.organizationId)).some((m) => m.role === name);
		const inUseByInvitation = (await databaseAdapter.findOrganizationInvitations(auth.organizationId)).some((i) => i.role === name && !i.acceptedAt);
		if (inUseByMember || inUseByInvitation) return c.json({
			success: false,
			error: "Role in use",
			message: `Cannot delete "${name}": reassign affected members or invitations first.`
		}, 409);
		if (!await databaseAdapter.deleteRole(auth.organizationId, name)) return c.json({
			success: false,
			error: "Not found",
			message: `No role named "${name}" in this organization`
		}, 404);
		await rolesService.invalidate(auth.organizationId, name);
		return c.json({
			success: true,
			message: "Role deleted"
		});
	} catch (error) {
		cmsLogger.error("Failed to delete role:", error);
		return c.json({
			success: false,
			error: "Failed to delete role",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/plugin-settings.js
var savePluginSettingsRequest = z.object({ values: z.record(z.string(), z.unknown()) });
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/plugin-settings.js
/**
* Require a session with `plugin.settings.manage`. Returns the narrowed session auth
* to proceed, or a 401/403 Response to short-circuit — so callers get a typed org id
* without a non-null assertion.
*/
function requireManage(c) {
	const auth = c.var.auth;
	if (!auth || auth.type !== "session") return c.json({
		success: false,
		error: "Unauthorized",
		message: "Session authentication required"
	}, 401);
	if (!hasCapability(auth, "plugin.settings.manage")) return c.json({
		success: false,
		error: "Forbidden",
		message: "The plugin.settings.manage capability is required"
	}, 403);
	return auth;
}
/**
* Does this session satisfy a settings section's own `requiredCapabilities`?
*
* `plugin.settings.manage` is the floor, checked by `requireManage`. A declaration may
* additionally name narrower capabilities to gate itself more tightly — the part's
* documented contract, and the same convention `hooks.ts` applies to plugin routes and
* `resolver.ts` applies to actions and tools. Without this the declared gate was
* silently ignored, so anyone who could manage settings could overwrite every plugin's
* secrets regardless of what the plugin asked for.
*/
function canAccessSettings(auth, required) {
	if (!required || required.length === 0) return true;
	return required.every((capability) => hasCapability(auth, capability));
}
var pluginSettingsRouter = new Hono().get("/", async (c) => {
	try {
		const auth = requireManage(c);
		if (auth instanceof Response) return auth;
		const { pluginSettingsService, partResolver } = c.var.aphexCMS;
		const declarations = partResolver.settingsDeclarations().filter((decl) => canAccessSettings(auth, decl.requiredCapabilities));
		const secretsEnabled = pluginSettingsService.secretsEnabled;
		const data = await Promise.all(declarations.map(async (decl) => ({
			pluginId: decl.pluginId,
			title: decl.title,
			values: await pluginSettingsService.getMasked(auth.organizationId, decl.pluginId)
		})));
		return c.json({
			success: true,
			data,
			secretsEnabled
		});
	} catch (error) {
		cmsLogger.error("Failed to list plugin settings:", error);
		return c.json({
			success: false,
			error: "Internal error"
		}, 500);
	}
}).put("/:pluginId", zValidator("json", savePluginSettingsRequest), async (c) => {
	try {
		const auth = requireManage(c);
		if (auth instanceof Response) return auth;
		const { pluginSettingsService, partResolver } = c.var.aphexCMS;
		const pluginId = c.req.param("pluginId");
		const declaration = partResolver.settingsDeclaration(pluginId);
		if (!declaration) return c.json({
			success: false,
			error: "Unknown plugin settings",
			message: `Plugin "${pluginId}" has not declared any settings.`
		}, 404);
		if (!canAccessSettings(auth, declaration.requiredCapabilities)) return c.json({
			success: false,
			error: "Forbidden",
			message: `Plugin "${pluginId}" requires: ${declaration.requiredCapabilities?.join(", ")}`
		}, 403);
		const { values } = c.req.valid("json");
		const saved = await pluginSettingsService.save(auth.organizationId, pluginId, values);
		return c.json({
			success: true,
			data: {
				pluginId,
				values: saved
			}
		});
	} catch (error) {
		if (error instanceof PluginSettingsValidationError) return c.json({
			success: false,
			error: "Validation failed",
			issues: error.issues
		}, 400);
		cmsLogger.error("Failed to save plugin settings:", error);
		return c.json({
			success: false,
			error: "Internal error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/user.js
var updateUserRequest = z.object({
	name: z.string().min(1).optional(),
	image: z.string().min(1).nullable().optional()
}).refine((v) => v.name !== void 0 || v.image !== void 0, { message: "At least one field (name, image) is required" });
var updateUserPreferencesRequest = z.object({ includeChildOrganizations: z.boolean().optional() }).strict();
var requestPasswordResetRequest = z.object({
	email: z.string().email(),
	redirectTo: z.string().optional()
});
var resetPasswordRequest = z.object({
	token: z.string().min(1),
	newPassword: z.string().min(8)
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/user-preferences.js
var userPreferencesRouter = new Hono().get("/cms-preference", async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const userProfile = await databaseAdapter.findUserProfileById(auth.user.id);
		return c.json({
			success: true,
			data: userProfile?.preferences || {}
		});
	} catch (error) {
		cmsLogger.error("Failed to get user preferences:", error);
		return c.json({
			success: false,
			error: "Failed to get user preferences",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).patch("/cms-preference", zValidator("json", updateUserPreferencesRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "Invalid preference values",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const { databaseAdapter } = c.var.aphexCMS;
		const auth = c.var.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		const body = c.req.valid("json");
		await databaseAdapter.updateUserPreferences(auth.user.id, body);
		const userProfile = await databaseAdapter.findUserProfileById(auth.user.id);
		return c.json({
			success: true,
			data: userProfile?.preferences || {}
		});
	} catch (error) {
		cmsLogger.error("Failed to update user preferences:", error);
		return c.json({
			success: false,
			error: "Failed to update user preferences",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/user.js
/**
* User account routes that delegate to the configured AuthProvider.
*
* cms-core ships these as Hono routers so studio doesn't need to maintain
* SvelteKit `+server.ts` files for them. The wire format and side effects
* (e.g. the password-reset email) are owned by the AuthProvider impl —
* cms-core's role is just to expose them over HTTP.
*/
var userRouter = new Hono().patch("/", zValidator("json", updateUserRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Invalid request body",
		message: "name or image is required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const auth = c.var.auth;
		const provider = c.var.aphexCMS.auth;
		if (!auth || auth.type !== "session") return c.json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, 401);
		if (!provider) return c.json({
			success: false,
			error: "Auth provider not configured"
		}, 500);
		const { name, image } = c.req.valid("json");
		if (name !== void 0) await provider.changeUserName(auth.user.id, name);
		if (image !== void 0) {
			if (!provider.changeUserImage) return c.json({
				success: false,
				error: "Auth provider does not support profile image updates"
			}, 500);
			await provider.changeUserImage(auth.user.id, image);
		}
		return c.json({
			success: true,
			message: "User updated successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to update user:", error);
		return c.json({
			success: false,
			error: "Failed to update user",
			message: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}).post("/request-password-reset", zValidator("json", requestPasswordResetRequest, (result, c) => {
	if (!result.success) return c.json({
		success: false,
		error: "Missing required field",
		message: "email is required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const provider = c.var.aphexCMS.auth;
		if (!provider) return c.json({
			success: false,
			error: "Auth provider not configured"
		}, 500);
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
	if (!result.success) return c.json({
		success: false,
		error: "Missing required fields",
		message: "token and newPassword are required",
		issues: result.error.issues
	}, 400);
}), async (c) => {
	try {
		const provider = c.var.aphexCMS.auth;
		if (!provider) return c.json({
			success: false,
			error: "Auth provider not configured"
		}, 500);
		const { token, newPassword } = c.req.valid("json");
		await provider.resetPassword(token, newPassword);
		return c.json({
			success: true,
			message: "Password reset successfully"
		});
	} catch (error) {
		cmsLogger.error("Failed to reset password:", error);
		return c.json({
			success: false,
			error: "Failed to reset password",
			message: error instanceof Error ? error.message : "Invalid or expired token"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/workers-run.js
/**
* Constant-time compare of the presented bearer token against the configured secret.
* Length is compared first (and short-circuits), which leaks only the secret's length —
* acceptable, and unavoidable without hashing both sides.
*/
function secretMatches(presented, expected) {
	const a = Buffer.from(presented);
	const b = Buffer.from(expected);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
var workersRunRouter = new Hono();
/**
* POST /api/internal/workers/run — drive one bounded batch of due jobs and return counts.
*
* Machine-to-machine: authorized by a shared secret (`Authorization: Bearer <secret>`),
* NOT the user capability system — platform cron (hosted) or a self-hosted worker loop
* calls it on a cadence. Disabled (404) unless `jobs.workerSecret` is configured, so it
* never exists as an unauthenticated surface by default. Bounded per call (batchSize), so
* a single invocation can't run unboundedly; the caller's cadence sets throughput.
*/
workersRunRouter.post("/run", async (c) => {
	const secret = c.var.aphexCMS.config.jobs?.workerSecret;
	if (!secret) return c.json({
		success: false,
		error: "Not found"
	}, 404);
	const header = c.req.header("authorization") ?? "";
	const presented = header.startsWith("Bearer ") ? header.slice(7) : "";
	if (!presented || !secretMatches(presented, secret)) return c.json({
		success: false,
		error: "Unauthorized"
	}, 401);
	const result = await runJobsBatch(c.var.aphexCMS, { workerId: `endpoint-${randomUUID()}` });
	return c.json({
		success: true,
		result
	});
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/resolve-created-by.js
/**
* Resolves `createdBy` user ids on a list of rows to a display name (or `'API Key'` for a
* `apikey:<id>` synthetic id — see `authToContext`'s API-key branch). Shared by every
* read-only history view (`GET /api/events`, `GET /api/agent/change-sets`, ...) — an audit
* trail whose whole point is accountability needs to show *who*, not a raw id.
*/
async function withCreatedByNames(rows, auth) {
	const userIds = [...new Set(rows.map((r) => r.createdBy).filter((id) => !!id))];
	const userMap = /* @__PURE__ */ new Map();
	if (userIds.length > 0 && auth) await Promise.all(userIds.map(async (userId) => {
		if (userId.startsWith("apikey:")) {
			userMap.set(userId, "API Key");
			return;
		}
		try {
			const user = await auth.getUserById(userId);
			if (user) userMap.set(userId, user.name || user.email);
		} catch {}
	}));
	return rows.map((r) => ({
		...r,
		createdByName: r.createdBy ? userMap.get(r.createdBy) ?? null : null
	}));
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/jobs.js
var jobStatus = z.enum([
	"pending",
	"leased",
	"completed",
	"failed",
	"cancelled"
]);
var listJobsQuery = z.object({
	status: jobStatus.optional(),
	type: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
	offset: z.coerce.number().int().min(0).optional()
});
var listEventsQuery = z.object({
	type: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
	offset: z.coerce.number().int().min(0).optional()
});
/** Map an adapter Page into the ApiResponse `pagination` shape the client expects. */
function toPagination$1(page) {
	const pageSize = page.limit || 1;
	return {
		total: page.total,
		page: Math.floor(page.offset / pageSize) + 1,
		pageSize,
		totalPages: Math.max(1, Math.ceil(page.total / pageSize)),
		hasNextPage: page.offset + page.limit < page.total,
		hasPrevPage: page.offset > 0
	};
}
function requireHistoryAccess(c) {
	const auth = c.var.auth;
	if (!auth || auth.type === "partial_session") return { error: c.json({
		success: false,
		error: "Authentication required"
	}, 401) };
	if (!hasCapability(auth, "document.read")) return { error: c.json({
		success: false,
		error: "Insufficient permissions"
	}, 403) };
	return { organizationId: authToContext(auth).organizationId };
}
var jobsRouter = new Hono().get("/jobs", async (c) => {
	try {
		const gate = requireHistoryAccess(c);
		if ("error" in gate) return gate.error;
		const parsed = listJobsQuery.safeParse(c.req.query());
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid query",
			issues: parsed.error.issues
		}, 400);
		const { status, type, limit, offset } = parsed.data;
		const { databaseAdapter } = c.var.aphexCMS;
		const page = await databaseAdapter.listJobs({
			organizationId: gate.organizationId,
			status,
			type,
			limit,
			offset
		});
		return c.json({
			success: true,
			data: page.items,
			pagination: toPagination$1(page)
		});
	} catch (error) {
		cmsLogger.error("Failed to list jobs:", error);
		return c.json({
			success: false,
			error: "Failed to list jobs"
		}, 500);
	}
}).get("/events", async (c) => {
	try {
		const gate = requireHistoryAccess(c);
		if ("error" in gate) return gate.error;
		const parsed = listEventsQuery.safeParse(c.req.query());
		if (!parsed.success) return c.json({
			success: false,
			error: "Invalid query",
			issues: parsed.error.issues
		}, 400);
		const { type, limit, offset } = parsed.data;
		const { databaseAdapter, auth } = c.var.aphexCMS;
		const page = await databaseAdapter.listEvents({
			organizationId: gate.organizationId,
			type,
			limit,
			offset
		});
		const items = await withCreatedByNames(page.items, auth);
		return c.json({
			success: true,
			data: items,
			pagination: toPagination$1(page)
		});
	} catch (error) {
		cmsLogger.error("Failed to list events:", error);
		return c.json({
			success: false,
			error: "Failed to list events"
		}, 500);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/agent-chat.js
var agentChatMessageSchema = z.object({
	role: z.enum([
		"system",
		"user",
		"assistant",
		"tool"
	]),
	content: z.string(),
	toolCalls: z.array(z.object({
		id: z.string(),
		name: z.string(),
		arguments: z.record(z.string(), z.unknown())
	})).optional(),
	toolCallId: z.string().optional()
});
var agentChatRequest = z.object({
	messages: z.array(agentChatMessageSchema).min(1),
	/** Optional override of the instance's configured default model. */
	model: z.string().optional(),
	/** Present when the caller has a live document editor tab open — gates the
	* `content_patch_fields`/`content_save_draft` workspace-bridge tools into the resolved
	* tool list (see `mcp/tools.ts`'s `resolveAgentTools`). */
	documentContext: z.object({
		collection: z.string(),
		id: z.string()
	}).optional(),
	/** Echoes back the change-set row created on the first leg of a turn that got paused for
	* a workspace tool, so a resume request records against the same row instead of creating
	* a new one per leg. */
	changeSetId: z.string().optional(),
	/** Token usage accumulated across a paused turn's earlier legs, summed with this leg's
	* usage when the change-set is finally completed. */
	priorUsage: z.object({
		promptTokens: z.number(),
		completionTokens: z.number()
	}).optional()
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/agent-operations.js
var recordWorkspaceOperationRequest = z.object({
	changeSetId: z.string(),
	toolName: z.string(),
	collection: z.string(),
	id: z.string(),
	success: z.boolean(),
	error: z.string().optional(),
	arguments: z.record(z.string(), z.unknown()).default({}),
	data: z.unknown().optional()
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/ai/run-agent-turn.js
var DEFAULT_MAX_TOOL_ROUNDTRIPS = 8;
function toToolSpec(tool) {
	return {
		name: tool.definition.name,
		description: tool.definition.description,
		parameters: z.toJSONSchema(tool.definition.inputSchema)
	};
}
/**
* Streams one agent turn: sends `messages` to the model, executes any tool calls it
* requests against `tools`, feeds the results back as `tool` messages, and repeats until
* the model stops calling tools (or `maxToolRoundtrips` is hit — surfaced as an error
* rather than looping forever against a model that won't stop calling tools).
*/
async function* runAgentTurn(opts) {
	const messages = [...opts.messages];
	const systemMessage = opts.systemPrompt ? {
		role: "system",
		content: opts.systemPrompt
	} : null;
	const toolsByName = new Map(opts.tools.map((t) => [t.definition.name, t]));
	const toolSpecs = opts.tools.map(toToolSpec);
	const maxRoundtrips = opts.maxToolRoundtrips ?? DEFAULT_MAX_TOOL_ROUNDTRIPS;
	let roundtrips = 0;
	for (;;) {
		let assistantText = "";
		const pendingToolCalls = [];
		let finishReason = "stop";
		let erroredOut = false;
		for await (const event of opts.aiProvider.chatStream({
			model: opts.model,
			messages: systemMessage ? [systemMessage, ...messages] : messages,
			tools: toolSpecs,
			maxTokens: opts.maxTokens,
			signal: opts.signal
		})) switch (event.type) {
			case "text":
				assistantText += event.delta;
				yield event;
				break;
			case "toolCall":
				pendingToolCalls.push(event.toolCall);
				yield {
					type: "toolCall",
					toolCallId: event.toolCall.id,
					name: event.toolCall.name,
					arguments: event.toolCall.arguments
				};
				break;
			case "usage":
				yield event;
				break;
			case "error":
				yield event;
				erroredOut = true;
				break;
			case "done":
				finishReason = event.finishReason;
				break;
		}
		if (erroredOut) {
			if (assistantText) messages.push({
				role: "assistant",
				content: assistantText
			});
			yield {
				type: "done",
				finishReason: "error",
				messages
			};
			return;
		}
		if (finishReason !== "tool_calls" || pendingToolCalls.length === 0) {
			if (assistantText) messages.push({
				role: "assistant",
				content: assistantText
			});
			yield {
				type: "done",
				finishReason,
				messages
			};
			return;
		}
		if (++roundtrips > maxRoundtrips) {
			yield {
				type: "error",
				message: `Stopped after ${maxRoundtrips} tool-calling round trips.`
			};
			yield {
				type: "done",
				finishReason: "error",
				messages
			};
			return;
		}
		messages.push({
			role: "assistant",
			content: assistantText,
			toolCalls: pendingToolCalls
		});
		const workspaceCalls = [];
		const executableCalls = [];
		for (const call of pendingToolCalls) (toolsByName.get(call.name)?.definition.execution === "workspace" ? workspaceCalls : executableCalls).push(call);
		for (const call of executableCalls) {
			const tool = toolsByName.get(call.name);
			let success;
			let data;
			let error;
			if (!tool) {
				success = false;
				error = `Unknown tool: ${call.name}`;
			} else {
				const requiredCaps = tool.definition.requiredCapabilities ?? [];
				const auth = opts.toolContext.context.auth;
				if (!(requiredCaps.length === 0 || auth != null && requiredCaps.every((c) => hasCapability(auth, c)))) {
					success = false;
					error = `Forbidden: requires ${requiredCaps.join(", ")}`;
				} else {
					const parsed = tool.definition.inputSchema.safeParse(call.arguments);
					if (!parsed.success) {
						success = false;
						error = `Invalid arguments: ${parsed.error.message}`;
					} else try {
						const result = await tool.execute(parsed.data, opts.toolContext);
						success = result.success;
						data = result.success ? result.data : void 0;
						error = result.success ? void 0 : result.error;
					} catch (err) {
						success = false;
						error = err instanceof Error ? err.message : String(err);
					}
				}
			}
			yield {
				type: "toolResult",
				toolCallId: call.id,
				name: call.name,
				success,
				data,
				error
			};
			messages.push({
				role: "tool",
				toolCallId: call.id,
				content: JSON.stringify(success ? data ?? null : { error })
			});
		}
		if (workspaceCalls.length > 0) {
			yield {
				type: "done",
				finishReason: "awaiting_workspace_tool",
				messages,
				pendingWorkspaceCalls: workspaceCalls.map((c) => ({
					toolCallId: c.id,
					name: c.name,
					arguments: c.arguments
				}))
			};
			return;
		}
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/ai/default-system-prompt.js
var DEFAULT_AGENT_SYSTEM_PROMPT = `You are the in-admin content assistant for this CMS. You can read and edit content through the tools available to you — call \`describe_cms\` first if you don't already know what content types, fields, and tools exist in this session; never guess at a schema's shape.

Guidelines:
- Prefer drafts: create or edit content as a draft. Only call \`publish_document\` when the user has explicitly asked you to publish — writing or updating something is not itself a request to publish it.
- If \`content_patch_fields\`/\`content_save_draft\` are available, a document is currently open in the admin editor — use those two tools (not \`update_document\`) for any edit to that document, so the change appears live in the editor instead of only in the database.
- Before a broad or hard-to-reverse change (bulk edits, unpublishing, overwriting existing content), briefly say what you're about to do rather than doing it silently.
- Only reference fields, collections, and tools that \`describe_cms\`/\`get_schema\` actually showed you — never invent one.
- If a tool call fails or is forbidden, say why rather than retrying blindly or working around it.
- Keep responses concise — don't restate what a tool result already showed.`;
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/agent-chat.js
var SUMMARY_MAX_LENGTH = 200;
var toolResultWithDocumentId = z.object({ document: z.object({ id: z.string() }) });
/** `create_document` has no `id` argument (nothing to reference before it exists) — its new
* id only shows up in the result. Falls back to that when the args don't have one, so a
* create is still attributable to a document instead of being silently dropped. */
function resolveDocumentId(args, data) {
	if (typeof args.id === "string") return args.id;
	const parsed = toolResultWithDocumentId.safeParse(data);
	return parsed.success ? parsed.data.document.id : null;
}
/**
* Best-effort audit record for one mutating tool call — looks up the two most recent
* document-version rows to capture `versionBefore`/`versionAfter` (the version an undo would
* restore to, and the one this write produced), then records the operation. Never throws: a
* failure to record the audit trail must never break the actual tool call or the SSE stream.
* Exported for unit testing — not part of the route's own public surface.
*/
async function recordMutatingOperation(aphexCMS, context, changeSetId, toolName, args, success, error, data) {
	const collection = typeof args.collection === "string" ? args.collection : null;
	const documentId = resolveDocumentId(args, data);
	if (!collection || !documentId) return;
	try {
		const { databaseAdapter, localAPI } = aphexCMS;
		const { versions } = await localAPI.versionService.listVersions(databaseAdapter, context.organizationId, documentId, { limit: 2 });
		const [versionAfter, versionBefore] = versions;
		await databaseAdapter.recordOperation({
			changeSetId,
			organizationId: context.organizationId,
			collection,
			documentId,
			toolName,
			arguments: args,
			success,
			error,
			versionBefore: versionBefore?.versionNumber ?? null,
			versionAfter: versionAfter?.versionNumber ?? null
		});
	} catch (err) {
		cmsLogger.error("[agent-chat] failed to record agent operation (continuing):", err);
	}
}
var agentChatRouter = new Hono();
/**
* POST /api/agent/chat — the in-admin agent's streaming chat endpoint (Milestone 2 item 5
* of references/content-copilot-phase-1-plan.md). Stateless per call: the browser sends
* the full running conversation each time (conversation persistence is a separate,
* not-yet-built piece — see the plan). Requires an authenticated session; individual tool
* calls are separately capability-gated by `resolveAgentTools`/each tool's own checks —
* this endpoint is a dumb transport over the same tool-execution service MCP uses, not an
* additional authorization layer.
*
* 404s (rather than 401) when no `aiProvider` is configured, so the route doesn't exist as
* a surface at all on an instance that hasn't opted in — same "don't advertise an unset
* feature" posture as `workers-run.ts`'s worker secret gate.
*
* Also records an audit/undo trail (`cms_agent_change_sets`/`cms_agent_operations`): a
* change-set row is created eagerly for every turn (so token usage is captured even for a
* pure Q&A turn with no mutations), and every mutating tool call gets an operation row. All
* of this recording is best-effort — see `recordMutatingOperation` above and the try/catch
* around change-set creation/completion below — a failure here must never break the chat.
*/
agentChatRouter.post("/chat", async (c) => {
	const { aphexCMS, auth } = c.var;
	const { aiProvider, agentModel } = aphexCMS.config;
	const { databaseAdapter } = aphexCMS;
	if (!aiProvider) return c.json({
		success: false,
		error: "Not found"
	}, 404);
	if (!auth) return c.json({
		success: false,
		error: "Unauthorized"
	}, 401);
	if (!agentModel) return c.json({
		success: false,
		error: "Server misconfigured: no agentModel configured for aiProvider"
	}, 501);
	const body = await c.req.json().catch(() => null);
	const parsed = agentChatRequest.safeParse(body);
	if (!parsed.success) return c.json({
		success: false,
		error: "Invalid request",
		issues: parsed.error.issues
	}, 400);
	const context = authToContext(auth);
	const tools = resolveAgentTools({
		aphexCMS,
		context
	}, { documentContext: parsed.data.documentContext });
	const toolsByName = new Map(tools.map((t) => [t.definition.name, t]));
	const model = parsed.data.model ?? agentModel;
	const abortController = new AbortController();
	let changeSetId = parsed.data.changeSetId ?? null;
	if (!changeSetId) try {
		const firstUserMessage = parsed.data.messages.find((m) => m.role === "user")?.content ?? "";
		changeSetId = (await databaseAdapter.createChangeSet({
			organizationId: context.organizationId,
			createdBy: context.user?.id ?? null,
			summary: firstUserMessage.slice(0, SUMMARY_MAX_LENGTH) || null,
			provider: aiProvider.name,
			model
		})).id;
	} catch (err) {
		cmsLogger.error("[agent-chat] failed to create change-set (continuing without one):", err);
	}
	return streamSSE(c, async (stream) => {
		c.req.raw.signal.addEventListener("abort", () => abortController.abort());
		let promptTokens = parsed.data.priorUsage?.promptTokens ?? 0;
		let completionTokens = parsed.data.priorUsage?.completionTokens ?? 0;
		let turnFailed = false;
		let turnPaused = false;
		const argsByToolCallId = /* @__PURE__ */ new Map();
		try {
			for await (const event of runAgentTurn({
				aiProvider,
				model,
				messages: parsed.data.messages,
				tools,
				toolContext: {
					aphexCMS,
					context
				},
				systemPrompt: aphexCMS.config.agentSystemPrompt ?? DEFAULT_AGENT_SYSTEM_PROMPT,
				signal: abortController.signal
			})) {
				if (event.type === "usage") {
					promptTokens += event.promptTokens;
					completionTokens += event.completionTokens;
				} else if (event.type === "toolCall") argsByToolCallId.set(event.toolCallId, event.arguments);
				else if (event.type === "toolResult" && changeSetId) {
					const tool = toolsByName.get(event.name);
					const args = argsByToolCallId.get(event.toolCallId);
					if (tool?.definition.mutates && args) await recordMutatingOperation(aphexCMS, context, changeSetId, event.name, args, event.success, event.error, event.data);
				} else if (event.type === "error") turnFailed = true;
				if (event.type === "done") {
					event.changeSetId = changeSetId;
					if (event.finishReason === "awaiting_workspace_tool") turnPaused = true;
				}
				await stream.writeSSE({ data: JSON.stringify(event) });
			}
		} catch (err) {
			turnFailed = true;
			cmsLogger.error("[agent-chat] turn failed:", err);
			await stream.writeSSE({ data: JSON.stringify({
				type: "error",
				message: err instanceof Error ? err.message : "Unknown error"
			}) });
		} finally {
			if (changeSetId && !turnPaused) try {
				await databaseAdapter.completeChangeSet(context.organizationId, changeSetId, {
					status: turnFailed ? "failed" : "completed",
					promptTokens,
					completionTokens
				});
			} catch (err) {
				cmsLogger.error("[agent-chat] failed to complete change-set (continuing):", err);
			}
		}
	});
});
/**
* POST /api/agent/operations — records an audit/undo row for a tool the *client* executed
* against a live `DocumentWorkspace` (the `content_patch_fields`/`content_save_draft` bridge
* tools — see `ai/content-workspace-tools.ts`). `agent-chat.ts`'s own `recordMutatingOperation`
* call above only sees tool results resolved server-side inside `runAgentTurn`'s loop, so a
* workspace tool's result — resolved client-side after a paused turn — needs this separate
* path to reach the same `cms_agent_change_sets`/`cms_agent_operations` tables. Same
* session-authenticated posture as `/chat`; not itself a mutation of document data (the
* client already made that call directly via the normal document API), purely bookkeeping.
*/
agentChatRouter.post("/operations", async (c) => {
	const { aphexCMS, auth } = c.var;
	if (!aphexCMS.config.aiProvider) return c.json({
		success: false,
		error: "Not found"
	}, 404);
	if (!auth) return c.json({
		success: false,
		error: "Unauthorized"
	}, 401);
	const body = await c.req.json().catch(() => null);
	const parsed = recordWorkspaceOperationRequest.safeParse(body);
	if (!parsed.success) return c.json({
		success: false,
		error: "Invalid request",
		issues: parsed.error.issues
	}, 400);
	await recordMutatingOperation(aphexCMS, authToContext(auth), parsed.data.changeSetId, parsed.data.toolName, {
		collection: parsed.data.collection,
		id: parsed.data.id,
		...parsed.data.arguments
	}, parsed.data.success, parsed.data.error, parsed.data.data);
	return c.json({ success: true });
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/routes/agent-change-sets.js
var listChangeSetsQuery = z.object({
	limit: z.coerce.number().int().min(1).max(200).optional(),
	offset: z.coerce.number().int().min(0).optional()
});
/** Map an adapter Page into the ApiResponse `pagination` shape the client expects. */
function toPagination(page) {
	const pageSize = page.limit || 1;
	return {
		total: page.total,
		page: Math.floor(page.offset / pageSize) + 1,
		pageSize,
		totalPages: Math.max(1, Math.ceil(page.total / pageSize)),
		hasNextPage: page.offset + page.limit < page.total,
		hasPrevPage: page.offset > 0
	};
}
var agentChangeSetsRouter = new Hono().get("/change-sets", async (c) => {
	const auth = c.var.auth;
	if (!auth || auth.type === "partial_session") return c.json({
		success: false,
		error: "Authentication required"
	}, 401);
	if (!hasCapability(auth, "document.read")) return c.json({
		success: false,
		error: "Insufficient permissions"
	}, 403);
	const q = listChangeSetsQuery.safeParse(c.req.query());
	if (!q.success) return c.json({
		success: false,
		error: "Invalid query parameters",
		issues: q.error.issues
	}, 400);
	const { organizationId } = authToContext(auth);
	const page = await c.var.aphexCMS.databaseAdapter.listChangeSets({
		organizationId,
		limit: q.data.limit,
		offset: q.data.offset
	});
	const items = await withCreatedByNames(page.items, c.var.aphexCMS.auth);
	return c.json({
		success: true,
		data: items,
		pagination: toPagination(page)
	});
}).get("/change-sets/:id", async (c) => {
	const auth = c.var.auth;
	if (!auth || auth.type === "partial_session") return c.json({
		success: false,
		error: "Authentication required"
	}, 401);
	if (!hasCapability(auth, "document.read")) return c.json({
		success: false,
		error: "Insufficient permissions"
	}, 403);
	const { organizationId } = authToContext(auth);
	const changeSet = await c.var.aphexCMS.databaseAdapter.getChangeSet(organizationId, c.req.param("id"));
	if (!changeSet) return c.json({
		success: false,
		error: "Not found"
	}, 404);
	const [withName] = await withCreatedByNames([changeSet], c.var.aphexCMS.auth);
	return c.json({
		success: true,
		data: withName
	});
}).post("/change-sets/:id/undo", async (c) => {
	const auth = c.var.auth;
	if (!auth || auth.type === "partial_session") return c.json({
		success: false,
		error: "Authentication required"
	}, 401);
	if (!hasCapability(auth, "document.update")) return c.json({
		success: false,
		error: "Insufficient permissions"
	}, 403);
	const context = authToContext(auth);
	const { databaseAdapter, localAPI } = c.var.aphexCMS;
	const changeSet = await databaseAdapter.getChangeSet(context.organizationId, c.req.param("id"));
	if (!changeSet) return c.json({
		success: false,
		error: "Not found"
	}, 404);
	const undoable = changeSet.operations.filter((op) => op.success && op.versionBefore !== null).reverse();
	const results = [];
	for (const op of undoable) try {
		const collection = localAPI.getCollection(op.collection);
		if (!collection) {
			results.push({
				operationId: op.id,
				documentId: op.documentId,
				success: false,
				error: `Unknown collection: ${op.collection}`
			});
			continue;
		}
		const current = await collection.findByID(context, op.documentId);
		const restored = await localAPI.versionService.restoreVersion(databaseAdapter, context.organizationId, op.documentId, op.versionBefore, context.user?.id, current?._meta?.revision);
		results.push({
			operationId: op.id,
			documentId: op.documentId,
			success: restored !== null,
			error: restored === null ? "Version not found or restore failed" : void 0
		});
	} catch (err) {
		if (err instanceof RevisionConflictError) {
			results.push({
				operationId: op.id,
				documentId: op.documentId,
				success: false,
				error: `Changed since the agent's edit (conflict): ${err.message}`
			});
			continue;
		}
		cmsLogger.error("[agent-change-sets] undo failed for operation:", op.id, err);
		results.push({
			operationId: op.id,
			documentId: op.documentId,
			success: false,
			error: err instanceof Error ? err.message : "Unknown error"
		});
	}
	return c.json({
		success: true,
		data: { results }
	});
});
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/server/api/index.js
/**
* Build the Aphex API Hono app shell.
*
* Returns a Hono app with `/api` basePath and the bridge middleware that
* lifts `app.fetch(req, env)` values onto `c.var`. Built-in routes are NOT
* mounted yet — call `mountAphexBuiltins(app)` after registering any user
* middleware/overrides (Hono is registration-order-strict).
*/
function createAphexApi() {
	const app = new Hono().basePath("/api");
	app.use("*", bodyLimit({
		maxSize: 10 * 1024 * 1024,
		onError: (c) => c.json({
			success: false,
			error: "Request body too large (max 10MB)"
		}, 413)
	}));
	app.use("*", async (c, next) => {
		c.set("aphexCMS", c.env.aphexCMS);
		c.set("auth", c.env.auth);
		await next();
	});
	return app;
}
/**
* Mount cms-core's built-in resource routes onto an Aphex API app.
*
* Called by `createCMSHook` after `config.api?.(app)` runs, so user-provided
* middleware (e.g. an email-sending wrap on `/organizations/invitations`)
* registers ahead of the built-in handler and gets the chance to wrap it.
*/
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
	app.route("/plugin-settings", pluginSettingsRouter);
	app.route("/user", userPreferencesRouter);
	app.route("/user", userRouter);
	app.route("/internal/workers", workersRunRouter);
	app.route("/", jobsRouter);
	app.route("/agent", agentChatRouter);
	app.route("/agent", agentChangeSetsRouter);
	app.get("/aphex-health", async (c) => {
		try {
			const { databaseAdapter } = c.var.aphexCMS;
			const dbHealthy = await databaseAdapter.isHealthy();
			const status = dbHealthy ? "healthy" : "degraded";
			return c.json({
				status,
				database: dbHealthy
			}, dbHealthy ? 200 : 503);
		} catch {
			return c.json({
				status: "unhealthy",
				database: false
			}, 503);
		}
	});
}
/**
* Adapter: wrap a SvelteKit-style `RequestHandler` so it can be mounted
* onto a Hono router.
*
* Used for handlers that already exist in SK form (e.g. the built-in
* GraphQL Yoga app) and don't need to be rewritten just to flow through
* the Hono catch-all. We synthesize the minimum `event` shape those
* handlers actually read: `request` + `locals.{aphexCMS,auth}` + `params`
* + `url`. If a future SK handler reaches for `cookies`, `setHeaders`, or
* `getClientAddress`, extend the synthesized event accordingly.
*/
function toHonoHandler(skHandler) {
	return async (c) => {
		return skHandler({
			request: c.req.raw,
			url: new URL(c.req.url),
			params: c.req.param(),
			locals: {
				aphexCMS: c.var.aphexCMS,
				auth: c.var.auth
			},
			setHeaders: () => void 0,
			getClientAddress: () => c.req.header("x-forwarded-for") ?? "127.0.0.1"
		});
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/hooks.js
/**
* Wrap a plugin route handler so it enforces `requiredCapabilities` before running.
* 401 when there's no authenticated principal at all; 403 when authenticated but
* missing a required capability. Uses the same server-resolved capability set every
* core resource checks — the client can't forge it.
*/
function gateHandler(handler, required) {
	return (c) => {
		const auth = c.var.auth;
		if (!auth || auth.type === "partial_session") return c.json({
			success: false,
			error: "Authentication required"
		}, 401);
		const caps = resolveCapabilities(auth);
		const missing = required.filter((cap) => !caps.has(cap));
		if (missing.length > 0) return c.json({
			success: false,
			error: "Insufficient permissions",
			missingCapabilities: missing
		}, 403);
		return handler(c);
	};
}
var cmsInstances = null;
var schemaError = null;
var initPromise = null;
var activeConfig = null;
var configDirty = false;
var embeddedRunner = null;
function checkSchemasDirty() {
	if (!configDirty) return false;
	configDirty = false;
	return true;
}
function createDefaultStorageAdapter() {
	return createStorageAdapter("local", {
		basePath: "./storage/assets",
		baseUrl: ""
	});
}
function createCMSHook(config) {
	if (!config) throw new Error("[CMS] createCMSHook received an undefined config. If this happens during HMR, the config module may not have re-executed yet.");
	if (config.logger) setLogger(config.logger);
	if (config.logLevel) setLogLevel(config.logLevel);
	activeConfig = config;
	return async ({ event, resolve }) => {
		const currentConfig = activeConfig ?? config;
		if (cmsInstances && (checkSchemasDirty() || schemaError)) {
			cmsLogger.info("[CMS]", "Schema change detected, re-initializing...");
			if (cmsInstances.config.cache) cmsInstances.config.cache.flush();
			cmsInstances = null;
			schemaError = null;
			initPromise = null;
		}
		if (initPromise) await initPromise;
		if (!cmsInstances) {
			let resolveInit;
			initPromise = new Promise((r) => resolveInit = r);
			cmsLogger.info("[CMS]", "Initializing...");
			const databaseAdapter = currentConfig.database;
			const storageAdapter = currentConfig.storage ?? createDefaultStorageAdapter();
			const emailAdapter = currentConfig.email ?? null;
			const aiProvider = currentConfig.aiProvider ?? null;
			const assetService = new AssetService(storageAdapter, databaseAdapter);
			const cmsEngine = createCMS(currentConfig, databaseAdapter);
			const rolesService = new RolesService(databaseAdapter, currentConfig.cache ?? null);
			const localAPI = createLocalAPI(currentConfig, databaseAdapter);
			const partResolver = createPartResolver(currentConfig.plugins ?? []);
			const pluginSettingsService = new PluginSettingsService(databaseAdapter, partResolver, currentConfig.security?.secretEncryptionKey ?? null);
			const apiApp = createAphexApi();
			currentConfig.api?.(apiApp);
			for (const route of partResolver.serverRoutes()) {
				const handler = route.requiredCapabilities === "public" ? route.handler : gateHandler(route.handler, route.requiredCapabilities);
				apiApp.on(route.method, route.path, handler);
			}
			mountAphexBuiltins(apiApp);
			try {
				await cmsEngine.initialize();
			} catch (error) {
				cmsLogger.error("[CMS]", "Failed to initialize:", error);
				schemaError = error instanceof Error ? error : new Error(String(error));
			}
			let graphqlSettings = null;
			if (currentConfig.graphql !== false) try {
				const { createGraphQLHandler } = await import("./graphql2.js");
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
					pluginSettingsService,
					logger: cmsLogger,
					auth: currentConfig.auth?.provider,
					apiApp,
					partResolver
				}, currentConfig.schemaTypes, graphqlConfig);
				const rawPath = graphqlConfig.path ?? "/api/graphql";
				const fullPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
				const honoPath = fullPath.startsWith("/api") ? fullPath.slice(4) || "/" : fullPath;
				apiApp.all(honoPath, toHonoHandler(result.handler));
				graphqlSettings = result.settings;
			} catch (error) {
				cmsLogger.error("[CMS]", "Failed to initialize GraphQL:", error);
			}
			cmsInstances = {
				config: currentConfig,
				databaseAdapter,
				assetService,
				storageAdapter,
				emailAdapter,
				aiProvider,
				cmsEngine,
				localAPI,
				rolesService,
				pluginSettingsService,
				logger: cmsLogger,
				auth: currentConfig.auth?.provider,
				graphqlSettings,
				apiApp,
				partResolver
			};
			if (currentConfig.jobs?.embedded && !embeddedRunner) embeddedRunner = startEmbeddedJobRunner({
				intervalMs: currentConfig.jobs.embeddedIntervalMs,
				logger: cmsLogger,
				getServices: () => cmsInstances
			});
			resolveInit();
		}
		if (cmsInstances) cmsInstances.schemaError = schemaError;
		event.locals.aphexCMS = cmsInstances;
		if (cmsInstances.auth) {
			const authResponse = await handleAuthHook(event, currentConfig, cmsInstances.auth, cmsInstances.databaseAdapter, cmsInstances.rolesService);
			if (authResponse) return authResponse;
		}
		event.locals.previewPerspective = currentConfig.preview?.resolvePerspective?.({
			auth: event.locals.auth,
			url: event.url
		}) ?? getPreviewPerspective(event.locals.auth, event.url);
		return resolve(event);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/routes/assets-cdn.js
var GET = async ({ params, locals, setHeaders, request }) => {
	try {
		const { assetService, databaseAdapter, storageAdapter, cmsEngine, config } = locals.aphexCMS;
		let auth = locals.auth;
		const { id, filename } = params;
		cmsLogger.debug("[Asset CDN]", "Request for asset:", id, filename);
		if (!auth) {
			if (request.headers.get("x-api-key") && config.auth?.provider) try {
				const apiKeyAuth = await config.auth.provider.validateApiKey(request, databaseAdapter);
				if (apiKeyAuth) {
					auth = apiKeyAuth;
					cmsLogger.debug("[Asset CDN]", "Authenticated via API key");
				}
			} catch (err) {
				cmsLogger.warn("[Asset CDN]", "API key validation failed:", err);
			}
		}
		if (!id) return new Response("Asset ID is required", { status: 400 });
		const asset = await assetService.findAssetByIdGlobal(id);
		if (!asset) {
			cmsLogger.warn("[Asset CDN]", "Asset not found:", id);
			return new Response("Asset not found", { status: 404 });
		}
		const organizationId = auth && auth.type !== "partial_session" ? auth.organizationId : void 0;
		let isPrivate = false;
		const schemaType = asset.metadata?.schemaType;
		const fieldPath = asset.metadata?.fieldPath;
		if (schemaType && fieldPath) {
			const schema = cmsEngine.getSchemaTypeByName(schemaType);
			if (schema && schema.fields) {
				const findField = (fields, path) => {
					const parts = path.split(".");
					let current = null;
					for (let i = 0; i < parts.length; i++) {
						const part = parts[i];
						current = fields.find((f) => f.name === part);
						if (!current) return null;
						if (i < parts.length - 1) if (current.type === "object" && current.fields) fields = current.fields;
						else return null;
					}
					return current;
				};
				const field = findField(schema.fields, fieldPath);
				if (field && field.type === "image") isPrivate = field.private === true;
				else cmsLogger.warn("[Asset CDN]", `Could not find field: ${schemaType}.${fieldPath}`);
			}
		}
		cmsLogger.debug("[Asset CDN]", "Asset privacy:", {
			isPrivate,
			schemaType,
			fieldPath
		});
		if (isPrivate && !organizationId) {
			cmsLogger.warn("[Asset CDN]", "Private asset accessed without auth");
			return new Response("Unauthorized - This asset is private", { status: 401 });
		}
		if (isPrivate && organizationId) {
			let hasAccess = organizationId === asset.organizationId;
			if (!hasAccess && databaseAdapter.getChildOrganizations) hasAccess = (await databaseAdapter.getChildOrganizations(organizationId)).includes(asset.organizationId);
			if (!hasAccess) {
				cmsLogger.warn("[Asset CDN]", "Forbidden: org mismatch for private asset");
				return new Response("Forbidden", { status: 403 });
			}
		}
		if (asset.url && asset.url.startsWith("http")) return new Response(null, {
			status: 302,
			headers: { Location: asset.url }
		});
		if (!storageAdapter?.getObject) {
			cmsLogger.error("[Asset CDN]", "Storage adapter does not support getObject");
			return new Response("Storage adapter does not support file serving", { status: 500 });
		}
		const fileBuffer = await storageAdapter.getObject(asset.path);
		const rawFilename = asset.originalFilename || asset.filename;
		const asciiFallback = rawFilename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
		const utf8Encoded = encodeURIComponent(rawFilename);
		const disposition = asset.mimeType && asset.mimeType !== "image/svg+xml" && [
			"image/",
			"application/pdf",
			"video/",
			"audio/"
		].some((t) => asset.mimeType.startsWith(t)) ? "inline" : "attachment";
		setHeaders({
			"Content-Type": asset.mimeType || "application/octet-stream",
			"Content-Length": fileBuffer.length.toString(),
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Disposition": `${disposition}; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`,
			"X-Content-Type-Options": "nosniff",
			...asset.mimeType?.startsWith("image/") && { "Accept-Ranges": "bytes" }
		});
		const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
		return new Response(arrayBuffer);
	} catch (error) {
		cmsLogger.error("[Asset CDN]", "Error serving asset:", error);
		return new Response("Failed to serve asset", { status: 500 });
	}
};
//#endregion
export { AuthError as a, createStorageAdapter as i, createCMSHook as n, capabilitySchema as r, GET as t };
