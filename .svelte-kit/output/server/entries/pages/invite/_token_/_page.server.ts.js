import { redirect } from "@sveltejs/kit";
const load = async ({ params, locals }) => {
  const { databaseAdapter } = locals.aphexCMS;
  const auth = locals.auth;
  const { token } = params;
  const invitation = await databaseAdapter.findInvitationByToken(token);
  if (!invitation) {
    return { error: "invalid", invitation: null, organization: null };
  }
  if (invitation.acceptedAt) {
    return { error: "already_accepted", invitation: null, organization: null };
  }
  if (new Date(invitation.expiresAt) < /* @__PURE__ */ new Date()) {
    return { error: "expired", invitation: null, organization: null };
  }
  const org = await databaseAdapter.findOrganizationById(invitation.organizationId);
  if (auth && auth.type === "session") {
    if (auth.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return {
        error: "email_mismatch",
        invitation: {
          email: invitation.email,
          role: invitation.role
        },
        organization: org ? { name: org.name, slug: org.slug } : null
      };
    }
    await databaseAdapter.acceptInvitation(token, auth.user.id);
    await databaseAdapter.updateUserSession(auth.user.id, invitation.organizationId);
    throw redirect(302, "/admin");
  }
  return {
    error: null,
    invitation: {
      email: invitation.email,
      role: invitation.role
    },
    organization: org ? { name: org.name, slug: org.slug } : null
  };
};
export {
  load
};
