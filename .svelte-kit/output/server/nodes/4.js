import * as server from '../entries/pages/god-mode/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.vHFnhZ1F.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/Cj7l_oe9.js","_app/immutable/chunks/DPQKsuSm.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BbTi7cCD.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/Cefgltig.js","_app/immutable/chunks/Xp_QC0U5.js","_app/immutable/chunks/Bsdhp00N2.js"];
export const stylesheets = [];
export const fonts = [];
