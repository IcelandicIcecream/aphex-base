import { n as private_env } from "./shared-server.js";
//#region src/lib/server/auth/auth.config.ts
var authOptions = { requireEmailVerification: private_env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true" };
//#endregion
export { authOptions as t };
