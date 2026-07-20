import { l as head } from "../../../../../chunks/dev.js";
import { t as ActivityView } from "../../../../../chunks/ui.js";
//#region src/routes/(protected)/admin/activity/+page.svelte
function _page($$renderer) {
	head("lhwx4o", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Activity · Aphex</title>`);
		});
	});
	ActivityView($$renderer, {});
}
//#endregion
export { _page as default };
