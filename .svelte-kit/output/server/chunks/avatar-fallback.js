import { f as derived, p as props_id, h as attributes, j as bind_props, g as spread_props } from "./renderer.js";
import { c as cn } from "./utils2.js";
import { a as attachRef, e as createBitsAttrs, c as createId, b as boxWith, m as mergeProps } from "./create-id.js";
import { C as Context, d as DOMContext, w as watch } from "./sheet-content.js";
const avatarAttrs = createBitsAttrs({ component: "avatar", parts: ["root", "image", "fallback"] });
const AvatarRootContext = new Context("Avatar.Root");
class AvatarRootState {
  static create(opts) {
    return AvatarRootContext.set(new AvatarRootState(opts));
  }
  opts;
  domContext;
  attachment;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(this.opts.ref);
    this.loadImage = this.loadImage.bind(this);
    this.attachment = attachRef(this.opts.ref);
  }
  loadImage(src, crossorigin, referrerPolicy) {
    if (this.opts.loadingStatus.current === "loaded") return;
    let imageTimerId;
    const image = new Image();
    image.src = src;
    if (crossorigin !== void 0) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    this.opts.loadingStatus.current = "loading";
    image.onload = () => {
      imageTimerId = this.domContext.setTimeout(
        () => {
          this.opts.loadingStatus.current = "loaded";
        },
        this.opts.delayMs.current
      );
    };
    image.onerror = () => {
      this.opts.loadingStatus.current = "error";
    };
    return () => {
      if (!imageTimerId) return;
      this.domContext.clearTimeout(imageTimerId);
    };
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [avatarAttrs.root]: "",
    "data-status": this.opts.loadingStatus.current,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class AvatarImageState {
  static create(opts) {
    return new AvatarImageState(opts, AvatarRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
    watch.pre(
      [
        () => this.opts.src.current,
        () => this.opts.crossOrigin.current
      ],
      ([src, crossOrigin]) => {
        if (!src) {
          this.root.opts.loadingStatus.current = "error";
          return;
        }
        this.root.loadImage(src, crossOrigin, this.opts.referrerPolicy.current);
      }
    );
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    style: {
      display: this.root.opts.loadingStatus.current === "loaded" ? "block" : "none"
    },
    "data-status": this.root.opts.loadingStatus.current,
    [avatarAttrs.image]: "",
    src: this.opts.src.current,
    crossorigin: this.opts.crossOrigin.current,
    referrerpolicy: this.opts.referrerPolicy.current,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class AvatarFallbackState {
  static create(opts) {
    return new AvatarFallbackState(opts, AvatarRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref);
  }
  #style = derived(() => this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : void 0);
  get style() {
    return this.#style();
  }
  set style($$value) {
    return this.#style($$value);
  }
  #props = derived(() => ({
    style: this.style,
    "data-status": this.root.opts.loadingStatus.current,
    [avatarAttrs.fallback]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function Avatar$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      delayMs = 0,
      loadingStatus = "loading",
      onLoadingStatusChange,
      child,
      children,
      id = createId(uid),
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const rootState = AvatarRootState.create({
      delayMs: boxWith(() => delayMs),
      loadingStatus: boxWith(() => loadingStatus, (v) => {
        if (loadingStatus !== v) {
          loadingStatus = v;
          onLoadingStatusChange?.(v);
        }
      }),
      id: boxWith(() => id),
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
    bind_props($$props, { loadingStatus, ref });
  });
}
function Avatar_fallback$1($$renderer, $$props) {
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
    const fallbackState = AvatarFallbackState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, fallbackState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></span>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Avatar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      loadingStatus = "loading",
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (Avatar$1) {
        $$renderer3.push("<!--[-->");
        Avatar$1($$renderer3, spread_props([
          {
            "data-slot": "avatar",
            class: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)
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
            get loadingStatus() {
              return loadingStatus;
            },
            set loadingStatus($$value) {
              loadingStatus = $$value;
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
    bind_props($$props, { ref, loadingStatus });
  });
}
function Avatar_fallback($$renderer, $$props) {
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
      if (Avatar_fallback$1) {
        $$renderer3.push("<!--[-->");
        Avatar_fallback$1($$renderer3, spread_props([
          {
            "data-slot": "avatar-fallback",
            class: cn("bg-muted flex size-full items-center justify-center rounded-full", className)
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
export {
  Avatar as A,
  Avatar_fallback as a,
  AvatarImageState as b
};
