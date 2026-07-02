import { f as spread_props, e as escape_html, d as derived, k as head } from "../../../../../../chunks/renderer.js";
import { B as Button } from "../../../../../../chunks/button.js";
import { I as Input } from "../../../../../../chunks/input.js";
import { L as Label } from "../../../../../../chunks/label.js";
import { B as Badge } from "../../../../../../chunks/badge.js";
import { S as Switch } from "../../../../../../chunks/switch.js";
import { C as Card, a as Card_content } from "../../../../../../chunks/card-content.js";
import "clsx";
import { C as Card_footer } from "../../../../../../chunks/card-footer.js";
import { C as Card_header, a as Card_title } from "../../../../../../chunks/card-title.js";
import { A as Avatar, a as Avatar_image, b as Avatar_fallback } from "../../../../../../chunks/avatar-fallback.js";
import { S as Separator } from "../../../../../../chunks/separator.js";
import { i as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/date-utils.js";
import { u as user } from "../../../../../../chunks/instance2.js";
import { I as Icon } from "../../../../../../chunks/sheet-content.js";
import "../../../../../../chunks/index4.js";
import "../../../../../../chunks/mode-states.svelte.js";
import { L as Lock } from "../../../../../../chunks/lock.js";
import { t as toast } from "../../../../../../chunks/toast-state.svelte.js";
function Building_2($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M10 12h4" }],
      ["path", { "d": "M10 8h4" }],
      ["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
      [
        "path",
        {
          "d": "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"
        }
      ],
      ["path", { "d": "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "building-2" },
      /**
       * @component @name Building2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTJoNCIgLz4KICA8cGF0aCBkPSJNMTAgOGg0IiAvPgogIDxwYXRoIGQ9Ik0xNCAyMXYtM2EyIDIgMCAwIDAtNCAwdjMiIC8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIgLz4KICA8cGF0aCBkPSJNNiAyMVY1YTIgMiAwIDAgMSAyLTJoOGEyIDIgMCAwIDEgMiAydjE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/building-2
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
function AccountSettings($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user: user$1, userPreferences = null, hasChildOrganizations = false } = $$props;
    let userName = user$1.name || "";
    let isUpdating = false;
    let includeChildOrganizations = userPreferences?.includeChildOrganizations ?? false;
    let isUpdatingPreferences = false;
    const userInitials = derived(() => user$1.name ? user$1.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : user$1.email[0].toUpperCase());
    function getRoleBadgeVariant(role) {
      switch (role) {
        case "super_admin":
          return "default";
        case "admin":
          return "secondary";
        default:
          return "outline";
      }
    }
    function formatRole(role) {
      return role.replace(/_/g, " ");
    }
    async function updateProfile() {
      if (!userName.trim()) {
        toast.error("Please enter your name");
        return;
      }
      isUpdating = true;
      try {
        const result = await user.updateProfile({ name: userName.trim() });
        if (!result.success) {
          throw new Error(result.error || result.message || "Failed to update profile");
        }
        toast.success("Profile updated successfully");
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update profile");
      } finally {
        isUpdating = false;
      }
    }
    async function updatePreferences(prefs) {
      isUpdatingPreferences = true;
      try {
        const result = await user.updatePreferences(prefs);
        if (!result.success) {
          throw new Error(result.error || result.message || "Failed to update preferences");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update preferences");
        if (prefs.includeChildOrganizations !== void 0) {
          includeChildOrganizations = !prefs.includeChildOrganizations;
        }
      } finally {
        isUpdatingPreferences = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-6">`);
      if (Card) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          children: ($$renderer4) => {
            if (Card_header) {
              $$renderer4.push("<!--[-->");
              Card_header($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="flex items-center gap-4">`);
                  if (Avatar) {
                    $$renderer5.push("<!--[-->");
                    Avatar($$renderer5, {
                      class: "h-14 w-14 text-lg",
                      children: ($$renderer6) => {
                        if (user$1.image) {
                          $$renderer6.push("<!--[0-->");
                          if (Avatar_image) {
                            $$renderer6.push("<!--[-->");
                            Avatar_image($$renderer6, { src: user$1.image, alt: user$1.name || user$1.email });
                            $$renderer6.push("<!--]-->");
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push("<!--]-->");
                          }
                        } else {
                          $$renderer6.push("<!--[-1-->");
                        }
                        $$renderer6.push(`<!--]--> `);
                        if (Avatar_fallback) {
                          $$renderer6.push("<!--[-->");
                          Avatar_fallback($$renderer6, {
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(userInitials())}`);
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
                  $$renderer5.push(` <div class="min-w-0 flex-1"><div class="flex items-center gap-2">`);
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      class: "text-lg",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(user$1.name || user$1.email)}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  Badge($$renderer5, {
                    variant: getRoleBadgeVariant(user$1.role),
                    class: "capitalize",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(formatRole(user$1.role))}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div> <p class="text-muted-foreground mt-0.5 text-sm">${escape_html(user$1.email)}</p></div></div>`);
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
                children: ($$renderer5) => {
                  Separator($$renderer5, { class: "mb-4" });
                  $$renderer5.push(`<!----> <div class="space-y-4"><div>`);
                  Label($$renderer5, {
                    for: "user-name",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Display Name`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    id: "user-name",
                    placeholder: "Your name",
                    class: "mt-2",
                    get value() {
                      return userName;
                    },
                    set value($$value) {
                      userName = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div>`);
                  Label($$renderer5, {
                    for: "user-email",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Email`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="relative mt-1">`);
                  Input($$renderer5, {
                    id: "user-email",
                    type: "email",
                    value: user$1.email,
                    disabled: true,
                    class: "pr-9"
                  });
                  $$renderer5.push(`<!----> `);
                  Lock($$renderer5, {
                    class: "text-muted-foreground absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2"
                  });
                  $$renderer5.push(`<!----></div> <p class="text-muted-foreground mt-1 text-xs">Managed by your authentication provider</p></div></div>`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
            $$renderer4.push(` `);
            if (Card_footer) {
              $$renderer4.push("<!--[-->");
              Card_footer($$renderer4, {
                class: "border-t px-6 py-4",
                children: ($$renderer5) => {
                  Button($$renderer5, {
                    onclick: updateProfile,
                    disabled: isUpdating,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(isUpdating ? "Saving..." : "Save Changes")}`);
                    },
                    $$slots: { default: true }
                  });
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
      if (hasChildOrganizations) {
        $$renderer3.push("<!--[0-->");
        if (Card) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            children: ($$renderer4) => {
              if (Card_header) {
                $$renderer4.push("<!--[-->");
                Card_header($$renderer4, {
                  children: ($$renderer5) => {
                    if (Card_title) {
                      $$renderer5.push("<!--[-->");
                      Card_title($$renderer5, {
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Content Preferences`);
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
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="flex items-center justify-between"><div class="flex items-center gap-3">`);
                    Building_2($$renderer5, { class: "text-muted-foreground h-5 w-5" });
                    $$renderer5.push(`<!----> <div>`);
                    Label($$renderer5, {
                      class: "text-base font-medium",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Include child organizations`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> <p class="text-muted-foreground text-sm">Show documents from child organizations in your content lists</p></div></div> `);
                    Switch($$renderer5, {
                      checked: includeChildOrganizations,
                      disabled: isUpdatingPreferences,
                      onCheckedChange: (checked) => {
                        includeChildOrganizations = checked;
                        updatePreferences({ includeChildOrganizations: checked });
                      }
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
      $$renderer3.push(`<!--]--></div>`);
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
    head("xbmurs", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Aphex CMS - Account</title>`);
      });
    });
    $$renderer2.push(`<div class="grid gap-6"><div class="hidden sm:block"><h2 class="text-xl font-semibold">Profile</h2> <p class="text-muted-foreground text-sm">Manage your personal account settings.</p></div> `);
    AccountSettings($$renderer2, {
      user: data.user,
      userPreferences: data.userPreferences,
      hasChildOrganizations: data.hasChildOrganizations
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
