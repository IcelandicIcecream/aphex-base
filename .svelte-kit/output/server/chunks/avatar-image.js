import { p as props_id, h as attributes, j as bind_props, f as derived, g as spread_props } from "./renderer.js";
import { I as Icon } from "./sheet-content.js";
import { c as cn } from "./utils2.js";
import { b as AvatarImageState } from "./avatar-fallback.js";
import { c as createId, b as boxWith, m as mergeProps } from "./create-id.js";
function Avatar_image$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      src,
      child,
      id = createId(uid),
      ref = null,
      crossorigin = void 0,
      referrerpolicy = void 0,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const imageState = AvatarImageState.create({
      src: boxWith(() => src),
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      crossOrigin: boxWith(() => crossorigin),
      referrerPolicy: boxWith(() => referrerpolicy)
    });
    const mergedProps = derived(() => mergeProps(restProps, imageState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<img${attributes({ ...mergedProps(), src })} onload="this.__e=event" onerror="this.__e=event"/>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Users($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
      ["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }],
      ["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
      ["circle", { "cx": "9", "cy": "7", "r": "4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "users" },
      /**
       * @component @name Users
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8cGF0aCBkPSJNMTYgMy4xMjhhNCA0IDAgMCAxIDAgNy43NDQiIC8+CiAgPHBhdGggZD0iTTIyIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/users
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
function Avatar_image($$renderer, $$props) {
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
      if (Avatar_image$1) {
        $$renderer3.push("<!--[-->");
        Avatar_image$1($$renderer3, spread_props([
          {
            "data-slot": "avatar-image",
            class: cn("aspect-square size-full", className)
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
  Avatar_image as A,
  Users as U
};
