import { t as private_env } from "./shared-server.js";
import { l as openFirstUser, o as allowlistEmail, s as claimCode } from "./server3.js";
//#region src/lib/server/auth/auth.config.ts
var ALL_TWO_FACTOR_METHODS = ["totp", "email"];
function isTwoFactorMethod(value) {
	return ALL_TWO_FACTOR_METHODS.includes(value);
}
/**
* Parses AUTH_TWO_FACTOR_METHODS, ignoring anything unrecognised. A typo falling
* back to the default is better than it silently removing a factor people rely
* on to sign in.
*/
function parseTwoFactorMethods(raw) {
	if (!raw) return ALL_TWO_FACTOR_METHODS;
	const parsed = raw.split(",").map((part) => part.trim().toLowerCase()).filter(isTwoFactorMethod);
	return parsed.length > 0 ? parsed : ALL_TWO_FACTOR_METHODS;
}
var authOptions = {
	requireEmailVerification: private_env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true",
	inviteOnly: private_env.AUTH_INVITE_ONLY !== "false",
	twoFactorMethods: parseTwoFactorMethods(private_env.AUTH_TWO_FACTOR_METHODS),
	allowAccountDeletion: true
};
/**
* How this instance gets its first administrator.
*
* Default: whoever signs up first becomes super admin — the same install flow as
* WordPress, Ghost, Strapi, Payload and Dokploy. It assumes you sign up promptly
* after deploying, because an instance left reachable before that belongs to
* whoever finds the URL first.
*
* Two opt-in ways to close that window, and one way to opt out entirely:
*
* - `APHEX_BOOTSTRAP_EMAIL=you@example.com` — only that address is promoted.
* - `APHEX_BOOTSTRAP_CLAIM_CODE=true` — sign-up also needs a code logged at
*   startup, which the sign-up form prompts for. Note the claim window closes on
*   the first sign-up, not on the code being used.
* - `never()` — no promotion at all; provision the first admin out of band.
*
* See the Authentication docs for the trade-offs.
*/
var bootstrapPolicy = private_env.APHEX_BOOTSTRAP_EMAIL ? allowlistEmail(private_env.APHEX_BOOTSTRAP_EMAIL) : private_env.APHEX_BOOTSTRAP_CLAIM_CODE === "true" ? claimCode() : openFirstUser();
//#endregion
export { bootstrapPolicy as n, authOptions as t };
