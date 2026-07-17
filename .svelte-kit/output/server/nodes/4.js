import * as server from '../entries/pages/god-mode/_layout.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+layout.server.ts";
export const imports = ["_app/immutable/nodes/4.RMm8-5Ru.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/rKt2x4fX.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/D61pnH3E.js","_app/immutable/chunks/EC7dP-4D.js","_app/immutable/chunks/BKdfayWh.js","_app/immutable/chunks/Cum25AMF.js","_app/immutable/chunks/DUgSV4t1.js","_app/immutable/chunks/Bsdhp00N.js"];
export const stylesheets = [];
export const fonts = [];
