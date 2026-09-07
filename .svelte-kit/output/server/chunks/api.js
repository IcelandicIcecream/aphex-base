import { r as effectiveFileType } from "./file-accept.js";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/upload-timeout.js
/**
* How long to wait on a request carrying a file body.
*
* Its own module because both transports need it — the XHR upload path and the
* fetch client — and a second copy of a heuristic is a second thing to get
* wrong. No imports, so neither pays for it.
*
* Derived from the payload rather than configured. A timeout encodes no
* decision the way a size limit does: its only job is to stop a hung request
* spinning forever. Exposing it as a setting invites an inconsistent pair —
* raise `upload.maxFileSize` to 100MB, leave the timeout at the JSON default,
* and every large upload fails in a way that reads as a server rejection.
* Deriving it means raising the size limit adjusts the deadline for free.
*/
/**
* Assumed floor throughput, deliberately pessimistic — a phone on a bad
* connection, not an office line. Too generous costs a slow failure on a
* genuinely dead request; too tight kills uploads that were succeeding.
*/
var UPLOAD_ASSUMED_BYTES_PER_SECOND = 64 * 1024;
var UPLOAD_TIMEOUT_FLOOR = 3e4;
var UPLOAD_TIMEOUT_CEILING = 900 * 1e3;
function uploadTimeoutForBytes(bytes) {
	const transfer = bytes / UPLOAD_ASSUMED_BYTES_PER_SECOND * 1e3;
	return Math.min(UPLOAD_TIMEOUT_CEILING, Math.max(UPLOAD_TIMEOUT_FLOOR, transfer));
}
function uploadTimeoutFor(body) {
	let bytes = 0;
	for (const value of body.values()) if (typeof Blob !== "undefined" && value instanceof Blob) bytes += value.size;
	return uploadTimeoutForBytes(bytes);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/client.js
var DEFAULT_BASE_URL = "/api";
var DEFAULT_TIMEOUT = 1e4;
var ApiError = class extends Error {
	status;
	response;
	constructor(status, response, message) {
		super(message || `API Error: ${status}`);
		this.status = status;
		this.response = response;
		this.name = "ApiError";
	}
};
var ApiClient = class {
	baseUrl;
	timeout;
	constructor(baseUrl = DEFAULT_BASE_URL, timeout = DEFAULT_TIMEOUT) {
		this.baseUrl = baseUrl;
		this.timeout = timeout;
	}
	/**
	* Make HTTP request with proper error handling
	*/
	async request(endpoint, options = {}, timeoutMs) {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = {};
		if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
		const requestOptions = {
			...options,
			headers: {
				...headers,
				...options.headers
			}
		};
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs ?? this.timeout);
		requestOptions.signal = controller.signal;
		try {
			const response = await fetch(url, requestOptions);
			clearTimeout(timeoutId);
			let data = null;
			try {
				data = await response.json();
			} catch {
				if (response.ok) throw new ApiError(response.status, null, "Malformed response from server");
			}
			if (!response.ok) throw new ApiError(response.status, data, data?.message || data?.error || `Request failed (${response.status})`);
			if (!data) throw new ApiError(response.status, null, "Malformed response from server");
			if (!data.success) throw new ApiError(response.status, data, data.message || data.error);
			return data;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof ApiError) throw error;
			throw new ApiError(0, null, error instanceof Error ? error.message : "Network error");
		}
	}
	/**
	* GET request
	*/
	async get(endpoint, params) {
		let url = endpoint;
		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== void 0 && value !== null) if (Array.isArray(value)) searchParams.append(key, value.join(","));
				else searchParams.append(key, String(value));
			});
			if (searchParams.toString()) url += `?${searchParams.toString()}`;
		}
		return this.request(url, { method: "GET" });
	}
	/**
	* POST request
	*/
	async post(endpoint, body, headers) {
		const isUpload = body instanceof FormData;
		return this.request(endpoint, {
			method: "POST",
			...headers ? { headers } : {},
			body: isUpload ? body : body ? JSON.stringify(body) : void 0
		}, isUpload ? uploadTimeoutFor(body) : void 0);
	}
	/**
	* PUT request
	*/
	async put(endpoint, body) {
		return this.request(endpoint, {
			method: "PUT",
			body: body instanceof FormData ? body : body ? JSON.stringify(body) : void 0
		});
	}
	/**
	* DELETE request
	*/
	async delete(endpoint, body) {
		return this.request(endpoint, {
			method: "DELETE",
			body: body ? JSON.stringify(body) : void 0
		});
	}
	/**
	* PATCH request
	*/
	async patch(endpoint, body) {
		return this.request(endpoint, {
			method: "PATCH",
			body: body instanceof FormData ? body : body ? JSON.stringify(body) : void 0
		});
	}
};
var apiClient = new ApiClient();
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/documents.js
var DocumentsApi = class {
	/**
	* List documents with optional filtering
	* NOTE: Requires 'type' parameter - use getByType() for convenience
	*/
	static async list(params = {}) {
		const queryParams = {
			...params,
			type: params.type || params.docType
		};
		delete queryParams.docType;
		return apiClient.get("/documents", queryParams);
	}
	/**
	* Get document by ID
	*/
	static async getById(id) {
		return apiClient.get(`/documents/${id}`);
	}
	/**
	* Find all documents that reference the given document. Used by the
	* unpublish flow to warn the user that taking this doc down will leave
	* dangling references in the published perspective of any back-referrers.
	*/
	static async getBackReferences(id) {
		return apiClient.get(`/documents/${id}/back-references`);
	}
	/**
	* Batch fetch — one HTTP call per N IDs. Server fans out and returns the
	* docs that exist (missing/forbidden IDs are silently dropped). Use this
	* when you have a known set of references to hydrate; for filtered or
	* paginated lists use `list()`.
	*/
	static async getMany(ids) {
		if (ids.length === 0) return {
			success: true,
			data: []
		};
		return apiClient.get("/documents/by-ids", { ids: ids.join(",") });
	}
	/**
	* Create new document
	*/
	static async create(data) {
		return apiClient.post("/documents", data);
	}
	/**
	* Update document draft by ID (auto-save)
	* Request/response shapes come from the zod schema in ./schemas/documents.ts —
	* single source of truth shared with the server handler.
	*/
	static async updateById(id, data) {
		return apiClient.put(`/documents/${id}`, data);
	}
	/**
	* Publish document (copy draft -> published)
	*/
	static async publish(id, options) {
		return apiClient.post(`/documents/${id}/publish`, options);
	}
	/**
	* Unpublish document (revert to draft only)
	*/
	static async unpublish(id, options) {
		return apiClient.delete(`/documents/${id}/publish`, options);
	}
	/**
	* Schedule a publish/unpublish for a future time (ISO-8601 `runAt`).
	* Enqueues a job the worker runs at that time — the permission check happens now.
	*/
	static async schedule(id, body) {
		return apiClient.post(`/documents/${id}/schedule`, body);
	}
	/** Pending scheduled publish/unpublish for a document (for the editor's schedule indicator). */
	static async getSchedule(id) {
		return apiClient.get(`/documents/${id}/schedule`);
	}
	/** Cancel the pending schedule for a document. */
	static async cancelSchedule(id) {
		return apiClient.delete(`/documents/${id}/schedule`);
	}
	/**
	* Delete document by ID
	*/
	static async deleteById(id) {
		return apiClient.delete(`/documents/${id}`);
	}
	/**
	* Get documents by type (convenience method)
	*/
	static async getByType(docType, params = {}) {
		return this.list({
			...params,
			docType
		});
	}
	/**
	* Get published documents only (convenience method)
	*/
	static async getPublished(params = {}) {
		return this.list({
			...params,
			status: "published"
		});
	}
	/**
	* Get draft documents only (convenience method)
	*/
	static async getDrafts(params = {}) {
		return this.list({
			...params,
			status: "draft"
		});
	}
	/**
	* List document version history
	*/
	static async listVersions(id, params) {
		return apiClient.get(`/documents/${id}/versions`, params);
	}
	/**
	* Get a specific version
	*/
	static async getVersion(id, versionNumber) {
		return apiClient.get(`/documents/${id}/versions/${versionNumber}`);
	}
	/**
	* Restore a version to draft
	*/
	static async restoreVersion(id, versionNumber, options) {
		return apiClient.post(`/documents/${id}/versions/${versionNumber}/restore`, options);
	}
};
var documents = {
	list: DocumentsApi.list.bind(DocumentsApi),
	getById: DocumentsApi.getById.bind(DocumentsApi),
	getMany: DocumentsApi.getMany.bind(DocumentsApi),
	getBackReferences: DocumentsApi.getBackReferences.bind(DocumentsApi),
	create: DocumentsApi.create.bind(DocumentsApi),
	updateById: DocumentsApi.updateById.bind(DocumentsApi),
	publish: DocumentsApi.publish.bind(DocumentsApi),
	unpublish: DocumentsApi.unpublish.bind(DocumentsApi),
	schedule: DocumentsApi.schedule.bind(DocumentsApi),
	getSchedule: DocumentsApi.getSchedule.bind(DocumentsApi),
	cancelSchedule: DocumentsApi.cancelSchedule.bind(DocumentsApi),
	deleteById: DocumentsApi.deleteById.bind(DocumentsApi),
	getByType: DocumentsApi.getByType.bind(DocumentsApi),
	getPublished: DocumentsApi.getPublished.bind(DocumentsApi),
	getDrafts: DocumentsApi.getDrafts.bind(DocumentsApi),
	listVersions: DocumentsApi.listVersions.bind(DocumentsApi),
	getVersion: DocumentsApi.getVersion.bind(DocumentsApi),
	restoreVersion: DocumentsApi.restoreVersion.bind(DocumentsApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/organizations.js
var OrganizationsApi = class {
	/**
	* List user's organizations
	*/
	static async list() {
		return apiClient.get("/organizations");
	}
	/**
	* Create new organization (super_admin only)
	*/
	static async create(data) {
		return apiClient.post("/organizations", data);
	}
	/**
	* Switch to a different organization
	*/
	static async switch(data) {
		return apiClient.post("/organizations/switch", data);
	}
	/**
	* Get organization by ID
	*/
	static async getById(id) {
		return apiClient.get(`/organizations/${id}`);
	}
	/**
	* Get active organization
	*/
	static async getActive() {
		const active = (await this.list()).data?.find((org) => org.isActive);
		if (!active) throw new Error("No active organization found");
		return {
			success: true,
			data: active
		};
	}
	/**
	* Get organization members
	*/
	static async getMembers() {
		return apiClient.get("/organizations/members");
	}
	/**
	* Invite a member to the organization
	*/
	static async inviteMember(data) {
		return apiClient.post("/organizations/invitations", data);
	}
	/**
	* Remove a member from the organization
	*/
	static async removeMember(data) {
		return apiClient.delete("/organizations/members", data);
	}
	/**
	* Update a member's role
	*/
	static async updateMemberRole(data) {
		return apiClient.patch("/organizations/members", data);
	}
	/**
	* Update organization settings
	*/
	static async update(id, data) {
		return apiClient.patch(`/organizations/${id}`, data);
	}
	/**
	* Cancel a pending invitation
	*/
	static async cancelInvitation(data) {
		return apiClient.delete("/organizations/invitations", data);
	}
	/**
	* Delete an organization, its media, and every membership in it. Owners only —
	* enforced by the route, not here.
	*/
	static async remove(id) {
		return apiClient.delete(`/organizations/${id}`);
	}
};
var organizations = {
	list: OrganizationsApi.list.bind(OrganizationsApi),
	create: OrganizationsApi.create.bind(OrganizationsApi),
	switch: OrganizationsApi.switch.bind(OrganizationsApi),
	getById: OrganizationsApi.getById.bind(OrganizationsApi),
	getActive: OrganizationsApi.getActive.bind(OrganizationsApi),
	update: OrganizationsApi.update.bind(OrganizationsApi),
	remove: OrganizationsApi.remove.bind(OrganizationsApi),
	getMembers: OrganizationsApi.getMembers.bind(OrganizationsApi),
	inviteMember: OrganizationsApi.inviteMember.bind(OrganizationsApi),
	removeMember: OrganizationsApi.removeMember.bind(OrganizationsApi),
	updateMemberRole: OrganizationsApi.updateMemberRole.bind(OrganizationsApi),
	cancelInvitation: OrganizationsApi.cancelInvitation.bind(OrganizationsApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/roles.js
var RolesApi = class {
	/** List all roles (built-in + custom) for the active organization. */
	static async list() {
		return apiClient.get("/roles");
	}
	/** Create a custom role. Built-in names are rejected server-side. */
	static async create(data) {
		return apiClient.post("/roles", data);
	}
	/** Edit description or capabilities. Works on built-ins too. */
	static async update(name, data) {
		return apiClient.patch(`/roles/${encodeURIComponent(name)}`, data);
	}
	/** Delete a custom role. Built-ins and in-use roles are blocked server-side. */
	static async remove(name) {
		return apiClient.delete(`/roles/${encodeURIComponent(name)}`);
	}
};
var roles = {
	list: RolesApi.list.bind(RolesApi),
	create: RolesApi.create.bind(RolesApi),
	update: RolesApi.update.bind(RolesApi),
	remove: RolesApi.remove.bind(RolesApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/upload.js
/**
* POST a FormData body with progress reporting.
*
* Resolves with the parsed body on success and rejects with `ApiError`
* otherwise, matching `ApiClient` exactly.
*/
/**
* PUT a file straight to object storage, reporting progress.
*
* Distinct from {@link uploadFormData} in two ways that matter:
*
* - **No credentials.** The target is a third-party origin and the URL already
*   carries its own signature. Sending cookies would leak the session to the
*   storage provider and trip CORS besides.
* - **Raw body, not FormData.** The signature covers the object bytes; wrapping
*   them in multipart framing would store the framing.
*
* A failure here is very often missing bucket CORS rather than a broken file,
* and the browser deliberately hides the distinction — so the error says so.
*/
function putToStorage(url, file, headers = {}, options = {}) {
	const { onProgress, signal, timeoutMs } = options;
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new ApiError(0, null, "Upload cancelled"));
			return;
		}
		const xhr = new XMLHttpRequest();
		xhr.open("PUT", url, true);
		xhr.withCredentials = false;
		for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value);
		if (timeoutMs) xhr.timeout = timeoutMs;
		if (onProgress) xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && event.total > 0) onProgress(Math.min(100, Math.round(event.loaded / event.total * 100)));
		});
		const onAbort = () => xhr.abort();
		signal?.addEventListener("abort", onAbort, { once: true });
		const cleanup = () => signal?.removeEventListener("abort", onAbort);
		xhr.addEventListener("load", () => {
			cleanup();
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
				return;
			}
			reject(new ApiError(xhr.status, null, `Storage rejected the upload (${xhr.status})`));
		});
		xhr.addEventListener("error", () => {
			cleanup();
			reject(new ApiError(0, null, "Could not reach storage. The bucket may not allow PUT from this origin (CORS)."));
		});
		xhr.addEventListener("timeout", () => {
			cleanup();
			reject(new ApiError(0, null, "Upload timed out"));
		});
		xhr.addEventListener("abort", () => {
			cleanup();
			reject(new ApiError(0, null, "Upload cancelled"));
		});
		xhr.send(file);
	});
}
function uploadFormData(url, body, options = {}) {
	const { onProgress, signal, timeoutMs } = options;
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new ApiError(0, null, "Upload cancelled"));
			return;
		}
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.withCredentials = true;
		if (timeoutMs) xhr.timeout = timeoutMs;
		if (onProgress) xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && event.total > 0) onProgress(Math.min(100, Math.round(event.loaded / event.total * 100)));
		});
		const onAbort = () => xhr.abort();
		signal?.addEventListener("abort", onAbort, { once: true });
		const cleanup = () => signal?.removeEventListener("abort", onAbort);
		xhr.addEventListener("load", () => {
			cleanup();
			let data = null;
			try {
				data = JSON.parse(xhr.responseText);
			} catch {}
			if (!(xhr.status >= 200 && xhr.status < 300)) {
				reject(new ApiError(xhr.status, data, data?.message || data?.error || `Upload failed (${xhr.status})`));
				return;
			}
			if (!data) {
				reject(new ApiError(xhr.status, null, "Malformed response from server"));
				return;
			}
			if (!data.success) {
				reject(new ApiError(xhr.status, data, data.message || data.error));
				return;
			}
			resolve(data);
		});
		xhr.addEventListener("error", () => {
			cleanup();
			reject(new ApiError(0, null, "Network error during upload"));
		});
		xhr.addEventListener("timeout", () => {
			cleanup();
			reject(new ApiError(0, null, "Upload timed out"));
		});
		xhr.addEventListener("abort", () => {
			cleanup();
			reject(new ApiError(0, null, "Upload cancelled"));
		});
		xhr.send(body);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/assets.js
