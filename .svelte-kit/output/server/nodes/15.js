import * as server from '../entries/pages/god-mode/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.CrWCixid.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DO8AZ4cD2.js","_app/immutable/chunks/D0qHo88W.js"];
export const stylesheets = [];
export const fonts = [];
