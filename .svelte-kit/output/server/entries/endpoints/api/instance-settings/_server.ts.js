import { json } from "@sveltejs/kit";
import { z } from "zod";
//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/api/schemas/instance.js
var updateInstanceSettingsRequest = z.object({ allowUserOrgCreation: z.boolean().optional() }).strict();
//#endregion
//#region src/routes/api/instance-settings/+server.ts
var GET = async ({ locals }) => {
	try {
		const { databaseAdapter } = locals.aphexCMS;
		const auth = locals.auth;
		if (!auth || auth.type !== "session") return json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, { status: 401 });
		return json({
			success: true,
			data: await databaseAdapter.getInstanceSettings()
		});
	} catch {
		return json({
			success: false,
			error: "Failed to fetch instance settings"
		}, { status: 500 });
	}
};
var PATCH = async ({ request, locals }) => {
	try {
		const { databaseAdapter } = locals.aphexCMS;
		const auth = locals.auth;
		if (!auth || auth.type !== "session") return json({
			success: false,
			error: "Unauthorized",
			message: "Session authentication required"
		}, { status: 401 });
		if (auth.user.role !== "super_admin") return json({
			success: false,
			error: "Forbidden",
			message: "Only super admins can update instance settings"
		}, { status: 403 });
		const body = await request.json();
		const parsed = updateInstanceSettingsRequest.safeParse(body);
		if (!parsed.success) return json({
			success: false,
			error: "Invalid request body",
			issues: parsed.error.issues
		}, { status: 400 });
		return json({
			success: true,
			data: await databaseAdapter.updateInstanceSettings(parsed.data)
		});
	} catch {
		return json({
			success: false,
			error: "Failed to update instance settings"
		}, { status: 500 });
	}
};
//#endregion
export { GET, PATCH };
