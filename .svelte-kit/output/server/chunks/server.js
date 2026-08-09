//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/runtime/app/paths/internal/server.js
var base = "";
var assets = base;
var app_dir = "_app";
var initial = {
	base,
	assets
};
/**
* `base` could be overridden during rendering to be relative;
* this one's the original non-relative base path
*/
var initial_base = initial.base;
/**
* @param {{ base: string, assets: string }} paths
*/
function override(paths) {
	base = paths.base;
	assets = paths.assets;
}
function reset() {
	base = initial.base;
	assets = initial.assets;
}
/** @param {string} path */
function set_assets(path) {
	assets = initial.assets = path;
}
//#endregion
export { override as a, initial_base as i, assets as n, reset as o, base as r, set_assets as s, app_dir as t };
