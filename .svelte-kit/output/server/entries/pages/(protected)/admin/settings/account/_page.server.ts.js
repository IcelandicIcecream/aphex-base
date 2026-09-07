import { t as email } from "../../../../../../chunks/email.js";
import { t as authOptions } from "../../../../../../chunks/auth.config.js";
//#region src/routes/(protected)/admin/settings/account/+page.server.ts
var load = async ({ locals }) => {
	const auth = locals.auth;
	if (!auth || auth.type !== "session") throw new Error("No session found");
	const databaseAdapter = locals.aphexCMS.databaseAdapter;
	const userPreferences = (await databaseAdapter.findUserProfileById(auth.user.id))?.preferences || {};
	let hasChildOrganizations = false;
	if (auth.organizationId && databaseAdapter.hierarchyEnabled) hasChildOrganizations = (await databaseAdapter.getChildOrganizations(auth.organizationId)).length > 0;
	const emailOtpAvailable = Boolean(authOptions.twoFactorMethods.includes("email") && email);
	return {
		userPreferences,
		hasChildOrganizations,
		totpAvailable: authOptions.twoFactorMethods.includes("totp") || !emailOtpAvailable,
		emailOtpAvailable
	};
};
//#endregion
export { load };
