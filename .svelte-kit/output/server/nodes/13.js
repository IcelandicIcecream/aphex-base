import * as server from '../entries/pages/god-mode/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.BYApf6wH.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DCOhRI4T.js","_app/immutable/chunks/DUgSV4t1.js"];
export const stylesheets = [];
export const fonts = [];
