import { redirect } from "@sveltejs/kit";
import { c as cmsConfig } from "../../../../chunks/aphex.config.js";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw new Error("No session found");
  }
  const db = locals.aphexCMS.databaseAdapter;
  const userOrgMemberships = await db.findUserOrganizations(auth.user.id);
  if (userOrgMemberships.length === 0 && auth.user.role !== "super_admin") {
    throw redirect(302, "/invitations");
  }
  const instanceSettings = await db.getInstanceSettings();
  const organizations = userOrgMemberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.member.role,
    isActive: membership.organization.id === auth.organizationId,
    metadata: membership.organization.metadata
  }));
  const activeOrganization = organizations.find((org) => org.isActive);
  const canCreateOrganization = auth.user.role === "super_admin" || (instanceSettings.allowUserOrgCreation ?? false);
  const title = cmsConfig.customization?.branding?.title || "Aphex CMS";
  const faviconUrl = null;
  return {
    auth,
    title,
    organizations,
    activeOrganization,
    canCreateOrganization,
    faviconUrl,
    // Expose resolved capabilities + active role to the admin shell so
    // client code (UI gating, debug panels) can consult the same set the
    // server enforces against.
    rbac: {
      role: auth.organizationRole,
      capabilities: auth.capabilities ?? []
    }
  };
};
export {
  load
};
