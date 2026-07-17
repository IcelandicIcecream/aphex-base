import { p as private_env } from "./shared-server.js";
const authOptions = {
  requireEmailVerification: private_env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true"
};
export {
  authOptions as a
};
