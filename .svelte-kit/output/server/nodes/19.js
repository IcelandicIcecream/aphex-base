import * as server from '../entries/pages/invitations/_page.server.ts.js';

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/19.Cr9rFuF4.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/DQFvJnrk.js","_app/immutable/chunks/Cyw3vPuA.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/XuJyaCpf.js","_app/immutable/chunks/DXzYXzwJ.js","_app/immutable/chunks/gUsD_cxt2.js","_app/immutable/chunks/Y4aNW56n2.js","_app/immutable/chunks/DQzmbhrf.js","_app/immutable/chunks/BQ8_va8C.js","_app/immutable/chunks/CX6SrRj2.js"];
export const stylesheets = [];
export const fonts = [];
