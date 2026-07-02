const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw new Error("No session found");
  }
  const { databaseAdapter, rolesService } = locals.aphexCMS;
  let pendingInvitations = [];
  if (auth.organizationId) {
    const invitations = await databaseAdapter.findOrganizationInvitations(auth.organizationId);
    pendingInvitations = invitations.filter(
      (inv) => !inv.acceptedAt && inv.expiresAt && inv.expiresAt > /* @__PURE__ */ new Date()
    );
  }
  const allRoles = auth.organizationId ? await rolesService.listRoles(auth.organizationId) : [];
  const inviteRoles = allRoles.filter((r) => r.name !== "owner").map((r) => ({ name: r.name, description: r.description }));
  return {
    pendingInvitations,
    inviteRoles
  };
};
export {
  load
};
