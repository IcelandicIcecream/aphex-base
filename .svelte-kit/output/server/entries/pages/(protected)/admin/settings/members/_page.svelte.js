import { c as ensure_array_like, et as escape_html, f as spread_props, l as head, o as derived } from "../../../../../../chunks/dev.js";
import { s as organizations } from "../../../../../../chunks/api.js";
import { n as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/navigation.js";
import { E as Icon, c as Select_content, l as Select_item, mt as usePermissions, n as confirmDialog, o as Root, p as Mail, s as Select_trigger, v as toast } from "../../../../../../chunks/stega.js";
import { O as Input } from "../../../../../../chunks/label.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../../../chunks/avatar.js";
import { t as Button } from "../../../../../../chunks/button.js";
import "../../../../../../chunks/ui.js";
import { t as Search } from "../../../../../../chunks/search.js";
import { t as Users } from "../../../../../../chunks/users.js";
import { t as Badge } from "../../../../../../chunks/badge.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, t as Card_title } from "../../../../../../chunks/card.js";
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/ellipsis-vertical.svelte
function Ellipsis_vertical($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "ellipsis-vertical" },
			props,
			{
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "12",
						"cy": "5",
						"r": "1"
					}],
					["circle", {
						"cx": "12",
						"cy": "19",
						"r": "1"
					}]
				],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/send.svelte
