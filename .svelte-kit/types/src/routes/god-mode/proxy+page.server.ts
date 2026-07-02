// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const { databaseAdapter } = locals.aphexCMS;
	const instanceSettings = await databaseAdapter.getInstanceSettings();

	return {
		instanceSettings
	};
};
