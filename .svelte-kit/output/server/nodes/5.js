

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DxTZ88mF.js","_app/immutable/chunks/BBL2YEBp.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/EtqTmODC.js"];
export const stylesheets = [];
export const fonts = [];
