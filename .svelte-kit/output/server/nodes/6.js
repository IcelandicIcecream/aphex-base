import * as server from '../entries/pages/(protected)/admin/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(protected)/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(protected)/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.Cb1JnFQi.js","_app/immutable/chunks/BARG7cSW.js","_app/immutable/chunks/CKdmS9oW.js","_app/immutable/chunks/gYbdV4Nd.js","_app/immutable/chunks/UjPMXPgc.js","_app/immutable/chunks/h6_VJW8I.js","_app/immutable/chunks/BClHcXt1.js","_app/immutable/chunks/CX4vWi3c.js","_app/immutable/chunks/C2RvHdGd.js","_app/immutable/chunks/Bo8QhFgd.js","_app/immutable/chunks/BSi0KH58.js","_app/immutable/chunks/CthiXW5T.js","_app/immutable/chunks/C02-GEj-.js","_app/immutable/chunks/qn6qK7kI.js","_app/immutable/chunks/DkjiSo46.js","_app/immutable/chunks/Cpo44d73.js","_app/immutable/chunks/De8yTCJm.js","_app/immutable/chunks/BNeIWknf.js","_app/immutable/chunks/27Ql8Q9d.js","_app/immutable/chunks/BkohKciM.js","_app/immutable/chunks/oh2qLylc.js","_app/immutable/chunks/DJ9mY8mB.js","_app/immutable/chunks/c4ggtxFF.js","_app/immutable/chunks/CHGILBPb.js","_app/immutable/chunks/BjGxCChY.js","_app/immutable/chunks/BtODoU7S.js","_app/immutable/chunks/DS6GWw6A.js"];
export const stylesheets = ["_app/immutable/assets/PermissionsDebug.CHhzONVg.css"];
export const fonts = [];
