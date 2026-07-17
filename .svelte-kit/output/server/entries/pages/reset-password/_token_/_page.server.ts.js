import { redirect } from "@sveltejs/kit";
//#region src/routes/reset-password/[token]/+page.server.ts
var load = async ({ locals, request }) => {
	const { aphexCMS } = locals;
	if ((await aphexCMS.auth?.getSession(request, aphexCMS.databaseAdapter))?.session) throw redirect(302, "/admin");
	return {};
};
//#endregion
export { load };
