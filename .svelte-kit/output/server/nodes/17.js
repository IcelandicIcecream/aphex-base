import * as server from '../entries/pages/invitations/_page.server.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/17.BQPX6V-J.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/CT-ODKIN.js","_app/immutable/chunks/DspQ8EXR.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/DyClAzyV2.js","_app/immutable/chunks/IrhDjT_3.js","_app/immutable/chunks/BywZ7kef2.js","_app/immutable/chunks/Ce8rvkyQ2.js","_app/immutable/chunks/BUJYKzO22.js"];
export const stylesheets = [];
export const fonts = [];
