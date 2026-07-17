import { t as authService } from "../../../../chunks/service.js";
//#region src/routes/god-mode/organizations/+page.server.ts
var load = async ({ locals }) => {
	const { databaseAdapter } = locals.aphexCMS;
	const [allOrgs, instanceSettings] = await Promise.all([databaseAdapter.findAllOrganizations(), databaseAdapter.getInstanceSettings()]);
	return {
		organizations: await Promise.all(allOrgs.map(async (org) => {
			const members = await databaseAdapter.findOrganizationMembers(org.id);
			const owner = members.find((m) => m.role === "owner");
			let ownerEmail;
			if (owner) ownerEmail = (await authService.getUserById(owner.userId))?.email;
			return {
				id: org.id,
				name: org.name,
				slug: org.slug,
				role: "owner",
				isActive: false,
				createdBy: org.createdBy,
				createdAt: org.createdAt,
				memberCount: members.length,
				ownerEmail
			};
		})),
		instanceSettings
	};
};
//#endregion
export { load };
