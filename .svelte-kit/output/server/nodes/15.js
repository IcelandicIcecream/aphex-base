import * as server from '../entries/pages/(site)/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(site)/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(site)/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.eDMF25Ew.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C1N8SbpF.js"];
export const stylesheets = ["_app/immutable/assets/15.BRgDTEtA.css"];
export const fonts = [];
