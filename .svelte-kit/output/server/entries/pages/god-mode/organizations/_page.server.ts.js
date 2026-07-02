import { a as authService } from "../../../../chunks/service.js";
const load = async ({ locals }) => {
  const { databaseAdapter } = locals.aphexCMS;
  const [allOrgs, instanceSettings] = await Promise.all([
    databaseAdapter.findAllOrganizations(),
    databaseAdapter.getInstanceSettings()
  ]);
  const orgsWithDetails = await Promise.all(
    allOrgs.map(async (org) => {
      const members = await databaseAdapter.findOrganizationMembers(org.id);
      const owner = members.find((m) => m.role === "owner");
      let ownerEmail;
      if (owner) {
        const ownerUser = await authService.getUserById(owner.userId);
        ownerEmail = ownerUser?.email;
      }
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: "owner",
        isActive: false,
        createdBy: org.createdBy,
        createdAt: org.createdAt,
        memberCount: members.length,
        ownerEmail
      };
    })
  );
  return {
    organizations: orgsWithDetails,
    instanceSettings
  };
};
export {
  load
};
