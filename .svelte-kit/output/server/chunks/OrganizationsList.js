import { a as ensure_array_like, e as escape_html, b as attr } from "./renderer.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./client.js";
import { B as Badge } from "./badge.js";
import "./date-utils.js";
import "./button.js";
import "./instance2.js";
import "clsx";
import "./sheet-content.js";
import "./index4.js";
import "./mode-states.svelte.js";
import { E as External_link } from "./external-link.js";
function OrganizationsList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { orgs = [] } = $$props;
    let switchingOrgId = null;
    function getInitials(name) {
      return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
    }
    if (orgs.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-muted-foreground text-sm">No organizations yet</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y rounded-lg border"><!--[-->`);
      const each_array = ensure_array_like(orgs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let org = each_array[$$index];
        $$renderer2.push(`<div class="hover:bg-muted/50 flex items-center gap-4 p-4 transition-colors"><div class="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">${escape_html(getInitials(org.name))}</div> <div class="min-w-0 flex-1"><div class="flex items-baseline gap-2"><span class="font-medium">${escape_html(org.name)}</span> <span class="text-muted-foreground">/</span> <span class="text-muted-foreground text-sm">[${escape_html(org.slug)}]</span> `);
        if (org.isActive) {
          $$renderer2.push("<!--[0-->");
          Badge($$renderer2, {
            variant: "default",
            class: "text-xs",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Active`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="text-muted-foreground text-sm">`);
        if (org.ownerEmail) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`Owned by: ${escape_html(org.ownerEmail)}`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="text-muted-foreground text-sm">Total members: ${escape_html(org.memberCount)}</div></div> <button class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-2 transition-colors"${attr("disabled", switchingOrgId !== null, true)}${attr("title", org.isActive ? "Go to dashboard" : "Switch to this organization")}>`);
        External_link($$renderer2, { class: "size-4" });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  OrganizationsList as O
};
