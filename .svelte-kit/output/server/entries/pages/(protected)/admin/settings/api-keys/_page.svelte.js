import { a as derived, c as head, d as spread_props, k as escape_html, s as ensure_array_like } from "../../../../../../chunks/server2.js";
import { r as apiKeys } from "../../../../../../chunks/api.js";
import { n as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/navigation.js";
import { C as Copy, Et as usePermissions, R as Icon, a as Root, c as Select_item, k as toast, l as Select_group, n as confirmDialog, o as Select_trigger, p as Trash_2, s as Select_content } from "../../../../../../chunks/stega.js";
import { O as Input, t as Label } from "../../../../../../chunks/label.js";
import { a as Dialog_header, i as Dialog_content, o as Dialog_footer, r as Dialog_description, s as Dialog_title, t as Root$1 } from "../../../../../../chunks/dialog.js";
import { t as Button } from "../../../../../../chunks/button.js";
import "../../../../../../chunks/ui.js";
import { n as Plus, t as SettingsHeaderActions } from "../../../../../../chunks/SettingsHeaderActions.js";
import { t as Badge } from "../../../../../../chunks/badge.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, t as Card_title } from "../../../../../../chunks/card.js";
import { n as Alert_description, r as Alert } from "../../../../../../chunks/alert.js";
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/key-round.svelte
function Key_round($$renderer, $$props) {
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
			{ name: "key-round" },
			props,
			{
				iconNode: [["path", { "d": "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }], ["circle", {
					"cx": "16.5",
					"cy": "7.5",
					"r": ".5",
					"fill": "currentColor"
				}]],
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
//#region src/routes/(protected)/admin/settings/_components/ApiKeysSettings.svelte
function ApiKeysSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { apiKeys: apiKeys$1 } = $$props;
		const perms = usePermissions();
		const canManageApiKeys = derived(() => perms.can("apiKey.manage"));
		let createDialogOpen = false;
		let newKeyName = "";
		let newKeyMode = "read";
		const newKeyPermissions = derived(() => newKeyMode === "write" ? ["read", "write"] : ["read"]);
		let newKeyExpiresValue = "365";
		let newKeyExpiresInDays = 365;
		let createdKey = null;
		let isCreating = false;
		const expirationOptions = [
			{
				value: "30",
				label: "30 days"
			},
			{
				value: "90",
				label: "90 days"
			},
			{
				value: "365",
				label: "1 year"
			},
			{
				value: "never",
				label: "Never"
			}
		];
		const expirationTriggerContent = derived(() => expirationOptions.find((opt) => opt.value === newKeyExpiresValue)?.label ?? "1 year");
		async function createApiKey() {
			if (!newKeyName.trim()) {
				toast.error("Please enter a key name");
				return;
			}
			isCreating = true;
			try {
				const result = await apiKeys.create({
					name: newKeyName.trim(),
					permissions: newKeyPermissions(),
					expiresInDays: newKeyExpiresInDays
				});
				if (!result.success || !result.data) throw new Error(result.error || "Failed to create API key");
				createdKey = {
					key: result.data.apiKey.key,
					name: result.data.apiKey.name ?? newKeyName
				};
				newKeyName = "";
				newKeyMode = "read";
				newKeyExpiresValue = "365";
				newKeyExpiresInDays = 365;
				await invalidateAll();
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to create API key");
			} finally {
				isCreating = false;
			}
		}
		async function deleteApiKey(id, name) {
			if (!await confirmDialog({
				title: `Delete "${name}"?`,
				description: "This action cannot be undone. Any integration using this key will lose access.",
				confirmText: "Delete",
				variant: "destructive"
			})) return;
			try {
				const result = await apiKeys.remove(id);
				if (!result.success) throw new Error(result.error || "Failed to delete API key");
				toast.success(`API key "${name}" deleted`);
				await invalidateAll();
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to delete API key");
			}
		}
		function copyToClipboard(text) {
			navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard");
		}
		function formatDate(date) {
			if (!date) return "Never";
			return new Date(date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			});
		}
		function formatPermissions(permissions) {
			return permissions.join(" ");
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (canManageApiKeys()) {
				$$renderer.push("<!--[0-->");
				SettingsHeaderActions($$renderer, {
					children: ($$renderer) => {
						Button($$renderer, {
							size: "sm",
							onclick: () => {
								createdKey = null;
								createDialogOpen = true;
							},
							children: ($$renderer) => {
								Plus($$renderer, { class: "mr-1.5 h-4 w-4" });
								$$renderer.push(`<!----> New token`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
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
									$$renderer.push(`<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div>`);
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->API keys`);
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
												$$renderer.push(`<!---->Personal and service tokens scoped to this organization.`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(`</div> `);
									if (canManageApiKeys()) {
										$$renderer.push("<!--[0-->");
										Root$1($$renderer, {
											get open() {
												return createDialogOpen;
											},
											set open($$value) {
												createDialogOpen = $$value;
												$$settled = false;
											},
											children: ($$renderer) => {
												Dialog_content($$renderer, {
													class: "sm:max-w-[500px]",
													children: ($$renderer) => {
														if (createdKey) {
															$$renderer.push("<!--[0-->");
															Dialog_header($$renderer, {
																children: ($$renderer) => {
																	Dialog_title($$renderer, {
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->API key created`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Dialog_description($$renderer, {
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Save this key securely. You won't be able to see it again.`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!---->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> <div class="space-y-4 py-4"><div>`);
															Label($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Key name`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> <p class="mt-1 text-sm font-medium">${escape_html(createdKey.name)}</p></div> <div>`);
															Label($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->API key`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> <div class="mt-1 flex gap-2">`);
															Input($$renderer, {
																value: createdKey.key,
																readonly: true,
																class: "font-mono text-xs"
															});
															$$renderer.push(`<!----> `);
															Button($$renderer, {
																size: "sm",
																variant: "outline",
																onclick: () => copyToClipboard(createdKey.key),
																children: ($$renderer) => {
																	Copy($$renderer, { class: "mr-1.5 h-3.5 w-3.5" });
																	$$renderer.push(`<!----> Copy`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----></div></div></div> `);
															Dialog_footer($$renderer, {
																children: ($$renderer) => {
																	Button($$renderer, {
																		onclick: () => {
																			createdKey = null;
																			createDialogOpen = false;
																		},
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Done`);
																		},
																		$$slots: { default: true }
																	});
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!---->`);
														} else {
															$$renderer.push("<!--[-1-->");
															Dialog_header($$renderer, {
																children: ($$renderer) => {
																	Dialog_title($$renderer, {
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Create API key`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Dialog_description($$renderer, {
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Generate a new token for programmatic access.`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!---->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> <div class="space-y-4 py-4"><div>`);
															Label($$renderer, {
																for: "key-name",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Key name`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> `);
															Input($$renderer, {
																id: "key-name",
																placeholder: "Production read",
																class: "mt-1",
																get value() {
																	return newKeyName;
																},
																set value($$value) {
																	newKeyName = $$value;
																	$$settled = false;
																}
															});
															$$renderer.push(`<!----></div> <div>`);
															Label($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Access level`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> <div class="mt-2 flex gap-2">`);
															Button($$renderer, {
																variant: newKeyMode === "read" ? "default" : "outline",
																size: "sm",
																onclick: () => newKeyMode = "read",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Read only`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> `);
															Button($$renderer, {
																variant: newKeyMode === "write" ? "default" : "outline",
																size: "sm",
																onclick: () => newKeyMode = "write",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Read + write`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----></div></div> <div>`);
															Label($$renderer, {
																for: "expires",
																children: ($$renderer) => {
																	$$renderer.push(`<!---->Expires in`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!----> `);
															if (Root) {
																$$renderer.push("<!--[-->");
																Root($$renderer, {
																	type: "single",
																	name: "expiration",
																	onValueChange: (value) => {
																		if (value) newKeyExpiresInDays = value === "never" ? void 0 : parseInt(value);
																	},
																	get value() {
																		return newKeyExpiresValue;
																	},
																	set value($$value) {
																		newKeyExpiresValue = $$value;
																		$$settled = false;
																	},
																	children: ($$renderer) => {
																		if (Select_trigger) {
																			$$renderer.push("<!--[-->");
																			Select_trigger($$renderer, {
																				class: "mt-1 w-[180px]",
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->${escape_html(expirationTriggerContent())}`);
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
																					if (Select_group) {
																						$$renderer.push("<!--[-->");
																						Select_group($$renderer, {
																							children: ($$renderer) => {
																								$$renderer.push(`<!--[-->`);
																								const each_array = ensure_array_like(expirationOptions);
																								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
																									let option = each_array[$$index];
																									if (Select_item) {
																										$$renderer.push("<!--[-->");
																										Select_item($$renderer, {
																											value: option.value,
																											label: option.label,
																											children: ($$renderer) => {
																												$$renderer.push(`<!---->${escape_html(option.label)}`);
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
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(`</div></div> `);
															Dialog_footer($$renderer, {
																children: ($$renderer) => {
																	Button($$renderer, {
																		variant: "outline",
																		onclick: () => createDialogOpen = false,
																		disabled: isCreating,
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->Cancel`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!----> `);
																	Button($$renderer, {
																		onclick: createApiKey,
																		disabled: isCreating,
																		children: ($$renderer) => {
																			$$renderer.push(`<!---->${escape_html(isCreating ? "Creating..." : "Create key")}`);
																		},
																		$$slots: { default: true }
																	});
																	$$renderer.push(`<!---->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push(`<!---->`);
														}
														$$renderer.push(`<!--]-->`);
													},
													$$slots: { default: true }
												});
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> `);
									if (Alert) {
										$$renderer.push("<!--[-->");
										Alert($$renderer, {
											class: "bg-muted/50 text-muted-foreground px-3 py-2",
											children: ($$renderer) => {
												if (Alert_description) {
													$$renderer.push("<!--[-->");
													Alert_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Tokens are shown once. Treat them like passwords: store them in a secrets manager and never
				commit them to source.`);
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
						$$renderer.push(` `);
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "pt-0",
								children: ($$renderer) => {
									if (apiKeys$1.length === 0) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center"><div class="bg-muted mb-4 rounded-full p-3">`);
										Key_round($$renderer, { class: "text-muted-foreground h-6 w-6" });
										$$renderer.push(`<!----></div> <p class="text-base font-medium">No API keys yet</p> <p class="text-muted-foreground mt-1 text-sm">Create a token to access CMS data programmatically.</p></div>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<div class="border-border hidden overflow-hidden rounded-lg border md:block"><div class="bg-muted/30 text-muted-foreground grid grid-cols-[minmax(140px,1fr)_96px_130px_100px_100px_76px] border-b px-4 py-2 text-xs font-medium tracking-wide uppercase"><div>Name</div> <div>Token</div> <div>Scope</div> <div>Created</div> <div>Last used</div> <div></div></div> <div class="divide-y"><!--[-->`);
										const each_array_1 = ensure_array_like(apiKeys$1);
										for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
											let apiKey = each_array_1[$$index_1];
											$$renderer.push(`<div class="grid grid-cols-[minmax(140px,1fr)_96px_130px_100px_100px_76px] items-center px-4 py-3 text-sm"><div class="truncate font-medium">${escape_html(apiKey.name ?? "Unnamed key")}</div> <div class="text-muted-foreground truncate font-mono text-xs">shown once</div> <div>`);
											Badge($$renderer, {
												variant: "outline",
												class: "font-mono text-xs",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatPermissions(apiKey.permissions))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="text-muted-foreground">${escape_html(formatDate(apiKey.createdAt))}</div> <div class="text-muted-foreground">${escape_html(formatDate(apiKey.lastRequest))}</div> <div class="flex justify-end">`);
											if (canManageApiKeys()) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													variant: "outline",
													size: "sm",
													onclick: () => deleteApiKey(apiKey.id, apiKey.name ?? "Unnamed"),
													children: ($$renderer) => {
														$$renderer.push(`<!---->Delete`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div></div>`);
										}
										$$renderer.push(`<!--]--></div></div> <div class="space-y-3 md:hidden"><!--[-->`);
										const each_array_2 = ensure_array_like(apiKeys$1);
										for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
											let apiKey = each_array_2[$$index_2];
											$$renderer.push(`<div class="border-border rounded-lg border p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-medium">${escape_html(apiKey.name ?? "Unnamed key")}</p> <p class="text-muted-foreground mt-1 font-mono text-xs">Token shown once</p></div> `);
											Badge($$renderer, {
												variant: "outline",
												class: "font-mono text-xs",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(formatPermissions(apiKey.permissions))}`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div> <div class="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p class="text-muted-foreground text-xs">Created</p> <p class="mt-1">${escape_html(formatDate(apiKey.createdAt))}</p></div> <div><p class="text-muted-foreground text-xs">Last used</p> <p class="mt-1">${escape_html(formatDate(apiKey.lastRequest))}</p></div></div> `);
											if (canManageApiKeys()) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													class: "mt-4 w-full",
													variant: "outline",
													size: "sm",
													onclick: () => deleteApiKey(apiKey.id, apiKey.name ?? "Unnamed"),
													children: ($$renderer) => {
														Trash_2($$renderer, { class: "mr-1.5 h-4 w-4" });
														$$renderer.push(`<!----> Delete key`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										}
										$$renderer.push(`<!--]--></div>`);
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
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "mt-5",
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								children: ($$renderer) => {
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											class: "text-base",
											children: ($$renderer) => {
												$$renderer.push(`<!---->API reference`);
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
												$$renderer.push(`<!---->Use the key in the <code class="bg-muted rounded px-1 py-0.5 text-xs">x-api-key</code> header.`);
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
								class: "space-y-4",
								children: ($$renderer) => {
									$$renderer.push(`<div class="bg-muted relative rounded-md p-3 pr-11"><code class="block font-mono text-xs leading-relaxed break-all">curl -H "x-api-key: your_key_here"
				https://your-app.com/api/documents?type={schemaType}</code> `);
									Button($$renderer, {
										variant: "ghost",
										size: "icon",
										class: "absolute top-2 right-2 h-7 w-7",
										onclick: () => copyToClipboard("curl -H \"x-api-key: your_key_here\" https://your-app.com/api/documents?type={schemaType}"),
										children: ($$renderer) => {
											Copy($$renderer, { class: "h-3.5 w-3.5" });
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2 text-sm sm:grid-cols-2"><div class="border-border rounded-md border p-3"><p class="font-medium">Read endpoints</p> <div class="text-muted-foreground mt-2 space-y-1 font-mono text-xs"><p>GET /api/documents?type={type}</p> <p>GET /api/documents/{id}</p> <p>POST /api/documents/query</p> <p>GET /api/assets</p> <p>GET /api/schemas</p></div></div> <div class="border-border rounded-md border p-3"><p class="font-medium">Write endpoints</p> <div class="text-muted-foreground mt-2 space-y-1 font-mono text-xs"><p>POST /api/documents</p> <p>PUT /api/documents/{id}</p> <p>DELETE /api/documents/{id}</p> <p>POST /api/assets</p></div></div></div> <p class="text-muted-foreground text-xs leading-relaxed">Read-only keys can use read endpoints. Write keys can create, update, and delete documents and
			upload assets. <code class="bg-muted rounded px-1 py-0.5">POST /api/documents/query</code> only
			requires read access.</p>`);
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
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/(protected)/admin/settings/api-keys/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("jdanqk", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - API Keys</title>`);
			});
		});
		$$renderer.push(`<div class="grid gap-5">`);
		ApiKeysSettings($$renderer, {
			apiKeys: data.apiKeys,
			organizationRole: data.user.organizationRole
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
