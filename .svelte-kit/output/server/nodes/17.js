import * as server from '../entries/pages/invitations/_page.server.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/17.DIpysL3g.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/DgG-v0pL.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BTKFf_cQ.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/Dw6QdtyX2.js","_app/immutable/chunks/vKZplqn12.js","_app/immutable/chunks/BywZ7kef2.js","_app/immutable/chunks/Bsdhp00N2.js","_app/immutable/chunks/xOVXi32w2.js"];
export const stylesheets = [];
export const fonts = [];
