

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DPfx22oS.js","_app/immutable/chunks/CuH1ETlL.js","_app/immutable/chunks/BYshYTyp.js","_app/immutable/chunks/CFnA_iiW.js"];
export const stylesheets = [];
export const fonts = [];
