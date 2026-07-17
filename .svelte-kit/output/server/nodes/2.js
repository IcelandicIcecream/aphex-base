import * as server from '../entries/pages/(protected)/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(protected)/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(protected)/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Bh6-TWEN.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/D0QA5rT2.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/t0pvKbc4.js","_app/immutable/chunks/EWJOPo4r.js","_app/immutable/chunks/BLWQXWUK.js","_app/immutable/chunks/D-5onARp.js","_app/immutable/chunks/BKdfayWh.js","_app/immutable/chunks/DUgSV4t1.js","_app/immutable/chunks/Cum25AMF.js","_app/immutable/chunks/VNaVgQIF.js","_app/immutable/chunks/D_VTZmzM.js","_app/immutable/chunks/EtqTmODC.js","_app/immutable/chunks/DCOhRI4T.js","_app/immutable/chunks/CwHMAHlE.js","_app/immutable/chunks/Bsdhp00N.js"];
export const stylesheets = ["_app/immutable/assets/client.C3NnK_la.css"];
export const fonts = [];
