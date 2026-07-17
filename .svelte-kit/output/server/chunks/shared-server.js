//#region ../../node_modules/.pnpm/@sveltejs+kit@2.59.1_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_b04ba523657186a84b6a74c1243122db/node_modules/@sveltejs/kit/src/runtime/shared-server.js
/**
* `$env/dynamic/private`
* @type {Record<string, string>}
*/
var private_env = {};
/**
* `$env/dynamic/public`
* @type {Record<string, string>}
*/
var public_env = {};
/** @param {any} error */
var fix_stack_trace = (error) => error?.stack;
/** @type {(environment: Record<string, string>) => void} */
function set_private_env(environment) {
	private_env = environment;
}
/** @type {(environment: Record<string, string>) => void} */
function set_public_env(environment) {
	public_env = environment;
}
//#endregion
export { set_public_env as a, set_private_env as i, private_env as n, public_env as r, fix_stack_trace as t };
