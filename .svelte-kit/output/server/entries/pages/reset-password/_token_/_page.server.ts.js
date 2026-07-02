import { redirect } from "@sveltejs/kit";
const load = async ({ locals, request }) => {
  const { aphexCMS } = locals;
  const session = await aphexCMS.auth?.getSession(request, aphexCMS.databaseAdapter);
  if (session?.session) {
    throw redirect(302, "/admin");
  }
  return {};
};
export {
  load
};
