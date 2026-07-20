import { Q as attr, c as ensure_array_like, et as escape_html } from "./dev.js";
import "./navigation.js";
import { t as External_link } from "./external-link.js";
import "./ui.js";
import { t as Badge } from "./badge.js";
//#region src/routes/(protected)/admin/organizations/_components/OrganizationsList.svelte
function OrganizationsList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { orgs = [] } = $$props;
		function getInitials(name) {
			return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
		}
		if (orgs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-muted-foreground text-sm">No organizations yet</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="divide-y rounded-lg border"><!--[-->`);
			const each_array = ensure_array_like(orgs);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let org = each_array[$$index];
				$$renderer.push(`<div class="hover:bg-muted/50 flex items-center gap-4 p-4 transition-colors"><div class="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">${escape_html(getInitials(org.name))}</div> <div class="min-w-0 flex-1"><div class="flex items-baseline gap-2"><span class="font-medium">${escape_html(org.name)}</span> <span class="text-muted-foreground">/</span> <span class="text-muted-foreground text-sm">[${escape_html(org.slug)}]</span> `);
				if (org.isActive) {
					$$renderer.push("<!--[0-->");
					Badge($$renderer, {
						variant: "default",
						class: "text-xs",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Active`);
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="text-muted-foreground text-sm">`);
				if (org.ownerEmail) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`Owned by: ${escape_html(org.ownerEmail)}`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="text-muted-foreground text-sm">Total members: ${escape_html(org.memberCount)}</div></div> <button class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-2 transition-colors"${attr("disabled", false, true)}${attr("title", org.isActive ? "Go to dashboard" : "Switch to this organization")}>`);
				External_link($$renderer, { class: "size-4" });
				$$renderer.push(`<!----></button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { OrganizationsList as t };
