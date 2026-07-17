import "./dev.js";
//#region src/lib/stores/activeTab.svelte.ts
function createActiveTab() {
	let activeTab = "structure";
	return {
		get value() {
			return activeTab;
		},
		set value(val) {
			activeTab = val;
		}
	};
}
var activeTabState = createActiveTab();
//#endregion
export { activeTabState as t };
