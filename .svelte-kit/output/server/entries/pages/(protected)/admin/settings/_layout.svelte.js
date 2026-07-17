import { s as setContext, e as escape_html, a as ensure_array_like, b as attr, c as attr_class, d as stringify, f as derived } from "../../../../../chunks/renderer.js";
import { p as page } from "../../../../../chunks/index3.js";
import { s as settingsHeaderActionContextKey } from "../../../../../chunks/settings-header-actions.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    let headerActions = null;
    setContext(settingsHeaderActionContextKey, {
      setActions(actions) {
        headerActions = actions;
      }
    });
    const basePath = "/admin/settings";
    const capabilities = derived(() => page.data.rbac?.capabilities ?? []);
    function has(cap) {
      return capabilities().includes(cap);
    }
    const orgTabs = derived(() => [
      { label: "General", href: basePath, requires: "org.settings" },
      {
        label: "Members",
        href: `${basePath}/members`,
        requires: null
      },
      {
        label: "Roles & access",
        href: `${basePath}/roles`,
        requires: "role.manage"
      },
      {
        label: "Plugins",
        href: `${basePath}/plugins`,
        requires: "plugin.settings.manage"
      }
    ].filter((t) => t.requires === null || has(t.requires)));
    const accountTabs = derived(() => [
      {
        label: "Profile",
        href: `${basePath}/account`,
        requires: null
      },
      {
        label: "API tokens",
        href: `${basePath}/api-keys`,
        requires: "apiKey.manage"
      }
    ].filter((t) => t.requires === null || has(t.requires)));
    function isActive(href) {
      if (href === basePath) return page.url.pathname === basePath;
      return page.url.pathname.startsWith(href);
    }
    const organizationName = derived(() => page.data.sidebarData?.activeOrganization?.name ?? "Organization");
    const currentTitle = derived(() => {
      const tab = [...orgTabs(), ...accountTabs()].find((item) => isActive(item.href));
      if (tab?.label === "General") return "Organization settings";
      if (tab?.label === "Profile") return "Profile settings";
      return tab ? `${tab.label} settings` : "Settings";
    });
    const currentDescription = derived(() => {
      if (page.url.pathname === basePath) return `Profile, defaults and preferences for ${organizationName()}.`;
      if (page.url.pathname.startsWith(`${basePath}/account`)) return "Personal identity and account preferences.";
      if (page.url.pathname.startsWith(`${basePath}/members`)) return "Manage members and invitations.";
      if (page.url.pathname.startsWith(`${basePath}/roles`)) return "Manage role capabilities and access.";
      if (page.url.pathname.startsWith(`${basePath}/api-keys`)) return "Create and manage programmatic access.";
      return "Manage your organization and account.";
    });
    $$renderer2.push(`<div class="bg-background flex flex-1 flex-col overflow-y-auto"><div class="mx-auto w-full max-w-7xl px-4 py-6 md:px-8"><div class="min-w-0"><div class="mb-5 border-b"><div class="flex flex-col gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 class="text-2xl font-semibold tracking-tight">${escape_html(currentTitle())}</h1> <p class="text-muted-foreground mt-1 text-sm">${escape_html(currentDescription())}</p></div> `);
    if (headerActions) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">`);
      headerActions($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <nav class="flex gap-5 overflow-x-auto text-sm" aria-label="Settings sections"><!--[-->`);
    const each_array = ensure_array_like([...orgTabs(), ...accountTabs()]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<a${attr("href", tab.href)}${attr_class(`border-b-2 px-0 pb-2.5 font-medium whitespace-nowrap transition-colors ${stringify(isActive(tab.href) ? "border-foreground text-foreground" : "text-muted-foreground hover:text-foreground border-transparent")}`)}>${escape_html(tab.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav></div> `);
    children($$renderer2);
    $$renderer2.push(`<!----></div></div></div>`);
  });
}
export {
  _layout as default
};
