import * as server from '../entries/pages/god-mode/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.Dge5xTGP.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/CT-ODKIN.js","_app/immutable/chunks/DspQ8EXR.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DVj63na7.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/Cefgltig.js","_app/immutable/chunks/Xp_QC0U5.js","_app/immutable/chunks/Ce8rvkyQ2.js"];
export const stylesheets = [];
export const fonts = [];
