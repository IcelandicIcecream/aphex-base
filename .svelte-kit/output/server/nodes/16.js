import * as server from '../entries/pages/(site)/_slug_/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(site)/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(site)/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.Bkvco5Xw.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/umA67tns.js","_app/immutable/chunks/DQFvJnrk.js","_app/immutable/chunks/Cyw3vPuA.js","_app/immutable/chunks/D-5onARp.js","_app/immutable/chunks/kdnaFRFL.js","_app/immutable/chunks/C1N8SbpF.js"];
export const stylesheets = ["_app/immutable/assets/16.DUEW3f0U.css"];
export const fonts = [];
