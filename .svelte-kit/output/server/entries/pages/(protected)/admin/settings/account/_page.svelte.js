import { $ as attr, m as stringify, n as attr_class, p as spread_props, tt as escape_html, u as head } from "../../../../../../chunks/dev.js";
import { D as Upload, N as Icon, l as Switch, y as toast } from "../../../../../../chunks/client.js";
import { i as user } from "../../../../../../chunks/api.js";
import { n as invalidateAll } from "../../../../../../chunks/client2.js";
import "../../../../../../chunks/navigation.js";
import { t as Button } from "../../../../../../chunks/button.js";
import { t as Badge } from "../../../../../../chunks/badge.js";
import { n as Label, t as Input } from "../../../../../../chunks/input.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../../../chunks/avatar.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, r as Card_footer, t as Card_title } from "../../../../../../chunks/card.js";
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/building-2.svelte
function Building_2($$renderer, $$props) {
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
			{ name: "building-2" },
			props,
			{
				iconNode: [
					["path", { "d": "M10 12h4" }],
					["path", { "d": "M10 8h4" }],
					["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
					["path", { "d": "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" }],
					["path", { "d": "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }]
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
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/lock.svelte
function Lock($$renderer, $$props) {
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
			{ name: "lock" },
			props,
			{
				iconNode: [["rect", {
					"width": "18",
					"height": "11",
					"x": "3",
					"y": "11",
					"rx": "2",
					"ry": "2"
				}], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]],
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
//#region src/routes/(protected)/admin/settings/_components/AccountSettings.svelte
function AccountSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user: user$1, userPreferences = null, hasChildOrganizations = false } = $$props;
		let userName = "";
		let userImage = "";
		let isUpdating = false;
		let includeChildOrganizations = false;
		let isUpdatingPreferences = false;
		function getRoleBadgeVariant(role) {
			switch (role) {
				case "super_admin": return "default";
				case "admin": return "secondary";
				default: return "outline";
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
				const result = await user.updateProfile({
					name: userName.trim(),
					image: userImage || null
				});
				if (!result.success) throw new Error(result.error || result.message || "Failed to update profile");
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
				if (!result.success) throw new Error(result.error || result.message || "Failed to update preferences");
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to update preferences");
				if (prefs.includeChildOrganizations !== void 0) includeChildOrganizations = !prefs.includeChildOrganizations;
			} finally {
				isUpdatingPreferences = false;
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="space-y-6">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								class: "flex flex-row items-start justify-between gap-4",
								children: ($$renderer) => {
									$$renderer.push(`<div class="space-y-1.5">`);
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!---->Identity`);
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
												$$renderer.push(`<!---->Your public profile inside this workspace.`);
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
										variant: getRoleBadgeVariant(user$1.role),
										class: "shrink-0 px-2.5 py-1 text-xs font-medium capitalize",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(formatRole(user$1.role))}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
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
									$$renderer.push(`<div class="space-y-4"><div><div class="flex flex-col gap-4 sm:flex-row sm:items-center"><button type="button"${attr_class(`border-border bg-muted/30 group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-colors sm:h-[130px] sm:w-[130px] ${stringify("hover:bg-muted/50")}`)}${attr("disabled", isUpdating, true)} aria-label="Upload avatar">`);
									if (Avatar) {
										$$renderer.push("<!--[-->");
										Avatar($$renderer, {
											class: "h-full w-full rounded-xl",
											children: ($$renderer) => {
												if (userImage) {
													$$renderer.push("<!--[0-->");
													if (Avatar_image) {
														$$renderer.push("<!--[-->");
														Avatar_image($$renderer, {
															src: userImage,
															alt: user$1.name || user$1.email,
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
													Avatar_fallback($$renderer, { class: "bg-muted rounded-xl" });
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
									$$renderer.push(` <div class="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"><span class="flex flex-col items-center gap-1.5">`);
									Upload($$renderer, { class: "h-4 w-4" });
									$$renderer.push(`<!----> Upload icon</span></div> `);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></button> <div class="min-w-0 flex-1 space-y-3"><div><h2 class="truncate text-lg font-semibold">${escape_html(userName || user$1.email)}</h2> <p class="text-muted-foreground mt-0.5 truncate text-sm">${escape_html(user$1.email)}</p></div> <input type="file" accept="image/*" class="hidden"/> <div class="flex flex-wrap gap-2">`);
									Button($$renderer, {
										type: "button",
										variant: "outline",
										onclick: () => void 0,
										disabled: isUpdating,
										children: ($$renderer) => {
											Upload($$renderer, { class: "mr-2 h-4 w-4" });
											$$renderer.push(`<!----> ${escape_html("Upload avatar")}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (userImage) {
										$$renderer.push("<!--[0-->");
										Button($$renderer, {
											type: "button",
											variant: "ghost",
											onclick: () => userImage = "",
											disabled: isUpdating,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Remove`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <p class="text-muted-foreground text-xs">Drag an image here, or choose a file. JPG, PNG, WebP, or GIF. Max 5MB.</p></div></div></div> <div>`);
									Label($$renderer, {
										for: "user-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Display Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
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
									$$renderer.push(`<!----></div> <div>`);
									Label($$renderer, {
										for: "user-email",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Email`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="relative mt-1">`);
									Input($$renderer, {
										id: "user-email",
										type: "email",
										value: user$1.email,
										disabled: true,
										class: "pr-9"
									});
									$$renderer.push(`<!----> `);
									Lock($$renderer, { class: "text-muted-foreground absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2" });
									$$renderer.push(`<!----></div> <p class="text-muted-foreground mt-1 text-xs">Managed by your authentication provider</p></div></div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Card_footer) {
							$$renderer.push("<!--[-->");
							Card_footer($$renderer, {
								class: "flex justify-end border-t px-6 py-4",
								children: ($$renderer) => {
									Button($$renderer, {
										onclick: updateProfile,
										disabled: isUpdating,
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(isUpdating ? "Saving..." : "Save changes")}`);
										},
										$$slots: { default: true }
									});
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
			if (hasChildOrganizations) {
				$$renderer.push("<!--[0-->");
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						children: ($$renderer) => {
							if (Card_header) {
								$$renderer.push("<!--[-->");
								Card_header($$renderer, {
									children: ($$renderer) => {
										if (Card_title) {
											$$renderer.push("<!--[-->");
											Card_title($$renderer, {
												children: ($$renderer) => {
													$$renderer.push(`<!---->Content Preferences`);
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
													$$renderer.push(`<!---->Control how organization content appears in your workspace.`);
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
										$$renderer.push(`<div class="flex items-center justify-between"><div class="flex items-center gap-3">`);
										Building_2($$renderer, { class: "text-muted-foreground h-5 w-5" });
										$$renderer.push(`<!----> <div>`);
										Label($$renderer, {
											class: "text-base font-medium",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Include child organizations`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <p class="text-muted-foreground text-sm">Show documents from child organizations in your content lists</p></div></div> `);
										Switch($$renderer, {
											checked: includeChildOrganizations,
											disabled: isUpdatingPreferences,
											onCheckedChange: (checked) => {
												includeChildOrganizations = checked;
												updatePreferences({ includeChildOrganizations: checked });
											}
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
//#region src/routes/(protected)/admin/settings/account/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("xbmurs", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Account</title>`);
			});
		});
		$$renderer.push(`<div class="grid gap-5">`);
		AccountSettings($$renderer, {
			user: data.user,
			userPreferences: data.userPreferences,
			hasChildOrganizations: data.hasChildOrganizations
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
