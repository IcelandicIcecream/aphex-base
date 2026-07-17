import { p as hasCapability } from "../../../../../chunks/validator.js";
import "../../../../../chunks/dist.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/admin/settings/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (auth?.type === "session" && !hasCapability(auth, "org.settings")) throw redirect(302, "/admin/settings/account");
	return {};
};
//#endregion
export { load };
