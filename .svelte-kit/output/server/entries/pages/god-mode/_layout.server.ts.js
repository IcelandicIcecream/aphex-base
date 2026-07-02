import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || auth.type !== "session") {
    throw redirect(302, "/login");
  }
  if (auth.user.role !== "super_admin") {
    throw redirect(302, "/admin");
  }
  return {
    unauthorized: false,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      role: auth.user.role
    }
  };
};
export {
  load
};
