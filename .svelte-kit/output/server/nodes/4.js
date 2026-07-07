import * as server from '../entries/pages/god-mode/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.DvMHy1o1.js","_app/immutable/chunks/BARG7cSW.js","_app/immutable/chunks/CKdmS9oW.js","_app/immutable/chunks/UjPMXPgc.js","_app/immutable/chunks/h6_VJW8I.js","_app/immutable/chunks/CthiXW5T.js","_app/immutable/chunks/CX4vWi3c.js","_app/immutable/chunks/BClHcXt1.js","_app/immutable/chunks/C2RvHdGd.js","_app/immutable/chunks/BNeIWknf.js","_app/immutable/chunks/27Ql8Q9d.js","_app/immutable/chunks/BkohKciM.js","_app/immutable/chunks/oh2qLylc.js","_app/immutable/chunks/qn6qK7kI.js","_app/immutable/chunks/BSi0KH58.js","_app/immutable/chunks/DSFL3bnU.js","_app/immutable/chunks/DkjiSo46.js","_app/immutable/chunks/Cpo44d73.js","_app/immutable/chunks/C02-GEj-.js"];
export const stylesheets = [];
export const fonts = [];
