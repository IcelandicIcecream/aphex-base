import { t as authService } from "./service.js";
//#region src/lib/server/auth/index.ts
var authProvider = {
	getSession: (request, db) => authService.getSession(request, db),
	requireSession: (request, db) => authService.requireSession(request, db),
	validateApiKey: (request) => authService.validateApiKey(request),
	requireApiKey: (request, db, permission) => authService.requireApiKey(request, db, permission),
	getUserById: (userId) => authService.getUserById(userId),
	getUserByEmail: (email) => authService.getUserByEmail(email),
	changeUserName: (userId, name) => authService.changeUserName(userId, name),
	changeUserImage: (userId, image) => authService.changeUserImage(userId, image),
	requestPasswordReset: (email, redirectTo) => authService.requestPasswordReset(email, redirectTo),
	resetPassword: (token, newPassword) => authService.resetPassword(token, newPassword)
};
//#endregion
export { authProvider as t };