function Send($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* @license @lucide/svelte v0.554.0 - ISC
		*
		* ISC License
		*
		* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The MIT License (MIT) (for portions derived from Feather)
		*
		* Copyright (c) 2013-2023 Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		let { $$slots, $$events, ...props } = $$props;
		Icon($$renderer, spread_props([
			{ name: "send" },
			props,
			{
				iconNode: [["path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }], ["path", { "d": "m21.854 2.147-10.94 10.939" }]],
				children: ($$renderer) => {
					props.children?.($$renderer);
					$$renderer.push(`<!---->`);
				},
				$$slots: { default: true }
			}
		]));
	});
}
//#endregion
//#region src/routes/(protected)/admin/settings/members/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
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
		const roleOptions = derived(() => Array.from(/* @__PURE__ */ new Set([...activeOrganization()?.members.map((member) => member.role) ?? [], ...inviteRoles().map((role) => role.name)])).sort());
		const filteredMembers = derived(() => (activeOrganization()?.members ?? []).filter((member) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch = !query || (member.user.name || "").toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query);
			const matchesRole = roleFilter === "all" || member.role === roleFilter;
			return matchesSearch && matchesRole && (statusFilter === "all" || statusFilter === "active");
		}));
		const filteredInvitations = derived(() => pendingInvitations().filter((invitation) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch = !query || invitation.email.toLowerCase().includes(query);
			const matchesRole = roleFilter === "all" || invitation.role === roleFilter;
			return matchesSearch && matchesRole && (statusFilter === "all" || statusFilter === "pending");
		}));
		const visiblePeopleCount = derived(() => filteredMembers().length + filteredInvitations().length);
		function getRoleBadgeVariant(role) {
			switch (role) {
				case "owner": return "default";
				case "admin": return "secondary";
				default: return "outline";
			}
		}
		function getInitials(name, email) {
			if (name) return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
			return email[0].toUpperCase();
		}
		function formatRole(role) {
			return role.replace(/_/g, " ");
		}
		async function inviteMember() {
			if (!inviteEmail.trim()) return;
			isInviting = true;
			try {
				const result = await organizations.inviteMember({
					email: inviteEmail.trim(),
					role: inviteRole
				});
				if (!result.success) throw new Error(result.error || result.message || "Failed to invite member");
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
			if (!await confirmDialog({
				title: `Cancel invitation for ${email}?`,
				description: "The user will not be able to join the organization if the invitation is revoked. They can still re-join with a new invitation later.",
				confirmText: "Revoke",
				variant: "destructive"
			})) return;
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
			if (!await confirmDialog({
				title: `Remove ${userName}?`,
				description: `${userName} will lose access to this organization. They can be re-invited later.`,
				confirmText: "Remove",
				variant: "destructive"
			})) return;
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
		function $$render_inner($$renderer) {
			head("hoozl0", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Aphex CMS - Members</title>`);
				});
			});
			$$renderer.push(`<div class="grid gap-5">`);
			if (!activeOrganization()) {
				$$renderer.push("<!--[0-->");
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						children: ($$renderer) => {
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "py-12 text-center",
									children: ($$renderer) => {
										Users($$renderer, { class: "text-muted-foreground mx-auto mb-3 h-10 w-10" });
										$$renderer.push(`<!----> <p class="text-muted-foreground text-lg">No active organization</p>`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else {
				$$renderer.push("<!--[-1-->");
				if (canInvite()) {
					$$renderer.push("<!--[0-->");
					if (Card) {
						$$renderer.push("<!--[-->");
						Card($$renderer, {
							class: "border-dashed",
							children: ($$renderer) => {
								if (Card_header) {
									$$renderer.push("<!--[-->");
									Card_header($$renderer, {
										children: ($$renderer) => {
											if (Card_title) {
												$$renderer.push("<!--[-->");
												Card_title($$renderer, {
													class: "flex items-center gap-2 text-base",
													children: ($$renderer) => {
														Send($$renderer, { class: "h-4 w-4" });
														$$renderer.push(`<!----> Invite member`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (Card_description) {
												$$renderer.push("<!--[-->");
												Card_description($$renderer, {
													children: ($$renderer) => {
														$$renderer.push(`<!---->Send an invitation to join this organization.`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
								$$renderer.push(` `);
								if (Card_content) {
									$$renderer.push("<!--[-->");
									Card_content($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<div class="flex flex-col gap-3 lg:flex-row lg:items-end"><div class="flex-1">`);
											Input($$renderer, {
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
											$$renderer.push(`<!----></div> <div class="lg:w-[170px]">`);
											if (Root) {
												$$renderer.push("<!--[-->");
												Root($$renderer, {
													type: "single",
													name: "role",
													get value() {
														return inviteRole;
													},
													set value($$value) {
														inviteRole = $$value;
														$$settled = false;
													},
													children: ($$renderer) => {
														if (Select_trigger) {
															$$renderer.push("<!--[-->");
															Select_trigger($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<span class="capitalize">${escape_html(formatRole(inviteRole))}</span>`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Select_content) {
															$$renderer.push("<!--[-->");
															Select_content($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!--[-->`);
																	const each_array = ensure_array_like(inviteRoles());
																	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
																		let option = each_array[$$index];
																		if (Select_item) {
																			$$renderer.push("<!--[-->");
																			Select_item($$renderer, {
																				value: option.name,
																				label: option.name,
																				children: ($$renderer) => {
																					$$renderer.push(`<div><div class="font-medium capitalize">${escape_html(formatRole(option.name))}</div> `);
																					if (option.description) {
																						$$renderer.push("<!--[0-->");
																						$$renderer.push(`<div class="text-muted-foreground text-xs">${escape_html(option.description)}</div>`);
																					} else $$renderer.push("<!--[-1-->");
																					$$renderer.push(`<!--]--></div>`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	}
																	$$renderer.push(`<!--]-->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(`</div> `);
											Button($$renderer, {
												class: "lg:w-auto",
												onclick: inviteMember,
												disabled: isInviting,
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(isInviting ? "Sending..." : "Send invite")}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div>`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						children: ($$renderer) => {
							if (Card_header) {
								$$renderer.push("<!--[-->");
								Card_header($$renderer, {
									class: "gap-4",
									children: ($$renderer) => {
										$$renderer.push(`<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div>`);
										if (Card_title) {
											$$renderer.push("<!--[-->");
											Card_title($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->Team directory`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Card_description) {
											$$renderer.push("<!--[-->");
											Card_description($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->Search, filter, and manage organization access.`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(`</div> `);
										Badge($$renderer, {
											variant: "secondary",
											class: "w-fit text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(visiblePeopleCount())} shown`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div> <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_160px]"><div class="relative">`);
										Search($$renderer, { class: "text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" });
										$$renderer.push(`<!----> `);
										Input($$renderer, {
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
										$$renderer.push(`<!----></div> `);
										if (Root) {
											$$renderer.push("<!--[-->");
											Root($$renderer, {
												type: "single",
												name: "role-filter",
												get value() {
													return roleFilter;
												},
												set value($$value) {
													roleFilter = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													if (Select_trigger) {
														$$renderer.push("<!--[-->");
														Select_trigger($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<span>${escape_html(roleFilter === "all" ? "All roles" : formatRole(roleFilter))}</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Select_content) {
														$$renderer.push("<!--[-->");
														Select_content($$renderer, {
															children: ($$renderer) => {
																if (Select_item) {
																	$$renderer.push("<!--[-->");
																	Select_item($$renderer, {
																		value: "all",
																		label: "All roles",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->All roles`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
																$$renderer.push(` <!--[-->`);
																const each_array_1 = ensure_array_like(roleOptions());
																for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
																	let role = each_array_1[$$index_1];
																	if (Select_item) {
																		$$renderer.push("<!--[-->");
																		Select_item($$renderer, {
																			value: role,
																			label: formatRole(role),
																			children: ($$renderer) => {
																				$$renderer.push(`<span class="capitalize">${escape_html(formatRole(role))}</span>`);
																			},
																			$$slots: { default: true }
																		});
																		$$renderer.push("<!--]-->");
																	} else {
																		$$renderer.push("<!--[!-->");
																		$$renderer.push("<!--]-->");
																	}
																}
																$$renderer.push(`<!--]-->`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(` `);
										if (Root) {
											$$renderer.push("<!--[-->");
											Root($$renderer, {
												type: "single",
												name: "status-filter",
												get value() {
													return statusFilter;
												},
												set value($$value) {
													statusFilter = $$value;
													$$settled = false;
												},
												children: ($$renderer) => {
													if (Select_trigger) {
														$$renderer.push("<!--[-->");
														Select_trigger($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<span>${escape_html(statusFilter === "all" ? "All statuses" : statusFilter)}</span>`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
													$$renderer.push(` `);
													if (Select_content) {
														$$renderer.push("<!--[-->");
														Select_content($$renderer, {
															children: ($$renderer) => {
																if (Select_item) {
																	$$renderer.push("<!--[-->");
																	Select_item($$renderer, {
																		value: "all",
																		label: "All statuses",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->All statuses`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
																$$renderer.push(` `);
																if (Select_item) {
																	$$renderer.push("<!--[-->");
																	Select_item($$renderer, {
																		value: "active",
																		label: "Active",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Active`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
																$$renderer.push(` `);
																if (Select_item) {
																	$$renderer.push("<!--[-->");
																	Select_item($$renderer, {
																		value: "pending",
																		label: "Pending",
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Pending`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push("<!--]-->");
																} else {
																	$$renderer.push("<!--[!-->");
																	$$renderer.push("<!--]-->");
																}
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
										$$renderer.push(`</div>`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
							$$renderer.push(` `);
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "pt-0",
									children: ($$renderer) => {
										$$renderer.push(`<div class="border-border hidden overflow-hidden rounded-lg border md:block"><div class="bg-muted/30 text-muted-foreground grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] border-b px-4 py-2 text-xs font-medium tracking-wide uppercase"><div>Member</div> <div>Role</div> <div>Status</div> <div></div></div> <div class="divide-y"><!--[-->`);
										const each_array_2 = ensure_array_like(filteredMembers());
										for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
											let member = each_array_2[$$index_2];
											const isCurrentUser = member.userId === currentUserId();
											const canRemove = canRemoveMembers() && !isCurrentUser && member.role !== "owner";
											$$renderer.push(`<div class="grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] items-center px-4 py-3"><div class="flex min-w-0 items-center gap-3">`);
											if (Avatar) {
												$$renderer.push("<!--[-->");
												Avatar($$renderer, {
													class: "h-10 w-10",
													children: ($$renderer) => {
														if (member.user.image) {
															$$renderer.push("<!--[0-->");
															if (Avatar_image) {
																$$renderer.push("<!--[-->");
																Avatar_image($$renderer, {
																	src: member.user.image,
																	alt: member.user.name || member.user.email,
																	class: "object-cover"
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														} else $$renderer.push("<!--[-1-->");
														$$renderer.push(`<!--]--> `);
														if (Avatar_fallback) {
															$$renderer.push("<!--[-->");
															Avatar_fallback($$renderer, {
																class: "text-xs",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(getInitials(member.user.name, member.user.email))}`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` <div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(member.user.name || member.user.email)} `);
											if (isCurrentUser) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<span class="text-muted-foreground font-normal">(You)</span>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></p> `);
											if (member.user.name) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground truncate text-xs">${escape_html(member.user.email)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div></div> <div>`);
											Badge($$renderer, {
												variant: getRoleBadgeVariant(member.role),
												class: "capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatRole(member.role))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="flex items-center gap-2 text-sm"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</div> <div class="flex justify-end">`);
											if (canRemove) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													variant: "outline",
													size: "sm",
													onclick: () => removeMember(member.userId, member.user.name || member.user.email),
													children: ($$renderer) => {
														Ellipsis_vertical($$renderer, { class: "h-4 w-4" });
														$$renderer.push(`<!----> <span class="sr-only">Remove</span>`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div></div>`);
										}
										$$renderer.push(`<!--]--> <!--[-->`);
										const each_array_3 = ensure_array_like(filteredInvitations());
										for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
											let invitation = each_array_3[$$index_3];
											$$renderer.push(`<div class="grid grid-cols-[minmax(260px,1fr)_150px_150px_64px] items-center px-4 py-3"><div class="flex min-w-0 items-center gap-3"><div class="border-muted-foreground/25 flex h-10 w-10 items-center justify-center rounded-full border border-dashed">`);
											Mail($$renderer, { class: "text-muted-foreground h-4 w-4" });
											$$renderer.push(`<!----></div> <div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(invitation.email)}</p> <p class="text-muted-foreground truncate text-xs">Invitation sent</p></div></div> <div>`);
											Badge($$renderer, {
												variant: "outline",
												class: "capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatRole(invitation.role))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div>`);
											Badge($$renderer, {
												variant: "secondary",
												class: "bg-amber-100 text-amber-700 hover:bg-amber-100",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Pending`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="flex justify-end">`);
											if (canInvite()) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													variant: "outline",
													size: "sm",
													onclick: () => cancelInvitation(invitation.id, invitation.email),
													children: ($$renderer) => {
														Ellipsis_vertical($$renderer, { class: "h-4 w-4" });
														$$renderer.push(`<!----> <span class="sr-only">Revoke</span>`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div></div>`);
										}
										$$renderer.push(`<!--]--></div></div> <div class="space-y-3 md:hidden"><!--[-->`);
										const each_array_4 = ensure_array_like(filteredMembers());
										for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
											let member = each_array_4[$$index_4];
											const isCurrentUser = member.userId === currentUserId();
											const canRemove = canRemoveMembers() && !isCurrentUser && member.role !== "owner";
											$$renderer.push(`<div class="border-border rounded-lg border p-4"><div class="flex items-start gap-3">`);
											if (Avatar) {
												$$renderer.push("<!--[-->");
												Avatar($$renderer, {
													class: "h-11 w-11",
													children: ($$renderer) => {
														if (member.user.image) {
															$$renderer.push("<!--[0-->");
															if (Avatar_image) {
																$$renderer.push("<!--[-->");
																Avatar_image($$renderer, {
																	src: member.user.image,
																	alt: member.user.name || member.user.email,
																	class: "object-cover"
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														} else $$renderer.push("<!--[-1-->");
														$$renderer.push(`<!--]--> `);
														if (Avatar_fallback) {
															$$renderer.push("<!--[-->");
															Avatar_fallback($$renderer, {
																class: "text-xs",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->${escape_html(getInitials(member.user.name, member.user.email))}`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium">${escape_html(member.user.name || member.user.email)} `);
											if (isCurrentUser) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<span class="text-muted-foreground font-normal">(You)</span>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></p> <p class="text-muted-foreground truncate text-xs">${escape_html(member.user.email)}</p></div></div> <div class="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p class="text-muted-foreground text-xs">Role</p> `);
											Badge($$renderer, {
												variant: getRoleBadgeVariant(member.role),
												class: "mt-1 capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatRole(member.role))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div><p class="text-muted-foreground text-xs">Status</p> <p class="mt-1 flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</p></div></div> `);
											if (canRemove) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													class: "mt-4 w-full",
													variant: "outline",
													size: "sm",
													onclick: () => removeMember(member.userId, member.user.name || member.user.email),
													children: ($$renderer) => {
														$$renderer.push(`<!---->Remove member`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										}
										$$renderer.push(`<!--]--> <!--[-->`);
										const each_array_5 = ensure_array_like(filteredInvitations());
										for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
											let invitation = each_array_5[$$index_5];
											$$renderer.push(`<div class="border-border rounded-lg border border-dashed p-4"><div class="flex items-start gap-3"><div class="border-muted-foreground/25 flex h-11 w-11 items-center justify-center rounded-full border border-dashed">`);
											Mail($$renderer, { class: "text-muted-foreground h-4 w-4" });
											$$renderer.push(`<!----></div> <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium">${escape_html(invitation.email)}</p> <p class="text-muted-foreground truncate text-xs">Invitation pending</p></div></div> <div class="mt-4 flex flex-wrap items-center gap-2">`);
											Badge($$renderer, {
												variant: "outline",
												class: "capitalize",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatRole(invitation.role))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Badge($$renderer, {
												variant: "secondary",
												class: "bg-amber-100 text-amber-700 hover:bg-amber-100",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Pending`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> `);
											if (canInvite()) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													class: "mt-4 w-full",
													variant: "outline",
													size: "sm",
													onclick: () => cancelInvitation(invitation.id, invitation.email),
													children: ($$renderer) => {
														$$renderer.push(`<!---->Revoke invitation`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										}
										$$renderer.push(`<!--]--></div> `);
										if (visiblePeopleCount() === 0) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="border-border rounded-lg border border-dashed py-10 text-center">`);
											Users($$renderer, { class: "text-muted-foreground mx-auto mb-3 h-8 w-8" });
											$$renderer.push(`<!----> <p class="text-sm font-medium">No matching members</p> <p class="text-muted-foreground text-xs">Try another search or filter.</p></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
