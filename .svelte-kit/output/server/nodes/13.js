import * as server from '../entries/pages/god-mode/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.BDQWs4sW.js","_app/immutable/chunks/BARG7cSW.js","_app/immutable/chunks/CKdmS9oW.js","_app/immutable/chunks/UjPMXPgc.js","_app/immutable/chunks/h6_VJW8I.js","_app/immutable/chunks/Bo8QhFgd.js","_app/immutable/chunks/CX4vWi3c.js","_app/immutable/chunks/BSi0KH58.js","_app/immutable/chunks/CHGILBPb.js","_app/immutable/chunks/CthiXW5T.js","_app/immutable/chunks/C02-GEj-.js","_app/immutable/chunks/qn6qK7kI.js","_app/immutable/chunks/Cpo44d73.js"];
export const stylesheets = [];
export const fonts = [];
