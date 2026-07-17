import { s as derived } from "../../../../chunks/dev.js";
import { n as AdminApp } from "../../../../chunks/client.js";
import { t as page } from "../../../../chunks/state.js";
import { t as plugins } from "../../../../chunks/plugins.js";
import { t as activeTabState } from "../../../../chunks/activeTab.svelte.js";
import { t as schemaTypes } from "../../../../chunks/schemaTypes.js";
//#region src/routes/(protected)/admin/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const blockPreviews = {};
		let { data } = $$props;
		const capabilities = derived(() => page.data.rbac?.capabilities ?? []);
		const rbacRole = derived(() => page.data.rbac?.role ?? null);
		function handleTabChange(value) {
			if (activeTabState) activeTabState.value = value;
		}
		AdminApp($$renderer, {
			schemas: schemaTypes,
			plugins,
			blockPreviews,
			documentTypes: data.documentTypes,
			schemaError: data.schemaError,
			graphqlSettings: data.graphqlSettings,
			isReadOnly: data.isReadOnly,
			capabilities: capabilities(),
			rbacRole: rbacRole(),
			userPreferences: data.userPreferences,
			activeTab: activeTabState,
			handleTabChange,
			title: "Aphex CMS"
		});
	});
}
//#endregion
export { _page as default };
