import { p as props_id, h as attributes, j as bind_props, f as derived, g as spread_props, a as ensure_array_like, e as escape_html, b as attr } from "./renderer.js";
import { c as DialogTriggerState } from "./sheet-content.js";
import { c as createId, b as boxWith, m as mergeProps } from "./create-id.js";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./state.svelte.js";
import { B as Badge } from "./badge.js";
import "./date-utils.js";
import "./client.js";
import "./button.js";
import "./instance2.js";
import "clsx";
import "./index5.js";
import "./mode-states.svelte.js";
import { E as External_link } from "./external-link.js";
function Dialog_trigger$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      children,
      child,
      disabled = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = DialogTriggerState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      disabled: boxWith(() => Boolean(disabled))
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Dialog_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { ref = null, $$slots, $$events, ...restProps } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_trigger$1) {
        $$renderer3.push("<!--[-->");
        Dialog_trigger$1($$renderer3, spread_props([
          { "data-slot": "dialog-trigger" },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref });
  });
}
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
  Dialog_trigger as D,
  OrganizationsList as O
};
