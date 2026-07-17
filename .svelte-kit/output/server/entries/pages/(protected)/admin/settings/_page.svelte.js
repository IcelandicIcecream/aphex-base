import { g as spread_props, c as attr_class, d as stringify, b as attr, e as escape_html, f as derived, l as head } from "../../../../../chunks/renderer.js";
import { C as Card, a as Card_content } from "../../../../../chunks/card-content.js";
import "clsx";
import { B as Button } from "../../../../../chunks/button.js";
import { I as Input } from "../../../../../chunks/input.js";
import { L as Label } from "../../../../../chunks/label.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../../../chunks/card-title.js";
import { C as Card_footer } from "../../../../../chunks/card-footer.js";
import { A as Avatar, a as Avatar_fallback } from "../../../../../chunks/avatar-fallback.js";
import { U as Users, A as Avatar_image } from "../../../../../chunks/avatar-image.js";
import { I as Icon, A as Alert } from "../../../../../chunks/sheet-content.js";
import { A as Alert_description } from "../../../../../chunks/alert-description.js";
import { i as invalidateAll } from "../../../../../chunks/client.js";
import "../../../../../chunks/date-utils.js";
import "../../../../../chunks/badge.js";
import { o as organizations } from "../../../../../chunks/instance2.js";
import "../../../../../chunks/index5.js";
import "../../../../../chunks/mode-states.svelte.js";
import { U as Upload } from "../../../../../chunks/upload.js";
import { C as Copy } from "../../../../../chunks/copy.js";
import { t as toast } from "../../../../../chunks/toast-state.svelte.js";
function Calendar_days($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M8 2v4" }],
      ["path", { "d": "M16 2v4" }],
      [
        "rect",
        { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
      ],
      ["path", { "d": "M3 10h18" }],
      ["path", { "d": "M8 14h.01" }],
      ["path", { "d": "M12 14h.01" }],
      ["path", { "d": "M16 14h.01" }],
      ["path", { "d": "M8 18h.01" }],
      ["path", { "d": "M12 18h.01" }],
      ["path", { "d": "M16 18h.01" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "calendar-days" },
      /**
       * @component @name CalendarDays
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgogIDxwYXRoIGQ9Ik04IDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMTRoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNiAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTggMThoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOGguMDEiIC8+CiAgPHBhdGggZD0iTTE2IDE4aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/calendar-days
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
function OrganizationsSettings($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { activeOrganization } = $$props;
    let editOrgName = "";
    let editOrgSlug = "";
    let editOrgLogo = "";
    let isUpdatingOrg = false;
    let isUploadingLogo = false;
    let error = null;
    let logoInput = null;
    const orgInitials = derived(() => activeOrganization.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2));
    const formattedDate = derived(() => new Date(activeOrganization.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    function generateSlug(text) {
      return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    }
    function handleSlugInput(event) {
      const target = event.target;
      editOrgSlug = target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    }
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
    async function updateOrganization() {
      if (!editOrgName.trim() || !editOrgSlug.trim()) {
        error = "Please enter both organization name and slug";
        return;
      }
      isUpdatingOrg = true;
      error = null;
      try {
        const result = await organizations.update(activeOrganization.id, {
          name: editOrgName.trim(),
          slug: editOrgSlug.trim(),
          metadata: {
            ...activeOrganization.metadata ?? {},
            logo: editOrgLogo || void 0
          }
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to update organization");
        }
        toast.success("Organization updated successfully");
        await invalidateAll();
      } catch (err) {
        error = err instanceof Error ? err.message : "Failed to update organization";
      } finally {
        isUpdatingOrg = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
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
                        $$renderer6.push(`<!---->Shown to members and in API responses.`);
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
                  $$renderer5.push(`<div class="grid gap-6 lg:grid-cols-[150px_1fr]"><div class="flex flex-col gap-3"><button type="button"${attr_class(`border-border bg-muted/30 group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border transition-colors sm:h-[130px] sm:w-[130px] ${stringify("hover:bg-muted/50")}`)}${attr("disabled", isUpdatingOrg, true)} aria-label="Upload organization icon">`);
                  if (Avatar) {
                    $$renderer5.push("<!--[-->");
                    Avatar($$renderer5, {
                      class: "h-full w-full rounded-xl",
                      children: ($$renderer6) => {
                        if (editOrgLogo) {
                          $$renderer6.push("<!--[0-->");
                          if (Avatar_image) {
                            $$renderer6.push("<!--[-->");
                            Avatar_image($$renderer6, {
                              src: editOrgLogo,
                              alt: activeOrganization.name,
                              class: "object-cover"
                            });
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
                            class: "bg-transparent text-3xl font-semibold",
                            children: ($$renderer7) => {
                              $$renderer7.push(`<!---->${escape_html(orgInitials())}`);
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
                  $$renderer5.push(` <div class="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"><span class="flex flex-col items-center gap-1.5">`);
                  Upload($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> Replace icon</span></div> `);
                  {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></button> <div class="flex flex-wrap gap-2"><input type="file" accept="image/*" class="hidden"/> `);
                  Button($$renderer5, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onclick: () => logoInput?.click(),
                    disabled: isUpdatingOrg,
                    children: ($$renderer6) => {
                      Upload($$renderer6, { class: "mr-1.5 h-3.5 w-3.5" });
                      $$renderer6.push(`<!----> ${escape_html("Replace")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (editOrgLogo) {
                    $$renderer5.push("<!--[0-->");
                    Button($$renderer5, {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onclick: () => editOrgLogo = "",
                      disabled: isUpdatingOrg,
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Remove`);
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div> <p class="text-muted-foreground max-w-[150px] text-xs leading-5">JPG, PNG, WebP, GIF, or SVG. Max 5MB.</p></div> <div class="grid content-start gap-4 md:grid-cols-2"><div>`);
                  Label($$renderer5, {
                    for: "org-name",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Display Name`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Input($$renderer5, {
                    id: "org-name",
                    placeholder: "Acme Inc",
                    class: "mt-2",
                    get value() {
                      return editOrgName;
                    },
                    set value($$value) {
                      editOrgName = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div>`);
                  Label($$renderer5, {
                    for: "org-slug",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Slug`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="mt-2 flex gap-2">`);
                  Input($$renderer5, {
                    id: "org-slug",
                    value: editOrgSlug,
                    oninput: handleSlugInput,
                    placeholder: "acme-inc",
                    class: "flex-1"
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    variant: "outline",
                    size: "sm",
                    onclick: () => editOrgSlug = generateSlug(editOrgName),
                    disabled: !editOrgName.trim(),
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Generate`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div></div> <div>`);
                  Label($$renderer5, {
                    for: "org-id",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Organization ID`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="mt-2 flex gap-2">`);
                  Input($$renderer5, {
                    id: "org-id",
                    value: activeOrganization.id,
                    disabled: true,
                    class: "min-w-0 flex-1 font-mono"
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    variant: "outline",
                    size: "icon",
                    type: "button",
                    class: "shrink-0",
                    onclick: () => copyToClipboard(activeOrganization.id),
                    children: ($$renderer6) => {
                      Copy($$renderer6, { class: "h-4 w-4" });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div></div> <div>`);
                  Label($$renderer5, {
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Created`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> <div class="border-input bg-muted/30 text-muted-foreground mt-2 flex h-10 items-center gap-2 rounded-md border px-3 text-sm">`);
                  Calendar_days($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> ${escape_html(formattedDate())}</div></div> <div class="text-muted-foreground flex items-center gap-2 text-sm md:col-span-2">`);
                  Users($$renderer5, { class: "h-4 w-4" });
                  $$renderer5.push(`<!----> <span>${escape_html(activeOrganization.members.length)} member${escape_html(activeOrganization.members.length !== 1 ? "s" : "")}</span></div> `);
                  if (error) {
                    $$renderer5.push("<!--[0-->");
                    if (Alert) {
                      $$renderer5.push("<!--[-->");
                      Alert($$renderer5, {
                        variant: "destructive",
                        class: "md:col-span-2",
                        children: ($$renderer6) => {
                          if (Alert_description) {
                            $$renderer6.push("<!--[-->");
                            Alert_description($$renderer6, {
                              children: ($$renderer7) => {
                                $$renderer7.push(`<!---->${escape_html(error)}`);
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
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div></div>`);
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
                class: "flex justify-end gap-2 border-t px-6 py-4",
                children: ($$renderer5) => {
                  Button($$renderer5, {
                    variant: "outline",
                    onclick: () => {
                      editOrgName = activeOrganization.name;
                      editOrgSlug = activeOrganization.slug;
                      editOrgLogo = activeOrganization.metadata?.logo || "";
                      error = null;
                    },
                    disabled: isUpdatingOrg || isUploadingLogo,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Discard`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  Button($$renderer5, {
                    onclick: updateOrganization,
                    disabled: isUpdatingOrg,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(isUpdatingOrg ? "Saving..." : "Save changes")}`);
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("193z1pc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Aphex CMS - Organization Settings</title>`);
      });
    });
    $$renderer2.push(`<div class="grid gap-5">`);
    if (data.activeOrganization) {
      $$renderer2.push("<!--[0-->");
      OrganizationsSettings($$renderer2, { activeOrganization: data.activeOrganization });
    } else {
      $$renderer2.push("<!--[-1-->");
      if (Card) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          children: ($$renderer3) => {
            if (Card_content) {
              $$renderer3.push("<!--[-->");
              Card_content($$renderer3, {
                class: "py-12 text-center",
                children: ($$renderer4) => {
                  $$renderer4.push(`<p class="text-muted-foreground text-lg">No active organization</p> <p class="text-muted-foreground mt-2 text-sm">You need to be added to an organization</p>`);
                },
                $$slots: { default: true }
              });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
          },
          $$slots: { default: true }
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
