import { error } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw error(401, "Not authenticated");
  }
  const { rolesService } = locals.aphexCMS;
  const roles = await rolesService.listRoles(auth.organizationId);
  return {
    roles,
    canManageRoles: auth.capabilities?.includes("role.manage") ?? false
  };
};
export {
  load
};
