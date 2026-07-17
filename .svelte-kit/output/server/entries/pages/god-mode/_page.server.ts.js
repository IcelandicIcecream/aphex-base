//#region src/routes/god-mode/+page.server.ts
var load = async ({ locals }) => {
	const { databaseAdapter } = locals.aphexCMS;
	return { instanceSettings: await databaseAdapter.getInstanceSettings() };
};
//#endregion
export { load };
