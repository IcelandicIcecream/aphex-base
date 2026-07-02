import "clsx";
import { m as setContext, l as getContext } from "./renderer.js";
const KEY = /* @__PURE__ */ Symbol.for("aphex.permissions");
function setPermissionsContext(getCapabilities, getRole = () => null) {
  const ctx = {
    get capabilities() {
      return getCapabilities();
    },
    get role() {
      return getRole();
    },
    can(cap) {
      return getCapabilities().includes(cap);
    },
    canAny(...caps) {
      const current = getCapabilities();
      return caps.some((c) => current.includes(c));
    },
    canAll(...caps) {
      const current = getCapabilities();
      return caps.every((c) => current.includes(c));
    }
  };
  setContext(KEY, ctx);
  return ctx;
}
function usePermissions() {
  const ctx = getContext(KEY);
  if (ctx) return ctx;
  warnOnce();
  return DENY_ALL;
}
const DENY_ALL = Object.freeze({
  capabilities: Object.freeze([]),
  role: null,
  can: () => false,
  canAny: () => false,
  canAll: () => false
});
let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  if (typeof window !== "undefined") {
    console.warn("[aphex] usePermissions() called outside a PermissionsContext provider. All capability checks will return false. Call setPermissionsContext() in an ancestor.");
  }
}
const confirmDialogState = {
  open: false,
  title: "",
  description: void 0,
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "default",
  resolve: null
};
function confirmDialog(options) {
  return new Promise((resolve) => {
    if (confirmDialogState.resolve) {
      confirmDialogState.resolve(false);
    }
    confirmDialogState.title = options.title;
    confirmDialogState.description = options.description;
    confirmDialogState.confirmText = options.confirmText ?? "Confirm";
    confirmDialogState.cancelText = options.cancelText ?? "Cancel";
    confirmDialogState.variant = options.variant ?? "default";
    confirmDialogState.resolve = resolve;
    confirmDialogState.open = true;
  });
}
function resolveConfirmDialog(value) {
  const r = confirmDialogState.resolve;
  confirmDialogState.resolve = null;
  confirmDialogState.open = false;
  r?.(value);
}
export {
  confirmDialogState as a,
  confirmDialog as c,
  resolveConfirmDialog as r,
  setPermissionsContext as s,
  usePermissions as u
};
