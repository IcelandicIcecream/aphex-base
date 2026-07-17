import "./state.svelte.js";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import { w as writable } from "./index4.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}
function invalidateAll() {
  {
    throw new Error("Cannot call invalidateAll() on the server");
  }
}
({
  check: stores.updated.check
});
export {
  goto as g,
  invalidateAll as i
};
