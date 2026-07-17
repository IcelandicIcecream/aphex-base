import { redirect } from "@sveltejs/kit";
import { a as authOptions } from "../../../chunks/auth.config.js";
const load = async ({ locals, request }) => {
  const { aphexCMS } = locals;
  const session = await aphexCMS.auth?.getSession(request, aphexCMS.databaseAdapter);
  if (session?.session) {
    throw redirect(302, "/admin");
  }
  return { requireEmailVerification: authOptions.requireEmailVerification };
};
export {
  load
};
