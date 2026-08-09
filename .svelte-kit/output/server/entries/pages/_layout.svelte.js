import { D as attr, c as head, x as setContext } from "../../chunks/server2.js";
import "../../chunks/internal.js";
import "../../chunks/navigation.js";
import "../../chunks/dist4.js";
//#region src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3csvg%20width='512'%20height='512'%20viewBox='0%200%20512%20512'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cstyle%3e%20path%20{%20fill:%20%2318181b;%20}%20circle%20{%20stroke:%20%2318181b;%20}%20@media%20(prefers-color-scheme:%20dark)%20{%20path%20{%20fill:%20%23ffffff;%20}%20circle%20{%20stroke:%20%23ffffff;%20}%20}%20%3c/style%3e%3cpath%20d='M260.616%20105.082C260.626%20105.082%20260.635%20105.087%20260.64%20105.096C260.645%20105.104%20260.653%20105.109%20260.663%20105.109L274.644%20105.112C282.748%20105.114%20290.156%20109.573%20294.103%20116.823L445.131%20394.268C445.878%20395.639%20445.62%20397.342%20444.501%20398.436L415.541%20426.751C413.86%20428.394%20411.074%20427.947%20410.002%20425.862L382.043%20371.473C381.842%20371.081%20381.567%20370.731%20381.235%20370.441L289.225%20290.294C285.241%20286.824%20283.96%20281.084%20286.099%20276.289L304.656%20234.68C305.138%20233.599%20305.041%20232.349%20304.398%20231.358L276.521%20188.455C275.032%20186.164%20271.601%20186.408%20270.436%20188.888L225.858%20283.804C225.177%20285.254%20225.568%20286.978%20226.806%20287.987L282.077%20333.058C283.735%20334.41%20284.439%20336.626%20283.859%20338.669C281.377%20347.419%20274.822%20354.323%20266.285%20357.18L248.665%20363.075C242.243%20365.224%20235.145%20364.2%20229.469%20360.306L201.046%20340.806C199.372%20339.658%20197.071%20340.181%20196.05%20341.943L162.258%20400.225C161.65%20401.273%20161.627%20402.558%20162.197%20403.623L203.526%20480.844C205.176%20483.928%20201.757%20487.262%20198.717%20485.534L95.0729%20426.613C93.4445%20425.688%2092.8431%20423.638%2093.7113%20421.972L228.285%20163.793C229.541%20161.383%20227.691%20158.532%20224.982%20158.704L30.3807%20171.043C27.4433%20171.23%2025.6193%20167.92%2027.341%20165.527L69.7919%20106.539C70.4501%20105.624%2071.5077%20105.082%2072.6326%20105.082L260.616%20105.082Z'/%3e%3ccircle%20cx='256'%20cy='256'%20r='225.28'%20stroke-width='61.44'/%3e%3c/svg%3e";
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.0_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_a887045103699dd2c0f44378f6608e89/node_modules/@aphexcms/visual-editing/dist/live-preview.svelte.js
var KEY = Symbol("aphex:live-preview");
var LivePreviewContext = class {
	current = null;
	currentType = null;
	currentId = null;
};
function setLivePreviewContext() {
	const ctx = new LivePreviewContext();
	setContext(KEY, ctx);
	return ctx;
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.0_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_a887045103699dd2c0f44378f6608e89/node_modules/@aphexcms/visual-editing/dist/AphexVisualOverlay.svelte
function AphexVisualOverlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Whether to use stega encoding for auto-detecting fields.
		* Must match the setting in DocumentEditor / aphex.config.ts. Default: true.
		*/
		let { stega = true, children } = $$props;
		setLivePreviewContext();
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.push(`<link rel="icon"${attr("href", favicon_default)}/>`);
	});
	AphexVisualOverlay($$renderer, {
		children: ($$renderer) => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _layout as default };
