import { g as attributes, h as clsx, e as escape_html, i as bind_props, k as head, a as ensure_array_like, d as derived } from "../../../../../../chunks/renderer.js";
import { C as Card, a as Card_content } from "../../../../../../chunks/card-content.js";
import "clsx";
import { S as Shield, R as Root, a as Sheet_header, b as Sheet_title, c as Sheet_description } from "../../../../../../chunks/index9.js";
import { B as Button } from "../../../../../../chunks/button.js";
import { I as Input } from "../../../../../../chunks/input.js";
import { c as cn } from "../../../../../../chunks/utils2.js";
import { L as Label } from "../../../../../../chunks/label.js";
import { C as Checkbox } from "../../../../../../chunks/checkbox.js";
import { B as Badge } from "../../../../../../chunks/badge.js";
import { S as Separator } from "../../../../../../chunks/separator.js";
import { A as ALL_CAPABILITIES } from "../../../../../../chunks/capabilities.js";
import "../../../../../../chunks/date-utils.js";
import { u as usePermissions, c as confirmDialog } from "../../../../../../chunks/confirm-dialog.svelte.js";
import { r as roles } from "../../../../../../chunks/instance2.js";
import { P as Pencil, T as Trash_2, S as Sheet_content } from "../../../../../../chunks/sheet-content.js";
import { i as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/index4.js";
import "../../../../../../chunks/mode-states.svelte.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { L as Lock } from "../../../../../../chunks/lock.js";
import { t as toast } from "../../../../../../chunks/toast-state.svelte.js";
function Textarea($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      value = void 0,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<textarea${attributes({
      "data-slot": "textarea",
      class: clsx(cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
      ...restProps
    })}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea>`);
    bind_props($$props, { ref, value });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const roles$1 = derived(() => data.roles);
    const perms = usePermissions();
    const canManageRoles = derived(() => perms.can("role.manage"));
    let editor = { kind: "closed" };
    let form = { name: "", description: "", capabilities: /* @__PURE__ */ new Set() };
    let saving = false;
    const CAPABILITY_GROUPS = [
      { title: "Documents", prefix: "document." },
      { title: "Assets", prefix: "asset." },
      { title: "Members", prefix: "member." },
      { title: "Organization", prefix: "org." },
      { title: "Keys & Roles", prefix: "" }
      // catch-all, resolved below
    ];
    function groupedCapabilities() {
      const groups = {};
      for (const cap of ALL_CAPABILITIES) {
        const match = CAPABILITY_GROUPS.find((g) => g.prefix && cap.startsWith(g.prefix));
        const title = match?.title ?? "Keys & Roles";
        (groups[title] ??= []).push(cap);
      }
      return CAPABILITY_GROUPS.map((g) => ({ title: g.title, items: groups[g.title] ?? [] })).filter((g) => g.items.length > 0);
    }
    function capabilityLabel(cap) {
      const suffix = cap.split(".").slice(1).join(".");
      return suffix.charAt(0).toUpperCase() + suffix.slice(1);
    }
    function openCreate() {
      form = { name: "", description: "", capabilities: /* @__PURE__ */ new Set() };
      editor = { kind: "create" };
    }
    function openEdit(role) {
      form = {
        name: role.name,
        description: role.description ?? "",
        capabilities: new Set(role.capabilities)
      };
      editor = { kind: "edit", role };
    }
    function closeEditor() {
      editor = { kind: "closed" };
    }
    const READ_IMPLIED_BY = {
      "document.create": "document.read",
      "document.update": "document.read",
      "document.delete": "document.read",
      "document.publish": "document.read",
      "document.unpublish": "document.read",
      "asset.upload": "asset.read",
      "asset.delete": "asset.read"
    };
    const WRITES_NEEDING = Object.entries(READ_IMPLIED_BY).reduce(
      (acc, [write, read]) => {
        if (!read) return acc;
        (acc[read] ??= []).push(write);
        return acc;
      },
      {}
    );
    function toggleCapability(cap, next) {
      const updated = new Set(form.capabilities);
      if (next) {
        updated.add(cap);
        const implied = READ_IMPLIED_BY[cap];
        if (implied) updated.add(implied);
      } else {
        const dependents = WRITES_NEEDING[cap] ?? [];
        if (dependents.some((w) => updated.has(w))) return;
        updated.delete(cap);
      }
      form.capabilities = updated;
    }
    function isImpliedRead(cap) {
      const dependents = WRITES_NEEDING[cap] ?? [];
      return dependents.some((w) => form.capabilities.has(w));
    }
    async function save() {
      saving = true;
      try {
        const capabilities = Array.from(form.capabilities);
        if (editor.kind === "create") {
          if (!form.name.trim()) {
            toast.error("Name is required");
            return;
          }
          const result = await roles.create({
            name: form.name.trim(),
            description: form.description.trim() || null,
            capabilities
          });
          if (!result.success) throw new Error(result.error || "Failed to create role");
          toast.success(`Role "${form.name.trim()}" created`);
        } else if (editor.kind === "edit") {
          const result = await roles.update(editor.role.name, { description: form.description.trim() || null, capabilities });
          if (!result.success) throw new Error(result.error || "Failed to update role");
          toast.success(`Role "${editor.role.name}" updated`);
        }
        closeEditor();
        await invalidateAll();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save role");
      } finally {
        saving = false;
      }
    }
    async function remove(role) {
      const confirmed = await confirmDialog({
        title: `Delete role "${role.name}"?`,
        description: "This cannot be undone. Members and pending invitations using this role will block the deletion.",
        confirmText: "Delete",
        variant: "destructive"
      });
      if (!confirmed) return;
      try {
        const result = await roles.remove(role.name);
        if (!result.success) throw new Error(result.error || "Failed to delete role");
        toast.success(`Role "${role.name}" deleted`);
        await invalidateAll();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete role");
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1qv5ab2", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Aphex CMS - Roles</title>`);
        });
      });
      $$renderer3.push(`<div class="grid gap-6"><div class="flex items-start justify-between gap-4"><div class="hidden sm:block"><h2 class="text-xl font-semibold">Roles</h2> <p class="text-muted-foreground text-sm">Define which members can do what. Built-in roles are always available; add custom roles to
				match how your team works.</p></div> `);
      if (canManageRoles()) {
        $$renderer3.push("<!--[0-->");
        Button($$renderer3, {
          onclick: openCreate,
          class: "shrink-0",
          children: ($$renderer4) => {
            Plus($$renderer4, { class: "mr-1 h-4 w-4" });
            $$renderer4.push(`<!----> New role`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="grid gap-3"><!--[-->`);
      const each_array = ensure_array_like(roles$1());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let role = each_array[$$index];
        if (Card) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            children: ($$renderer4) => {
              if (Card_content) {
                $$renderer4.push("<!--[-->");
                Card_content($$renderer4, {
                  class: "flex items-center gap-4 py-4",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="bg-muted flex h-10 w-10 items-center justify-center rounded-md">`);
                    if (role.isBuiltIn) {
                      $$renderer5.push("<!--[0-->");
                      Lock($$renderer5, { class: "text-muted-foreground h-4 w-4" });
                    } else {
                      $$renderer5.push("<!--[-1-->");
                      Shield($$renderer5, { class: "text-muted-foreground h-4 w-4" });
                    }
                    $$renderer5.push(`<!--]--></div> <div class="min-w-0 flex-1"><div class="flex items-center gap-2"><p class="truncate text-sm font-semibold capitalize">${escape_html(role.name)}</p> `);
                    if (role.isBuiltIn) {
                      $$renderer5.push("<!--[0-->");
                      Badge($$renderer5, {
                        variant: "secondary",
                        class: "text-[10px]",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Built-in`);
                        },
                        $$slots: { default: true }
                      });
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]--> `);
                    Badge($$renderer5, {
                      variant: "outline",
                      class: "text-[10px]",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(role.capabilities.length)} capabilit${escape_html(role.capabilities.length === 1 ? "y" : "ies")}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div> `);
                    if (role.description) {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<p class="text-muted-foreground mt-0.5 truncate text-xs">${escape_html(role.description)}</p>`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]--></div> `);
                    if (canManageRoles()) {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<div class="flex items-center gap-2">`);
                      Button($$renderer5, {
                        variant: "outline",
                        size: "sm",
                        onclick: () => openEdit(role),
                        children: ($$renderer6) => {
                          Pencil($$renderer6, { class: "mr-1 h-3.5 w-3.5" });
                          $$renderer6.push(`<!----> Edit`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      if (!role.isBuiltIn) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          variant: "outline",
                          size: "sm",
                          onclick: () => remove(role),
                          children: ($$renderer6) => {
                            Trash_2($$renderer6, { class: "text-destructive mr-1 h-3.5 w-3.5" });
                            $$renderer6.push(`<!----> Delete`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]-->`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
            },
            $$slots: { default: true }
          });
          $$renderer3.push("<!--]-->");
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push("<!--]-->");
        }
      }
      $$renderer3.push(`<!--]--></div></div> `);
      if (Root) {
        $$renderer3.push("<!--[-->");
        Root($$renderer3, {
          open: editor.kind !== "closed",
          onOpenChange: (o) => {
            if (!o) closeEditor();
          },
          children: ($$renderer4) => {
            if (Sheet_content) {
              $$renderer4.push("<!--[-->");
              Sheet_content($$renderer4, {
                class: "flex w-full flex-col gap-0 p-0 sm:max-w-lg",
                children: ($$renderer5) => {
                  if (Sheet_header) {
                    $$renderer5.push("<!--[-->");
                    Sheet_header($$renderer5, {
                      class: "border-b p-6",
                      children: ($$renderer6) => {
                        if (Sheet_title) {
                          $$renderer6.push("<!--[-->");
                          Sheet_title($$renderer6, {
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(editor.kind === "create" ? "Create role" : `Edit "${editor.kind === "edit" ? editor.role.name : ""}"`)}`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push("<!--]-->");
                        } else {
                          $$renderer6.push("<!--[!-->");
                          $$renderer6.push("<!--]-->");
                        }
                        $$renderer6.push(` `);
                        if (Sheet_description) {
                          $$renderer6.push("<!--[-->");
                          Sheet_description($$renderer6, {
                            children: ($$renderer7) => {
                              if (editor.kind === "edit" && editor.role.isBuiltIn) {
                                $$renderer7.push("<!--[0-->");
                                $$renderer7.push(`Built-in role. Capabilities can be tuned; the name is fixed.`);
                              } else {
                                $$renderer7.push("<!--[-1-->");
                                $$renderer7.push(`Pick the capabilities this role grants. Members assigned to this role will gain every
					checked permission.`);
                              }
                              $$renderer7.push(`<!--]-->`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push("<!--]-->");
                        } else {
                          $$renderer6.push("<!--[!-->");
                          $$renderer6.push("<!--]-->");
                        }
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` <div class="flex-1 space-y-6 overflow-y-auto p-6"><div class="space-y-2">`);
                  Label($$renderer5, {
                    for: "role-name",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Name`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    id: "role-name",
                    disabled: editor.kind === "edit",
                    placeholder: "e.g. translator",
                    get value() {
                      return form.name;
                    },
                    set value($$value) {
                      form.name = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----> `);
                  if (editor.kind === "create") {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<p class="text-muted-foreground text-xs">Letters, numbers, spaces, hyphens, or underscores. Used when assigning members.</p>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div> <div class="space-y-2">`);
                  Label($$renderer5, {
                    for: "role-description",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Description`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Textarea($$renderer5, {
                    id: "role-description",
                    placeholder: "What does this role do?",
                    rows: 2,
                    get value() {
                      return form.description;
                    },
                    set value($$value) {
                      form.description = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> `);
                  Separator($$renderer5, {});
                  $$renderer5.push(`<!----> <div class="space-y-4"><div class="flex items-center justify-between">`);
                  Label($$renderer5, {
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Capabilities`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <span class="text-muted-foreground text-xs">${escape_html(form.capabilities.size)} of ${escape_html(ALL_CAPABILITIES.length)} selected</span></div> <!--[-->`);
                  const each_array_1 = ensure_array_like(groupedCapabilities());
                  for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
                    let group = each_array_1[$$index_2];
                    $$renderer5.push(`<div class="space-y-2"><p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">${escape_html(group.title)}</p> <div class="grid gap-2"><!--[-->`);
                    const each_array_2 = ensure_array_like(group.items);
                    for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                      let cap = each_array_2[$$index_1];
                      const implied = isImpliedRead(cap);
                      $$renderer5.push(`<label class="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2">`);
                      Checkbox($$renderer5, {
                        checked: form.capabilities.has(cap),
                        disabled: implied,
                        onCheckedChange: (v) => toggleCapability(cap, v === true)
                      });
                      $$renderer5.push(`<!----> <div class="flex-1"><p class="text-sm font-medium">${escape_html(capabilityLabel(cap))}</p> <p class="text-muted-foreground font-mono text-[10px]">${escape_html(cap)}</p></div></label>`);
                    }
                    $$renderer5.push(`<!--]--></div></div>`);
                  }
                  $$renderer5.push(`<!--]--></div></div> <div class="flex items-center justify-end gap-2 border-t p-6">`);
                  Button($$renderer5, {
                    variant: "outline",
                    onclick: closeEditor,
                    disabled: saving,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Cancel`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    onclick: save,
                    disabled: saving,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(saving ? "Saving..." : editor.kind === "create" ? "Create role" : "Save changes")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div>`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
          },
          $$slots: { default: true }
        });
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
  });
}
export {
  _page as default
};