var AssetsApi = class AssetsApi {
	/**
	* List assets with optional filters
	*/
	/**
	* Attach a poster frame to an existing video.
	*
	* Separate from the upload because the frame's storage key derives from an
	* asset id that doesn't exist until the row does: upload the video, learn the
	* id, then send the frame here.
	*/
	static async uploadPoster(assetId, poster, info = {}) {
		const body = new FormData();
		if (poster) body.append("poster", new File([poster], "poster.webp", { type: "image/webp" }));
		if (info.duration != null) body.append("duration", String(info.duration));
		if (info.width != null) body.append("width", String(info.width));
		if (info.height != null) body.append("height", String(info.height));
		return apiClient.post(`/assets/${assetId}/poster`, body);
	}
	static async list(filters) {
		return apiClient.get("/assets", filters);
	}
	/**
	* Get asset by ID
	*/
	static async getById(id) {
		return apiClient.get(`/assets/${id}`);
	}
	/**
	* Upload a file, choosing the transport.
	*
	* Direct-to-storage when the server reports it available, otherwise through
	* the app. The choice is the server's to report, not the client's to guess:
	* it depends on whether the adapter can sign, whether an encryption key is
	* configured, and whether the operator opted in — the last of which implies
	* bucket CORS that nothing here can detect.
	*/
	static async uploadFile(file, opts = {}) {
		const { direct, schemaType, fieldPath, allowedMimeTypes, videoDuration, videoWidth, videoHeight, ...uploadOptions } = opts;
		if (direct) try {
			return await AssetsApi.uploadDirect(file, {
				schemaType,
				fieldPath
			}, uploadOptions);
		} catch (err) {
			if (!(err instanceof ApiError) || err.status !== 404) throw err;
		}
		const formData = new FormData();
		formData.append("file", file);
		if (schemaType) formData.append("schemaType", schemaType);
		if (fieldPath) formData.append("fieldPath", fieldPath);
		if (allowedMimeTypes?.length) formData.append("allowedMimeTypes", JSON.stringify(allowedMimeTypes));
		if (videoDuration != null) formData.append("videoDuration", String(videoDuration));
		if (videoWidth != null) formData.append("videoWidth", String(videoWidth));
		if (videoHeight != null) formData.append("videoHeight", String(videoHeight));
		return AssetsApi.upload(formData, uploadOptions);
	}
	/**
	* Three-step direct upload: get a signed URL, PUT to storage, confirm.
	*
	* Progress covers only the PUT — it is the whole transfer, and reporting the
	* two bookkeeping calls would just make the bar jump.
	*/
	static async uploadDirect(file, meta, options) {
		const grant = (await apiClient.post("/assets/upload-url", {
			filename: file.name,
			mimeType: effectiveFileType(file.name, file.type) || "application/octet-stream",
			size: file.size,
			...meta
		})).data;
		if (!grant) throw new ApiError(500, null, "Malformed upload grant");
		await putToStorage(grant.uploadUrl, file, grant.headers, {
			...options,
			timeoutMs: options.timeoutMs ?? uploadTimeoutForBytes(file.size)
		});
		return apiClient.post("/assets/confirm", { assetId: grant.assetId }, { "x-upload-ticket": grant.ticket });
	}
	/**
	* Upload a new asset (multipart/form-data)
	* Note: Use FormData for file uploads
	*/
	static async upload(formData, options) {
		return uploadFormData("/api/assets", formData, {
			...options,
			timeoutMs: options?.timeoutMs ?? uploadTimeoutFor(formData)
		});
	}
	/**
	* Update asset metadata
	*/
	static async update(id, data) {
		return apiClient.patch(`/assets/${id}`, data);
	}
	/**
	* Delete an asset.
	*
	* Throws `ApiError` with status 409 and an {@link AssetDeleteConflict} body when
	* the asset is still referenced. Pass `{ force: true }` to delete anyway —
	* necessary when the reference is held by a document whose schema type is no
	* longer registered, since that document can't be opened to remove it by hand.
	*/
	static async delete(id, options) {
		const query = options?.force ? "?force=true" : "";
		return apiClient.delete(`/assets/${id}${query}`);
	}
	/**
	* Bulk delete assets.
	*
	* Rejects with a 409 carrying {@link BulkAssetDeleteConflict} when any of them
	* is still referenced. `{ force: true }` deletes anyway — the same escape the
	* single-asset delete has, and for the same reason: a reference held by a
	* document whose schema type is no longer registered cannot be removed by
	* hand, so without it those assets are undeletable.
	*/
	static async deleteBulk(ids, options) {
		const query = options?.force ? "?force=true" : "";
		return apiClient.delete(`/assets/bulk${query}`, { ids });
	}
	/**
	* Get documents that reference a specific asset
	*/
	static async getReferences(id) {
		return apiClient.get(`/assets/${id}/references`);
	}
	/**
	* Get reference counts for multiple assets in batch
	*/
	static async getReferenceCounts(ids) {
		return apiClient.post("/assets/references/counts", { ids });
	}
};
var assets = {
	list: AssetsApi.list.bind(AssetsApi),
	uploadPoster: AssetsApi.uploadPoster.bind(AssetsApi),
	getById: AssetsApi.getById.bind(AssetsApi),
	upload: AssetsApi.upload.bind(AssetsApi),
	uploadFile: AssetsApi.uploadFile.bind(AssetsApi),
	update: AssetsApi.update.bind(AssetsApi),
	delete: AssetsApi.delete.bind(AssetsApi),
	deleteBulk: AssetsApi.deleteBulk.bind(AssetsApi),
	getReferences: AssetsApi.getReferences.bind(AssetsApi),
	getReferenceCounts: AssetsApi.getReferenceCounts.bind(AssetsApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/user.js
var UserApi = class {
	/**
	* Update user profile
	*/
	static async updateProfile(data) {
		return apiClient.patch("/user", data);
	}
	/**
	* Update CMS preferences (e.g. includeChildOrganizations)
	*/
	static async updatePreferences(prefs) {
		return apiClient.patch("/user/cms-preference", prefs);
	}
};
var user = {
	updateProfile: UserApi.updateProfile.bind(UserApi),
	updatePreferences: UserApi.updatePreferences.bind(UserApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/api-keys.js
var ApiKeysApi = class {
	/**
	* Create a new API key
	*/
	static async create(data) {
		return apiClient.post("/settings/api-keys", data);
	}
	/**
	* Delete an API key
	*/
	static async remove(id) {
		return apiClient.delete(`/settings/api-keys/${id}`);
	}
};
var apiKeys = {
	create: ApiKeysApi.create.bind(ApiKeysApi),
	remove: ApiKeysApi.remove.bind(ApiKeysApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/invitations.js
var InvitationsApi = class {
	/**
	* List all pending invitations for the authenticated user
	*/
	static async listPending() {
		return apiClient.get("/invitations");
	}
	/**
	* Accept a pending invitation
	*/
	static async accept(id) {
		return apiClient.post(`/invitations/${id}/accept`);
	}
	/**
	* Reject/decline a pending invitation
	*/
	static async reject(id) {
		return apiClient.post(`/invitations/${id}/reject`);
	}
};
var invitations = {
	listPending: InvitationsApi.listPending.bind(InvitationsApi),
	accept: InvitationsApi.accept.bind(InvitationsApi),
	reject: InvitationsApi.reject.bind(InvitationsApi)
};
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@11.0.0_c0a018cf61073c78ab0baf2566dc3db2/node_modules/@aphexcms/cms-core/dist/api/instance.js
var InstanceApi = class {
	/**
	* Get instance settings
	*/
	static async getSettings() {
		return apiClient.get("/instance-settings");
	}
	/**
	* Update instance settings (super_admin only)
	*/
	static async updateSettings(data) {
		return apiClient.patch("/instance-settings", data);
	}
};
var instance = {
	getSettings: InstanceApi.getSettings.bind(InstanceApi),
	updateSettings: InstanceApi.updateSettings.bind(InstanceApi)
};
//#endregion
export { assets as a, documents as c, user as i, ApiError as l, invitations as n, roles as o, apiKeys as r, organizations as s, instance as t, apiClient as u };
