import { A as escape_html, O as attr, a as derived, c as head, d as spread_props, f as store_get, m as unsubscribe_stores, p as stringify, s as ensure_array_like, t as attr_class } from "../../../../../../chunks/server2.js";
import { i as user } from "../../../../../../chunks/api.js";
import { n as invalidateAll, t as goto } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/navigation.js";
import { D as toast, S as Copy, h as Shield_check, i as Switch } from "../../../../../../chunks/stega.js";
import { O as Input, t as Label } from "../../../../../../chunks/label.js";
import { a as Dialog_header, i as Dialog_content, o as Dialog_footer, r as Dialog_description, s as Dialog_title, t as Root } from "../../../../../../chunks/dialog.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../../../chunks/avatar.js";
import { t as Checkbox } from "../../../../../../chunks/checkbox.js";
import { n as Input_otp_slot, r as Input_otp_group, t as Input_otp } from "../../../../../../chunks/input-otp.js";
import { t as Button } from "../../../../../../chunks/button.js";
import { t as Icon } from "../../../../../../chunks/Icon.js";
import "../../../../../../chunks/ui.js";
import { n as Download, t as Lock } from "../../../../../../chunks/lock.js";
import { t as PasswordInput } from "../../../../../../chunks/PasswordInput.js";
import { t as Key_round } from "../../../../../../chunks/key-round.js";
import { t as Upload } from "../../../../../../chunks/upload.js";
import { t as Badge } from "../../../../../../chunks/badge.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, r as Card_footer, t as Card_title } from "../../../../../../chunks/card.js";
import { t as authClient } from "../../../../../../chunks/auth-client.js";
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
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/shield-off.svelte
function Shield_off($$renderer, $$props) {
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
			{ name: "shield-off" },
			props,
			{
				iconNode: [
					["path", { "d": "m2 2 20 20" }],
					["path", { "d": "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71" }],
					["path", { "d": "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264" }]
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
//#region src/routes/(protected)/admin/settings/_components/AccountSettings.svelte
function AccountSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user: user$1 } = $$props;
		/**
		* Mirrors the server's limit in `updateUserRequest` so the field stops taking
		* input rather than failing on save. The server bound is the real one — this
		* is only here so you find out before the round-trip.
		*/
		const NAME_MAX_LENGTH = 80;
		let userName = "";
		let userImage = "";
		let isUpdating = false;
		let isRemovingImage = false;
		/** Initials so an empty avatar reads as "no picture yet" rather than as a broken one. */
		const initials = derived(() => (userName.trim() || user$1.email).split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""));
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
		async function removeProfileImage() {
			if (!userImage) return;
			isRemovingImage = true;
			try {
				const result = await user.updateProfile({ image: null });
				if (!result.success) throw new Error(result.error || result.message || "Failed to remove avatar");
				userImage = "";
				toast.success("Avatar removed");
				await invalidateAll();
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to remove avatar");
			} finally {
				isRemovingImage = false;
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
									$$renderer.push(`<div class="flex flex-col gap-6 sm:flex-row sm:items-start"><div class="flex w-[130px] shrink-0 flex-col gap-2"><button type="button"${attr_class(`border-border bg-muted/30 group relative flex h-[130px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-colors ${stringify("hover:bg-muted/50")}`)}${attr("disabled", isRemovingImage || isUpdating, true)}${attr("aria-label", userImage ? "Replace avatar" : "Upload avatar")}>`);
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
													Avatar_fallback($$renderer, {
														class: "bg-muted text-muted-foreground rounded-xl text-2xl font-medium",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(initials())}`);
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
									$$renderer.push(` <div class="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"><span class="flex flex-col items-center gap-1.5">`);
									Upload($$renderer, { class: "h-4 w-4" });
									$$renderer.push(`<!----> ${escape_html(userImage ? "Replace" : "Upload")}</span></div> `);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></button> <input type="file" accept="image/*" class="hidden"/> `);
									Button($$renderer, {
										type: "button",
										variant: "outline",
										size: "sm",
										class: "w-full",
										onclick: () => void 0,
										disabled: isRemovingImage || isUpdating,
										children: ($$renderer) => {
											Upload($$renderer, { class: "mr-2 h-3.5 w-3.5" });
											$$renderer.push(`<!----> ${escape_html(userImage ? "Replace" : "Upload")}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (userImage) {
										$$renderer.push("<!--[0-->");
										Button($$renderer, {
											type: "button",
											variant: "ghost",
											size: "sm",
											class: "text-muted-foreground hover:text-destructive w-full",
											onclick: removeProfileImage,
											disabled: isRemovingImage || isUpdating,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(isRemovingImage ? "Removing…" : "Remove")}`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="max-w-sm min-w-0 flex-1 space-y-4"><div>`);
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
										maxlength: NAME_MAX_LENGTH,
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
									$$renderer.push(`<!----> <div class="relative mt-2">`);
									Input($$renderer, {
										id: "user-email",
										type: "email",
										value: user$1.email,
										disabled: true,
										class: "pr-9"
									});
									$$renderer.push(`<!----> `);
									Lock($$renderer, { class: "text-muted-foreground absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2" });
									$$renderer.push(`<!----></div> <p class="text-muted-foreground mt-1.5 text-xs">Managed by your authentication provider</p></div> <p class="text-muted-foreground text-xs">Drag an image onto the avatar, or choose a file. JPG, PNG, WebP, or GIF. Max 5MB.</p></div></div>`);
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
			$$renderer.push(`</div>`);
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
//#region src/routes/(protected)/admin/settings/_components/PreferencesSettings.svelte
function PreferencesSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Per-user workspace preferences.
		*
		* Split out of AccountSettings so the settings page can file it under its own
		* heading — these change what you *see* in the CMS, not who you are, and
		* grouping them with name and avatar made "Profile" mean two things.
		*
		* Preferences save immediately on toggle, with no Save button. They're
		* per-user view settings, so the cost of a wrong one is seeing the wrong list
		* for a moment, and an unsaved toggle is a worse failure than an instant one.
		*/
		let { userPreferences = null, hasChildOrganizations = false } = $$props;
		let includeChildOrganizations = false;
		let isUpdating = false;
		async function updatePreferences(prefs) {
			isUpdating = true;
			try {
				const result = await user.updatePreferences(prefs);
				if (!result.success) throw new Error(result.error || result.message || "Failed to update preferences");
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to update preferences");
				if (prefs.includeChildOrganizations !== void 0) includeChildOrganizations = !prefs.includeChildOrganizations;
			} finally {
				isUpdating = false;
			}
		}
		if (hasChildOrganizations) {
			$$renderer.push("<!--[0-->");
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex items-center justify-between gap-4"><div class="flex items-center gap-3">`);
									Building_2($$renderer, { class: "text-muted-foreground h-5 w-5 shrink-0" });
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
										disabled: isUpdating,
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
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(protected)/admin/settings/_components/PasswordSettings.svelte
function PasswordSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Change your own password from inside the admin.
		*
		* Distinct from the /reset-password flow, which is for people who *can't* sign
		* in and proves identity by email. Here the session already proves identity,
		* so the current password is what stops someone walking up to an unlocked
		* laptop and taking the account over.
		*
		* The form lives in a dialog rather than inline: it's three password fields
		* that are irrelevant until you actually intend to change something, and
		* leaving them open made the security section read as a form to fill in
		* rather than a summary of how the account is protected.
		*/
		const MIN_LENGTH = 8;
		let open = false;
		let currentPassword = "";
		let newPassword = "";
		let confirmPassword = "";
		let revokeOtherSessions = true;
		let busy = false;
		const mismatch = derived(() => confirmPassword.length > 0 && newPassword !== confirmPassword);
		const tooShort = derived(() => newPassword.length > 0 && newPassword.length < MIN_LENGTH);
		const canSubmit = derived(() => Boolean(currentPassword) && newPassword.length >= MIN_LENGTH && newPassword === confirmPassword);
		function reset() {
			currentPassword = "";
			newPassword = "";
			confirmPassword = "";
			revokeOtherSessions = true;
		}
		/** Never leave typed passwords sitting in memory behind a closed dialog. */
		function onOpenChange(next) {
			open = next;
			if (!next) reset();
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
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
												$$renderer.push(`<!---->Password`);
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
												$$renderer.push(`<!---->Change the password you use to sign in. You'll need your current password, and you can sign
				out everywhere else at the same time.`);
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
										variant: "outline",
										class: "shrink-0",
										onclick: () => open = true,
										children: ($$renderer) => {
											Key_round($$renderer, { class: "mr-2 h-4 w-4" });
											$$renderer.push(`<!----> Change password`);
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
					open,
					onOpenChange,
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "sm:max-w-md",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Change password`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Dialog_description) {
													$$renderer.push("<!--[-->");
													Dialog_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Enter your current password, then choose a new one.`);
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
									$$renderer.push(` <form id="change-password" class="space-y-4"><div class="space-y-2">`);
									Label($$renderer, {
										for: "current-password",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Current password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									PasswordInput($$renderer, {
										id: "current-password",
										required: true,
										autocomplete: "current-password",
										disabled: busy,
										get value() {
											return currentPassword;
										},
										set value($$value) {
											currentPassword = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="space-y-2">`);
									Label($$renderer, {
										for: "new-password",
										children: ($$renderer) => {
											$$renderer.push(`<!---->New password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									PasswordInput($$renderer, {
										id: "new-password",
										required: true,
										autocomplete: "new-password",
										disabled: busy,
										get value() {
											return newPassword;
										},
										set value($$value) {
											newPassword = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> <p${attr_class(`text-xs ${stringify(tooShort() ? "text-destructive" : "text-muted-foreground")}`)}>Must be at least 8 characters long</p></div> <div class="space-y-2">`);
									Label($$renderer, {
										for: "confirm-password",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Confirm new password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									PasswordInput($$renderer, {
										id: "confirm-password",
										required: true,
										autocomplete: "new-password",
										disabled: busy,
										get value() {
											return confirmPassword;
										},
										set value($$value) {
											confirmPassword = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> `);
									if (mismatch()) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-xs">Passwords do not match</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2">`);
									Checkbox($$renderer, {
										id: "revoke-sessions",
										checked: revokeOtherSessions,
										onCheckedChange: (checked) => revokeOtherSessions = checked === true,
										disabled: busy
									});
									$$renderer.push(`<!----> `);
									Label($$renderer, {
										for: "revoke-sessions",
										class: "text-sm font-normal",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Sign out everywhere else`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></form> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													variant: "ghost",
													onclick: () => onOpenChange(false),
													disabled: busy,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Cancel`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Button($$renderer, {
													type: "submit",
													form: "change-password",
													disabled: !canSubmit(),
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html("Change password")}`);
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
//#region src/routes/(protected)/admin/settings/_components/TwoFactorSettings.svelte
function TwoFactorSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		/**
		* Opt-in TOTP enrolment for the signed-in user.
		*
		* The enrol → verify split is better-auth's, and it's the right one: `enable`
		* hands back a secret and backup codes but leaves `twoFactorEnabled` false
		* until a real code from the authenticator comes back. So a user who closes
		* this panel halfway through — or scans the QR into an app that never syncs —
		* is not locked out of their own account.
		*/
		/**
		* Whether this instance offers the authenticator app at all. Drives enrolment:
		* with it off, turning 2FA on is a single password confirmation and codes
		* arrive by email instead of from a scanned QR.
		*/
		let { totpAvailable = true } = $$props;
		const session = authClient.useSession();
		const enabled = derived(() => store_get($$store_subs ??= {}, "$session", session).data?.user.twoFactorEnabled ?? void 0);
		let step = "idle";
		let password = "";
		let code = "";
		let busy = false;
		let qrDataUrl = "";
		let totpSecret = "";
		let backupCodes = [];
		function reset() {
			step = "idle";
			password = "";
			code = "";
			qrDataUrl = "";
			totpSecret = "";
			backupCodes = [];
		}
		function errorMessage(error, fallback) {
			return error?.message || fallback;
		}
		/**
		* Pull the session again, bypassing the cookie cache.
		*
		* The client already refetches after any `/two-factor/*` call, but that request
		* is served from Better Auth's signed session cookie, which is cached for 60s
		* and isn't rewritten when 2FA is enabled or disabled. So the "refreshed"
		* session still says what it said before, and this panel goes on claiming 2FA
		* is on for a minute after it was switched off. Asking for an uncached read is
		* what actually moves `twoFactorEnabled`.
		*/
		async function refreshSession() {
			await store_get($$store_subs ??= {}, "$session", session).refetch?.({ query: { disableCookieCache: true } });
		}
		async function confirmEnrolment() {
			if (busy || code.trim().length !== 6) return;
			busy = true;
			try {
				const result = await authClient.twoFactor.verifyTotp({ code: code.trim() });
				if (result.error) {
					toast.error(errorMessage(result.error, "That code is not valid. Codes expire every 30 seconds — try the current one."));
					code = "";
					return;
				}
				await refreshSession();
				toast.success("Two-factor authentication is on");
				reset();
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Could not verify the code");
			} finally {
				busy = false;
			}
		}
		async function copyBackupCodes() {
			try {
				await navigator.clipboard.writeText(backupCodes.join("\n"));
				toast.success("Backup codes copied");
			} catch {
				toast.error("Could not copy — select and copy them manually");
			}
		}
		function downloadBackupCodes() {
			const blob = new Blob([`${backupCodes.join("\n")}\n`], { type: "text/plain" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "aphex-backup-codes.txt";
			link.click();
			URL.revokeObjectURL(url);
		}
		function codesPanel($$renderer) {
			$$renderer.push(`<div class="bg-muted/40 space-y-3 rounded-lg border p-4"><p class="text-muted-foreground text-xs">Each code works once, and they're shown only now. Keep them somewhere you can reach without
			your phone.</p> <ul class="grid grid-cols-2 gap-1.5 font-mono text-sm sm:grid-cols-3"><!--[-->`);
			const each_array = ensure_array_like(backupCodes);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let backupCode = each_array[$$index_1];
				$$renderer.push(`<li class="bg-background rounded border px-2 py-1 text-center">${escape_html(backupCode)}</li>`);
			}
			$$renderer.push(`<!--]--></ul> <div class="flex flex-wrap gap-2">`);
			Button($$renderer, {
				type: "button",
				variant: "outline",
				size: "sm",
				onclick: copyBackupCodes,
				children: ($$renderer) => {
					Copy($$renderer, { class: "mr-2 h-3.5 w-3.5" });
					$$renderer.push(`<!----> Copy`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				type: "button",
				variant: "outline",
				size: "sm",
				onclick: downloadBackupCodes,
				children: ($$renderer) => {
					Download($$renderer, { class: "mr-2 h-3.5 w-3.5" });
					$$renderer.push(`<!----> Download`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div>`);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
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
												$$renderer.push(`<!---->Two-Factor Authentication`);
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
												$$renderer.push(`<!---->Ask for a code from an authenticator app on top of your password.`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
									$$renderer.push(`</div> `);
									if (enabled() !== void 0) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: enabled() ? "default" : "outline",
											class: "shrink-0 px-2.5 py-1 text-xs",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(enabled() ? "On" : "Off")}`);
											},
											$$slots: { default: true }
										});
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
						$$renderer.push(` `);
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								children: ($$renderer) => {
									if (enabled() === void 0) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="bg-muted/40 h-10 animate-pulse rounded-md"></div>`);
									} else if (enabled()) {
										$$renderer.push("<!--[1-->");
										$$renderer.push(`<div class="space-y-4"><div class="flex items-start gap-3">`);
										Shield_check($$renderer, { class: "mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-500" });
										$$renderer.push(`<!----> <p class="text-muted-foreground text-sm">Signing in on a new device asks for a six-digit code from your authenticator app.</p></div> `);
										if (backupCodes.length) {
											$$renderer.push("<!--[0-->");
											codesPanel($$renderer);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (step === "disable" || step === "regenerate") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<form class="space-y-3"><div class="space-y-2">`);
											Label($$renderer, {
												for: "tf-password",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Confirm your password`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											PasswordInput($$renderer, {
												id: "tf-password",
												required: true,
												autocomplete: "current-password",
												disabled: busy,
												get value() {
													return password;
												},
												set value($$value) {
													password = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">${escape_html(step === "disable" ? "Turning this off removes your authenticator and all backup codes." : "Generating new codes immediately invalidates the previous set.")}</p></div> <div class="flex gap-2">`);
											Button($$renderer, {
												type: "submit",
												variant: step === "disable" ? "destructive" : "default",
												disabled: busy || !password,
												children: ($$renderer) => {
													if (busy) {
														$$renderer.push("<!--[0-->");
														$$renderer.push(`Working…`);
													} else if (step === "disable") {
														$$renderer.push("<!--[1-->");
														$$renderer.push(`Turn off two-factor`);
													} else {
														$$renderer.push("<!--[-1-->");
														$$renderer.push(`Generate new codes`);
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												disabled: busy,
												onclick: reset,
												children: ($$renderer) => {
													$$renderer.push(`<!---->Cancel`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div></form>`);
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<div class="flex flex-wrap gap-2">`);
											Button($$renderer, {
												type: "button",
												variant: "outline",
												onclick: () => {
													backupCodes = [];
													step = "regenerate";
												},
												children: ($$renderer) => {
													$$renderer.push(`<!---->Generate new backup codes`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												class: "text-destructive hover:text-destructive",
												onclick: () => {
													backupCodes = [];
													step = "disable";
												},
												children: ($$renderer) => {
													Shield_off($$renderer, { class: "mr-2 h-4 w-4" });
													$$renderer.push(`<!----> Turn off`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----></div>`);
										}
										$$renderer.push(`<!--]--></div>`);
									} else if (step === "idle") {
										$$renderer.push("<!--[2-->");
										$$renderer.push(`<div class="space-y-4"><p class="text-muted-foreground text-sm">You'll scan a QR code with an authenticator app — 1Password, Bitwarden, Google
					Authenticator, or any other — and enter a six-digit code to confirm it works.</p> `);
										Button($$renderer, {
											type: "button",
											onclick: () => step = "password",
											children: ($$renderer) => {
												Shield_check($$renderer, { class: "mr-2 h-4 w-4" });
												$$renderer.push(`<!----> Set up two-factor`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div>`);
									} else if (step === "password") {
										$$renderer.push("<!--[3-->");
										$$renderer.push(`<form class="space-y-3"><div class="space-y-2">`);
										Label($$renderer, {
											for: "tf-password",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Confirm your password`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										PasswordInput($$renderer, {
											id: "tf-password",
											required: true,
											autocomplete: "current-password",
											disabled: busy,
											get value() {
												return password;
											},
											set value($$value) {
												password = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----></div> <div class="flex gap-2">`);
										Button($$renderer, {
											type: "submit",
											disabled: busy || !password,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(busy ? "Working…" : "Continue")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Button($$renderer, {
											type: "button",
											variant: "ghost",
											disabled: busy,
											onclick: reset,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Cancel`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div></form>`);
									} else if (step === "verify") {
										$$renderer.push("<!--[4-->");
										$$renderer.push(`<div class="space-y-5"><div class="flex flex-col gap-4 sm:flex-row sm:items-start">`);
										if (qrDataUrl) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<img${attr("src", qrDataUrl)} alt="QR code for your authenticator app" class="bg-background h-[180px] w-[180px] shrink-0 rounded-lg border p-2"/>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="min-w-0 flex-1 space-y-2"><p class="text-sm font-medium">1. Scan this with your authenticator app</p> `);
										if (totpSecret) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-xs">Can't scan? Enter this key manually:</p> <code class="bg-muted block rounded px-2 py-1.5 font-mono text-xs break-all">${escape_html(totpSecret)}</code>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div></div> <div class="space-y-2"><p class="text-sm font-medium">2. Save your backup codes</p> `);
										codesPanel($$renderer);
										$$renderer.push(`<!----></div> <form class="space-y-3"><div class="space-y-2">`);
										Label($$renderer, {
											for: "tf-code",
											children: ($$renderer) => {
												$$renderer.push(`<!---->3. Enter the six-digit code to finish`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										{
											function children($$renderer, { cells }) {
												if (Input_otp_group) {
													$$renderer.push("<!--[-->");
													Input_otp_group($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!--[-->`);
															const each_array_1 = ensure_array_like(cells);
															for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
																let cell = each_array_1[i];
																if (Input_otp_slot) {
																	$$renderer.push("<!--[-->");
																	Input_otp_slot($$renderer, { cell });
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
											}
											if (Input_otp) {
												$$renderer.push("<!--[-->");
												Input_otp($$renderer, {
													inputId: "tf-code",
													maxlength: 6,
													value: code,
													onValueChange: (next) => code = next.replace(/\D/g, ""),
													onComplete: confirmEnrolment,
													pasteTransformer: (text) => text.replace(/\D/g, ""),
													disabled: busy,
													inputmode: "numeric",
													autocomplete: "one-time-code",
													children,
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										}
										$$renderer.push(`</div> <div class="flex gap-2">`);
										Button($$renderer, {
											type: "submit",
											disabled: busy || code.trim().length !== 6,
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(busy ? "Verifying…" : "Turn on two-factor")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Button($$renderer, {
											type: "button",
											variant: "ghost",
											disabled: busy,
											onclick: reset,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Cancel`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div></form></div>`);
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
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(protected)/admin/settings/_components/DeleteAccountSettings.svelte
function DeleteAccountSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { email } = $$props;
		let open = false;
		let confirmation = "";
		let password = "";
		let isDeleting = false;
		const canDelete = derived(() => confirmation.trim().toLowerCase() === email.toLowerCase());
		function onOpenChange(next) {
			if (isDeleting) return;
			open = next;
			if (!next) {
				confirmation = "";
				password = "";
			}
		}
		async function deleteAccount() {
			if (!canDelete() || isDeleting) return;
			isDeleting = true;
			try {
				const result = await authClient.deleteUser({ password });
				if (result.error) throw new Error(result.error.message || "Could not delete your account");
				await goto("/login?deleted=1");
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Could not delete your account");
				isDeleting = false;
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "border-destructive/40",
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
								children: ($$renderer) => {
									$$renderer.push(`<div class="space-y-1"><p class="text-sm font-medium">Delete account</p> <p class="text-muted-foreground max-w-prose text-sm">Permanently deletes your account, your profile picture, and your membership of every
				workspace. Content you created stays where it is. This can't be undone.</p></div> `);
									Button($$renderer, {
										variant: "destructive",
										class: "shrink-0",
										onclick: () => open = true,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Delete account`);
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
					open,
					onOpenChange,
					children: ($$renderer) => {
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "sm:max-w-md",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Delete your account?`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Dialog_description) {
													$$renderer.push("<!--[-->");
													Dialog_description($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->This is permanent. Your profile and profile picture are erased and you're removed from every
				workspace you belong to.`);
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
									$$renderer.push(` <div class="grid gap-4 py-2"><div class="grid gap-2">`);
									Label($$renderer, {
										for: "delete-confirmation",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Type <span class="font-mono font-medium">${escape_html(email)}</span> to confirm`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "delete-confirmation",
										autocomplete: "off",
										disabled: isDeleting,
										get value() {
											return confirmation;
										},
										set value($$value) {
											confirmation = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> <div class="grid gap-2">`);
									Label($$renderer, {
										for: "delete-password",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Your password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									PasswordInput($$renderer, {
										id: "delete-password",
										autocomplete: "current-password",
										disabled: isDeleting,
										get value() {
											return password;
										},
										set value($$value) {
											password = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div></div> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													variant: "outline",
													onclick: () => onOpenChange(false),
													disabled: isDeleting,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Cancel`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Button($$renderer, {
													variant: "destructive",
													onclick: deleteAccount,
													disabled: !canDelete() || isDeleting,
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(isDeleting ? "Deleting…" : "Delete account")}`);
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
//#region src/routes/(protected)/admin/settings/account/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("xbmurs", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Account</title>`);
			});
		});
		$$renderer.push(`<div class="grid gap-10"><section class="grid gap-4">`);
		AccountSettings($$renderer, { user: data.user });
		$$renderer.push(`<!----> `);
		PreferencesSettings($$renderer, {
			userPreferences: data.userPreferences,
			hasChildOrganizations: data.hasChildOrganizations
		});
		$$renderer.push(`<!----></section> <section class="grid gap-4"><header><h2 class="text-base font-semibold">Security</h2> <p class="text-muted-foreground text-sm">How you sign in and prove it's you.</p></header> `);
		PasswordSettings($$renderer, {});
		$$renderer.push(`<!----> `);
		TwoFactorSettings($$renderer, { totpAvailable: data.totpAvailable });
		$$renderer.push(`<!----></section> <section class="grid gap-4"><header><h2 class="text-base font-semibold">Danger zone</h2> <p class="text-muted-foreground text-sm">Irreversible, and only for you.</p></header> `);
		DeleteAccountSettings($$renderer, { email: data.user.email });
		$$renderer.push(`<!----></section></div>`);
	});
}
//#endregion
export { _page as default };
