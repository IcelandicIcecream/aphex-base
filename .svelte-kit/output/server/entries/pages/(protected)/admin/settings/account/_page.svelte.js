import { g as spread_props, e as escape_html, c as attr_class, d as stringify, b as attr, l as head } from "../../../../../../chunks/renderer.js";
import { B as Button } from "../../../../../../chunks/button.js";
import { I as Input } from "../../../../../../chunks/input.js";
import { L as Label } from "../../../../../../chunks/label.js";
import { B as Badge } from "../../../../../../chunks/badge.js";
import { S as Switch } from "../../../../../../chunks/switch.js";
import { C as Card, a as Card_content } from "../../../../../../chunks/card-content.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../../../../chunks/card-title.js";
import { C as Card_footer } from "../../../../../../chunks/card-footer.js";
import "clsx";
import { A as Avatar, a as Avatar_fallback } from "../../../../../../chunks/avatar-fallback.js";
import { i as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/date-utils.js";
import { u as user } from "../../../../../../chunks/instance2.js";
import { I as Icon } from "../../../../../../chunks/sheet-content.js";
import "../../../../../../chunks/index5.js";
import "../../../../../../chunks/mode-states.svelte.js";
import { U as Upload } from "../../../../../../chunks/upload.js";
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
function Lock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        {
          "width": "18",
          "height": "11",
          "x": "3",
          "y": "11",
          "rx": "2",
          "ry": "2"
        }
      ],
      ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "lock" },
      /**
       * @component @name Lock
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTEiIHg9IjMiIHk9IjExIiByeD0iMiIgcnk9IjIiIC8+CiAgPHBhdGggZD0iTTcgMTFWN2E1IDUgMCAwIDEgMTAgMHY0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/lock
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
    let { user: user$1, hasChildOrganizations = false } = $$props;
    let userName = "";
    let userImage = "";
    let isUpdating = false;
    let includeChildOrganizations = false;
    let isUpdatingPreferences = false;
    let imageInput = null;
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
        const result = await user.updateProfile({ name: userName.trim(), image: userImage || null });
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
                class: "flex flex-row items-start justify-between gap-4",
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="space-y-1.5">`);
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Identity`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  if (Card_description) {
                    $$renderer5.push("<!--[-->");
                    Card_description($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Your public profile inside this workspace.`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(`</div> `);
                  Badge($$renderer5, {
                    variant: getRoleBadgeVariant(user$1.role),
                    class: "shrink-0 px-2.5 py-1 text-xs font-medium capitalize",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(formatRole(user$1.role))}`);
                    },
                    $$slots: { default: true }
                  });
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
            if (Card_content) {
              $$renderer4.push("<!--[-->");
              Card_content($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="space-y-4"><div><div class="flex flex-col gap-4 sm:flex-row sm:items-center"><button type="button"${attr_class(`border-border bg-muted/30 group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-colors sm:h-[130px] sm:w-[130px] ${stringify("hover:bg-muted/50")}`)}${attr("disabled", isUpdating, true)} aria-label="Upload avatar">`);
                  if (Avatar) {
                    $$renderer5.push("<!--[-->");
                    Avatar($$renderer5, {
                      class: "h-full w-full rounded-xl",
                      children: ($$renderer6) => {
                        {
                          $$renderer6.push("<!--[-1-->");
                        }
                        $$renderer6.push(`<!--]--> `);
                        if (Avatar_fallback) {
                          $$renderer6.push("<!--[-->");
                          Avatar_fallback($$renderer6, { class: "bg-muted rounded-xl" });
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
                  $$renderer5.push(` <div class="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"><span class="flex flex-col items-center gap-1.5">`);
                  Upload($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> Upload icon</span></div> `);
                  {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></button> <div class="min-w-0 flex-1 space-y-3"><div><h2 class="truncate text-lg font-semibold">${escape_html(userName || user$1.email)}</h2> <p class="text-muted-foreground mt-0.5 truncate text-sm">${escape_html(user$1.email)}</p></div> <input type="file" accept="image/*" class="hidden"/> <div class="flex flex-wrap gap-2">`);
                  Button($$renderer5, {
                    type: "button",
                    variant: "outline",
                    onclick: () => imageInput?.click(),
                    disabled: isUpdating,
                    children: ($$renderer6) => {
                      Upload($$renderer6, { class: "mr-2 h-4 w-4" });
                      $$renderer6.push(`<!----> ${escape_html("Upload avatar")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div> <p class="text-muted-foreground text-xs">Drag an image here, or choose a file. JPG, PNG, WebP, or GIF. Max 5MB.</p></div></div></div> <div>`);
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
                class: "flex justify-end border-t px-6 py-4",
                children: ($$renderer5) => {
                  Button($$renderer5, {
                    onclick: updateProfile,
                    disabled: isUpdating,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(isUpdating ? "Saving..." : "Save changes")}`);
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
                    $$renderer5.push(` `);
                    if (Card_description) {
                      $$renderer5.push("<!--[-->");
                      Card_description($$renderer5, {
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Control how organization content appears in your workspace.`);
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
    $$renderer2.push(`<div class="grid gap-5">`);
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
