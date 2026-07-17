import * as server from '../entries/pages/invitations/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/invitations/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/invitations/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.D2xu50kN.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/rKt2x4fX.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/D61pnH3E.js","_app/immutable/chunks/Bzhjxm24.js","_app/immutable/chunks/D-5onARp.js","_app/immutable/chunks/EC7dP-4D.js","_app/immutable/chunks/BKdfayWh.js","_app/immutable/chunks/DUgSV4t1.js","_app/immutable/chunks/Cum25AMF.js","_app/immutable/chunks/VNaVgQIF.js","_app/immutable/chunks/D_VTZmzM.js","_app/immutable/chunks/EtqTmODC.js","_app/immutable/chunks/DCOhRI4T.js","_app/immutable/chunks/Bsdhp00N.js"];
export const stylesheets = ["_app/immutable/assets/client.ghdsr_qY.css"];
export const fonts = [];
