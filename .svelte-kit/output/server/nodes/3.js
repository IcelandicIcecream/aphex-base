import * as server from '../entries/pages/(protected)/admin/settings/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(protected)/admin/settings/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(protected)/admin/settings/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.4-Xs4o-K.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/EWJOPo4r.js","_app/immutable/chunks/D0QA5rT2.js","_app/immutable/chunks/BrJc77IX.js"];
export const stylesheets = [];
export const fonts = [];
