import { g as spread_props, l as head, e as escape_html, a as ensure_array_like, f as derived } from "../../../../../../chunks/renderer.js";
import { A as Avatar, a as Avatar_fallback } from "../../../../../../chunks/avatar-fallback.js";
import { U as Users, A as Avatar_image } from "../../../../../../chunks/avatar-image.js";
import { C as Card, a as Card_content } from "../../../../../../chunks/card-content.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../../../../chunks/card-title.js";
import "clsx";
import { R as Root, S as Select_trigger, a as Select_content, b as Select_item } from "../../../../../../chunks/index9.js";
import { B as Badge } from "../../../../../../chunks/badge.js";
import { B as Button } from "../../../../../../chunks/button.js";
import { I as Input } from "../../../../../../chunks/input.js";
import "../../../../../../chunks/date-utils.js";
import { i as invalidateAll } from "../../../../../../chunks/client.js";
import { u as usePermissions, c as confirmDialog } from "../../../../../../chunks/confirm-dialog.svelte.js";
import { o as organizations } from "../../../../../../chunks/instance2.js";
import { I as Icon } from "../../../../../../chunks/sheet-content.js";
import "../../../../../../chunks/index5.js";
import "../../../../../../chunks/mode-states.svelte.js";
import { S as Search } from "../../../../../../chunks/search.js";
import { M as Mail } from "../../../../../../chunks/mail.js";
import { t as toast } from "../../../../../../chunks/toast-state.svelte.js";
function Ellipsis_vertical($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "1" }],
      ["circle", { "cx": "12", "cy": "5", "r": "1" }],
      ["circle", { "cx": "12", "cy": "19", "r": "1" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "ellipsis-vertical" },
      /**
       * @component @name EllipsisVertical
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iNSIgcj0iMSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE5IiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ellipsis-vertical
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
function Send($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
        }
      ],
      ["path", { "d": "m21.854 2.147-10.94 10.939" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "send" },
      /**
       * @component @name Send
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuNTM2IDIxLjY4NmEuNS41IDAgMCAwIC45MzctLjAyNGw2LjUtMTlhLjQ5Ni40OTYgMCAwIDAtLjYzNS0uNjM1bC0xOSA2LjVhLjUuNSAwIDAgMC0uMDI0LjkzN2w3LjkzIDMuMThhMiAyIDAgMCAxIDEuMTEyIDEuMTF6IiAvPgogIDxwYXRoIGQ9Im0yMS44NTQgMi4xNDctMTAuOTQgMTAuOTM5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/send
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const activeOrganization = derived(() => data.activeOrganization);
    const currentUserId = derived(() => data.user.id);
    const pendingInvitations = derived(() => data.pendingInvitations ?? []);
    const inviteRoles = derived(() => data.inviteRoles ?? []);
    let inviteEmail = "";
    let inviteRole = "editor";
    let isInviting = false;
    let searchQuery = "";
    let roleFilter = "all";
    let statusFilter = "all";
    const perms = usePermissions();
    const canInvite = derived(() => perms.can("member.invite"));
    const canRemoveMembers = derived(() => perms.can("member.remove"));
    const roleOptions = derived(() => Array.from(/* @__PURE__ */ new Set([
      ...activeOrganization()?.members.map((member) => member.role) ?? [],
      ...inviteRoles().map((role) => role.name)
    ])).sort());
    const filteredMembers = derived(() => (activeOrganization()?.members ?? []).filter((member) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || (member.user.name || "").toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus = statusFilter === "all" || statusFilter === "active";
      return matchesSearch && matchesRole && matchesStatus;
    }));
    const filteredInvitations = derived(() => pendingInvitations().filter((invitation) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || invitation.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || invitation.role === roleFilter;
      const matchesStatus = statusFilter === "all" || statusFilter === "pending";
      return matchesSearch && matchesRole && matchesStatus;
    }));
    const visiblePeopleCount = derived(() => filteredMembers().length + filteredInvitations().length);
    function getRoleBadgeVariant(role) {
      switch (role) {
        case "owner":
          return "default";
        case "admin":
          return "secondary";
        default:
          return "outline";
      }
    }
    function getInitials(name, email) {
      if (name) {
        return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
      }
      return email[0].toUpperCase();
    }
    function formatRole(role) {
      return role.replace(/_/g, " ");
    }
    async function inviteMember() {
      if (!inviteEmail.trim()) return;
      isInviting = true;
      try {
        const result = await organizations.inviteMember({ email: inviteEmail.trim(), role: inviteRole });
        if (!result.success) {
          throw new Error(result.error || result.message || "Failed to invite member");
        }
        toast.success(`Invitation sent to ${inviteEmail.trim()}`);
        inviteEmail = "";
        inviteRole = "editor";
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to invite member");
      } finally {
        isInviting = false;
      }
    }
    async function cancelInvitation(invitationId, email) {
      const confirmCancelInvitation = await confirmDialog({
        title: `Cancel invitation for ${email}?`,
        description: "The user will not be able to join the organization if the invitation is revoked. They can still re-join with a new invitation later.",
        confirmText: "Revoke",
        variant: "destructive"
      });
      if (!confirmCancelInvitation) return;
      try {
        const result = await organizations.cancelInvitation({ invitationId });
        if (!result.success) throw new Error(result.error || "Failed to cancel invitation");
        toast.success(`Invitation for ${email} revoked`);
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to cancel invitation");
      }
    }
    async function removeMember(userId, userName) {
      const confirmed = await confirmDialog({
        title: `Remove ${userName}?`,
        description: `${userName} will lose access to this organization. They can be re-invited later.`,
        confirmText: "Remove",
        variant: "destructive"
      });
      if (!confirmed) return;
      try {
        const result = await organizations.removeMember({ userId });
        if (!result.success) throw new Error(result.error || "Failed to remove member");
        toast.success(`${userName} has been removed`);
        await invalidateAll();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to remove member");
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("hoozl0", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Aphex CMS - Members</title>`);
        });
      });
      $$renderer3.push(`<div class="grid gap-5">`);
      if (!activeOrganization()) {
        $$renderer3.push("<!--[0-->");
        if (Card) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            children: ($$renderer4) => {
              if (Card_content) {
                $$renderer4.push("<!--[-->");
                Card_content($$renderer4, {
                  class: "py-12 text-center",
                  children: ($$renderer5) => {
                    Users($$renderer5, { class: "text-muted-foreground mx-auto mb-3 h-10 w-10" });
                    $$renderer5.push(`<!----> <p class="text-muted-foreground text-lg">No active organization</p>`);
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
        if (canInvite()) {
          $$renderer3.push("<!--[0-->");
          if (Card) {
            $$renderer3.push("<!--[-->");
            Card($$renderer3, {
              class: "border-dashed",
              children: ($$renderer4) => {
                if (Card_header) {
                  $$renderer4.push("<!--[-->");
                  Card_header($$renderer4, {
                    children: ($$renderer5) => {
                      if (Card_title) {
                        $$renderer5.push("<!--[-->");
                        Card_title($$renderer5, {
                          class: "flex items-center gap-2 text-base",
                          children: ($$renderer6) => {
                            Send($$renderer6, { class: "h-4 w-4" });
                            $$renderer6.push(`<!----> Invite member`);
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
                            $$renderer6.push(`<!---->Send an invitation to join this organization.`);
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
                      $$renderer5.push(`<div class="flex flex-col gap-3 lg:flex-row lg:items-end"><div class="flex-1">`);
                      Input($$renderer5, {
                        id: "invite-email",
                        type: "email",
                        placeholder: "email@example.com",
                        get value() {
                          return inviteEmail;
                        },
                        set value($$value) {
                          inviteEmail = $$value;
                          $$settled = false;
                        }
                      });
                      $$renderer5.push(`<!----></div> <div class="lg:w-[170px]">`);
                      if (Root) {
                        $$renderer5.push("<!--[-->");
                        Root($$renderer5, {
                          type: "single",
                          name: "role",
                          get value() {
                            return inviteRole;
                          },
                          set value($$value) {
                            inviteRole = $$value;
                            $$settled = false;
                          },
                          children: ($$renderer6) => {
                            if (Select_trigger) {
                              $$renderer6.push("<!--[-->");
                              Select_trigger($$renderer6, {
                                children: ($$renderer7) => {
                                  $$renderer7.push(`<span class="capitalize">${escape_html(formatRole(inviteRole))}</span>`);
                                },
                                $$slots: { default: true }
                              });
                              $$renderer6.push("<!--]-->");
                            } else {
                              $$renderer6.push("<!--[!-->");
                              $$renderer6.push("<!--]-->");
                            }
                            $$renderer6.push(` `);
                            if (Select_content) {
                              $$renderer6.push("<!--[-->");
                              Select_content($$renderer6, {
                                children: ($$renderer7) => {
                                  $$renderer7.push(`<!--[-->`);
                                  const each_array = ensure_array_like(inviteRoles());
                                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                                    let option = each_array[$$index];
                                    if (Select_item) {
                                      $$renderer7.push("<!--[-->");
                                      Select_item($$renderer7, {
                                        value: option.name,
                                        label: option.name,
                                        children: ($$renderer8) => {
                                          $$renderer8.push(`<div><div class="font-medium capitalize">${escape_html(formatRole(option.name))}</div> `);
                                          if (option.description) {
                                            $$renderer8.push("<!--[0-->");
                                            $$renderer8.push(`<div class="text-muted-foreground text-xs">${escape_html(option.description)}</div>`);
                                          } else {
                                            $$renderer8.push("<!--[-1-->");
                                          }
                                          $$renderer8.push(`<!--]--></div>`);
                                        },
                                        $$slots: { default: true }
                                      });
                                      $$renderer7.push("<!--]-->");
                                    } else {
                                      $$renderer7.push("<!--[!-->");
                                      $$renderer7.push("<!--]-->");
                                    }
                                  }
                                  $$renderer7.push(`<!--]-->`);
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
                      $$renderer5.push(`</div> `);
                      Button($$renderer5, {
                        class: "lg:w-auto",
                        onclick: inviteMember,
                        disabled: isInviting,
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(isInviting ? "Sending..." : "Send invite")}`);
                        },
                        $$slots: { default: true }
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
        $$renderer3.push(`<!--]--> `);
        if (Card) {
          $$renderer3.push("<!--[-->");
          Card($$renderer3, {
            children: ($$renderer4) => {
              if (Card_header) {
                $$renderer4.push("<!--[-->");
                Card_header($$renderer4, {
                  class: "gap-4",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div>`);
                    if (Card_title) {
                      $$renderer5.push("<!--[-->");
                      Card_title($$renderer5, {
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Team directory`);
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
                          $$renderer6.push(`<!---->Search, filter, and manage organization access.`);
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
                      variant: "secondary",
                      class: "w-fit text-xs",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(visiblePeopleCount())} shown`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div> <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_160px]"><div class="relative">`);
                    Search($$renderer5, {
                      class: "text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                    });
                    $$renderer5.push(`<!----> `);
                    Input($$renderer5, {
                      placeholder: "Search by name or email",
                      class: "pl-9",
                      get value() {
                        return searchQuery;
                      },
                      set value($$value) {
                        searchQuery = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div> `);
                    if (Root) {
                      $$renderer5.push("<!--[-->");
                      Root($$renderer5, {
                        type: "single",
                        name: "role-filter",
                        get value() {
                          return roleFilter;
                        },
                        set value($$value) {
                          roleFilter = $$value;
                          $$settled = false;
                        },
                        children: ($$renderer6) => {
                          if (Select_trigger) {
                            $$renderer6.push("<!--[-->");
                            Select_trigger($$renderer6, {
                              children: ($$renderer7) => {
                                $$renderer7.push(`<span>${escape_html(roleFilter === "all" ? "All roles" : formatRole(roleFilter))}</span>`);
                              },
                              $$slots: { default: true }
                            });
                            $$renderer6.push("<!--]-->");
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push("<!--]-->");
                          }
                          $$renderer6.push(` `);
                          if (Select_content) {
                            $$renderer6.push("<!--[-->");
                            Select_content($$renderer6, {
                              children: ($$renderer7) => {
                                if (Select_item) {
                                  $$renderer7.push("<!--[-->");
                                  Select_item($$renderer7, {
                                    value: "all",
                                    label: "All roles",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->All roles`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
                                $$renderer7.push(` <!--[-->`);
                                const each_array_1 = ensure_array_like(roleOptions());
                                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                                  let role = each_array_1[$$index_1];
                                  if (Select_item) {
                                    $$renderer7.push("<!--[-->");
                                    Select_item($$renderer7, {
                                      value: role,
                                      label: formatRole(role),
                                      children: ($$renderer8) => {
                                        $$renderer8.push(`<span class="capitalize">${escape_html(formatRole(role))}</span>`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                }
                                $$renderer7.push(`<!--]-->`);
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
                    $$renderer5.push(` `);
                    if (Root) {
                      $$renderer5.push("<!--[-->");
                      Root($$renderer5, {
                        type: "single",
                        name: "status-filter",
                        get value() {
                          return statusFilter;
                        },
                        set value($$value) {
                          statusFilter = $$value;
                          $$settled = false;
                        },
                        children: ($$renderer6) => {
                          if (Select_trigger) {
                            $$renderer6.push("<!--[-->");
                            Select_trigger($$renderer6, {
                              children: ($$renderer7) => {
                                $$renderer7.push(`<span>${escape_html(statusFilter === "all" ? "All statuses" : statusFilter)}</span>`);
                              },
                              $$slots: { default: true }
                            });
                            $$renderer6.push("<!--]-->");
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push("<!--]-->");
                          }
                          $$renderer6.push(` `);
                          if (Select_content) {
                            $$renderer6.push("<!--[-->");
                            Select_content($$renderer6, {
                              children: ($$renderer7) => {
                                if (Select_item) {
                                  $$renderer7.push("<!--[-->");
                                  Select_item($$renderer7, {
                                    value: "all",
                                    label: "All statuses",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->All statuses`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
                                $$renderer7.push(` `);
                                if (Select_item) {
                                  $$renderer7.push("<!--[-->");
                                  Select_item($$renderer7, {
                                    value: "active",
                                    label: "Active",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->Active`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
                                $$renderer7.push(` `);
                                if (Select_item) {
                                  $$renderer7.push("<!--[-->");
                                  Select_item($$renderer7, {
                                    value: "pending",
                                    label: "Pending",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->Pending`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
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
                    $$renderer5.push(`</div>`);
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
                  class: "pt-0",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="border-border hidden overflow-hidden rounded-lg border md:block"><div class="bg-muted/30 text-muted-foreground grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] border-b px-4 py-2 text-xs font-medium tracking-wide uppercase"><div>Member</div> <div>Role</div> <div>Status</div> <div></div></div> <div class="divide-y"><!--[-->`);
                    const each_array_2 = ensure_array_like(filteredMembers());
                    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                      let member = each_array_2[$$index_2];
                      const isCurrentUser = member.userId === currentUserId();
                      const canRemove = canRemoveMembers() && !isCurrentUser && member.role !== "owner";
                      $$renderer5.push(`<div class="grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] items-center px-4 py-3"><div class="flex min-w-0 items-center gap-3">`);
                      if (Avatar) {
                        $$renderer5.push("<!--[-->");
                        Avatar($$renderer5, {
                          class: "h-10 w-10",
                          children: ($$renderer6) => {
                            if (member.user.image) {
                              $$renderer6.push("<!--[0-->");
                              if (Avatar_image) {
                                $$renderer6.push("<!--[-->");
                                Avatar_image($$renderer6, {
                                  src: member.user.image,
                                  alt: member.user.name || member.user.email,
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
                                class: "text-xs",
                                children: ($$renderer7) => {
                                  $$renderer7.push(`<!---->${escape_html(getInitials(member.user.name, member.user.email))}`);
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
                      $$renderer5.push(` <div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(member.user.name || member.user.email)} `);
                      if (isCurrentUser) {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<span class="text-muted-foreground font-normal">(You)</span>`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></p> `);
                      if (member.user.name) {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<p class="text-muted-foreground truncate text-xs">${escape_html(member.user.email)}</p>`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div></div> <div>`);
                      Badge($$renderer5, {
                        variant: getRoleBadgeVariant(member.role),
                        class: "capitalize",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatRole(member.role))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div class="flex items-center gap-2 text-sm"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</div> <div class="flex justify-end">`);
                      if (canRemove) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          variant: "outline",
                          size: "sm",
                          onclick: () => removeMember(member.userId, member.user.name || member.user.email),
                          children: ($$renderer6) => {
                            Ellipsis_vertical($$renderer6, { class: "h-4 w-4" });
                            $$renderer6.push(`<!----> <span class="sr-only">Remove</span>`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div></div>`);
                    }
                    $$renderer5.push(`<!--]--> <!--[-->`);
                    const each_array_3 = ensure_array_like(filteredInvitations());
                    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                      let invitation = each_array_3[$$index_3];
                      $$renderer5.push(`<div class="grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] items-center px-4 py-3"><div class="flex min-w-0 items-center gap-3"><div class="border-muted-foreground/25 flex h-10 w-10 items-center justify-center rounded-full border border-dashed">`);
                      Mail($$renderer5, { class: "text-muted-foreground h-4 w-4" });
                      $$renderer5.push(`<!----></div> <div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(invitation.email)}</p> <p class="text-muted-foreground truncate text-xs">Invitation sent</p></div></div> <div>`);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "capitalize",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatRole(invitation.role))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div>`);
                      Badge($$renderer5, {
                        variant: "secondary",
                        class: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Pending`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div class="flex justify-end">`);
                      if (canInvite()) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          variant: "outline",
                          size: "sm",
                          onclick: () => cancelInvitation(invitation.id, invitation.email),
                          children: ($$renderer6) => {
                            Ellipsis_vertical($$renderer6, { class: "h-4 w-4" });
                            $$renderer6.push(`<!----> <span class="sr-only">Revoke</span>`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div></div>`);
                    }
                    $$renderer5.push(`<!--]--></div></div> <div class="space-y-3 md:hidden"><!--[-->`);
                    const each_array_4 = ensure_array_like(filteredMembers());
                    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
                      let member = each_array_4[$$index_4];
                      const isCurrentUser = member.userId === currentUserId();
                      const canRemove = canRemoveMembers() && !isCurrentUser && member.role !== "owner";
                      $$renderer5.push(`<div class="border-border rounded-lg border p-4"><div class="flex items-start gap-3">`);
                      if (Avatar) {
                        $$renderer5.push("<!--[-->");
                        Avatar($$renderer5, {
                          class: "h-11 w-11",
                          children: ($$renderer6) => {
                            if (member.user.image) {
                              $$renderer6.push("<!--[0-->");
                              if (Avatar_image) {
                                $$renderer6.push("<!--[-->");
                                Avatar_image($$renderer6, {
                                  src: member.user.image,
                                  alt: member.user.name || member.user.email,
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
                                class: "text-xs",
                                children: ($$renderer7) => {
                                  $$renderer7.push(`<!---->${escape_html(getInitials(member.user.name, member.user.email))}`);
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
                      $$renderer5.push(` <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium">${escape_html(member.user.name || member.user.email)} `);
                      if (isCurrentUser) {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<span class="text-muted-foreground font-normal">(You)</span>`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></p> <p class="text-muted-foreground truncate text-xs">${escape_html(member.user.email)}</p></div></div> <div class="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p class="text-muted-foreground text-xs">Role</p> `);
                      Badge($$renderer5, {
                        variant: getRoleBadgeVariant(member.role),
                        class: "mt-1 capitalize",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatRole(member.role))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> <div><p class="text-muted-foreground text-xs">Status</p> <p class="mt-1 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</p></div></div> `);
                      if (canRemove) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          class: "mt-4 w-full",
                          variant: "outline",
                          size: "sm",
                          onclick: () => removeMember(member.userId, member.user.name || member.user.email),
                          children: ($$renderer6) => {
                            $$renderer6.push(`<!---->Remove member`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                    }
                    $$renderer5.push(`<!--]--> <!--[-->`);
                    const each_array_5 = ensure_array_like(filteredInvitations());
                    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
                      let invitation = each_array_5[$$index_5];
                      $$renderer5.push(`<div class="border-border rounded-lg border border-dashed p-4"><div class="flex items-start gap-3"><div class="border-muted-foreground/25 flex h-11 w-11 items-center justify-center rounded-full border border-dashed">`);
                      Mail($$renderer5, { class: "text-muted-foreground h-4 w-4" });
                      $$renderer5.push(`<!----></div> <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium">${escape_html(invitation.email)}</p> <p class="text-muted-foreground truncate text-xs">Invitation pending</p></div></div> <div class="mt-4 flex flex-wrap items-center gap-2">`);
                      Badge($$renderer5, {
                        variant: "outline",
                        class: "capitalize",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->${escape_html(formatRole(invitation.role))}`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----> `);
                      Badge($$renderer5, {
                        variant: "secondary",
                        class: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                        children: ($$renderer6) => {
                          $$renderer6.push(`<!---->Pending`);
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push(`<!----></div> `);
                      if (canInvite()) {
                        $$renderer5.push("<!--[0-->");
                        Button($$renderer5, {
                          class: "mt-4 w-full",
                          variant: "outline",
                          size: "sm",
                          onclick: () => cancelInvitation(invitation.id, invitation.email),
                          children: ($$renderer6) => {
                            $$renderer6.push(`<!---->Revoke invitation`);
                          },
                          $$slots: { default: true }
                        });
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]--></div>`);
                    }
                    $$renderer5.push(`<!--]--></div> `);
                    if (visiblePeopleCount() === 0) {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<div class="border-border rounded-lg border border-dashed py-10 text-center">`);
                      Users($$renderer5, { class: "text-muted-foreground mx-auto mb-3 h-8 w-8" });
                      $$renderer5.push(`<!----> <p class="text-sm font-medium">No matching members</p> <p class="text-muted-foreground text-xs">Try another search or filter.</p></div>`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]-->`);
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
export {
  _page as default
};
