import { c as isInstanceUnclaimed } from "../../../chunks/server3.js";
import { t as authOptions } from "../../../chunks/auth.config.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.ts
var load = async ({ locals, request }) => {
	const { aphexCMS } = locals;
	if ((await aphexCMS.auth?.getSession(request, aphexCMS.databaseAdapter))?.session) throw redirect(302, "/admin");
	return {
		requireEmailVerification: authOptions.requireEmailVerification,
		unclaimed: await isInstanceUnclaimed(aphexCMS.databaseAdapter)
	};
};
//#endregion
export { load };
