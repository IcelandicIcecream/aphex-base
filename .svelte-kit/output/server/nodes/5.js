import * as server from '../entries/pages/god-mode/_layout.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/god-mode/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/god-mode/+layout.server.ts";
export const imports = ["_app/immutable/nodes/5.BYJPdOzv.js","_app/immutable/chunks/Dnm4jccR.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/DQFvJnrk.js","_app/immutable/chunks/Cyw3vPuA.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BOdA3yFl.js","_app/immutable/chunks/XuJyaCpf.js","_app/immutable/chunks/DXzYXzwJ.js","_app/immutable/chunks/BH8S5UaW.js","_app/immutable/chunks/BGA0Uifo.js","_app/immutable/chunks/BQ8_va8C.js"];
export const stylesheets = [];
export const fonts = [];
