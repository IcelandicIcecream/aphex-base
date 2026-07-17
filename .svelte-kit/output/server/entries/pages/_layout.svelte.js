import "../../chunks/index-server.js";
import { $ as attr, u as head, yt as setContext } from "../../chunks/dev.js";
import "../../chunks/navigation.js";
import "../../chunks/dist4.js";
//#region src/lib/assets/favicon.svg
var favicon_default = "/_app/immutable/assets/favicon.DN4o9Qxv.svg";
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.2.0_@sveltejs+kit@2.59.1_@opentelemetry+api@1.9.0_@sveltejs+_969cc3b7339c2c905fd2d4f5f98623d0/node_modules/@aphexcms/visual-editing/dist/live-preview.svelte.js
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
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.2.0_@sveltejs+kit@2.59.1_@opentelemetry+api@1.9.0_@sveltejs+_969cc3b7339c2c905fd2d4f5f98623d0/node_modules/@aphexcms/visual-editing/dist/AphexVisualOverlay.svelte
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
