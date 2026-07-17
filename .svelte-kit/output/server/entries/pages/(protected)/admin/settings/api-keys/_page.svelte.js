import { p as props_id, h as attributes, j as bind_props, f as derived, g as spread_props, a as ensure_array_like, e as escape_html, l as head } from "../../../../../../chunks/renderer.js";
import { B as Badge } from "../../../../../../chunks/badge.js";
import { B as Button } from "../../../../../../chunks/button.js";
import { C as Card, a as Card_content } from "../../../../../../chunks/card-content.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../../../../chunks/card-title.js";
import "clsx";
import { I as Icon, A as Alert, T as Trash_2 } from "../../../../../../chunks/sheet-content.js";
import { A as Alert_description } from "../../../../../../chunks/alert-description.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title } from "../../../../../../chunks/index7.js";
import { I as Input } from "../../../../../../chunks/input.js";
import { L as Label } from "../../../../../../chunks/label.js";
import { c as SelectGroupState, R as Root$1, S as Select_trigger, a as Select_content, b as Select_item } from "../../../../../../chunks/index9.js";
import "../../../../../../chunks/date-utils.js";
import { i as invalidateAll } from "../../../../../../chunks/client.js";
import { u as usePermissions, c as confirmDialog } from "../../../../../../chunks/confirm-dialog.svelte.js";
import { b as apiKeys } from "../../../../../../chunks/instance2.js";
import "../../../../../../chunks/index5.js";
import "../../../../../../chunks/mode-states.svelte.js";
import { S as SettingsHeaderActions, P as Plus } from "../../../../../../chunks/SettingsHeaderActions.js";
import { C as Copy } from "../../../../../../chunks/copy.js";
import { t as toast } from "../../../../../../chunks/toast-state.svelte.js";
import { D as Dialog_description, a as Dialog_footer } from "../../../../../../chunks/dialog-description.js";
import { c as createId, b as boxWith, m as mergeProps } from "../../../../../../chunks/create-id.js";
function Select_group$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      children,
      child,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const groupState = SelectGroupState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, groupState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Key_round($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
        }
      ],
      [
        "circle",
        { "cx": "16.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "key-round" },
      /**
       * @component @name KeyRound
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi41ODYgMTcuNDE0QTIgMiAwIDAgMCAyIDE4LjgyOFYyMWExIDEgMCAwIDAgMSAxaDNhMSAxIDAgMCAwIDEtMXYtMWExIDEgMCAwIDEgMS0xaDFhMSAxIDAgMCAwIDEtMXYtMWExIDEgMCAwIDEgMS0xaC4xNzJhMiAyIDAgMCAwIDEuNDE0LS41ODZsLjgxNC0uODE0YTYuNSA2LjUgMCAxIDAtNC00eiIgLz4KICA8Y2lyY2xlIGN4PSIxNi41IiBjeT0iNy41IiByPSIuNSIgZmlsbD0iY3VycmVudENvbG9yIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/key-round
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Select_group($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { ref = null, $$slots, $$events, ...restProps } = $$props;
    if (Select_group$1) {
      $$renderer2.push("<!--[-->");
      Select_group$1($$renderer2, spread_props([{ "data-slot": "select-group" }, restProps]));
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    bind_props($$props, { ref });
  });
}
function ApiKeysSettings($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { apiKeys: apiKeys$1 } = $$props;
    const perms = usePermissions();
    const canManageApiKeys = derived(() => perms.can("apiKey.manage"));
    let createDialogOpen = false;
    let newKeyName = "";
    let newKeyMode = "read";
    const newKeyPermissions = derived(() => newKeyMode === "write" ? ["read", "write"] : ["read"]);
    let newKeyExpiresValue = "365";
    let newKeyExpiresInDays = 365;
    let createdKey = null;
    let isCreating = false;
    const expirationOptions = [
      { value: "30", label: "30 days" },
      { value: "90", label: "90 days" },
      { value: "365", label: "1 year" },
      { value: "never", label: "Never" }
    ];
    const expirationTriggerContent = derived(() => expirationOptions.find((opt) => opt.value === newKeyExpiresValue)?.label ?? "1 year");
    async function createApiKey() {
      if (!newKeyName.trim()) {
        toast.error("Please enter a key name");
        return;
      }
      isCreating = true;
      try {
        const result = await apiKeys.create({
          name: newKeyName.trim(),
          permissions: newKeyPermissions(),
          expiresInDays: newKeyExpiresInDays
        });
        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to create API key");
        }
        createdKey = {
          key: result.data.apiKey.key,
          name: result.data.apiKey.name ?? newKeyName
        };
        newKeyName = "";
        newKeyMode = "read";
        newKeyExpiresValue = "365";
        newKeyExpiresInDays = 365;
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create API key");
      } finally {
        isCreating = false;
      }
    }
    async function deleteApiKey(id, name) {
      const confirmed = await confirmDialog({
        title: `Delete "${name}"?`,
        description: "This action cannot be undone. Any integration using this key will lose access.",
        confirmText: "Delete",
        variant: "destructive"
      });
      if (!confirmed) return;
      try {
        const result = await apiKeys.remove(id);
        if (!result.success) throw new Error(result.error || "Failed to delete API key");
        toast.success(`API key "${name}" deleted`);
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete API key");
      }
    }
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
    function formatDate(date) {
      if (!date) return "Never";
      return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    function formatPermissions(permissions) {
      return permissions.join(" ");
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (canManageApiKeys()) {
        $$renderer3.push("<!--[0-->");
        SettingsHeaderActions($$renderer3, {
          children: ($$renderer4) => {
            Button($$renderer4, {
              size: "sm",
              onclick: () => {
                createdKey = null;
                createDialogOpen = true;
              },
              children: ($$renderer5) => {
                Plus($$renderer5, { class: "mr-1.5 h-4 w-4" });
                $$renderer5.push(`<!----> New token`);
              },
              $$slots: { default: true }
            });
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (Card) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          children: ($$renderer4) => {
            if (Card_header) {
              $$renderer4.push("<!--[-->");
              Card_header($$renderer4, {
                class: "gap-4",
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div>`);
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->API keys`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  if (Card_description) {
                    $$renderer5.push("<!--[-->");
                    Card_description($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Personal and service tokens scoped to this organization.`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(`</div> `);
                  if (canManageApiKeys()) {
                    $$renderer5.push("<!--[0-->");
                    Root($$renderer5, {
                      get open() {
                        return createDialogOpen;
                      },
                      set open($$value) {
                        createDialogOpen = $$value;
                        $$settled = false;
                      },
                      children: ($$renderer6) => {
                        Dialog_content($$renderer6, {
                          class: "sm:max-w-[500px]",
                          children: ($$renderer7) => {
                            if (createdKey) {
                              $$renderer7.push("<!--[0-->");
                              Dialog_header($$renderer7, {
                                children: ($$renderer8) => {
                                  Dialog_title($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->API key created`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Dialog_description($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Save this key securely. You won't be able to see it again.`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> <div class="space-y-4 py-4"><div>`);
                              Label($$renderer7, {
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Key name`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> <p class="mt-1 text-sm font-medium">${escape_html(createdKey.name)}</p></div> <div>`);
                              Label($$renderer7, {
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->API key`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> <div class="mt-1 flex gap-2">`);
                              Input($$renderer7, {
                                value: createdKey.key,
                                readonly: true,
                                class: "font-mono text-xs"
                              });
                              $$renderer7.push(`<!----> `);
                              Button($$renderer7, {
                                size: "sm",
                                variant: "outline",
                                onclick: () => copyToClipboard(createdKey.key),
                                children: ($$renderer8) => {
                                  Copy($$renderer8, { class: "mr-1.5 h-3.5 w-3.5" });
                                  $$renderer8.push(`<!----> Copy`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----></div></div></div> `);
                              Dialog_footer($$renderer7, {
                                children: ($$renderer8) => {
                                  Button($$renderer8, {
                                    onclick: () => {
                                      createdKey = null;
                                      createDialogOpen = false;
                                    },
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Done`);
                                    },
                                    $$slots: { default: true }
                                  });
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!---->`);
                            } else {
                              $$renderer7.push("<!--[-1-->");
                              Dialog_header($$renderer7, {
                                children: ($$renderer8) => {
                                  Dialog_title($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Create API key`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Dialog_description($$renderer8, {
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Generate a new token for programmatic access.`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> <div class="space-y-4 py-4"><div>`);
                              Label($$renderer7, {
                                for: "key-name",
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Key name`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> `);
                              Input($$renderer7, {
                                id: "key-name",
                                placeholder: "Production read",
                                class: "mt-1",
                                get value() {
                                  return newKeyName;
                                },
                                set value($$value) {
                                  newKeyName = $$value;
                                  $$settled = false;
                                }
                              });
                              $$renderer7.push(`<!----></div> <div>`);
                              Label($$renderer7, {
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Access level`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> <div class="mt-2 flex gap-2">`);
                              Button($$renderer7, {
                                variant: newKeyMode === "read" ? "default" : "outline",
                                size: "sm",
                                onclick: () => newKeyMode = "read",
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Read only`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> `);
                              Button($$renderer7, {
                                variant: newKeyMode === "write" ? "default" : "outline",
                                size: "sm",
                                onclick: () => newKeyMode = "write",
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Read + write`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----></div></div> <div>`);
                              Label($$renderer7, {
                                for: "expires",
                                children: ($$renderer8) => {
                                  $$renderer8.push(`<!---->Expires in`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!----> `);
                              if (Root$1) {
                                $$renderer7.push("<!--[-->");
                                Root$1($$renderer7, {
                                  type: "single",
                                  name: "expiration",
                                  onValueChange: (value) => {
                                    if (value) newKeyExpiresInDays = value === "never" ? void 0 : parseInt(value);
                                  },
                                  get value() {
                                    return newKeyExpiresValue;
                                  },
                                  set value($$value) {
                                    newKeyExpiresValue = $$value;
                                    $$settled = false;
                                  },
                                  children: ($$renderer8) => {
                                    if (Select_trigger) {
                                      $$renderer8.push("<!--[-->");
                                      Select_trigger($$renderer8, {
                                        class: "mt-1 w-[180px]",
                                        children: ($$renderer9) => {
                                          $$renderer9.push(`<!---->${escape_html(expirationTriggerContent())}`);
                                        },
                                        $$slots: { default: true }
                                      });
                                      $$renderer8.push("<!--]-->");
                                    } else {
                                      $$renderer8.push("<!--[!-->");
                                      $$renderer8.push("<!--]-->");
                                    }
                                    $$renderer8.push(` `);
                                    if (Select_content) {
                                      $$renderer8.push("<!--[-->");
                                      Select_content($$renderer8, {
                                        children: ($$renderer9) => {
                                          if (Select_group) {
                                            $$renderer9.push("<!--[-->");
                                            Select_group($$renderer9, {
                                              children: ($$renderer10) => {
                                                $$renderer10.push(`<!--[-->`);
                                                const each_array = ensure_array_like(expirationOptions);
                                                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                                                  let option = each_array[$$index];
                                                  if (Select_item) {
                                                    $$renderer10.push("<!--[-->");
                                                    Select_item($$renderer10, {
                                                      value: option.value,
                                                      label: option.label,
                                                      children: ($$renderer11) => {
                                                        $$renderer11.push(`<!---->${escape_html(option.label)}`);
                                                      },
                                                      $$slots: { default: true }
                                                    });
                                                    $$renderer10.push("<!--]-->");
                                                  } else {
                                                    $$renderer10.push("<!--[!-->");
                                                    $$renderer10.push("<!--]-->");
                                                  }
                                                }
                                                $$renderer10.push(`<!--]-->`);
                                              },
                                              $$slots: { default: true }
                                            });
                                            $$renderer9.push("<!--]-->");
                                          } else {
                                            $$renderer9.push("<!--[!-->");
                                            $$renderer9.push("<!--]-->");
                                          }
                                        },
                                        $$slots: { default: true }
                                      });
                                      $$renderer8.push("<!--]-->");
                                    } else {
                                      $$renderer8.push("<!--[!-->");
                                      $$renderer8.push("<!--]-->");
                                    }
                                  },
                                  $$slots: { default: true }
                                });
                                $$renderer7.push("<!--]-->");
                              } else {
                                $$renderer7.push("<!--[!-->");
                                $$renderer7.push("<!--]-->");
                              }
                              $$renderer7.push(`</div></div> `);
                              Dialog_footer($$renderer7, {
                                children: ($$renderer8) => {
                                  Button($$renderer8, {
                                    variant: "outline",
                                    onclick: () => createDialogOpen = false,
                                    disabled: isCreating,
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->Cancel`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!----> `);
                                  Button($$renderer8, {
                                    onclick: createApiKey,
                                    disabled: isCreating,
                                    children: ($$renderer9) => {
                                      $$renderer9.push(`<!---->${escape_html(isCreating ? "Creating..." : "Create key")}`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer8.push(`<!---->`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer7.push(`<!---->`);
                            }
                            $$renderer7.push(`<!--]-->`);
                          },
                          $$slots: { default: true }
                        });
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div> `);
                  if (Alert) {
                    $$renderer5.push("<!--[-->");
                    Alert($$renderer5, {
                      class: "bg-muted/50 text-muted-foreground px-3 py-2",
                      children: ($$renderer6) => {
                        if (Alert_description) {
                          $$renderer6.push("<!--[-->");
                          Alert_description($$renderer6, {
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->Tokens are shown once. Treat them like passwords: store them in a secrets manager and never
				commit them to source.`);
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
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
            $$renderer4.push(` `);
            if (Card_content) {
              $$renderer4.push("<!--[-->");
              Card_content($$renderer4, {
                class: "pt-0",
                children: ($$renderer5) => {
                  if (apiKeys$1.length === 0) {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center"><div class="bg-muted mb-4 rounded-full p-3">`);
                    Key_round($$renderer5, { class: "text-muted-foreground h-6 w-6" });
                    $$renderer5.push(`<!----></div> <p class="text-base font-medium">No API keys yet</p> <p class="text-muted-foreground mt-1 text-sm">Create a token to access CMS data programmatically.</p></div>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                    $$renderer5.push(`<div class="border-border hidden overflow-hidden rounded-lg border md:block"><div class="bg-muted/30 text-muted-foreground grid grid-cols-[minmax(140px,1fr)_96px_130px_100px_100px_76px] border-b px-4 py-2 text-xs font-medium tracking-wide uppercase"><div>Name</div> <div>Token</div> <div>Scope</div> <div>Created</div> <div>Last used</div> <div></div></div> <div class="divide-y"><!--[-->`);
                    const each_array_1 = ensure_array_like(apiKeys$1);
                    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                      let apiKey = each_array_1[$$index_1];
                      $$renderer5.push(`<div class="grid grid-cols-[minmax(140px,1fr)_96px_130px_100px_100px_76px] items-center px-4 py-3 text-sm"><div class="truncate font-medium">${escape_html(apiKey.name ?? "Unnamed key")}</div> <div class="text-muted-foreground truncate font-mono text-xs">shown once</div> <div>`);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "font-mono text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatPermissions(apiKey.permissions))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div class="text-muted-foreground">${escape_html(formatDate(apiKey.createdAt))}</div> <div class="text-muted-foreground">${escape_html(formatDate(apiKey.lastRequest))}</div> <div class="flex justify-end">`);
                      if (canManageApiKeys()) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          variant: "outline",
                          size: "sm",
                          onclick: () => deleteApiKey(apiKey.id, apiKey.name ?? "Unnamed"),
                          children: ($$renderer6) => {
                            $$renderer6.push(`<!---->Delete`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div></div>`);
                    }
                    $$renderer5.push(`<!--]--></div></div> <div class="space-y-3 md:hidden"><!--[-->`);
                    const each_array_2 = ensure_array_like(apiKeys$1);
                    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                      let apiKey = each_array_2[$$index_2];
                      $$renderer5.push(`<div class="border-border rounded-lg border p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(apiKey.name ?? "Unnamed key")}</p> <p class="text-muted-foreground mt-1 font-mono text-xs">Token shown once</p></div> `);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "font-mono text-xs",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatPermissions(apiKey.permissions))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div class="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p class="text-muted-foreground text-xs">Created</p> <p class="mt-1">${escape_html(formatDate(apiKey.createdAt))}</p></div> <div><p class="text-muted-foreground text-xs">Last used</p> <p class="mt-1">${escape_html(formatDate(apiKey.lastRequest))}</p></div></div> `);
                      if (canManageApiKeys()) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          class: "mt-4 w-full",
                          variant: "outline",
                          size: "sm",
                          onclick: () => deleteApiKey(apiKey.id, apiKey.name ?? "Unnamed"),
                          children: ($$renderer6) => {
                            Trash_2($$renderer6, { class: "mr-1.5 h-4 w-4" });
                            $$renderer6.push(`<!----> Delete key`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                    }
                    $$renderer5.push(`<!--]--></div>`);
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
      $$renderer3.push(` `);
      if (Card) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          class: "mt-5",
          children: ($$renderer4) => {
            if (Card_header) {
              $$renderer4.push("<!--[-->");
              Card_header($$renderer4, {
                children: ($$renderer5) => {
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      class: "text-base",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->API reference`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  if (Card_description) {
                    $$renderer5.push("<!--[-->");
                    Card_description($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Use the key in the <code class="bg-muted rounded px-1 py-0.5 text-xs">x-api-key</code> header.`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
            $$renderer4.push(` `);
            if (Card_content) {
              $$renderer4.push("<!--[-->");
              Card_content($$renderer4, {
                class: "space-y-4",
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="bg-muted relative rounded-md p-3 pr-11"><code class="block font-mono text-xs leading-relaxed break-all">curl -H "x-api-key: your_key_here"
				https://your-app.com/api/documents?type={schemaType}</code> `);
                  Button($$renderer5, {
                    variant: "ghost",
                    size: "icon",
                    class: "absolute top-2 right-2 h-7 w-7",
                    onclick: () => copyToClipboard('curl -H "x-api-key: your_key_here" https://your-app.com/api/documents?type={schemaType}'),
                    children: ($$renderer6) => {
                      Copy($$renderer6, { class: "h-3.5 w-3.5" });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div> <div class="grid gap-2 text-sm sm:grid-cols-2"><div class="border-border rounded-md border p-3"><p class="font-medium">Read endpoints</p> <div class="text-muted-foreground mt-2 space-y-1 font-mono text-xs"><p>GET /api/documents?type={type}</p> <p>GET /api/documents/{id}</p> <p>POST /api/documents/query</p> <p>GET /api/assets</p> <p>GET /api/schemas</p></div></div> <div class="border-border rounded-md border p-3"><p class="font-medium">Write endpoints</p> <div class="text-muted-foreground mt-2 space-y-1 font-mono text-xs"><p>POST /api/documents</p> <p>PUT /api/documents/{id}</p> <p>DELETE /api/documents/{id}</p> <p>POST /api/assets</p></div></div></div> <p class="text-muted-foreground text-xs leading-relaxed">Read-only keys can use read endpoints. Write keys can create, update, and delete documents and
			upload assets. <code class="bg-muted rounded px-1 py-0.5">POST /api/documents/query</code> only
			requires read access.</p>`);
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("jdanqk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Aphex CMS - API Keys</title>`);
      });
    });
    $$renderer2.push(`<div class="grid gap-5">`);
    ApiKeysSettings($$renderer2, {
      apiKeys: data.apiKeys,
      organizationRole: data.user.organizationRole
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
