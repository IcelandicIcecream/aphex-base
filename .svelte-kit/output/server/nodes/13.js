import * as server from '../entries/pages/god-mode/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.DwlRIM6i.js","_app/immutable/chunks/CuH1ETlL.js","_app/immutable/chunks/BYshYTyp.js","_app/immutable/chunks/_IjePubM.js","_app/immutable/chunks/BUbdJAKe.js","_app/immutable/chunks/DWnb8qnv.js","_app/immutable/chunks/61G43_m1.js","_app/immutable/chunks/BWyr2w-y.js","_app/immutable/chunks/R11S-GrI.js","_app/immutable/chunks/DgeYvy13.js","_app/immutable/chunks/BArnzh0S.js","_app/immutable/chunks/D8bLwq8p.js","_app/immutable/chunks/BhvYl8qp.js"];
export const stylesheets = [];
export const fonts = [];
