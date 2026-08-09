import { k as escape_html } from "../../chunks/server2.js";
import { t as page } from "../../chunks/state.js";
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+vite-plugin-svelte@7.2.0_svelte_da459b376329cf0681195252eb508031/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}
//#endregion
export { Error as default };
