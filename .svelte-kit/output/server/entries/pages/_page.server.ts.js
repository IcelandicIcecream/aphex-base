import { n as systemContext } from "../../chunks/auth-helpers.js";
//#region src/routes/+page.server.ts
var load = async ({ locals }) => {
	const [org] = await locals.aphexCMS.databaseAdapter.findAllOrganizations();
	if (!org) return { pages: [] };
	const context = {
		...systemContext(org.id),
		perspective: "published"
	};
	const { docs } = await locals.aphexCMS.localAPI.collections.page.find(context, {
		limit: 20,
		sort: ["-updatedAt"],
		public: true
	});
	return { pages: docs };
};
//#endregion
export { load };
