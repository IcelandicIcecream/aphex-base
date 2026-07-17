import "clsx";
import { s as setContext, r as run, m as getContext, j as bind_props, p as props_id, h as attributes, f as derived, g as spread_props, i as clsx, e as escape_html } from "./renderer.js";
import { S as SvelteMap } from "./mode-states.svelte.js";
import { n as noop, b as DialogRootState, k as DialogActionState, l as AlertDialogCancelState, m as DialogContentState, F as Focus_scope, o as afterSleep, p as Escape_layer, q as Dismissible_layer, r as Text_selection_layer, s as Scroll_lock, I as Icon, e as Dialog_overlay, h as Portal } from "./sheet-content.js";
import { b as buttonVariants } from "./button.js";
import { b as boxWith, c as createId, m as mergeProps } from "./create-id.js";
import { a as confirmDialogState, r as resolveConfirmDialog } from "./confirm-dialog.svelte.js";
import { c as cn } from "./utils2.js";
import { a as Dialog_title, D as Dialog_description } from "./dialog.js";
class AdminSlots {
  // Reactive so outlets re-render as entries come and go.
  #slots = new SvelteMap();
  /**
   * Register a snippet into a slot. Returns an unregister function — call it on
   * cleanup (returning it from an `$effect` does this automatically).
   */
  register(name, entry) {
    const current = run(() => this.#slots.get(name) ?? []);
    const next = [...current.filter((e) => e.id !== entry.id), entry].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    this.#slots.set(name, next);
    return () => {
      const list = run(() => this.#slots.get(name));
      if (!list) return;
      const filtered = list.filter((e) => e.id !== entry.id);
      if (filtered.length > 0) this.#slots.set(name, filtered);
      else this.#slots.delete(name);
    };
  }
  /** Entries registered in a slot, in sort order. Empty array if none. */
  get(name) {
    return this.#slots.get(name) ?? [];
  }
  /** Whether a slot has any entries — handy for conditional chrome. */
  has(name) {
    return this.get(name).length > 0;
  }
}
const ADMIN_SLOTS_KEY = /* @__PURE__ */ Symbol.for("aphex.admin.slots");
function setAdminSlots() {
  const slots = new AdminSlots();
  setContext(ADMIN_SLOTS_KEY, slots);
  return slots;
}
function useAdminSlots() {
  return getContext(ADMIN_SLOTS_KEY);
}
function Alert_dialog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      onOpenChange = noop,
      onOpenChangeComplete = noop,
      children
    } = $$props;
    DialogRootState.create({
      variant: boxWith(() => "alert-dialog"),
      open: boxWith(() => open, (v) => {
        open = v;
        onOpenChange(v);
      }),
      onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { open });
  });
}
function Alert_dialog_action$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      id = createId(uid),
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const actionState = DialogActionState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, actionState.props));
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
function Alert_dialog_cancel$1($$renderer, $$props) {
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
    const cancelState = AlertDialogCancelState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      disabled: boxWith(() => Boolean(disabled))
    });
    const mergedProps = derived(() => mergeProps(restProps, cancelState.props));
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
function Alert_dialog_content$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      children,
      child,
      ref = null,
      forceMount = false,
      interactOutsideBehavior = "ignore",
      onCloseAutoFocus = noop,
      onEscapeKeydown = noop,
      onOpenAutoFocus = noop,
      onInteractOutside = noop,
      preventScroll = true,
      trapFocus = true,
      restoreScrollDelay = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = DialogContentState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
    if (contentState.shouldRender || forceMount) {
      $$renderer2.push("<!--[0-->");
      {
        let focusScope = function($$renderer3, { props: focusScopeProps }) {
          Escape_layer($$renderer3, spread_props([
            mergedProps(),
            {
              enabled: contentState.root.opts.open.current,
              ref: contentState.opts.ref,
              onEscapeKeydown: (e) => {
                onEscapeKeydown(e);
                if (e.defaultPrevented) return;
                contentState.root.handleClose();
              },
              children: ($$renderer4) => {
                Dismissible_layer($$renderer4, spread_props([
                  mergedProps(),
                  {
                    ref: contentState.opts.ref,
                    enabled: contentState.root.opts.open.current,
                    interactOutsideBehavior,
                    onInteractOutside: (e) => {
                      onInteractOutside(e);
                      if (e.defaultPrevented) return;
                      contentState.root.handleClose();
                    },
                    children: ($$renderer5) => {
                      Text_selection_layer($$renderer5, spread_props([
                        mergedProps(),
                        {
                          ref: contentState.opts.ref,
                          enabled: contentState.root.opts.open.current,
                          children: ($$renderer6) => {
                            if (child) {
                              $$renderer6.push("<!--[0-->");
                              if (contentState.root.opts.open.current) {
                                $$renderer6.push("<!--[0-->");
                                Scroll_lock($$renderer6, { preventScroll, restoreScrollDelay });
                              } else {
                                $$renderer6.push("<!--[-1-->");
                              }
                              $$renderer6.push(`<!--]--> `);
                              child($$renderer6, {
                                props: mergeProps(mergedProps(), focusScopeProps),
                                ...contentState.snippetProps
                              });
                              $$renderer6.push(`<!---->`);
                            } else {
                              $$renderer6.push("<!--[-1-->");
                              Scroll_lock($$renderer6, { preventScroll });
                              $$renderer6.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
                              children?.($$renderer6);
                              $$renderer6.push(`<!----></div>`);
                            }
                            $$renderer6.push(`<!--]-->`);
                          },
                          $$slots: { default: true }
                        }
                      ]));
                    },
                    $$slots: { default: true }
                  }
                ]));
              },
              $$slots: { default: true }
            }
          ]));
        };
        Focus_scope($$renderer2, {
          ref: contentState.opts.ref,
          loop: true,
          trapFocus,
          enabled: contentState.root.opts.open.current,
          onCloseAutoFocus,
          onOpenAutoFocus: (e) => {
            onOpenAutoFocus(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            afterSleep(0, () => contentState.opts.ref.current?.focus());
          },
          focusScope
        });
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Chevron_right($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
    Icon($$renderer2, spread_props([
      { name: "chevron-right" },
      /**
       * @component @name ChevronRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
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
function Circle_check($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["path", { "d": "m9 12 2 2 4-4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-check" },
      /**
       * @component @name CircleCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check
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
function Alert_dialog_title($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_title) {
        $$renderer3.push("<!--[-->");
        Dialog_title($$renderer3, spread_props([
          {
            "data-slot": "alert-dialog-title",
            class: cn("text-lg font-semibold", className)
          },
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
function Alert_dialog_action($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Alert_dialog_action$1) {
        $$renderer3.push("<!--[-->");
        Alert_dialog_action$1($$renderer3, spread_props([
          {
            "data-slot": "alert-dialog-action",
            class: cn(buttonVariants(), className)
          },
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
function Alert_dialog_cancel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Alert_dialog_cancel$1) {
        $$renderer3.push("<!--[-->");
        Alert_dialog_cancel$1($$renderer3, spread_props([
          {
            "data-slot": "alert-dialog-cancel",
            class: cn(buttonVariants({ variant: "outline" }), className)
          },
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
function Alert_dialog_footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "alert-dialog-footer",
      class: clsx(cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "alert-dialog-header",
      class: clsx(cn("flex flex-col gap-2 text-center sm:text-left", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Alert_dialog_overlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_overlay) {
        $$renderer3.push("<!--[-->");
        Dialog_overlay($$renderer3, spread_props([
          {
            "data-slot": "alert-dialog-overlay",
            class: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
          },
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
function Alert_dialog_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      portalProps,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Portal) {
        $$renderer3.push("<!--[-->");
        Portal($$renderer3, spread_props([
          portalProps,
          {
            children: ($$renderer4) => {
              Alert_dialog_overlay($$renderer4, {});
              $$renderer4.push(`<!----> `);
              if (Alert_dialog_content$1) {
                $$renderer4.push("<!--[-->");
                Alert_dialog_content$1($$renderer4, spread_props([
                  {
                    "data-slot": "alert-dialog-content",
                    class: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className)
                  },
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
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
            },
            $$slots: { default: true }
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
function Alert_dialog_description($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Dialog_description) {
        $$renderer3.push("<!--[-->");
        Dialog_description($$renderer3, spread_props([
          {
            "data-slot": "alert-dialog-description",
            class: cn("text-muted-foreground text-sm", className)
          },
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
const Root = Alert_dialog;
function ConfirmDialogHost($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function handleOpenChange(open) {
      if (!open && confirmDialogState.open) {
        resolveConfirmDialog(false);
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Root($$renderer3, {
        onOpenChange: handleOpenChange,
        get open() {
          return confirmDialogState.open;
        },
        set open($$value) {
          confirmDialogState.open = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          Alert_dialog_content($$renderer4, {
            children: ($$renderer5) => {
              Alert_dialog_header($$renderer5, {
                children: ($$renderer6) => {
                  Alert_dialog_title($$renderer6, {
                    class: "break-words",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->${escape_html(confirmDialogState.title)}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  if (confirmDialogState.description) {
                    $$renderer6.push("<!--[0-->");
                    Alert_dialog_description($$renderer6, {
                      class: "break-words",
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!---->${escape_html(confirmDialogState.description)}`);
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer6.push("<!--[-1-->");
                  }
                  $$renderer6.push(`<!--]-->`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!----> `);
              Alert_dialog_footer($$renderer5, {
                children: ($$renderer6) => {
                  Alert_dialog_cancel($$renderer6, {
                    onclick: () => resolveConfirmDialog(false),
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->${escape_html(confirmDialogState.cancelText)}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  Alert_dialog_action($$renderer6, {
                    class: confirmDialogState.variant === "destructive" ? buttonVariants({ variant: "destructive" }) : void 0,
                    onclick: () => resolveConfirmDialog(true),
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->${escape_html(confirmDialogState.confirmText)}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!---->`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!---->`);
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
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
const activeTabState = createActiveTab();
export {
  Circle_check as C,
  Chevron_right as a,
  ConfirmDialogHost as b,
  activeTabState as c,
  setAdminSlots as s,
  useAdminSlots as u
};
