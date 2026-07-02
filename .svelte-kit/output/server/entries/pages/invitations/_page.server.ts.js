import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type === "api_key") {
    throw redirect(302, "/login");
  }
  const { databaseAdapter } = locals.aphexCMS;
  const allInvitations = await databaseAdapter.findInvitationsByEmail(auth.user.email);
  const now = /* @__PURE__ */ new Date();
  const pending = allInvitations.filter((inv) => inv.acceptedAt === null && new Date(inv.expiresAt) > now).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const enriched = await Promise.all(
    pending.map(async (inv) => {
      const org = await databaseAdapter.findOrganizationById(inv.organizationId);
      return {
        id: inv.id,
        organizationId: inv.organizationId,
        organizationName: org?.name ?? "Unknown",
        organizationSlug: org?.slug ?? "",
        role: inv.role,
        email: inv.email,
        expiresAt: inv.expiresAt,
        createdAt: inv.createdAt
      };
    })
  );
  return {
    pendingInvitations: enriched,
    hasOrganization: auth.type === "session",
    user: {
      email: auth.user.email,
      name: auth.user.name
    }
  };
};
export {
  load
};
