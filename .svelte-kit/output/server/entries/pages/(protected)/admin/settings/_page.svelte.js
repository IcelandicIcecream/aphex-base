import { $ as attr, m as stringify, n as attr_class, p as spread_props, s as derived, tt as escape_html, u as head } from "../../../../../chunks/dev.js";
import { D as Upload, F as Alert, N as Icon, P as Alert_description, y as toast } from "../../../../../chunks/client.js";
import { s as organizations } from "../../../../../chunks/api.js";
import { n as invalidateAll } from "../../../../../chunks/client2.js";
import "../../../../../chunks/navigation.js";
import { t as Button } from "../../../../../chunks/button.js";
import { n as Label, t as Input } from "../../../../../chunks/input.js";
import { n as Avatar_image, r as Avatar, t as Avatar_fallback } from "../../../../../chunks/avatar.js";
import { t as Copy } from "../../../../../chunks/copy.js";
import { t as Users } from "../../../../../chunks/users.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, r as Card_footer, t as Card_title } from "../../../../../chunks/card.js";
//#region ../../node_modules/.pnpm/@lucide+svelte@0.554.0_svelte@5.55.5_@typescript-eslint+types@8.57.2_/node_modules/@lucide/svelte/dist/icons/calendar-days.svelte
function Calendar_days($$renderer, $$props) {
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
			{ name: "calendar-days" },
			props,
			{
				iconNode: [
					["path", { "d": "M8 2v4" }],
					["path", { "d": "M16 2v4" }],
					["rect", {
						"width": "18",
						"height": "18",
						"x": "3",
						"y": "4",
						"rx": "2"
					}],
					["path", { "d": "M3 10h18" }],
					["path", { "d": "M8 14h.01" }],
					["path", { "d": "M12 14h.01" }],
					["path", { "d": "M16 14h.01" }],
					["path", { "d": "M8 18h.01" }],
					["path", { "d": "M12 18h.01" }],
					["path", { "d": "M16 18h.01" }]
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
//#region src/routes/(protected)/admin/settings/_components/OrganizationsSettings.svelte
function OrganizationsSettings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { activeOrganization } = $$props;
		let editOrgName = "";
		let editOrgSlug = "";
		let editOrgLogo = "";
		let isUpdatingOrg = false;
		let isUploadingLogo = false;
		let error = null;
		const orgInitials = derived(() => activeOrganization.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2));
		const formattedDate = derived(() => new Date(activeOrganization.createdAt).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		}));
		function generateSlug(text) {
			return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		function handleSlugInput(event) {
			editOrgSlug = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
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
				if (!result.success) throw new Error(result.error || "Failed to update organization");
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
		function $$render_inner($$renderer) {
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
												$$renderer.push(`<!---->Shown to members and in API responses.`);
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
									$$renderer.push(`<div class="grid gap-6 lg:grid-cols-[150px_1fr]"><div class="flex flex-col gap-3"><button type="button"${attr_class(`border-border bg-muted/30 group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border transition-colors sm:h-[130px] sm:w-[130px] ${stringify("hover:bg-muted/50")}`)}${attr("disabled", isUpdatingOrg, true)} aria-label="Upload organization icon">`);
									if (Avatar) {
										$$renderer.push("<!--[-->");
										Avatar($$renderer, {
											class: "h-full w-full rounded-xl",
											children: ($$renderer) => {
												if (editOrgLogo) {
													$$renderer.push("<!--[0-->");
													if (Avatar_image) {
														$$renderer.push("<!--[-->");
														Avatar_image($$renderer, {
															src: editOrgLogo,
															alt: activeOrganization.name,
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
														class: "bg-transparent text-3xl font-semibold",
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(orgInitials())}`);
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
									$$renderer.push(`<!----> Replace icon</span></div> `);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></button> <div class="flex flex-wrap gap-2"><input type="file" accept="image/*" class="hidden"/> `);
									Button($$renderer, {
										type: "button",
										variant: "outline",
										size: "sm",
										onclick: () => void 0,
										disabled: isUpdatingOrg,
										children: ($$renderer) => {
											Upload($$renderer, { class: "mr-1.5 h-3.5 w-3.5" });
											$$renderer.push(`<!----> ${escape_html("Replace")}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									if (editOrgLogo) {
										$$renderer.push("<!--[0-->");
										Button($$renderer, {
											type: "button",
											variant: "ghost",
											size: "sm",
											onclick: () => editOrgLogo = "",
											disabled: isUpdatingOrg,
											children: ($$renderer) => {
												$$renderer.push(`<!---->Remove`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <p class="text-muted-foreground max-w-[150px] text-xs leading-5">JPG, PNG, WebP, GIF, or SVG. Max 5MB.</p></div> <div class="grid content-start gap-4 md:grid-cols-2"><div>`);
									Label($$renderer, {
										for: "org-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Display Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
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
									$$renderer.push(`<!----></div> <div>`);
									Label($$renderer, {
										for: "org-slug",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Slug`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="mt-2 flex gap-2">`);
									Input($$renderer, {
										id: "org-slug",
										value: editOrgSlug,
										oninput: handleSlugInput,
										placeholder: "acme-inc",
										class: "flex-1"
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										variant: "outline",
										size: "sm",
										onclick: () => editOrgSlug = generateSlug(editOrgName),
										disabled: !editOrgName.trim(),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Generate`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div>`);
									Label($$renderer, {
										for: "org-id",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Organization ID`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="mt-2 flex gap-2">`);
									Input($$renderer, {
										id: "org-id",
										value: activeOrganization.id,
										disabled: true,
										class: "min-w-0 flex-1 font-mono"
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										variant: "outline",
										size: "icon",
										type: "button",
										class: "shrink-0",
										onclick: () => copyToClipboard(activeOrganization.id),
										children: ($$renderer) => {
											Copy($$renderer, { class: "h-4 w-4" });
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div></div> <div>`);
									Label($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Created`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="border-input bg-muted/30 text-muted-foreground mt-2 flex h-10 items-center gap-2 rounded-md border px-3 text-sm">`);
									Calendar_days($$renderer, { class: "h-4 w-4" });
									$$renderer.push(`<!----> ${escape_html(formattedDate())}</div></div> <div class="text-muted-foreground flex items-center gap-2 text-sm md:col-span-2">`);
									Users($$renderer, { class: "h-4 w-4" });
									$$renderer.push(`<!----> <span>${escape_html(activeOrganization.members.length)} member${escape_html(activeOrganization.members.length !== 1 ? "s" : "")}</span></div> `);
									if (error) {
										$$renderer.push("<!--[0-->");
										if (Alert) {
											$$renderer.push("<!--[-->");
											Alert($$renderer, {
												variant: "destructive",
												class: "md:col-span-2",
												children: ($$renderer) => {
													if (Alert_description) {
														$$renderer.push("<!--[-->");
														Alert_description($$renderer, {
															children: ($$renderer) => {
																$$renderer.push(`<!---->${escape_html(error)}`);
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
									$$renderer.push(`<!--]--></div></div>`);
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
								class: "flex justify-end gap-2 border-t px-6 py-4",
								children: ($$renderer) => {
									Button($$renderer, {
										variant: "outline",
										onclick: () => {
											editOrgName = activeOrganization.name;
											editOrgSlug = activeOrganization.slug;
											editOrgLogo = activeOrganization.metadata?.logo || "";
											error = null;
										},
										disabled: isUpdatingOrg || isUploadingLogo,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Discard`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										onclick: updateOrganization,
										disabled: isUpdatingOrg,
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(isUpdatingOrg ? "Saving..." : "Save changes")}`);
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
//#region src/routes/(protected)/admin/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("193z1pc", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Organization Settings</title>`);
			});
		});
		$$renderer.push(`<div class="grid gap-5">`);
		if (data.activeOrganization) {
			$$renderer.push("<!--[0-->");
			OrganizationsSettings($$renderer, { activeOrganization: data.activeOrganization });
		} else {
			$$renderer.push("<!--[-1-->");
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					children: ($$renderer) => {
						if (Card_content) {
							$$renderer.push("<!--[-->");
							Card_content($$renderer, {
								class: "py-12 text-center",
								children: ($$renderer) => {
									$$renderer.push(`<p class="text-muted-foreground text-lg">No active organization</p> <p class="text-muted-foreground mt-2 text-sm">You need to be added to an organization</p>`);
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
	});
}
//#endregion
export { _page as default };
