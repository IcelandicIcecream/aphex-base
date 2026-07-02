

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.0GglfS61.js","_app/immutable/chunks/BARG7cSW.js","_app/immutable/chunks/CKdmS9oW.js","_app/immutable/chunks/c4ggtxFF.js"];
export const stylesheets = ["_app/immutable/assets/5.G-WQ4z9I.css"];
export const fonts = [];
