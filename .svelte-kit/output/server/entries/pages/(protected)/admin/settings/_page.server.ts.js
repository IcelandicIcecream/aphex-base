import { redirect } from "@sveltejs/kit";
import { h as hasCapability } from "../../../../../chunks/capabilities.js";
import "../../../../../chunks/date-utils.js";
import "../../../../../chunks/instance2.js";
const load = async ({ locals }) => {
  const auth = locals.auth;
  if (auth?.type === "session" && !hasCapability(auth, "org.settings")) {
    throw redirect(302, "/admin/settings/account");
  }
  return {};
};
export {
  load
};
