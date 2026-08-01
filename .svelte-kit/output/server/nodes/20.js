import * as server from '../entries/pages/reset-password/_token_/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reset-password/_token_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/reset-password/[token]/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.BRcev1Dt.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/Cj7l_oe9.js","_app/immutable/chunks/DPQKsuSm.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BbTi7cCD.js","_app/immutable/chunks/ppegh-Cw.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/DO8AZ4cD2.js","_app/immutable/chunks/Bsdhp00N2.js"];
export const stylesheets = [];
export const fonts = [];
