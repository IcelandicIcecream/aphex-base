import { l as head } from "../../../../../../chunks/dev.js";
import { r as PluginSettingsPanel } from "../../../../../../chunks/stega.js";
import "../../../../../../chunks/ui.js";
import { t as plugins } from "../../../../../../chunks/plugins.js";
//#region src/routes/(protected)/admin/settings/plugins/+page.svelte
function _page($$renderer) {
	head("11j18xl", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Aphex CMS - Plugin settings</title>`);
		});
	});
	$$renderer.push(`<div class="grid gap-5">`);
	PluginSettingsPanel($$renderer, { plugins });
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _page as default };
