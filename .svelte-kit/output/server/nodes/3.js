import * as server from '../entries/pages/(protected)/admin/settings/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(protected)/admin/settings/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(protected)/admin/settings/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.BGi5o0kO.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DWyUc2o-.js","_app/immutable/chunks/5FdN2e8i.js","_app/immutable/chunks/BrJc77IX2.js"];
export const stylesheets = [];
export const fonts = [];
