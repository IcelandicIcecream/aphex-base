import { d as drizzleDb, u as user } from "../../../../../chunks/index2.js";
import { organizations, invitations, organizationMembers } from "@aphexcms/postgresql-adapter/schema";
import { eq } from "drizzle-orm";
const organizationService = {
  /**
   * Get organization with enriched member data (includes user details)
   * This performs a join between CMS organizationMembers and auth user tables
   */
  async getOrganizationWithMembers(organizationId) {
    const org = await drizzleDb.query.organizations.findFirst({
      where: eq(organizations.id, organizationId)
    });
    if (!org) {
      return null;
    }
    const members = await drizzleDb.select({
      member: organizationMembers,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      },
      invitation: {
        email: invitations.email
      }
    }).from(organizationMembers).innerJoin(user, eq(organizationMembers.userId, user.id)).leftJoin(invitations, eq(organizationMembers.invitationId, invitations.id)).where(eq(organizationMembers.organizationId, organizationId));
    return {
      organization: org,
      members: members.map((m) => ({
        member: m.member,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
          image: m.user.image
        },
        invitedEmail: m.invitation?.email || null
      }))
    };
  }
};
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw new Error("No session found");
  }
  let activeOrganization = null;
  let currentUserOrgRole = null;
  if (auth.organizationId) {
    const orgData = await organizationService.getOrganizationWithMembers(auth.organizationId);
    if (orgData) {
      activeOrganization = {
        ...orgData.organization,
        members: orgData.members.map((m) => ({
          ...m.member,
          user: m.user,
          invitedEmail: m.invitedEmail
        }))
      };
      const currentMember = orgData.members.find((m) => m.user.id === auth.user.id);
      currentUserOrgRole = currentMember?.member.role || null;
    }
  }
  return {
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      role: auth.user.role,
      organizationRole: currentUserOrgRole
    },
    activeOrganization
  };
};
export {
  load
};
