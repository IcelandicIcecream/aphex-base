import "../../chunks/index-server.js";
import { Q as attr, l as head, vt as setContext } from "../../chunks/dev.js";
import "../../chunks/navigation.js";
import "../../chunks/dist4.js";
//#region src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cstyle%3e%20path%20{%20fill:%20%2318181b;%20}%20@media%20(prefers-color-scheme:%20dark)%20{%20path%20{%20fill:%20%23ffffff;%20}%20}%20%3c/style%3e%3cpath%20d='M13.956%203.43635L18.1456%203.43635L20.1641%203.43712C20.1666%203.43712%2020.169%203.43842%2020.1703%203.44054C20.1715%203.44258%2020.1737%203.44386%2020.1761%203.44396C22.062%203.5162%2023.7574%204.60042%2024.6713%206.33551L39.9102%2035.267C40.2138%2035.8434%2039.7924%2036.539%2039.1397%2036.5389L37.0679%2036.5386C36.7688%2036.5385%2036.4919%2036.3839%2036.3355%2036.1298L33.3801%2031.3267C33.3173%2031.2248%2033.234%2031.1371%2033.1354%2031.0693L24.6492%2025.2343C23.457%2024.4143%2022.9948%2022.8169%2023.5659%2021.4933L24.9105%2018.3752C25.0235%2018.1132%2025.0007%2017.813%2024.8495%2017.5726L22.392%2013.664C22.0261%2013.0821%2021.1578%2013.1443%2020.8721%2013.773L17.1504%2021.9631C16.9899%2022.3162%2017.0829%2022.7318%2017.3781%2022.9805L23.2854%2027.9596C23.4723%2028.1172%2023.5518%2028.3711%2023.488%2028.6038C23.2148%2029.5985%2022.4862%2030.3843%2021.5288%2030.7153L19.6562%2031.3627C18.9307%2031.6136%2018.1203%2031.4916%2017.4756%2031.0346L14.7977%2029.1361C14.3844%2028.8431%2013.807%2028.969%2013.5495%2029.4083L12.1813%2031.7429L10.9914%2033.8867C10.8996%2034.052%2010.7565%2034.1831%2010.5839%2034.26L5.47512%2036.5347C4.73679%2036.8634%203.99524%2036.0938%204.35059%2035.3675L15.9857%2011.5884C16.2933%2010.9599%2015.7701%2010.2485%2015.08%2010.3567L5.31911%2011.8868C4.98066%2011.9398%204.64386%2011.7884%204.46008%2011.5005L0.164217%204.77114C-0.203334%204.19538%200.213947%203.43746%200.898521%203.43741L13.956%203.43635Z'/%3e%3c/svg%3e";
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
