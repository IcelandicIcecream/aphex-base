import * as server from '../entries/pages/(site)/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(site)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(site)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.CtLBaatf.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/C1N8SbpF.js"];
export const stylesheets = ["_app/immutable/assets/4.CDyVucfH.css"];
export const fonts = [];
