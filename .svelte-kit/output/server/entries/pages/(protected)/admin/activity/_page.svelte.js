import { a as derived, c as head } from "../../../../../chunks/server2.js";
import { s as hasCapability } from "../../../../../chunks/resolver.js";
import "../../../../../chunks/dist.js";
import { t as ActivityView } from "../../../../../chunks/ui.js";
//#region src/routes/(protected)/admin/activity/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const canControlJobs = derived(() => hasCapability(data.auth, "org.settings"));
		const isSuperAdmin = derived(() => data.auth.user.role === "super_admin");
		head("lhwx4o", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Activity · Aphex</title>`);
			});
		});
		ActivityView($$renderer, {
			canControlJobs: canControlJobs(),
			isSuperAdmin: isSuperAdmin()
		});
	});
}
//#endregion
export { _page as default };
