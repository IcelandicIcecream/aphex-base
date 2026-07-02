import { d as dayjs, u as utc } from "./date-utils.js";
dayjs.extend(utc);
const DEFAULT_BASE_URL = "/api";
const DEFAULT_TIMEOUT = 1e4;
class ApiError extends Error {
  status;
  response;
  constructor(status, response, message) {
    super(message || `API Error: ${status}`);
    this.status = status;
    this.response = response;
    this.name = "ApiError";
  }
}
class ApiClient {
  baseUrl;
  timeout;
  constructor(baseUrl = DEFAULT_BASE_URL, timeout = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  /**
   * Make HTTP request with proper error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const requestOptions = {
      headers: {
        ...headers,
        ...options.headers
      },
      ...options
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    requestOptions.signal = controller.signal;
    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) {
        throw new ApiError(response.status, data, data.message || data.error);
      }
      if (!data.success) {
        throw new ApiError(response.status, data, data.message || data.error);
      }
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
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
        if (value !== void 0 && value !== null) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(","));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    return this.request(url, { method: "GET" });
  }
  /**
   * POST request
   */
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      // Don't stringify FormData - pass it directly
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : void 0
    });
  }
  /**
   * PUT request
   */
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      // Don't stringify FormData - pass it directly
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
      // Don't stringify FormData - pass it directly
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : void 0
    });
  }
}
const apiClient = new ApiClient();
class DocumentsApi {
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
    if (ids.length === 0)
      return { success: true, data: [] };
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
  static async publish(id) {
    return apiClient.post(`/documents/${id}/publish`);
  }
  /**
   * Unpublish document (revert to draft only)
   */
  static async unpublish(id) {
    return apiClient.delete(`/documents/${id}/publish`);
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
    return this.list({ ...params, docType });
  }
  /**
   * Get published documents only (convenience method)
   */
  static async getPublished(params = {}) {
    return this.list({ ...params, status: "published" });
  }
  /**
   * Get draft documents only (convenience method)
   */
  static async getDrafts(params = {}) {
    return this.list({ ...params, status: "draft" });
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
  static async restoreVersion(id, versionNumber) {
    return apiClient.post(`/documents/${id}/versions/${versionNumber}/restore`);
  }
}
const documents = {
  list: DocumentsApi.list.bind(DocumentsApi),
  getById: DocumentsApi.getById.bind(DocumentsApi),
  getMany: DocumentsApi.getMany.bind(DocumentsApi),
  getBackReferences: DocumentsApi.getBackReferences.bind(DocumentsApi),
  create: DocumentsApi.create.bind(DocumentsApi),
  updateById: DocumentsApi.updateById.bind(DocumentsApi),
  publish: DocumentsApi.publish.bind(DocumentsApi),
  unpublish: DocumentsApi.unpublish.bind(DocumentsApi),
  deleteById: DocumentsApi.deleteById.bind(DocumentsApi),
  getByType: DocumentsApi.getByType.bind(DocumentsApi),
  getPublished: DocumentsApi.getPublished.bind(DocumentsApi),
  getDrafts: DocumentsApi.getDrafts.bind(DocumentsApi),
  listVersions: DocumentsApi.listVersions.bind(DocumentsApi),
  getVersion: DocumentsApi.getVersion.bind(DocumentsApi),
  restoreVersion: DocumentsApi.restoreVersion.bind(DocumentsApi)
};
class OrganizationsApi {
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
    const result = await this.list();
    const active = result.data?.find((org) => org.isActive);
    if (!active) {
      throw new Error("No active organization found");
    }
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
   * Delete an organization (super_admin only)
   */
  static async remove(id) {
    return apiClient.delete(`/organizations/${id}`);
  }
}
const organizations = {
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
class RolesApi {
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
}
const roles = {
  list: RolesApi.list.bind(RolesApi),
  create: RolesApi.create.bind(RolesApi),
  update: RolesApi.update.bind(RolesApi),
  remove: RolesApi.remove.bind(RolesApi)
};
class AssetsApi {
  /**
   * List assets with optional filters
   */
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
   * Upload a new asset (multipart/form-data)
   * Note: Use FormData for file uploads
   */
  static async upload(formData) {
    return apiClient.post("/assets", formData);
  }
  /**
   * Update asset metadata
   */
  static async update(id, data) {
    return apiClient.patch(`/assets/${id}`, data);
  }
  /**
   * Delete an asset
   */
  static async delete(id) {
    return apiClient.delete(`/assets/${id}`);
  }
  /**
   * Bulk delete assets
   */
  static async deleteBulk(ids) {
    return apiClient.delete("/assets/bulk", { ids });
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
}
const assets = {
  list: AssetsApi.list.bind(AssetsApi),
  getById: AssetsApi.getById.bind(AssetsApi),
  upload: AssetsApi.upload.bind(AssetsApi),
  update: AssetsApi.update.bind(AssetsApi),
  delete: AssetsApi.delete.bind(AssetsApi),
  deleteBulk: AssetsApi.deleteBulk.bind(AssetsApi),
  getReferences: AssetsApi.getReferences.bind(AssetsApi),
  getReferenceCounts: AssetsApi.getReferenceCounts.bind(AssetsApi)
};
class UserApi {
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
}
const user = {
  updateProfile: UserApi.updateProfile.bind(UserApi),
  updatePreferences: UserApi.updatePreferences.bind(UserApi)
};
class ApiKeysApi {
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
}
const apiKeys = {
  create: ApiKeysApi.create.bind(ApiKeysApi),
  remove: ApiKeysApi.remove.bind(ApiKeysApi)
};
class InvitationsApi {
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
}
const invitations = {
  listPending: InvitationsApi.listPending.bind(InvitationsApi),
  accept: InvitationsApi.accept.bind(InvitationsApi),
  reject: InvitationsApi.reject.bind(InvitationsApi)
};
class InstanceApi {
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
}
const instance = {
  getSettings: InstanceApi.getSettings.bind(InstanceApi),
  updateSettings: InstanceApi.updateSettings.bind(InstanceApi)
};
export {
  ApiError as A,
  instance as a,
  apiKeys as b,
  assets as c,
  documents as d,
  invitations as i,
  organizations as o,
  roles as r,
  user as u
};
