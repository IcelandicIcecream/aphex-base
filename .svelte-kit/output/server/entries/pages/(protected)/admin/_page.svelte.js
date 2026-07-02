import { m as setContext, d as derived, p as props_id, g as attributes, i as bind_props, h as clsx, f as spread_props, c as attr_class, s as stringify, b as attr, e as escape_html, a as ensure_array_like, ad as attr_style, k as head } from "../../../../chunks/renderer.js";
import { c as cmsLogger } from "../../../../chunks/date-utils.js";
import { B as Button } from "../../../../chunks/button.js";
import { B as Badge } from "../../../../chunks/badge.js";
import { c as assets, d as documents, A as ApiError } from "../../../../chunks/instance2.js";
import "clsx";
import { C as Context, a0 as RovingFocusGroup, w as watch, n as noop, I as Icon, a1 as Image, T as Trash_2, X, a2 as Alert } from "../../../../chunks/sheet-content.js";
import { p as page } from "../../../../chunks/index3.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import { g as goto } from "../../../../chunks/client.js";
import "../../../../chunks/index4.js";
import { c as cn } from "../../../../chunks/utils2.js";
import { S as SvelteMap, c as SvelteSet, d as SvelteURLSearchParams } from "../../../../chunks/mode-states.svelte.js";
import { a as attachRef, j as boolToTrueOrUndef, c as createBitsAttrs, d as createId, e as boxWith, m as mergeProps } from "../../../../chunks/create-id.js";
import { u as usePermissions, c as confirmDialog, s as setPermissionsContext } from "../../../../chunks/confirm-dialog.svelte.js";
import { c as collectReferenceIds } from "../../../../chunks/reference-walk.js";
import { E as External_link } from "../../../../chunks/external-link.js";
import { t as toast } from "../../../../chunks/toast-state.svelte.js";
import { I as Input } from "../../../../chunks/input.js";
import { L as Label } from "../../../../chunks/label.js";
import { S as Separator } from "../../../../chunks/separator.js";
import { C as Checkbox } from "../../../../chunks/checkbox.js";
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title } from "../../../../chunks/index6.js";
import { C as Circle_check, a as Chevron_right, b as ConfirmDialogHost, c as activeTabState } from "../../../../chunks/activeTab.svelte.js";
import { s as schemaTypes } from "../../../../chunks/index8.js";
function sortObject(item) {
  if (item === null || typeof item !== "object")
    return item;
  if (Array.isArray(item)) {
    return item.map(sortObject);
  }
  const sortedKeys = Object.keys(item).sort();
  const sortedObj = {};
  for (const key of sortedKeys) {
    sortedObj[key] = sortObject(item[key]);
  }
  return sortedObj;
}
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
function createContentHash(data, includeTimestamp = true) {
  const hashData = includeTimestamp ? {
    ...data,
    _lastModified: (/* @__PURE__ */ new Date()).toISOString()
  } : data;
  const stableJson = JSON.stringify(sortObject(hashData));
  return simpleHash(stableJson);
}
function createPublishedHash(data) {
  return createContentHash(data, false);
}
function hasUnpublishedChanges(draftData, publishedHash) {
  if (!publishedHash)
    return true;
  const publishedDataHash = createPublishedHash(draftData);
  return publishedDataHash !== publishedHash;
}
const SCHEMA_CONTEXT_KEY = /* @__PURE__ */ Symbol("aphex-schemas");
function setSchemaContext(schemas) {
  setContext(SCHEMA_CONTEXT_KEY, schemas);
}
const tabsAttrs = createBitsAttrs({
  component: "tabs",
  parts: ["root", "list", "trigger", "content"]
});
const TabsRootContext = new Context("Tabs.Root");
class TabsRootState {
  static create(opts) {
    return TabsRootContext.set(new TabsRootState(opts));
  }
  opts;
  attachment;
  rovingFocusGroup;
  triggerIds = [];
  // holds the trigger ID for each value to associate it with the content
  valueToTriggerId = new SvelteMap();
  // holds the content ID for each value to associate it with the trigger
  valueToContentId = new SvelteMap();
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(opts.ref);
    this.rovingFocusGroup = new RovingFocusGroup({
      candidateAttr: tabsAttrs.trigger,
      rootNode: this.opts.ref,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  registerTrigger(id, value) {
    this.triggerIds.push(id);
    this.valueToTriggerId.set(value, id);
    return () => {
      this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
      this.valueToTriggerId.delete(value);
    };
  }
  registerContent(id, value) {
    this.valueToContentId.set(value, id);
    return () => {
      this.valueToContentId.delete(value);
    };
  }
  setValue(v) {
    this.opts.value.current = v;
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-orientation": this.opts.orientation.current,
    [tabsAttrs.root]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TabsContentState {
  static create(opts) {
    return new TabsContentState(opts, TabsRootContext.get());
  }
  opts;
  root;
  attachment;
  #isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
  #ariaLabelledBy = derived(() => this.root.valueToTriggerId.get(this.opts.value.current));
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
    watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
      return this.root.registerContent(id, value);
    });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "tabpanel",
    hidden: boolToTrueOrUndef(!this.#isActive()),
    tabindex: 0,
    "data-value": this.opts.value.current,
    "data-state": getTabDataState(this.#isActive()),
    "aria-labelledby": this.#ariaLabelledBy(),
    "data-orientation": this.root.opts.orientation.current,
    [tabsAttrs.content]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function getTabDataState(condition) {
  return condition ? "active" : "inactive";
}
function Tabs$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      value = "",
      onValueChange = noop,
      orientation = "horizontal",
      loop = true,
      activationMode = "automatic",
      disabled = false,
      children,
      child,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const rootState = TabsRootState.create({
      id: boxWith(() => id),
      value: boxWith(() => value, (v) => {
        value = v;
        onValueChange(v);
      }),
      orientation: boxWith(() => orientation),
      loop: boxWith(() => loop),
      activationMode: boxWith(() => activationMode),
      disabled: boxWith(() => disabled),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, rootState.props));
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
    bind_props($$props, { ref, value });
  });
}
function Tabs_content$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      id = createId(uid),
      ref = null,
      value,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = TabsContentState.create({
      value: boxWith(() => value),
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
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
function Alert_description($$renderer, $$props) {
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
      "data-slot": "alert-description",
      class: clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Alert_title($$renderer, $$props) {
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
      "data-slot": "alert-title",
      class: clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Tabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      value = "",
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Tabs$1) {
        $$renderer3.push("<!--[-->");
        Tabs$1($$renderer3, spread_props([
          {
            "data-slot": "tabs",
            class: cn("flex flex-col gap-2", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
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
    bind_props($$props, { ref, value });
  });
}
function Tabs_content($$renderer, $$props) {
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
      if (Tabs_content$1) {
        $$renderer3.push("<!--[-->");
        Tabs_content$1($$renderer3, spread_props([
          {
            "data-slot": "tabs-content",
            class: cn("flex-1 outline-none", className)
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
function Arrow_down_up($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m3 16 4 4 4-4" }],
      ["path", { "d": "M7 20V4" }],
      ["path", { "d": "m21 8-4-4-4 4" }],
      ["path", { "d": "M17 4v16" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "arrow-down-up" },
      /**
       * @component @name ArrowDownUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMyAxNiA0IDQgNC00IiAvPgogIDxwYXRoIGQ9Ik03IDIwVjQiIC8+CiAgPHBhdGggZD0ibTIxIDgtNC00LTQgNCIgLz4KICA8cGF0aCBkPSJNMTcgNHYxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-down-up
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
function Chevron_left($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
    Icon($$renderer2, spread_props([
      { name: "chevron-left" },
      /**
       * @component @name ChevronLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
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
function Circle_alert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
      [
        "line",
        { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-alert" },
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function Code($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m16 18 6-6-6-6" }],
      ["path", { "d": "m8 6-6 6 6 6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "code" },
      /**
       * @component @name Code
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTggNi02LTYtNiIgLz4KICA8cGF0aCBkPSJtOCA2LTYgNiA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/code
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
function Download($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 15V3" }],
      ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
      ["path", { "d": "m7 10 5 5 5-5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "download" },
      /**
       * @component @name Download
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTVWMyIgLz4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cGF0aCBkPSJtNyAxMCA1IDUgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
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
function Ellipsis($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "1" }],
      ["circle", { "cx": "19", "cy": "12", "r": "1" }],
      ["circle", { "cx": "5", "cy": "12", "r": "1" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "ellipsis" },
      /**
       * @component @name Ellipsis
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjEyIiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ellipsis
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
function File_image($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        }
      ],
      ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
      ["circle", { "cx": "10", "cy": "12", "r": "2" }],
      [
        "path",
        { "d": "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "file-image" },
      /**
       * @component @name FileImage
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEyIiByPSIyIiAvPgogIDxwYXRoIGQ9Im0yMCAxNy0xLjI5Ni0xLjI5NmEyLjQxIDIuNDEgMCAwIDAtMy40MDggMEw5IDIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-image
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
function File_text($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        }
      ],
      ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
      ["path", { "d": "M10 9H8" }],
      ["path", { "d": "M16 13H8" }],
      ["path", { "d": "M16 17H8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "file-text" },
      /**
       * @component @name FileText
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTAgOUg4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxN0g4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-text
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
function Grid_3x3($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
      ],
      ["path", { "d": "M3 9h18" }],
      ["path", { "d": "M3 15h18" }],
      ["path", { "d": "M9 3v18" }],
      ["path", { "d": "M15 3v18" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "grid-3x3" },
      /**
       * @component @name Grid3x3
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDloMTgiIC8+CiAgPHBhdGggZD0iTTMgMTVoMTgiIC8+CiAgPHBhdGggZD0iTTkgM3YxOCIgLz4KICA8cGF0aCBkPSJNMTUgM3YxOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/grid-3x3
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
function History($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
      ],
      ["path", { "d": "M3 3v5h5" }],
      ["path", { "d": "M12 7v5l4 2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "history" },
      /**
       * @component @name History
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djVsNCAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/history
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
function Link($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        }
      ],
      [
        "path",
        {
          "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "link" },
      /**
       * @component @name Link
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSIgLz4KICA8cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/link
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
function List($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M3 5h.01" }],
      ["path", { "d": "M3 12h.01" }],
      ["path", { "d": "M3 19h.01" }],
      ["path", { "d": "M8 5h13" }],
      ["path", { "d": "M8 12h13" }],
      ["path", { "d": "M8 19h13" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "list" },
      /**
       * @component @name List
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
function Maximize_2($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M15 3h6v6" }],
      ["path", { "d": "m21 3-7 7" }],
      ["path", { "d": "m3 21 7-7" }],
      ["path", { "d": "M9 21H3v-6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "maximize-2" },
      /**
       * @component @name Maximize2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgM2g2djYiIC8+CiAgPHBhdGggZD0ibTIxIDMtNyA3IiAvPgogIDxwYXRoIGQ9Im0zIDIxIDctNyIgLz4KICA8cGF0aCBkPSJNOSAyMUgzdi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/maximize-2
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
function Minimize_2($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m14 10 7-7" }],
      ["path", { "d": "M20 10h-6V4" }],
      ["path", { "d": "m3 21 7-7" }],
      ["path", { "d": "M4 14h6v6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "minimize-2" },
      /**
       * @component @name Minimize2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTQgMTAgNy03IiAvPgogIDxwYXRoIGQ9Ik0yMCAxMGgtNlY0IiAvPgogIDxwYXRoIGQ9Im0zIDIxIDctNyIgLz4KICA8cGF0aCBkPSJNNCAxNGg2djYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/minimize-2
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
function Monitor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "width": "20", "height": "14", "x": "2", "y": "3", "rx": "2" }
      ],
      ["line", { "x1": "8", "x2": "16", "y1": "21", "y2": "21" }],
      ["line", { "x1": "12", "x2": "12", "y1": "17", "y2": "21" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "monitor" },
      /**
       * @component @name Monitor
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHg9IjIiIHk9IjMiIHJ4PSIyIiAvPgogIDxsaW5lIHgxPSI4IiB4Mj0iMTYiIHkxPSIyMSIgeTI9IjIxIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTciIHkyPSIyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/monitor
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
function Refresh_cw($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
      ],
      ["path", { "d": "M21 3v5h-5" }],
      [
        "path",
        { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
      ],
      ["path", { "d": "M8 16H3v5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "refresh-cw" },
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
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
function Search($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m21 21-4.34-4.34" }],
      ["circle", { "cx": "11", "cy": "11", "r": "8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "search" },
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
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
function Square_check_big($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"
        }
      ],
      ["path", { "d": "m9 11 3 3L22 4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "square-check-big" },
      /**
       * @component @name SquareCheckBig
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTAuNjU2VjE5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmgxMi4zNDQiIC8+CiAgPHBhdGggZD0ibTkgMTEgMyAzTDIyIDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/square-check-big
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
function Upload($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 3v12" }],
      ["path", { "d": "m17 8-5-5-5 5" }],
      ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "upload" },
      /**
       * @component @name Upload
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM3YxMiIgLz4KICA8cGF0aCBkPSJtMTcgOC01LTUtNSA1IiAvPgogIDxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/upload
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
async function copyUrlToClipboard(url) {
  try {
    const shareableUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(shareableUrl);
    toast.success("URL copied to clipboard");
    return true;
  } catch {
    toast.error("Failed to copy URL");
    return false;
  }
}
function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function MediaBrowser($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      selectable = false,
      multiSelect = false,
      onSelect,
      onSelectMultiple,
      assetTypeFilter,
      pageSize = 30,
      existingAssetIds
    } = $$props;
    let assetList = [];
    let loading = false;
    let searchQuery = "";
    let sortOrder = "newest";
    const perms = usePermissions();
    const canUpload = derived(() => perms.can("asset.upload"));
    const canDeleteAssets = derived(() => perms.can("asset.delete"));
    let selectedAsset = null;
    let lightboxOpen = false;
    let currentPage = 1;
    let totalPages = 1;
    let totalAssets = 0;
    let showUploadModal = false;
    let uploadQueue = [];
    let editTitle = "";
    let editDescription = "";
    let editAlt = "";
    let editCreditLine = "";
    let isSaving = false;
    let selectedIds = (() => selectable && multiSelect && existingAssetIds ? new Set(existingAssetIds) : /* @__PURE__ */ new Set())();
    let isBulkDeleting = false;
    const isSelectMode = derived(() => selectable && multiSelect);
    let referenceCounts = {};
    let selectedRefCount = 0;
    let searchTimeout;
    function handleSearchInput(value) {
      searchQuery = value;
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        () => {
          currentPage = 1;
          fetchAssets();
        },
        300
      );
    }
    async function fetchAssets(page2 = currentPage) {
      loading = true;
      try {
        const offset = (page2 - 1) * pageSize;
        const result = await assets.list({
          assetType: assetTypeFilter,
          search: searchQuery || void 0,
          limit: pageSize,
          offset
        });
        if (result.success && result.data) {
          assetList = result.data;
          currentPage = page2;
          if (result.pagination) {
            totalPages = result.pagination.totalPages;
            totalAssets = result.pagination.total;
          }
          if (!(selectable && multiSelect)) {
            selectedIds = /* @__PURE__ */ new Set();
          }
          fetchReferenceCounts(result.data.map((a) => a.id));
        }
      } catch {
        toast.error("Failed to fetch assets");
      } finally {
        loading = false;
      }
    }
    async function fetchReferenceCounts(assetIds) {
      if (assetIds.length === 0) return;
      try {
        const result = await assets.getReferenceCounts(assetIds);
        if (result.success && result.data) {
          referenceCounts = { ...referenceCounts, ...result.data };
        }
      } catch {
        toast.error("Failed to fetch reference counts");
      }
    }
    function sortAssets(list) {
      const sorted = [...list];
      switch (sortOrder) {
        case "newest":
          return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        case "oldest":
          return sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        case "name-asc":
          return sorted.sort((a, b) => a.originalFilename.localeCompare(b.originalFilename));
        case "name-desc":
          return sorted.sort((a, b) => b.originalFilename.localeCompare(a.originalFilename));
        default:
          return sorted;
      }
    }
    const pinnedAssets = derived(() => {
      if (!(selectable && multiSelect && existingAssetIds && existingAssetIds.size > 0)) return [];
      return assetList.filter((a) => existingAssetIds.has(a.id));
    });
    const sortedAssets = derived(() => {
      if (selectable && multiSelect && existingAssetIds && existingAssetIds.size > 0) {
        return sortAssets(assetList.filter((a) => !existingAssetIds.has(a.id)));
      }
      return sortAssets(assetList);
    });
    function toggleSelect(id) {
      const next = new SvelteSet(selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      selectedIds = next;
    }
    function confirmMultiSelect() {
      if (onSelectMultiple) {
        const selected = assetList.filter((a) => selectedIds.has(a.id));
        onSelectMultiple(selected);
        selectedIds = /* @__PURE__ */ new Set();
      }
    }
    async function bulkDelete() {
      if (selectedIds.size === 0) return;
      const idsToCheck = [...selectedIds];
      try {
        const result = await assets.getReferenceCounts(idsToCheck);
        if (result.success && result.data) {
          referenceCounts = { ...referenceCounts, ...result.data };
        }
      } catch {
        toast.error("Failed to check references");
      }
      const referencedAssets = idsToCheck.filter((id) => (referenceCounts[id] || 0) > 0);
      if (referencedAssets.length > 0) {
        toast.error(`Cannot delete ${referencedAssets.length} asset${referencedAssets.length > 1 ? "s" : ""} — still referenced by documents. Remove the references first.`);
        return;
      }
      const count = selectedIds.size;
      const confirmed = await confirmDialog({
        title: `Delete ${count} asset${count > 1 ? "s" : ""}?`,
        description: "This cannot be undone.",
        confirmText: "Delete",
        variant: "destructive"
      });
      if (!confirmed) return;
      isBulkDeleting = true;
      try {
        const result = await assets.deleteBulk([...selectedIds]);
        if (result.success) {
          if (selectedAsset && selectedIds.has(selectedAsset.id)) {
            selectedAsset = null;
          }
          selectedIds = /* @__PURE__ */ new Set();
          await fetchAssets();
        }
      } catch {
        toast.error("Failed to delete assets");
      } finally {
        isBulkDeleting = false;
      }
    }
    function closeAssetDetail() {
      selectedAsset = null;
    }
    async function saveMetadata() {
      if (!selectedAsset) return;
      isSaving = true;
      try {
        const result = await assets.update(selectedAsset.id, {
          title: editTitle || void 0,
          description: editDescription || void 0,
          alt: editAlt || void 0,
          creditLine: editCreditLine || void 0
        });
        if (result.success && result.data) {
          assetList = assetList.map((a) => a.id === selectedAsset.id ? result.data : a);
          selectedAsset = result.data;
        }
      } catch {
        toast.error("Failed to save metadata");
      } finally {
        isSaving = false;
      }
    }
    async function deleteAsset(asset) {
      try {
        const result = await assets.getReferenceCounts([asset.id]);
        if (result.success && result.data) {
          referenceCounts = { ...referenceCounts, ...result.data };
        }
      } catch {
      }
      const refCount = referenceCounts[asset.id] || 0;
      if (refCount > 0) {
        toast.error(`Cannot delete "${asset.originalFilename}" — referenced by ${refCount} document${refCount > 1 ? "s" : ""}. Remove the references first.`);
        return;
      }
      const confirmed = await confirmDialog({
        title: "Delete asset?",
        description: `"${asset.originalFilename}" will be permanently deleted. This cannot be undone.`,
        confirmText: "Delete",
        variant: "destructive"
      });
      if (!confirmed) return;
      try {
        const result = await assets.delete(asset.id);
        if (result.success) {
          if (selectedAsset?.id === asset.id) {
            selectedAsset = null;
          }
          await fetchAssets();
        }
      } catch {
        toast.error("Failed to delete asset");
      }
    }
    let copiedUrl = false;
    async function copyAssetUrl(asset) {
      const url = getThumbnailUrl(asset);
      const success = await copyUrlToClipboard(url);
      if (success) {
        copiedUrl = true;
        setTimeout(() => copiedUrl = false, 2e3);
      }
    }
    function downloadAsset(asset) {
      downloadFile(getThumbnailUrl(asset), asset.originalFilename);
    }
    function formatSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    function formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    }
    function getThumbnailUrl(asset) {
      return asset.url || `/media/${asset.id}/${asset.filename}`;
    }
    function isImage(asset) {
      return asset.assetType === "image" || asset.mimeType.startsWith("image/");
    }
    const visiblePages = derived(() => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }
      return pages;
    });
    const sortLabel = derived(
      () => "Last created: Newest first"
    );
    function failed($$renderer3, error, reset) {
      $$renderer3.push(`<div class="border-destructive/30 bg-destructive/5 rounded-md border p-4 text-center"><p class="text-destructive font-medium">Media browser encountered an error</p> <p class="text-muted-foreground mt-1 text-sm">${escape_html(error instanceof Error ? error.message : "Unknown error")}</p> <button class="bg-primary text-primary-foreground mt-3 rounded px-4 py-2 text-sm">Retry</button></div>`);
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex h-full flex-col" role="region">`);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="border-border flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4"><h2 class="text-base font-semibold sm:text-lg">Browse Assets</h2> `);
      if (canUpload()) {
        $$renderer3.push("<!--[0-->");
        Button($$renderer3, {
          size: "sm",
          onclick: () => {
            showUploadModal = true;
            uploadQueue = [];
          },
          children: ($$renderer4) => {
            Upload($$renderer4, { size: 16, class: "sm:mr-2" });
            $$renderer4.push(`<!----> <span class="hidden sm:inline">Upload assets</span>`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="border-border flex flex-wrap items-center gap-2 border-b px-4 py-2 sm:gap-3 sm:px-6 sm:py-3"><div class="relative min-w-0 flex-1 sm:w-48 sm:flex-none">`);
      Search($$renderer3, {
        size: 14,
        class: "text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
      });
      $$renderer3.push(`<!----> `);
      Input($$renderer3, {
        placeholder: "Search",
        class: "h-8 pl-8 text-sm",
        value: searchQuery,
        oninput: (e) => handleSearchInput(e.target.value)
      });
      $$renderer3.push(`<!----></div> `);
      if (totalAssets > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<span class="text-muted-foreground hidden text-xs sm:inline">${escape_html((currentPage - 1) * pageSize + 1)}–${escape_html(Math.min(currentPage * pageSize, totalAssets))} of ${escape_html(totalAssets)}</span>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="hidden flex-1 sm:block"></div> <div class="hidden items-center gap-1.5 sm:flex"><span class="text-muted-foreground text-xs">Show</span> `);
      $$renderer3.select(
        {
          value: pageSize,
          onchange: (e) => {
            pageSize = parseInt(e.target.value);
            currentPage = 1;
            fetchAssets(1);
          },
          class: "border-input bg-background text-foreground h-7 rounded-md border px-1.5 text-xs"
        },
        ($$renderer4) => {
          $$renderer4.option({ value: 10 }, ($$renderer5) => {
            $$renderer5.push(`10`);
          });
          $$renderer4.option({ value: 20 }, ($$renderer5) => {
            $$renderer5.push(`20`);
          });
          $$renderer4.option({ value: 30 }, ($$renderer5) => {
            $$renderer5.push(`30`);
          });
          $$renderer4.option({ value: 50 }, ($$renderer5) => {
            $$renderer5.push(`50`);
          });
          $$renderer4.option({ value: 100 }, ($$renderer5) => {
            $$renderer5.push(`100`);
          });
        }
      );
      $$renderer3.push(`</div> <div class="bg-muted flex items-center rounded-md p-0.5"><button${attr_class(`rounded p-1.5 ${stringify("bg-background shadow")}`)} title="Grid view">`);
      Grid_3x3($$renderer3, { size: 14 });
      $$renderer3.push(`<!----></button> <button${attr_class(`rounded p-1.5 ${stringify("text-muted-foreground")}`)} title="List view">`);
      List($$renderer3, { size: 14 });
      $$renderer3.push(`<!----></button></div> `);
      if (!selectable && canDeleteAssets()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button${attr_class(`rounded p-1.5 transition-colors ${stringify(isSelectMode() ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}`)}${attr("title", isSelectMode() ? "Exit select mode" : "Select multiple")}>`);
        Square_check_big($$renderer3, { size: 14 });
        $$renderer3.push(`<!----></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <button class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors sm:gap-1.5">`);
      Arrow_down_up($$renderer3, { size: 14 });
      $$renderer3.push(`<!----> <span class="hidden sm:inline">${escape_html(sortLabel())}</span></button></div> <div class="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden"><div${attr_class(`min-h-0 flex-1 md:overflow-y-auto ${stringify(selectedAsset ? "hidden md:block" : "")}`)}>`);
      $$renderer3.boundary({ failed }, ($$renderer4) => {
        $$renderer4.push(`<!--[-->`);
        {
          if (loading && assetList.length === 0) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="flex h-full items-center justify-center"><p class="text-muted-foreground">Loading assets...</p></div>`);
          } else if (sortedAssets().length === 0) {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(`<div class="flex h-full flex-col items-center justify-center gap-4"><div class="bg-muted/50 flex h-16 w-16 items-center justify-center rounded-full">`);
            Image($$renderer4, { class: "text-muted-foreground h-8 w-8" });
            $$renderer4.push(`<!----></div> <div class="text-center"><h3 class="mb-1 font-medium">No assets found</h3> <p class="text-muted-foreground text-sm">${escape_html(searchQuery ? "Try a different search term" : "Upload your first asset to get started")}</p></div></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
            if (selectable && multiSelect) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="bg-muted border-border flex items-center gap-3 border-b px-4 py-2"><span class="text-sm font-medium">${escape_html(selectedIds.size)} selected</span> `);
              Button($$renderer4, {
                variant: "default",
                size: "sm",
                onclick: confirmMultiSelect,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Done`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
            } else if (selectedIds.size > 0) {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<div class="bg-muted border-border flex items-center gap-3 border-b px-4 py-2"><span class="text-sm font-medium">${escape_html(selectedIds.size)} selected</span> `);
              if (canDeleteAssets()) {
                $$renderer4.push("<!--[0-->");
                Button($$renderer4, {
                  variant: "destructive",
                  size: "sm",
                  onclick: bulkDelete,
                  disabled: isBulkDeleting,
                  children: ($$renderer5) => {
                    Trash_2($$renderer5, { size: 14, class: "mr-1.5" });
                    $$renderer5.push(`<!----> ${escape_html(isBulkDeleting ? "Deleting..." : "Delete")}`);
                  },
                  $$slots: { default: true }
                });
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> <button class="text-muted-foreground hover:text-foreground text-sm transition-colors">Clear selection</button></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="grid grid-cols-2 gap-0.5 p-1 sm:grid-cols-5 xl:grid-cols-10"><!--[-->`);
              const each_array = ensure_array_like(pinnedAssets());
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let asset = each_array[$$index];
                $$renderer4.push(`<button${attr_class(`group relative flex flex-col overflow-hidden rounded-sm transition-colors ${stringify(selectedIds.has(asset.id) ? "ring-primary ring-2" : selectedAsset?.id === asset.id ? "ring-primary ring-2" : "hover:bg-muted/50")}`)}><div class="bg-muted/30 relative aspect-square overflow-hidden">`);
                if (isImage(asset)) {
                  $$renderer4.push("<!--[0-->");
                  $$renderer4.push(`<img${attr("src", getThumbnailUrl(asset))}${attr("alt", asset.alt || asset.originalFilename)} class="h-full w-full object-contain" loading="lazy"/>`);
                } else {
                  $$renderer4.push("<!--[-1-->");
                  $$renderer4.push(`<div class="flex h-full items-center justify-center">`);
                  File_text($$renderer4, { class: "text-muted-foreground h-10 w-10" });
                  $$renderer4.push(`<!----></div>`);
                }
                $$renderer4.push(`<!--]--> `);
                if (isSelectMode() && !selectable) {
                  $$renderer4.push("<!--[0-->");
                  $$renderer4.push(`<div class="absolute top-1.5 left-1.5">`);
                  Checkbox($$renderer4, {
                    checked: selectedIds.has(asset.id),
                    onCheckedChange: () => toggleSelect(asset.id),
                    onclick: (e) => e.stopPropagation()
                  });
                  $$renderer4.push(`<!----></div>`);
                } else {
                  $$renderer4.push("<!--[-1-->");
                }
                $$renderer4.push(`<!--]--></div> <div class="p-1.5"><p class="text-muted-foreground truncate text-xs">${escape_html(asset.originalFilename)}</p></div></button>`);
              }
              $$renderer4.push(`<!--]--> <!--[-->`);
              const each_array_1 = ensure_array_like(sortedAssets());
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let asset = each_array_1[$$index_1];
                $$renderer4.push(`<button${attr_class(`group relative flex flex-col overflow-hidden rounded-sm transition-colors ${stringify(selectedIds.has(asset.id) ? "ring-primary ring-2" : selectedAsset?.id === asset.id ? "ring-primary ring-2" : "hover:bg-muted/50")}`)}><div class="bg-muted/30 relative aspect-square overflow-hidden">`);
                if (isImage(asset)) {
                  $$renderer4.push("<!--[0-->");
                  $$renderer4.push(`<img${attr("src", getThumbnailUrl(asset))}${attr("alt", asset.alt || asset.originalFilename)} class="h-full w-full object-contain" loading="lazy"/>`);
                } else {
                  $$renderer4.push("<!--[-1-->");
                  $$renderer4.push(`<div class="flex h-full items-center justify-center">`);
                  File_text($$renderer4, { class: "text-muted-foreground h-10 w-10" });
                  $$renderer4.push(`<!----></div>`);
                }
                $$renderer4.push(`<!--]--> `);
                if (selectable) {
                  $$renderer4.push("<!--[0-->");
                  $$renderer4.push(`<div role="button" tabindex="0" class="bg-background/80 absolute top-1.5 right-1.5 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100" title="View details"><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`);
                } else if (isSelectMode()) {
                  $$renderer4.push("<!--[1-->");
                  $$renderer4.push(`<div class="absolute top-1.5 left-1.5">`);
                  Checkbox($$renderer4, {
                    checked: selectedIds.has(asset.id),
                    onCheckedChange: () => toggleSelect(asset.id),
                    onclick: (e) => e.stopPropagation()
                  });
                  $$renderer4.push(`<!----></div>`);
                } else {
                  $$renderer4.push("<!--[-1-->");
                }
                $$renderer4.push(`<!--]--></div> <div class="p-1.5"><p class="text-muted-foreground truncate text-xs">${escape_html(asset.originalFilename)}</p></div></button>`);
              }
              $$renderer4.push(`<!--]--></div> `);
              if (totalPages > 1) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="border-border flex items-center justify-center gap-1 border-t px-4 py-3"><button${attr("disabled", currentPage <= 1 || loading, true)} class="hover:bg-muted rounded p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30">`);
                Chevron_left($$renderer4, { size: 16 });
                $$renderer4.push(`<!----></button> <!--[-->`);
                const each_array_2 = ensure_array_like(visiblePages());
                for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                  let pg = each_array_2[$$index_2];
                  if (pg === "...") {
                    $$renderer4.push("<!--[0-->");
                    $$renderer4.push(`<span class="text-muted-foreground px-1.5 text-sm">...</span>`);
                  } else {
                    $$renderer4.push("<!--[-1-->");
                    $$renderer4.push(`<button${attr("disabled", loading, true)}${attr_class(`min-w-[32px] rounded px-2 py-1 text-sm font-medium transition-colors ${stringify(pg === currentPage ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground")}`)}>${escape_html(pg)}</button>`);
                  }
                  $$renderer4.push(`<!--]-->`);
                }
                $$renderer4.push(`<!--]--> <button${attr("disabled", currentPage >= totalPages || loading, true)} class="hover:bg-muted rounded p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30">`);
                Chevron_right($$renderer4, { size: 16 });
                $$renderer4.push(`<!----></button></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
        $$renderer4.push(`<!--]-->`);
      });
      $$renderer3.push(`</div> `);
      if (selectedAsset) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="bg-background border-border flex flex-col border-t md:w-[350px] md:shrink-0 md:overflow-y-auto md:border-t-0 md:border-l"><div class="border-border flex items-center justify-between border-b px-4 py-3"><button class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors md:hidden">`);
        Chevron_left($$renderer3, { size: 16 });
        $$renderer3.push(`<!----> Back</button> <p class="min-w-0 flex-1 truncate pl-2 text-sm font-medium md:pl-0"${attr("title", selectedAsset.originalFilename)}>${escape_html(selectedAsset.originalFilename)}</p> <div class="flex items-center gap-1">`);
        if (!selectable && canDeleteAssets()) {
          $$renderer3.push("<!--[0-->");
          Button($$renderer3, {
            variant: "ghost",
            size: "sm",
            class: "h-7 w-7 p-0",
            onclick: () => deleteAsset(selectedAsset),
            title: "Delete asset",
            children: ($$renderer4) => {
              Trash_2($$renderer4, { size: 14, class: "text-destructive" });
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        Button($$renderer3, {
          variant: "ghost",
          size: "sm",
          class: "hidden h-7 w-7 p-0 md:flex",
          onclick: closeAssetDetail,
          title: "Close",
          children: ($$renderer4) => {
            X($$renderer4, { size: 14 });
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div> `);
        if (selectable && !multiSelect && onSelect) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="border-border border-b px-4 py-2">`);
          Button($$renderer3, {
            size: "sm",
            class: "w-full",
            onclick: () => {
              if (selectedAsset && onSelect) onSelect(selectedAsset);
            },
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Select`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <div class="p-4 pb-0">`);
        if (isImage(selectedAsset)) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<button class="bg-muted/30 mb-3 w-full cursor-zoom-in overflow-hidden rounded-lg" title="Click to enlarge"><img${attr("src", getThumbnailUrl(selectedAsset))}${attr("alt", selectedAsset.alt || selectedAsset.originalFilename)} class="w-full object-contain" style="max-height: 200px;"/></button>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="bg-muted/30 mb-3 flex h-28 items-center justify-center overflow-hidden rounded-lg">`);
          File_text($$renderer3, { class: "text-muted-foreground h-12 w-12" });
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]--></div> <div class="border-border flex border-b"><button${attr_class(`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${stringify(
          "border-foreground text-foreground border-b-2"
        )}`)}>Details</button> <button${attr_class(`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${stringify("text-muted-foreground hover:text-foreground")}`)}>References (${escape_html(selectedRefCount)})</button></div> <div class="flex-1 overflow-y-auto p-4">`);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mb-4 space-y-2 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">Filename</span> <span class="max-w-[180px] truncate font-medium"${attr("title", selectedAsset.originalFilename)}>${escape_html(selectedAsset.originalFilename)}</span></div> <div class="flex justify-between"><span class="text-muted-foreground">Type</span> <span>${escape_html(selectedAsset.mimeType)}</span></div> <div class="flex justify-between"><span class="text-muted-foreground">Size</span> <span>${escape_html(formatSize(selectedAsset.size))}</span></div> `);
          if (selectedAsset.width && selectedAsset.height) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="flex justify-between"><span class="text-muted-foreground">Dimensions</span> <span>${escape_html(selectedAsset.width)} x ${escape_html(selectedAsset.height)}</span></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <div class="flex justify-between"><span class="text-muted-foreground">Uploaded</span> <span>${escape_html(formatDate(selectedAsset.createdAt))}</span></div></div> <div class="mb-4 flex gap-2">`);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            class: "flex-1",
            onclick: () => downloadAsset(selectedAsset),
            children: ($$renderer4) => {
              Download($$renderer4, { size: 14, class: "mr-1.5" });
              $$renderer4.push(`<!----> Download`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            variant: "outline",
            size: "sm",
            class: "flex-1",
            onclick: () => copyAssetUrl(selectedAsset),
            children: ($$renderer4) => {
              Link($$renderer4, { size: 14, class: "mr-1.5" });
              $$renderer4.push(`<!----> ${escape_html(copiedUrl ? "Copied!" : "Copy URL")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> `);
          Separator($$renderer3, { class: "my-4" });
          $$renderer3.push(`<!----> <div class="space-y-3"><div>`);
          Label($$renderer3, {
            for: "asset-title",
            class: "text-xs",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Title`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            id: "asset-title",
            class: "mt-1 h-8 text-sm",
            placeholder: "Asset title",
            get value() {
              return editTitle;
            },
            set value($$value) {
              editTitle = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----></div> <div>`);
          Label($$renderer3, {
            for: "asset-description",
            class: "text-xs",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Description`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <textarea id="asset-description" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" rows="2" placeholder="Description">`);
          const $$body = escape_html(editDescription);
          if ($$body) {
            $$renderer3.push(`${$$body}`);
          }
          $$renderer3.push(`</textarea></div> <div>`);
          Label($$renderer3, {
            for: "asset-alt",
            class: "text-xs",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Alt text`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            id: "asset-alt",
            class: "mt-1 h-8 text-sm",
            placeholder: "Alternative text",
            get value() {
              return editAlt;
            },
            set value($$value) {
              editAlt = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----></div> <div>`);
          Label($$renderer3, {
            for: "asset-credit",
            class: "text-xs",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Credit line`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Input($$renderer3, {
            id: "asset-credit",
            class: "mt-1 h-8 text-sm",
            placeholder: "Credit / attribution",
            get value() {
              return editCreditLine;
            },
            set value($$value) {
              editCreditLine = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----></div> `);
          Button($$renderer3, {
            onclick: saveMetadata,
            disabled: isSaving,
            size: "sm",
            class: "w-full",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(isSaving ? "Saving..." : "Save changes")}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> `);
      if (selectedAsset && isImage(selectedAsset)) {
        $$renderer3.push("<!--[0-->");
        if (Root) {
          $$renderer3.push("<!--[-->");
          Root($$renderer3, {
            get open() {
              return lightboxOpen;
            },
            set open($$value) {
              lightboxOpen = $$value;
              $$settled = false;
            },
            children: ($$renderer4) => {
              if (Dialog_content) {
                $$renderer4.push("<!--[-->");
                Dialog_content($$renderer4, {
                  showCloseButton: false,
                  class: "!z-[10000] flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden p-0 sm:max-w-[90vw]",
                  overlayClass: "!z-[9999]",
                  children: ($$renderer5) => {
                    if (Dialog_header) {
                      $$renderer5.push("<!--[-->");
                      Dialog_header($$renderer5, {
                        class: "border-border border-b px-4 py-3",
                        children: ($$renderer6) => {
                          if (Dialog_title) {
                            $$renderer6.push("<!--[-->");
                            Dialog_title($$renderer6, {
                              class: "truncate text-sm font-medium",
                              children: ($$renderer7) => {
                                $$renderer7.push(`<!---->${escape_html(selectedAsset.originalFilename)}`);
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
                    $$renderer5.push(` <div class="flex flex-1 items-center justify-center overflow-hidden p-4"><img${attr("src", getThumbnailUrl(selectedAsset))}${attr("alt", selectedAsset.alt || selectedAsset.originalFilename)} class="max-h-[70vh] max-w-full object-contain"/></div> <div class="border-border flex items-center justify-between border-t px-4 py-3"><div class="flex items-center gap-2">`);
                    Button($$renderer5, {
                      variant: "outline",
                      size: "sm",
                      onclick: () => downloadAsset(selectedAsset),
                      children: ($$renderer6) => {
                        Download($$renderer6, { size: 14, class: "mr-1.5" });
                        $$renderer6.push(`<!----> Download`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Button($$renderer5, {
                      variant: "outline",
                      size: "sm",
                      onclick: () => copyAssetUrl(selectedAsset),
                      children: ($$renderer6) => {
                        Link($$renderer6, { size: 14, class: "mr-1.5" });
                        $$renderer6.push(`<!----> ${escape_html(copiedUrl ? "Copied!" : "Copy URL")}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div> `);
                    Button($$renderer5, {
                      variant: "outline",
                      size: "sm",
                      onclick: () => lightboxOpen = false,
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Close`);
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
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (Root) {
        $$renderer3.push("<!--[-->");
        Root($$renderer3, {
          onOpenChange: (v) => {
            if (!v && true) {
              showUploadModal = false;
            }
          },
          get open() {
            return showUploadModal;
          },
          set open($$value) {
            showUploadModal = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            if (Dialog_content) {
              $$renderer4.push("<!--[-->");
              Dialog_content($$renderer4, {
                class: "!z-[10000] max-w-lg",
                overlayClass: "!z-[9999]",
                children: ($$renderer5) => {
                  if (Dialog_header) {
                    $$renderer5.push("<!--[-->");
                    Dialog_header($$renderer5, {
                      children: ($$renderer6) => {
                        if (Dialog_title) {
                          $$renderer6.push("<!--[-->");
                          Dialog_title($$renderer6, {
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->Upload Assets`);
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
                  $$renderer5.push(` <div${attr_class(`border-border mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${stringify("hover:bg-muted/50")}`)} role="button" tabindex="0">`);
                  File_image($$renderer5, { size: 32, class: "text-muted-foreground mb-3" });
                  $$renderer5.push(`<!----> <p class="text-sm font-medium">${escape_html("Drag and drop files here")}</p> <p class="text-muted-foreground mt-1 text-xs">or click to browse</p></div> <input type="file" multiple="" accept="image/*,.pdf,.txt" class="hidden"/> `);
                  if (uploadQueue.length > 0) {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="mt-4 max-h-48 space-y-2 overflow-y-auto"><!--[-->`);
                    const each_array_6 = ensure_array_like(uploadQueue);
                    for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
                      let item = each_array_6[$$index_6];
                      $$renderer5.push(`<div class="border-border flex items-center gap-3 rounded-md border px-3 py-2"><div class="min-w-0 flex-1"><p class="truncate text-sm">${escape_html(item.file.name)}</p> <p class="text-muted-foreground text-xs">${escape_html(formatSize(item.file.size))}</p></div> `);
                      if (item.status === "uploading") {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<div class="border-primary h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent"></div>`);
                      } else if (item.status === "done") {
                        $$renderer5.push("<!--[1-->");
                        Circle_check($$renderer5, { size: 16, class: "shrink-0 text-green-500" });
                      } else if (item.status === "failed") {
                        $$renderer5.push("<!--[2-->");
                        Circle_alert($$renderer5, { size: 16, class: "text-destructive shrink-0" });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                        $$renderer5.push(`<div class="bg-muted h-4 w-4 shrink-0 rounded-full"></div>`);
                      }
                      $$renderer5.push(`<!--]--></div>`);
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
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
const SAVE_STATE_KEY = /* @__PURE__ */ Symbol("aphex-save-state");
function setSaveStateContext(state) {
  setContext(SAVE_STATE_KEY, state);
}
function pluralize(word) {
  if (!word)
    return word;
  if (/[sxz]$/i.test(word) || /[sc]h$/i.test(word)) {
    return word + "es";
  }
  if (/[^aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + "ies";
  }
  return word + "s";
}
const versions = new SvelteMap();
function notifyDocumentChanged(documentId) {
  if (!documentId) return;
  versions.set(documentId, (versions.get(documentId) ?? 0) + 1);
}
const KEY = /* @__PURE__ */ Symbol("aphex:richtext-editors");
function setRichtextEditorRegistry() {
  const registry = /* @__PURE__ */ new Map();
  setContext(KEY, registry);
  return registry;
}
function DocumentEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      schemas,
      documentType,
      documentId,
      isCreating,
      onBack,
      onSaved,
      onAutoSaved,
      onDeleted,
      onPublished,
      onUnpublished,
      onRestored,
      onOpenReference,
      onOpenVersionHistory,
      externalVersionPreview = null,
      isReadOnly = false,
      focusMode = false,
      onToggleFocus,
      presentationMode = false,
      onTogglePresentation,
      organizationId = null
    } = $$props;
    setSchemaContext(schemas);
    setRichtextEditorRegistry();
    const perms = usePermissions();
    const canCreate = derived(() => !isReadOnly && perms.can("document.create"));
    const canUpdate = derived(() => !isReadOnly && perms.can("document.update"));
    const canDelete = derived(() => !isReadOnly && perms.can("document.delete"));
    const canPublishDoc = derived(() => !isReadOnly && perms.can("document.publish"));
    const canUnpublishDoc = derived(() => !isReadOnly && perms.can("document.unpublish"));
    const isViewingReadOnly = derived(() => isReadOnly || !canCreate() && !canUpdate() && !canDelete() && !canPublishDoc() && !canUnpublishDoc());
    let schema = null;
    let documentData = {};
    let fullDocument = null;
    let saving = false;
    let saveError = null;
    let lastSaved = null;
    let publishSuccess = null;
    let perspective = "draft";
    let publishedData = null;
    const isViewingPublished = derived(() => perspective === "published");
    let iframeRef = null;
    let fieldsWidth = 500;
    const resolvedPreviewUrl = derived(() => {
      return null;
    });
    const iframeUrl = derived(() => {
      if (!resolvedPreviewUrl()) return null;
      const base = typeof window !== "undefined" ? window.location.origin : void 0;
      let u;
      try {
        u = new URL(resolvedPreviewUrl(), base);
      } catch {
        return resolvedPreviewUrl();
      }
      if (perspective === "published") {
        u.searchParams.delete("aphex-preview");
      }
      return u.toString();
    });
    let showHeaderMenu = false;
    let showVersionHistory = false;
    let previewingVersion = null;
    const activePreview = derived(() => externalVersionPreview || previewingVersion);
    const isPreviewingVersion = derived(() => !!activePreview());
    let versionsList = [];
    let versionsError = false;
    async function loadVersions() {
      if (!documentId) return;
      versionsError = false;
      try {
        const response = await documents.listVersions(documentId);
        if (response.success && response.data) {
          versionsList = response.data;
        } else {
          versionsError = true;
        }
      } catch {
        versionsError = true;
      } finally {
      }
    }
    let now = Date.now();
    function timeAgo(date) {
      const seconds = Math.floor((now - date.getTime()) / 1e3);
      if (seconds < 5) return "just now";
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString();
    }
    const savedAgoText = derived(() => lastSaved ? `Saved ${timeAgo(lastSaved)}` : null);
    let hasUnsavedChanges = false;
    let hasValidationErrors = false;
    setSaveStateContext({
      get saving() {
        return saving;
      },
      get hasUnsavedChanges() {
        return hasUnsavedChanges;
      },
      get savedAgoText() {
        return savedAgoText();
      }
    });
    let schemaFields = [];
    let justCreatedDocument = false;
    const hasUnpublishedContent = derived(() => hasUnpublishedChanges(documentData, fullDocument?._meta?.publishedHash || null));
    const isUnpublished = derived(() => fullDocument?._meta?.status === "unpublished");
    const canPublish = derived(() => (hasUnpublishedContent() || isUnpublished()) && !saving && documentId && !hasValidationErrors);
    function getPreviewTitle() {
      const source = perspective === "published" && publishedData ? publishedData : documentData;
      {
        return source.title || `Untitled`;
      }
    }
    async function saveDocument(isAutoSave = false) {
      if (saving) return;
      saving = true;
      saveError = null;
      try {
        let response;
        if (isCreating) {
          cmsLogger.debug("[Document Editor]", "🔄 Creating new document with data:", { type: documentType, data: documentData });
          response = await documents.create({ type: documentType, data: documentData });
          cmsLogger.debug("[Document Editor]", "📝 Document creation response:", response);
          if (response.success && response.data) {
            cmsLogger.debug("[Document Editor]", "✅ Document created successfully with ID:", response.data.id);
            justCreatedDocument = true;
            fullDocument = response.data;
            onSaved?.(response.data.id);
          } else {
            toast.error(response?.error || "Failed to create document");
          }
        } else if (documentId) {
          response = await documents.updateById(documentId, { data: documentData });
          if (response?.success && response.data) {
            cmsLogger.debug("[Document Editor]", "meta response data:", response.data);
            const { id: responseId, _meta } = response.data;
            fullDocument = { id: responseId, _meta, ...documentData };
          }
        }
        if (response?.success) {
          lastSaved = /* @__PURE__ */ new Date();
          hasUnsavedChanges = false;
          if (response.data?.id) notifyDocumentChanged(response.data.id);
          if (presentationMode && iframeRef?.contentWindow) ;
          if (isAutoSave) {
            validateAllFields();
            schemaFields.forEach((fieldComponent, index) => {
              const field = schema?.fields[index];
              if (fieldComponent && field) ;
            });
            if (onAutoSaved && documentId) {
              onAutoSaved(documentId, getPreviewTitle());
            }
          }
          if (showVersionHistory) ;
        } else {
          throw new Error(response?.error || "Failed to save document");
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to save document");
        if (err instanceof ApiError && err.response?.validationErrors) {
          const validationErrors = err.response.validationErrors;
          const errorMessages = validationErrors.map((ve) => `${ve.field}: ${ve.errors.join(", ")}`).join("; ");
          saveError = `Validation failed: ${errorMessages}`;
        } else {
          saveError = err instanceof ApiError ? err.message : "Failed to save document";
        }
      } finally {
        saving = false;
      }
    }
    async function publishDocument() {
      if (!documentId || saving) return;
      if (hasUnsavedChanges) {
        await saveDocument(false);
        if (saveError) return;
      }
      const invalid = await validateAllFields();
      if (invalid.length > 0) {
        const preview = invalid.slice(0, 3).map((f) => f.title).join(", ");
        const remainder = invalid.length > 3 ? ` and ${invalid.length - 3} more` : "";
        const detail = invalid.map((f) => `${f.title}: ${f.messages.join(", ")}`).join("\n");
        saveError = `Cannot publish — fix: ${preview}${remainder}`;
        toast.error(`Fix ${invalid.length} field${invalid.length === 1 ? "" : "s"} to publish`, { description: detail });
        return;
      }
      const refIds = collectReferenceIds(documentData);
      if (refIds.length > 0) {
        let fetched = [];
        try {
          const res = await documents.getMany(refIds);
          if (res.success && res.data) fetched = res.data;
        } catch {
        }
        const fetchedById = new Map(fetched.map((d) => [d.id, d]));
        const checks = refIds.map((id) => ({ id, doc: fetchedById.get(id) ?? null }));
        const blockers = checks.filter((c) => !c.doc || c.doc._meta?.status !== "published");
        if (blockers.length > 0) {
          const titles = blockers.slice(0, 3).map((b) => {
            if (!b.doc) return `Missing (${b.id.slice(0, 8)})`;
            const d = b.doc;
            const label = d.title ?? d.name ?? d.heading ?? d.label ?? b.id;
            const type = d._meta?.type;
            return type ? `"${label}" (${type})` : `"${label}"`;
          }).join(", ");
          const remainder = blockers.length > 3 ? ` and ${blockers.length - 3} more` : "";
          saveError = `Cannot publish — unpublished references: ${titles}${remainder}`;
          toast.error(`${blockers.length} referenced document${blockers.length === 1 ? "" : "s"} ${blockers.length === 1 ? "is" : "are"} not published`, {
            description: "Publish the referenced documents first, then try again."
          });
          return;
        }
      }
      saving = true;
      saveError = null;
      try {
        const response = await documents.publish(documentId);
        if (response.success && response.data) {
          const { id: _id, _meta: _m, ...syncedData } = response.data;
          documentData = syncedData;
          fullDocument = response.data;
          lastSaved = /* @__PURE__ */ new Date();
          publishSuccess = /* @__PURE__ */ new Date();
          notifyDocumentChanged(documentId);
          cmsLogger.debug("[Document Editor]", "✅ Document published successfully");
          cmsLogger.debug("[Document Editor]", "📄 New published hash:", response.data.publishedHash);
          if (onPublished && documentId) {
            onPublished(documentId);
          }
          if (showVersionHistory) ;
        } else {
          throw new Error(response.error || "Failed to publish document");
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to publish document");
        if (err instanceof ApiError && err.response?.validationErrors) {
          const validationErrors = err.response.validationErrors;
          const errorMessages = validationErrors.map((ve) => `${ve.field}: ${ve.errors.join(", ")}`).join("; ");
          saveError = `Cannot publish - Validation failed: ${errorMessages}`;
        } else {
          saveError = err instanceof ApiError ? err.message : "Failed to publish document";
        }
      } finally {
        saving = false;
      }
    }
    async function unpublishDocument() {
      if (!documentId || saving) return;
      let backRefDescription = "It will be removed from published queries, but the data is preserved and you can re-publish anytime.";
      try {
        const backRefRes = await documents.getBackReferences(documentId);
        if (backRefRes.success && backRefRes.data) {
          const publishedBackRefs = backRefRes.data.filter((r) => r.status === "published");
          if (publishedBackRefs.length > 0) {
            const count = publishedBackRefs.length;
            backRefDescription = `${count} published document${count === 1 ? "" : "s"} reference${count === 1 ? "s" : ""} this one — their references will be left dangling in the published perspective until you re-publish them. Continue?`;
          }
        }
      } catch {
      }
      const confirmUnpublish = await confirmDialog({
        title: "Unpublish this document?",
        description: backRefDescription,
        confirmText: "Unpublish",
        variant: "destructive"
      });
      if (!confirmUnpublish) return;
      saving = true;
      saveError = null;
      try {
        const response = await documents.unpublish(documentId);
        if (response.success) {
          fullDocument = {
            ...fullDocument,
            _meta: { ...fullDocument?._meta, status: "unpublished" }
          };
          notifyDocumentChanged(documentId);
          toast.success("Document unpublished — you can re-publish anytime");
          if (onUnpublished && documentId) {
            onUnpublished(documentId);
          }
        } else {
          throw new Error(response.error || "Failed to unpublish");
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to unpublish document");
      } finally {
        saving = false;
      }
    }
    async function validateAllFields() {
      {
        hasValidationErrors = false;
        return [];
      }
    }
    async function deleteDocument() {
      if (!documentId || saving) return;
      const confirmDelete = await confirmDialog({
        title: "Delete this document?",
        description: "This action cannot be undone.",
        confirmText: "Delete",
        variant: "destructive"
      });
      if (!confirmDelete) return;
      saving = true;
      saveError = null;
      try {
        const response = await documents.deleteById(documentId);
        if (response.success) {
          cmsLogger.debug("[Document Editor]", "✅ Document deleted successfully");
          onDeleted?.();
        } else {
          throw new Error(response.error || "Failed to delete document");
        }
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Failed to delete document");
        saveError = err instanceof ApiError ? err.message : "Failed to delete document";
      } finally {
        saving = false;
      }
    }
    $$renderer2.push(`<div class="relative flex h-full w-full min-w-0 flex-col overflow-hidden"><div class="bg-background w-full min-w-0 overflow-x-clip px-4 pt-4 pb-5 lg:px-6 lg:pt-5"><div class="w-full"><div class="mb-4 flex items-center justify-between gap-3"><div class="text-muted-foreground flex min-w-0 items-center gap-2 text-[11px] font-medium tracking-wider uppercase"><span class="whitespace-nowrap">${escape_html(documentType)}</span> <span aria-hidden="true">·</span> <span class="truncate">${escape_html(getPreviewTitle())}</span></div> <div class="flex shrink-0 items-center gap-2">`);
    if (saving) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"></span> Saving</span>`);
    } else if (hasUnsavedChanges) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Unsaved</span>`);
    } else if (savedAgoText()) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<span class="text-muted-foreground hidden items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase sm:inline-flex"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Auto-saved</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (documentId && fullDocument?._meta?.publishedHash) {
      $$renderer2.push("<!--[0-->");
      const isPublished = fullDocument?._meta?.status === "published" && fullDocument?._meta?.publishedAt;
      const isUnpub = fullDocument?._meta?.status === "unpublished";
      $$renderer2.push(`<div class="flex items-center gap-1.5"><button${attr_class(`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase transition-colors ${stringify(perspective === "draft" ? "bg-primary/90 text-primary-foreground border-transparent" : "text-muted-foreground hover:bg-muted")}`)}><span${attr_class(`bg-muted-foreground/60 h-1.5 w-1.5 rounded-full ${stringify(perspective === "draft" ? "bg-primary-foreground/60" : "")}`)}></span> Draft</button> <button${attr_class(`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase transition-colors ${stringify(perspective === "published" ? "bg-primary text-primary-foreground border-transparent" : "text-muted-foreground hover:bg-muted")}`)}>`);
      if (isPublished) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span${attr_class(`h-1.5 w-1.5 rounded-full ${stringify(perspective === "published" ? "bg-primary-foreground/60" : "bg-green-500")}`)}></span> Published · ${escape_html(timeAgo(new Date(fullDocument._meta.publishedAt)))}`);
      } else if (isUnpub) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<span${attr_class(`h-1.5 w-1.5 rounded-full ${stringify(perspective === "published" ? "bg-primary-foreground/60" : "bg-muted-foreground/60")}`)}></span> Unpublished`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Published`);
      }
      $$renderer2.push(`<!--]--></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (documentId) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="relative">`);
      Button($$renderer2, {
        variant: "ghost",
        size: "icon",
        onclick: () => showHeaderMenu = !showHeaderMenu,
        class: "h-8 w-8 cursor-pointer",
        children: ($$renderer3) => {
          Ellipsis($$renderer3, { class: "h-4 w-4" });
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      if (showHeaderMenu) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-background border-rule absolute top-full right-0 z-[60] mt-1 min-w-[160px] rounded-md border py-1 shadow-lg"><button class="hover:bg-muted flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors">`);
        History($$renderer2, { class: "h-3.5 w-3.5" });
        $$renderer2.push(`<!----> History</button> <button class="hover:bg-muted flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors">`);
        Code($$renderer2, { class: "h-3.5 w-3.5" });
        $$renderer2.push(`<!----> Inspect</button></div>  <div class="fixed inset-0 z-[55]"></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (onTogglePresentation && schema?.previewUrl) {
      $$renderer2.push("<!--[0-->");
      Button($$renderer2, {
        variant: "ghost",
        size: "icon",
        onclick: onTogglePresentation,
        class: `hidden h-8 w-8 hover:cursor-pointer lg:flex ${stringify(presentationMode ? "text-primary" : "")}`,
        title: presentationMode ? "Exit presentation mode" : "Present",
        children: ($$renderer3) => {
          Monitor($$renderer3, { class: "h-4 w-4" });
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (onToggleFocus) {
      $$renderer2.push("<!--[0-->");
      Button($$renderer2, {
        variant: "ghost",
        size: "icon",
        onclick: onToggleFocus,
        class: "hidden h-8 w-8 hover:cursor-pointer lg:flex",
        title: focusMode ? "Exit focus mode" : "Enter focus mode",
        children: ($$renderer3) => {
          if (focusMode) {
            $$renderer3.push("<!--[0-->");
            Minimize_2($$renderer3, { class: "h-4 w-4" });
          } else {
            $$renderer3.push("<!--[-1-->");
            Maximize_2($$renderer3, { class: "h-4 w-4" });
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    Button($$renderer2, {
      variant: "ghost",
      size: "icon",
      onclick: onBack,
      class: "hidden h-8 w-8 hover:cursor-pointer lg:flex",
      title: "Close",
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div> <h1 class="block w-full min-w-0 truncate text-3xl font-semibold tracking-tight">${escape_html(getPreviewTitle())}</h1> <div class="mt-3 flex items-center justify-between gap-3 sm:hidden"><div class="flex flex-wrap items-center gap-2">`);
    if (!fullDocument?._meta?.publishedHash && documentId && fullDocument?._meta?.status !== "unpublished") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Draft</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (saving) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 animate-pulse rounded-full"></span> Saving</span>`);
    } else if (hasUnsavedChanges) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Unsaved</span>`);
    } else if (savedAgoText()) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<span class="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase"><span class="bg-muted-foreground/60 h-1.5 w-1.5 rounded-full"></span> Auto-saved</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div data-document-editor=""${attr_class(`relative flex min-h-0 flex-1 ${stringify(presentationMode ? "flex-row" : "flex-col")}`)}><div${attr_class(`${stringify(presentationMode ? "shrink-0 overflow-y-auto" : "flex flex-1 flex-col overflow-auto")} p-4 lg:p-6`)}${attr_style(presentationMode ? `width: ${fieldsWidth}px; min-width: 500px` : void 0)}><div class="flex w-full flex-1 flex-col gap-4 lg:gap-6">`);
    if (saveError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-destructive/10 border-destructive/20 rounded-md border p-3"><p class="text-destructive text-sm">${escape_html(saveError)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="border-muted-foreground/30 rounded-md border border-dashed p-4"><p class="text-muted-foreground text-center text-sm">No schema found for document type: ${escape_html(documentType)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (presentationMode) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div role="separator" aria-orientation="vertical" class="hover:bg-primary/20 active:bg-primary/30 w-1 shrink-0 cursor-ew-resize transition-colors"></div> <div class="flex min-h-0 flex-1 flex-col">`);
      if (iframeUrl()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="border-rule bg-background flex h-10 shrink-0 items-center gap-1 border-b px-2"><button class="hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 transition-colors"${attr("title", "Disable edit mode")}><div${attr_class(`relative h-[14px] w-6 rounded-full transition-colors ${stringify("bg-primary")}`)}><div${attr_class(`absolute top-[2px] h-[10px] w-[10px] rounded-full bg-white shadow transition-all ${stringify("left-[12px]")}`)}></div></div> <span${attr_class(`text-[11px] font-medium tracking-wide ${stringify("text-foreground")}`)}>Edit</span></button> <button class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors" title="Refresh preview">`);
        Refresh_cw($$renderer2, { class: "h-3.5 w-3.5" });
        $$renderer2.push(`<!----></button> <div class="bg-muted mx-1 min-w-0 flex-1 rounded px-2.5 py-1"><span class="text-muted-foreground block truncate text-center font-mono text-[11px]">${escape_html(iframeUrl())}</span></div> <button class="hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded p-1.5 transition-colors" title="Open in new tab">`);
        External_link($$renderer2, { class: "h-3.5 w-3.5" });
        $$renderer2.push(`<!----></button></div> <div class="relative min-h-0 flex-1"><iframe${attr("src", iframeUrl())} class="h-full w-full border-none" title="Page preview"></iframe> `);
        {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">`);
        Monitor($$renderer2, { class: "text-muted-foreground/30 h-10 w-10" });
        $$renderer2.push(`<!----> <p class="text-muted-foreground text-sm">No preview URL yet.</p> <p class="text-muted-foreground/50 text-xs">Fill in the required fields to enable preview.</p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (documentId) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="border-rule bg-background relative z-50 border-t p-4">`);
      if (isPreviewingVersion() && activePreview()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex items-center justify-between"><p class="text-muted-foreground text-sm">Revision from ${escape_html(new Date(activePreview().createdAt || Date.now()).toLocaleString(void 0, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }))}</p> `);
        Button($$renderer2, {
          size: "sm",
          onclick: async () => {
            if (!documentId || !activePreview()) return;
            try {
              await documents.restoreVersion(documentId, activePreview().versionNumber);
              const docRes = await documents.getById(documentId);
              if (docRes.success && docRes.data) {
                const doc = docRes.data;
                fullDocument = doc;
                const newData = {};
                if (schema) ;
                documentData = newData;
                hasUnsavedChanges = false;
                lastSaved = /* @__PURE__ */ new Date();
              }
              previewingVersion = null;
              perspective = "draft";
              publishedData = null;
              toast.success("Revision restored");
              if (onRestored && documentId) {
                onRestored(documentId);
              }
            } catch {
              toast.error("Failed to restore revision");
            }
          },
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Restore`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
      } else if (isViewingPublished()) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="flex items-center justify-between"><p class="text-muted-foreground text-sm">`);
        if (fullDocument?._meta?.status === "unpublished") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`Unpublished`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`Published on ${escape_html(fullDocument?._meta?.publishedAt ? new Date(fullDocument._meta.publishedAt).toLocaleString(void 0, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          }) : "Unknown")}`);
        }
        $$renderer2.push(`<!--]--></p> `);
        if (fullDocument?._meta?.status === "unpublished") {
          $$renderer2.push("<!--[0-->");
          if (canPublishDoc()) {
            $$renderer2.push("<!--[0-->");
            Button($$renderer2, {
              size: "sm",
              onclick: publishDocument,
              disabled: saving,
              children: ($$renderer3) => {
                $$renderer3.push(`<!---->Publish`);
              },
              $$slots: { default: true }
            });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else if (canUnpublishDoc()) {
          $$renderer2.push("<!--[1-->");
          Button($$renderer2, {
            size: "sm",
            variant: "secondary",
            onclick: unpublishDocument,
            disabled: saving,
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Unpublish`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="flex items-center justify-between"><div class="flex items-center gap-2">`);
        if (publishSuccess && now - publishSuccess.getTime() < 3e3) {
          $$renderer2.push("<!--[0-->");
          Badge($$renderer2, {
            variant: "default",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Published!`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2">`);
        if (canPublishDoc() && !isViewingPublished()) {
          $$renderer2.push("<!--[0-->");
          Button($$renderer2, {
            onclick: publishDocument,
            disabled: !canPublish(),
            size: "sm",
            variant: canPublish() ? "default" : "secondary",
            class: "cursor-pointer",
            children: ($$renderer3) => {
              if (saving) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`Publishing...`);
              } else if (isUnpublished()) {
                $$renderer3.push("<!--[1-->");
                $$renderer3.push(`Publish`);
              } else if (!hasUnpublishedContent()) {
                $$renderer3.push("<!--[2-->");
                $$renderer3.push(`Published`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`Publish Changes`);
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
        } else if (isViewingReadOnly()) {
          $$renderer2.push("<!--[1-->");
          Badge($$renderer2, {
            variant: "secondary",
            class: "text-xs",
            children: ($$renderer3) => {
              $$renderer3.push(`<!---->Read Only`);
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (canDelete() && true) {
          $$renderer2.push("<!--[0-->");
          Button($$renderer2, {
            variant: "ghost",
            size: "icon",
            class: "text-muted-foreground hover:text-destructive h-8 w-8",
            onclick: deleteDocument,
            title: "Delete document",
            children: ($$renderer3) => {
              Trash_2($$renderer3, { class: "h-4 w-4" });
            },
            $$slots: { default: true }
          });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function DocumentVersionPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { documentId, onClose, onPreviewVersion } = $$props;
    let versions2 = [];
    let loading = true;
    let previewVersion = null;
    let filter = "all";
    const filteredVersions = derived(() => filter === "all" ? versions2 : versions2.filter((v) => v.eventType === filter));
    function refresh() {
      return loadVersions();
    }
    async function loadVersions() {
      loading = true;
      try {
        const res = await documents.listVersions(documentId, { limit: 100 });
        if (res.success && res.data) {
          versions2 = res.data;
        }
      } catch {
        toast.error("Failed to load versions");
      } finally {
        loading = false;
      }
    }
    $$renderer2.push(`<div class="flex h-full flex-col"><div class="border-border bg-background flex h-14 items-center justify-between border-b px-3"><h3 class="text-sm font-medium">History</h3> `);
    Button($$renderer2, {
      class: "hover:bg-muted rounded p-1 transition-colors",
      variant: "ghost",
      onclick: onClose,
      children: ($$renderer3) => {
        $$renderer3.push(`<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="border-border flex border-b"><!--[-->`);
    const each_array = ensure_array_like([
      { value: "all", label: "All" },
      { value: "publish", label: "Published" },
      { value: "draft", label: "Drafts" }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      Button($$renderer2, {
        variant: "ghost",
        class: `flex-1 cursor-pointer rounded-none px-2 py-2 text-xs font-medium transition-colors ${stringify(filter === tab.value ? "border-primary text-foreground border-b-2" : "text-muted-foreground hover:text-foreground")}`,
        onclick: () => {
          filter = tab.value;
        },
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(tab.label)}`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-auto">`);
    if (loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-4 text-center"><span class="text-muted-foreground text-xs">Loading...</span></div>`);
    } else if (filteredVersions().length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="p-4 text-center"><span class="text-muted-foreground text-xs">No ${escape_html(filter === "all" ? "" : filter)} versions</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(filteredVersions());
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let version = each_array_1[i];
        $$renderer2.push(`<div${attr("data-version-id", i)}${attr_class(`hover:bg-muted w-full cursor-pointer border-b px-3 py-2.5 text-left transition-colors ${stringify(previewVersion?.versionNumber === version.versionNumber ? "bg-muted border-l-primary border-l-2" : "")}`)}><div class="flex items-center justify-between"><span class="text-muted-foreground text-[11px]">${escape_html(new Date(version.createdAt).toLocaleString(void 0, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }))}</span> `);
        Badge($$renderer2, {
          variant: version.eventType === "publish" ? "default" : "secondary",
          class: "px-1.5 py-0 text-[9px]",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->${escape_html(version.eventType)}`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div> `);
        if (version.createdByName) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-muted-foreground mt-0.5 truncate text-[10px]">${escape_html(version.createdByName)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { refresh });
  });
}
function AdminApp($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      schemas,
      documentTypes: documentTypesFromServer,
      schemaError = null,
      title = "Aphex CMS",
      graphqlSettings = null,
      isReadOnly = false,
      capabilities = [],
      rbacRole = null,
      activeTab = { value: "structure" },
      handleTabChange = () => {
      }
    } = $$props;
    const perms = setPermissionsContext(() => capabilities, () => rbacRole);
    let currentOrgId = page.url.searchParams.get("orgId");
    const documentTypes = derived(() => documentTypesFromServer.map((docType) => {
      const schema = schemas.find((s) => s.name === docType.name);
      return {
        ...docType,
        icon: schema?.icon,
        group: schema?.group,
        access: schema?.access,
        singleton: schema?.singleton ?? false
      };
    }).filter((docType) => {
      const readList = docType.access?.read;
      if (!readList) return true;
      if (typeof readList === "function") return true;
      const role = perms.role;
      return role !== null && readList.includes(role);
    }));
    const hasDocumentTypes = derived(() => documentTypes().length > 0);
    const groupedDocumentTypes = derived(() => {
      const buckets = /* @__PURE__ */ new Map();
      buckets.set(null, []);
      for (const dt of documentTypes()) {
        const key = dt.group ?? null;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(dt);
      }
      return Array.from(buckets.entries()).filter(([, items]) => items.length > 0).map(([name, items]) => ({ name, items }));
    });
    let selectedDocumentType = null;
    let documentsList = [];
    let mobileView = "types";
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 375;
    let editingDocumentId = null;
    let isCreatingDocument = false;
    let focusModeOn = false;
    function toggleFocusMode() {
      focusModeOn = !focusModeOn;
      const params = new SvelteURLSearchParams(page.url.searchParams);
      if (focusModeOn) {
        params.set("focus", "1");
      } else {
        params.delete("focus");
      }
      goto(`/admin?${params.toString()}`, {});
    }
    let presentationModeOn = false;
    function togglePresentationMode() {
      presentationModeOn = !presentationModeOn;
    }
    let showVersionPanel = false;
    let versionPanelDocId = null;
    let versionPreviewData = null;
    let editorStack = [];
    let activeEditorIndex = 0;
    const MIN_EDITOR_WIDTH = 650;
    const COLLAPSED_WIDTH = 60;
    const TYPES_WIDTH = 350;
    let layoutConfig = derived(() => {
      const totalEditors = 0 + (editorStack.length > 0 ? 1 : 0);
      if (totalEditors === 0) {
        return {
          totalEditors: 0,
          expandedCount: 0,
          collapsedCount: 0,
          typesCollapsed: false,
          docsCollapsed: false,
          expandedIndices: [],
          activeIndex: activeEditorIndex,
          typesExpanded: true,
          docsExpanded: true
        };
      }
      const validActiveIndex = activeEditorIndex < 0 ? activeEditorIndex : Math.max(0, Math.min(activeEditorIndex, totalEditors - 1));
      const hasDocs = false;
      const typesActive = activeEditorIndex === -1;
      const docsActive = activeEditorIndex === -2;
      let typesExpanded = typesActive || totalEditors < 2;
      let docsExpanded = docsActive || totalEditors < 2;
      let panelsWidth = (typesExpanded ? TYPES_WIDTH : COLLAPSED_WIDTH) + 0;
      let editorSpace = windowWidth - panelsWidth;
      let maxEditors = Math.floor(editorSpace / MIN_EDITOR_WIDTH);
      if (totalEditors === 1 && !typesActive && !docsActive) {
        if (maxEditors < 1 && hasDocs) {
          docsExpanded = false;
          panelsWidth = TYPES_WIDTH + COLLAPSED_WIDTH;
          editorSpace = windowWidth - panelsWidth;
          maxEditors = Math.floor(editorSpace / MIN_EDITOR_WIDTH);
        }
        if (maxEditors < 1) {
          typesExpanded = false;
          panelsWidth = COLLAPSED_WIDTH + 0;
          editorSpace = windowWidth - panelsWidth;
          maxEditors = Math.floor(editorSpace / MIN_EDITOR_WIDTH);
        }
      }
      if (maxEditors < 1) maxEditors = 1;
      let expandedIndices = [validActiveIndex];
      if (maxEditors > 1) {
        for (let i = totalEditors - 1; i >= 0 && expandedIndices.length < maxEditors; i--) {
          if (i !== validActiveIndex) expandedIndices.push(i);
        }
      }
      return {
        totalEditors,
        expandedCount: expandedIndices.length,
        collapsedCount: totalEditors - expandedIndices.length,
        typesCollapsed: !typesExpanded,
        docsCollapsed: !docsExpanded,
        expandedIndices,
        activeIndex: validActiveIndex,
        typesExpanded,
        docsExpanded
      };
    });
    let typesPanel = derived(() => {
      if (focusModeOn || presentationModeOn) return "hidden";
      if (windowWidth < 620) {
        return mobileView === "types" ? "w-full" : "hidden";
      }
      return layoutConfig().typesExpanded ? "w-[350px]" : "w-[60px]";
    });
    let primaryEditorState = derived(() => {
      if (windowWidth < 620) {
        return { visible: mobileView === "editor", expanded: true };
      }
      return { visible: false, expanded: false };
    });
    async function navigateToEditDocument(docId, docType, replace = false) {
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.set("docId", docId);
      if (docType) params.set("docType", docType);
      params.delete("action");
      params.delete("fromDocId");
      params.delete("fromDocType");
      await goto(`/admin?${params.toString()}`, {});
      mobileView = "editor";
    }
    async function navigateBack() {
      if (focusModeOn) focusModeOn = false;
      if (presentationModeOn) presentationModeOn = false;
      const fromDocId = page.url.searchParams.get("fromDocId");
      const fromDocType = page.url.searchParams.get("fromDocType");
      if (fromDocId && fromDocType) {
        await navigateToEditDocument(fromDocId, fromDocType, false);
      } else {
        const params = new SvelteURLSearchParams(page.url.searchParams);
        params.delete("docType");
        params.delete("docId");
        params.delete("action");
        params.delete("stack");
        params.delete("focus");
        params.delete("history");
        await goto(`/admin?${params.toString()}`, {});
        mobileView = "types";
      }
    }
    function handleOpenVersionHistory(docId) {
      showVersionPanel = true;
      versionPanelDocId = docId;
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.set("history", "1");
      goto(`/admin?${params.toString()}`, {});
    }
    function handleCloseVersionPanel() {
      showVersionPanel = false;
      versionPanelDocId = null;
      versionPreviewData = null;
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.delete("history");
      goto(`/admin?${params.toString()}`, {});
    }
    async function handleOpenReference(documentId, documentType) {
      if (windowWidth < 620) {
        const params2 = new SvelteURLSearchParams({ docId: documentId, docType: documentType });
        await goto(`/admin?${params2.toString()}`, {});
        mobileView = "editor";
        return;
      }
      if (editingDocumentId === documentId) {
        activeEditorIndex = 0;
        return;
      }
      const newEntry = { documentId, documentType, isCreating: false };
      const newStack = activeEditorIndex === 0 && editorStack.length > 0 ? [newEntry] : [...editorStack, newEntry];
      const stackParam = newStack.map((item) => `${item.documentType}:${item.documentId}`).join(",");
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.set("stack", stackParam);
      await goto(`/admin?${params.toString()}`, {});
      activeEditorIndex = 1;
    }
    async function handleStackedEditorBack() {
      const newStack = editorStack.slice(0, -1);
      const params = new SvelteURLSearchParams(page.url.searchParams);
      if (newStack.length > 0) {
        const stackParam = newStack.map((item) => `${item.documentType}:${item.documentId}`).join(",");
        params.set("stack", stackParam);
      } else {
        params.delete("stack");
      }
      await goto(`/admin?${params.toString()}`, {});
      activeEditorIndex = newStack.length > 0 ? 1 : 0;
    }
    async function handleCloseStackedEditor(_index) {
      const params = new SvelteURLSearchParams(page.url.searchParams);
      params.delete("stack");
      params.delete("history");
      await goto(`/admin?${params.toString()}`, {});
      activeEditorIndex = 0;
    }
    function handleAutoSave(documentId, title2) {
      if (documentsList.length > 0) {
        documentsList = documentsList.map((doc) => doc.id === documentId ? { ...doc, title: title2 } : doc);
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("um2b6p", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(activeTab.value === "structure" ? "Content" : activeTab.value === "media" ? "Media" : "Vision")} - ${escape_html(title)}</title>`);
        });
      });
      $$renderer3.push(`<div class="flex h-full flex-col overflow-hidden">`);
      if ((windowWidth < 620 || focusModeOn || presentationModeOn) && activeTab.value === "structure") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="border-border bg-background border-b"><div class="flex h-12 items-center px-4">`);
        if (mobileView === "documents" && selectedDocumentType) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<button class="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Content</button> <span class="text-muted-foreground mx-2">/</span> <span class="text-sm font-medium">${escape_html(pluralize(documentTypes().find((t) => t.name === selectedDocumentType)?.title || selectedDocumentType))}</span>`);
        } else if (mobileView === "editor") {
          $$renderer3.push("<!--[1-->");
          Button($$renderer3, {
            onclick: navigateBack,
            variant: "ghost",
            class: "text-muted-foreground hover:text-foreground text-sm",
            children: ($$renderer4) => {
              $$renderer4.push(`<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <span class="ml-3 text-sm font-medium">${escape_html("Document")}</span>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<span class="text-sm font-medium">Content</span>`);
        }
        $$renderer3.push(`<!--]--></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="flex-1 overflow-hidden">`);
      if (Tabs) {
        $$renderer3.push("<!--[-->");
        Tabs($$renderer3, {
          value: activeTab.value,
          onValueChange: handleTabChange,
          class: "h-full",
          children: ($$renderer4) => {
            if (Tabs_content) {
              $$renderer4.push("<!--[-->");
              Tabs_content($$renderer4, {
                value: "structure",
                class: "h-full overflow-hidden",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->`);
                  {
                    $$renderer5.push(`<div${attr_class(clsx(windowWidth < 620 ? "h-full w-full" : "flex h-full w-full overflow-hidden"))}>`);
                    if (schemaError) {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<div class="bg-destructive/5 flex flex-1 items-center justify-center p-8"><div class="w-full max-w-2xl">`);
                      Alert($$renderer5, {
                        variant: "destructive",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.704-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>`);
                          Alert_title($$renderer6, {
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->Schema Validation Error`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                          Alert_description($$renderer6, {
                            class: "whitespace-pre-line",
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(schemaError.message)}`);
                            },
                            $$slots: { default: true }
                          });
                          $$renderer6.push(`<!---->`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div></div>`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                      $$renderer5.push(`<div${attr_class(`border-rule border-r transition-all duration-200 ${stringify(windowWidth < 620 ? typesPanel() === "hidden" ? "hidden" : "h-full w-screen" : typesPanel())} ${stringify(typesPanel() === "hidden" ? "hidden" : "block")} h-full overflow-hidden`)}>`);
                      if (typesPanel() === "w-[60px]") {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<button class="hover:bg-muted/30 flex h-full w-full cursor-pointer flex-col transition-colors" title="Click to expand content types"><div class="flex flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground -mt-2 text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">Content</div></div></button>`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                        $$renderer5.push(`<div class="h-full overflow-y-auto p-3">`);
                        if (hasDocumentTypes()) {
                          $$renderer5.push("<!--[0-->");
                          $$renderer5.push(`<h2 class="text-muted-foreground border-rule mt-2 mb-3 hidden px-2 pb-3 text-sm font-medium sm:block sm:border-b">Content</h2> <!--[-->`);
                          const each_array = ensure_array_like(groupedDocumentTypes());
                          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
                            let bucket = each_array[$$index_1];
                            if (bucket.name) {
                              $$renderer5.push("<!--[0-->");
                              $$renderer5.push(`<div class="text-muted-foreground mt-3 mb-1 px-2 text-xs font-semibold tracking-wide uppercase first:mt-0">${escape_html(bucket.name)}</div>`);
                            } else {
                              $$renderer5.push("<!--[-1-->");
                            }
                            $$renderer5.push(`<!--]--> <!--[-->`);
                            const each_array_1 = ensure_array_like(bucket.items);
                            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                              let docType = each_array_1[$$index];
                              $$renderer5.push(`<button${attr_class(`hover:bg-muted/50 group flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2.5 text-left transition-colors ${stringify(selectedDocumentType === docType.name ? "bg-muted/50" : "")}`)}${attr("title", docType.description || "")}><div class="flex items-center gap-2"><div class="text-muted-foreground flex h-5 w-5 items-center justify-center">`);
                              if (docType.icon) {
                                $$renderer5.push("<!--[0-->");
                                const Icon2 = docType.icon;
                                if (Icon2) {
                                  $$renderer5.push("<!--[-->");
                                  Icon2($$renderer5, { class: "h-4 w-4" });
                                  $$renderer5.push("<!--]-->");
                                } else {
                                  $$renderer5.push("<!--[!-->");
                                  $$renderer5.push("<!--]-->");
                                }
                              } else {
                                $$renderer5.push("<!--[-1-->");
                                File_text($$renderer5, { class: "h-4 w-4" });
                              }
                              $$renderer5.push(`<!--]--></div> <span class="text-sm">${escape_html(docType.singleton ? docType.title : pluralize(docType.title))}</span></div> <svg class="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>`);
                            }
                            $$renderer5.push(`<!--]-->`);
                          }
                          $$renderer5.push(`<!--]-->`);
                        } else {
                          $$renderer5.push("<!--[-1-->");
                          $$renderer5.push(`<div class="p-6 text-center"><div class="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">`);
                          File_text($$renderer5, { class: "text-muted-foreground h-8 w-8" });
                          $$renderer5.push(`<!----></div> <h3 class="mb-2 font-medium">No content types found</h3> <p class="text-muted-foreground mb-4 text-sm">Get started by defining your first schema type</p> <p class="text-muted-foreground text-xs">Add schemas in <code class="bg-muted rounded px-1.5 py-0.5 text-xs">src/lib/schemaTypes/</code></p></div>`);
                        }
                        $$renderer5.push(`<!--]--></div>`);
                      }
                      $$renderer5.push(`<!--]--></div> `);
                      {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--> `);
                      if (primaryEditorState().visible) {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<div${attr_class(`transition-all duration-200 ${stringify(windowWidth < 620 ? "w-screen" : "flex-1")} h-full overflow-x-hidden overflow-y-auto ${stringify(primaryEditorState().expanded ? "" : "hidden")}`)}${attr_style(windowWidth >= 620 ? "min-width: 0;" : "")}>`);
                        DocumentEditor($$renderer5, {
                          schemas,
                          documentType: selectedDocumentType,
                          documentId: editingDocumentId,
                          isCreating: isCreatingDocument,
                          focusMode: focusModeOn,
                          onToggleFocus: toggleFocusMode,
                          presentationMode: presentationModeOn,
                          onTogglePresentation: togglePresentationMode,
                          organizationId: currentOrgId,
                          onBack: navigateBack,
                          onOpenReference: handleOpenReference,
                          onOpenVersionHistory: handleOpenVersionHistory,
                          externalVersionPreview: versionPanelDocId === editingDocumentId ? versionPreviewData : null,
                          onSaved: async (docId) => {
                            {
                              navigateToEditDocument(docId, selectedDocumentType);
                            }
                          },
                          onAutoSaved: handleAutoSave,
                          onPublished: async (docId) => {
                          },
                          onUnpublished: async (docId) => {
                          },
                          onRestored: async (docId) => {
                          },
                          onDeleted: async () => {
                            {
                              const orgId = page.url.searchParams.get("orgId");
                              const url = orgId ? `/admin?orgId=${orgId}` : "/admin";
                              await goto(url, {});
                            }
                          },
                          isReadOnly
                        });
                        $$renderer5.push(`<!----></div> `);
                        if (!primaryEditorState().expanded && !focusModeOn && !presentationModeOn) {
                          $$renderer5.push("<!--[0-->");
                          $$renderer5.push(`<button class="border-rule hover:bg-muted/50 flex h-full w-[60px] cursor-pointer flex-col border-l transition-colors"${attr("title", `Click to expand ${stringify(selectedDocumentType)}`)}><div class="flex flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground -mt-2 text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">${escape_html("")}</div></div></button>`);
                        } else {
                          $$renderer5.push("<!--[-1-->");
                        }
                        $$renderer5.push(`<!--]-->`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--> `);
                      if (editorStack.length > 0) {
                        $$renderer5.push("<!--[0-->");
                        const currentRef = editorStack[editorStack.length - 1];
                        const isExpanded = focusModeOn ? activeEditorIndex === 1 : layoutConfig().expandedIndices.includes(1);
                        if (isExpanded) {
                          $$renderer5.push("<!--[0-->");
                          $$renderer5.push(`<div class="border-rule h-full flex-1 overflow-x-hidden overflow-y-auto border-l transition-all duration-200" style="min-width: 0;">`);
                          DocumentEditor($$renderer5, {
                            schemas,
                            documentType: currentRef.documentType,
                            documentId: currentRef.documentId,
                            isCreating: currentRef.isCreating,
                            onBack: handleStackedEditorBack,
                            onOpenReference: handleOpenReference,
                            onOpenVersionHistory: handleOpenVersionHistory,
                            onToggleFocus: () => {
                              activeEditorIndex = 1;
                              toggleFocusMode();
                            },
                            externalVersionPreview: versionPanelDocId === currentRef.documentId ? versionPreviewData : null,
                            onSaved: async () => {
                            },
                            onAutoSaved: handleAutoSave,
                            onPublished: async (docId) => {
                            },
                            onUnpublished: async (docId) => {
                            },
                            onRestored: async (docId) => {
                            },
                            onDeleted: async () => {
                              handleCloseStackedEditor();
                            },
                            isReadOnly
                          });
                          $$renderer5.push(`<!----></div>`);
                        } else if (!focusModeOn) {
                          $$renderer5.push("<!--[1-->");
                          $$renderer5.push(`<button class="border-rule hover:bg-muted/50 flex h-full w-[60px] cursor-pointer flex-col border-l transition-colors"${attr("title", `Click to expand ${stringify(currentRef.documentType)}`)}><div class="flex h-full flex-1 items-start justify-center p-2 pt-8 text-left"><div class="text-foreground text-sm font-medium whitespace-nowrap [writing-mode:vertical-rl]">${escape_html(currentRef.documentType.charAt(0).toUpperCase() + currentRef.documentType.slice(1))}</div></div></button>`);
                        } else {
                          $$renderer5.push("<!--[-1-->");
                        }
                        $$renderer5.push(`<!--]-->`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]-->`);
                    }
                    $$renderer5.push(`<!--]--> `);
                    if (showVersionPanel && versionPanelDocId) {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<div class="border-rule h-full w-[280px] shrink-0 overflow-y-auto border-l transition-all duration-200">`);
                      DocumentVersionPanel($$renderer5, {
                        documentId: versionPanelDocId,
                        onClose: handleCloseVersionPanel,
                        onPreviewVersion: (v) => {
                          versionPreviewData = v;
                        },
                        onRestored: async () => {
                          versionPreviewData = null;
                        }
                      });
                      $$renderer5.push(`<!----></div>`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]--></div>`);
                  }
                  $$renderer5.push(`<!---->`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
            $$renderer4.push(` `);
            if (graphqlSettings?.enableGraphiQL) {
              $$renderer4.push("<!--[0-->");
              if (Tabs_content) {
                $$renderer4.push("<!--[-->");
                Tabs_content($$renderer4, {
                  value: "vision",
                  class: "m-0 h-full p-0",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="bg-muted/10 flex h-full items-center justify-center"><div class="space-y-4 text-center"><div class="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full"><svg class="text-primary h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div> <div><h3 class="mb-2 text-lg font-semibold">GraphQL Playground</h3> <p class="text-muted-foreground mb-4">Query your CMS data with the GraphQL API</p> <a${attr("href", graphqlSettings.endpoint)} target="_blank" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 transition-colors">Open Playground <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></div></div></div>`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (Tabs_content) {
              $$renderer4.push("<!--[-->");
              Tabs_content($$renderer4, {
                value: "media",
                class: "m-0 h-full p-0",
                children: ($$renderer5) => {
                  MediaBrowser($$renderer5, { active: activeTab.value === "media" });
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
      $$renderer3.push(`</div></div> `);
      ConfirmDialogHost($$renderer3);
      $$renderer3.push(`<!---->`);
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
    const capabilities = derived(() => page.data.rbac?.capabilities ?? []);
    const rbacRole = derived(() => page.data.rbac?.role ?? null);
    function handleTabChange(value) {
      if (activeTabState) activeTabState.value = value;
    }
    AdminApp($$renderer2, {
      schemas: schemaTypes,
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
export {
  _page as default
};
