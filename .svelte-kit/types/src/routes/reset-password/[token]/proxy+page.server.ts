// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../../(protected)/admin/$types';

export const load = async ({ locals, request }: Parameters<PageServerLoad>[0]) => {
	const { aphexCMS } = locals;

	const session = await aphexCMS.auth?.getSession(request, aphexCMS.databaseAdapter);

	// If user is already authenticated, redirect to admin
	if (session?.session) {
		throw redirect(302, '/admin');
	}

	return {};
};
