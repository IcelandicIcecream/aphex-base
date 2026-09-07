import * as server from '../entries/pages/god-mode/_page.server.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+page.server.ts";
export const imports = ["_app/immutable/nodes/17.NJo7bIzj.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CC8Z-_yx.js","_app/immutable/chunks/DXzYXzwJ.js"];
export const stylesheets = [];
export const fonts = [];
