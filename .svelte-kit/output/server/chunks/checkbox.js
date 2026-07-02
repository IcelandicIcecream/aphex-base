import { o as is_array, q as get_prototype_of, t as object_prototype, d as derived, f as spread_props, p as props_id, g as attributes, i as bind_props } from "./renderer.js";
import { c as cn } from "./utils2.js";
import { C as Context, w as watch, E as ENTER, j as SPACE, k as isHTMLElement, I as Icon } from "./sheet-content.js";
import { a as attachRef, f as boolToEmptyStrOrUndef, h as boolToStr, i as getAriaChecked, c as createBitsAttrs, d as createId, e as boxWith, m as mergeProps } from "./create-id.js";
import { H as Hidden_input } from "./hidden-input.js";
import { C as Check } from "./check.js";
const empty = [];
function snapshot(value, skip_warning = false, no_tojson = false) {
  return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element = value[i];
        if (i in value) {
          copy[i] = clone(element, cloned, path, paths, null, no_tojson);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key of Object.keys(value)) {
        copy[key] = clone(
          // @ts-expect-error
          value[key],
          cloned,
          path,
          paths,
          null,
          no_tojson
        );
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function" && !no_tojson) {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        path,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
const checkboxAttrs = createBitsAttrs({
  component: "checkbox",
  parts: ["root", "group", "group-label", "input"]
});
const CheckboxGroupContext = new Context("Checkbox.Group");
const CheckboxRootContext = new Context("Checkbox.Root");
class CheckboxRootState {
  static create(opts, group = null) {
    return CheckboxRootContext.set(new CheckboxRootState(opts, group));
  }
  opts;
  group;
  #trueName = derived(() => {
    if (this.group && this.group.opts.name.current) return this.group.opts.name.current;
    return this.opts.name.current;
  });
  get trueName() {
    return this.#trueName();
  }
  set trueName($$value) {
    return this.#trueName($$value);
  }
  #trueRequired = derived(() => {
    if (this.group && this.group.opts.required.current) return true;
    return this.opts.required.current;
  });
  get trueRequired() {
    return this.#trueRequired();
  }
  set trueRequired($$value) {
    return this.#trueRequired($$value);
  }
  #trueDisabled = derived(() => {
    if (this.group && this.group.opts.disabled.current) return true;
    return this.opts.disabled.current;
  });
  get trueDisabled() {
    return this.#trueDisabled();
  }
  set trueDisabled($$value) {
    return this.#trueDisabled($$value);
  }
  #trueReadonly = derived(() => {
    if (this.group && this.group.opts.readonly.current) return true;
    return this.opts.readonly.current;
  });
  get trueReadonly() {
    return this.#trueReadonly();
  }
  set trueReadonly($$value) {
    return this.#trueReadonly($$value);
  }
  attachment;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    this.attachment = attachRef(this.opts.ref);
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
    watch.pre(
      [
        () => snapshot(this.group?.opts.value.current),
        () => this.opts.value.current
      ],
      ([groupValue, value]) => {
        if (!groupValue || !value) return;
        this.opts.checked.current = groupValue.includes(value);
      }
    );
    watch.pre(() => this.opts.checked.current, (checked) => {
      if (!this.group) return;
      if (checked) {
        this.group?.addValue(this.opts.value.current);
      } else {
        this.group?.removeValue(this.opts.value.current);
      }
    });
  }
  onkeydown(e) {
    if (this.trueDisabled || this.trueReadonly) return;
    if (e.key === ENTER) e.preventDefault();
    if (e.key === SPACE) {
      e.preventDefault();
      this.#toggle();
    }
  }
  #toggle() {
    if (this.opts.indeterminate.current) {
      this.opts.indeterminate.current = false;
      this.opts.checked.current = true;
    } else {
      this.opts.checked.current = !this.opts.checked.current;
    }
  }
  onclick(e) {
    if (this.trueDisabled || this.trueReadonly) return;
    if (this.opts.type.current === "submit") {
      this.#toggle();
      return;
    }
    e.preventDefault();
    this.#toggle();
  }
  #snippetProps = derived(() => ({
    checked: this.opts.checked.current,
    indeterminate: this.opts.indeterminate.current
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "checkbox",
    type: this.opts.type.current,
    disabled: this.trueDisabled,
    "aria-checked": getAriaChecked(this.opts.checked.current, this.opts.indeterminate.current),
    "aria-required": boolToStr(this.trueRequired),
    "aria-readonly": boolToStr(this.trueReadonly),
    "data-disabled": boolToEmptyStrOrUndef(this.trueDisabled),
    "data-readonly": boolToEmptyStrOrUndef(this.trueReadonly),
    "data-state": getCheckboxDataState(this.opts.checked.current, this.opts.indeterminate.current),
    [checkboxAttrs.root]: "",
    onclick: this.onclick,
    onkeydown: this.onkeydown,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class CheckboxInputState {
  static create() {
    return new CheckboxInputState(CheckboxRootContext.get());
  }
  root;
  #trueChecked = derived(() => {
    if (!this.root.group) return this.root.opts.checked.current;
    if (this.root.opts.value.current !== void 0 && this.root.group.opts.value.current.includes(this.root.opts.value.current)) {
      return true;
    }
    return false;
  });
  get trueChecked() {
    return this.#trueChecked();
  }
  set trueChecked($$value) {
    return this.#trueChecked($$value);
  }
  #shouldRender = derived(() => Boolean(this.root.trueName));
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(root) {
    this.root = root;
    this.onfocus = this.onfocus.bind(this);
  }
  onfocus(_) {
    if (!isHTMLElement(this.root.opts.ref.current)) return;
    this.root.opts.ref.current.focus();
  }
  #props = derived(() => ({
    type: "checkbox",
    checked: this.root.opts.checked.current === true,
    disabled: this.root.trueDisabled,
    required: this.root.trueRequired,
    name: this.root.trueName,
    value: this.root.opts.value.current,
    readonly: this.root.trueReadonly,
    onfocus: this.onfocus
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function getCheckboxDataState(checked, indeterminate) {
  if (indeterminate) return "indeterminate";
  return checked ? "checked" : "unchecked";
}
function Checkbox_input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const inputState = CheckboxInputState.create();
    if (inputState.shouldRender) {
      $$renderer2.push("<!--[0-->");
      Hidden_input($$renderer2, spread_props([inputState.props]));
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Checkbox$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      checked = false,
      ref = null,
      onCheckedChange,
      children,
      disabled = false,
      required = false,
      name = void 0,
      value = "on",
      id = createId(uid),
      indeterminate = false,
      onIndeterminateChange,
      child,
      type = "button",
      readonly,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const group = CheckboxGroupContext.getOr(null);
    if (group && value) {
      if (group.opts.value.current.includes(value)) {
        checked = true;
      } else {
        checked = false;
      }
    }
    watch.pre(() => value, () => {
      if (group && value) {
        if (group.opts.value.current.includes(value)) {
          checked = true;
        } else {
          checked = false;
        }
      }
    });
    const rootState = CheckboxRootState.create(
      {
        checked: boxWith(() => checked, (v) => {
          checked = v;
          onCheckedChange?.(v);
        }),
        disabled: boxWith(() => disabled ?? false),
        required: boxWith(() => required),
        name: boxWith(() => name),
        value: boxWith(() => value),
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v),
        indeterminate: boxWith(() => indeterminate, (v) => {
          indeterminate = v;
          onIndeterminateChange?.(v);
        }),
        type: boxWith(() => type),
        readonly: boxWith(() => Boolean(readonly))
      },
      group
    );
    const mergedProps = derived(() => mergeProps({ ...restProps }, rootState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps(), ...rootState.snippetProps });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2, rootState.snippetProps);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]--> `);
    Checkbox_input($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { checked, ref, indeterminate });
  });
}
function Minus($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "M5 12h14" }]];
    Icon($$renderer2, spread_props([
      { name: "minus" },
      /**
       * @component @name Minus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/minus
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
function Checkbox($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      checked = false,
      indeterminate = false,
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let children = function($$renderer4, { checked: checked2, indeterminate: indeterminate2 }) {
          $$renderer4.push(`<div data-slot="checkbox-indicator" class="text-current transition-none">`);
          if (checked2) {
            $$renderer4.push("<!--[0-->");
            Check($$renderer4, { class: "size-3.5" });
          } else if (indeterminate2) {
            $$renderer4.push("<!--[1-->");
            Minus($$renderer4, { class: "size-3.5" });
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div>`);
        };
        if (Checkbox$1) {
          $$renderer3.push("<!--[-->");
          Checkbox$1($$renderer3, spread_props([
            {
              "data-slot": "checkbox",
              class: cn("border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
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
              get checked() {
                return checked;
              },
              set checked($$value) {
                checked = $$value;
                $$settled = false;
              },
              get indeterminate() {
                return indeterminate;
              },
              set indeterminate($$value) {
                indeterminate = $$value;
                $$settled = false;
              },
              children,
              $$slots: { default: true }
            }
          ]));
          $$renderer3.push("<!--]-->");
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push("<!--]-->");
        }
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref, checked, indeterminate });
  });
}
export {
  Checkbox as C
};
