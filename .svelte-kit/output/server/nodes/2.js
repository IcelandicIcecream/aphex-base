import * as server from '../entries/pages/(protected)/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(protected)/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(protected)/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DzFIvyn3.js","_app/immutable/chunks/iK_pMUV6.js","_app/immutable/chunks/CT-ODKIN.js","_app/immutable/chunks/DspQ8EXR.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DVj63na7.js","_app/immutable/chunks/Cyz-yav3.js","_app/immutable/chunks/Xp_QC0U5.js","_app/immutable/chunks/D0qHo88W.js","_app/immutable/chunks/ppegh-Cw.js","_app/immutable/chunks/D9otEtpz.js","_app/immutable/chunks/D-5onARp.js","_app/immutable/chunks/fNbcIorf.js","_app/immutable/chunks/Cefgltig.js","_app/immutable/chunks/IrhDjT_3.js","_app/immutable/chunks/DyClAzyV2.js","_app/immutable/chunks/BywZ7kef2.js","_app/immutable/chunks/DO8AZ4cD2.js","_app/immutable/chunks/CwcxXhyj.js","_app/immutable/chunks/Dj7JupLI.js","_app/immutable/chunks/Bsu_0J3u2.js","_app/immutable/chunks/Ce8rvkyQ2.js","_app/immutable/chunks/YVi236Rq2.js"];
export const stylesheets = ["_app/immutable/assets/confirm-dialog.CV-KWLNP.css","_app/immutable/assets/stega.BbRNaxnK.css"];
export const fonts = [];
