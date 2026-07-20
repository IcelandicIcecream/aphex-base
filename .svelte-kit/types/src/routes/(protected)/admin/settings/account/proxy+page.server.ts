// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const auth = locals.auth;

	if (!auth || auth.type !== 'session') {
		throw new Error('No session found');
	}

	const databaseAdapter = locals.aphexCMS.databaseAdapter;

	const userProfile = await databaseAdapter.findUserProfileById(auth.user.id);
	const userPreferences = userProfile?.preferences || {};

	let hasChildOrganizations = false;
	if (auth.organizationId && databaseAdapter.hierarchyEnabled) {
		const childOrgs = await databaseAdapter.getChildOrganizations(auth.organizationId);
		hasChildOrganizations = childOrgs.length > 0;
	}

	return {
		userPreferences,
		hasChildOrganizations
	};
};
