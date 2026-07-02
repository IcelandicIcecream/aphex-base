import { m as setContext, k as head, b as attr } from "../../chunks/renderer.js";
import "clsx";
import "../../chunks/index4.js";
const favicon = "/_app/immutable/assets/favicon.DN4o9Qxv.svg";
const KEY = /* @__PURE__ */ Symbol("aphex:live-preview");
class LivePreviewContext {
  current = null;
}
function setLivePreviewContext() {
  const ctx = new LivePreviewContext();
  setContext(KEY, ctx);
  return ctx;
}
function AphexVisualOverlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    setLivePreviewContext();
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.push(`<link rel="icon"${attr("href", favicon)}/>`);
  });
  AphexVisualOverlay($$renderer, {
    children: ($$renderer2) => {
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    }
  });
}
export {
  _layout as default
};
