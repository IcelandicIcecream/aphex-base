import { c as head, d as spread_props, k as escape_html, wt as run } from "../../../../chunks/server2.js";
import "../../../../chunks/internal.js";
import { t as instance } from "../../../../chunks/api.js";
import "../../../../chunks/navigation.js";
import { i as Switch } from "../../../../chunks/stega.js";
import { O as Input, t as Label } from "../../../../chunks/label.js";
import { a as Dialog_header, i as Dialog_content, n as Dialog_trigger, o as Dialog_footer, r as Dialog_description, s as Dialog_title, t as Root } from "../../../../chunks/dialog.js";
import { t as Button } from "../../../../chunks/button.js";
import "../../../../chunks/ui.js";
import { t as OrganizationsList } from "../../../../chunks/OrganizationsList.js";
import "../../../../chunks/api2.js";
//#region src/routes/god-mode/_components/CreateOrganization.svelte
function CreateOrganization($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let open = false;
		let name = "";
		let slug = "";
		let isSubmitting = false;
		let error = null;
		function generateSlug(text) {
			return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		function handleNameInput(event) {
			name = event.target.value;
			if (!slug || slug === generateSlug(name.slice(0, -1))) slug = generateSlug(name);
		}
		function handleSlugInput(event) {
			slug = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
		}
		function resetForm() {
			name = "";
			slug = "";
			error = null;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Root) {
				$$renderer.push("<!--[-->");
				Root($$renderer, {
					onOpenChange: (v) => !v && resetForm(),
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					children: ($$renderer) => {
						{
							function child($$renderer, { props }) {
								Button($$renderer, spread_props([props, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->Create Organization`);
									},
									$$slots: { default: true }
								}]));
							}
							if (Dialog_trigger) {
								$$renderer.push("<!--[-->");
								Dialog_trigger($$renderer, {
									child,
									$$slots: { child: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						}
						$$renderer.push(` `);
						if (Dialog_content) {
							$$renderer.push("<!--[-->");
							Dialog_content($$renderer, {
								class: "sm:max-w-[480px]",
								children: ($$renderer) => {
									if (Dialog_header) {
										$$renderer.push("<!--[-->");
										Dialog_header($$renderer, {
											children: ($$renderer) => {
												if (Dialog_title) {
													$$renderer.push("<!--[-->");
													Dialog_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Create Organization`);
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
															$$renderer.push(`<!---->Create a new organization for your instance`);
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
									$$renderer.push(` <form class="grid gap-4 py-4"><div>`);
									Label($$renderer, {
										for: "org-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Organization name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "org-name",
										value: name,
										oninput: handleNameInput,
										placeholder: "My Organization",
										disabled: isSubmitting,
										class: "mt-1"
									});
									$$renderer.push(`<!----></div> <div>`);
									Label($$renderer, {
										for: "org-slug",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Slug`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <div class="mt-1 flex gap-2">`);
									Input($$renderer, {
										id: "org-slug",
										value: slug,
										oninput: handleSlugInput,
										placeholder: "my-organization",
										disabled: isSubmitting,
										class: "flex-1"
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										type: "button",
										variant: "outline",
										size: "sm",
										onclick: () => slug = generateSlug(name),
										disabled: !name.trim() || isSubmitting,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Generate`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <p class="text-muted-foreground mt-1 text-xs">Lowercase letters, numbers, and hyphens only.</p></div> `);
									if (error) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-destructive text-sm">${escape_html(error)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (Dialog_footer) {
										$$renderer.push("<!--[-->");
										Dialog_footer($$renderer, {
											children: ($$renderer) => {
												Button($$renderer, {
													type: "button",
													variant: "outline",
													onclick: () => open = false,
													disabled: isSubmitting,
													children: ($$renderer) => {
														$$renderer.push(`<!---->Cancel`);
													},
													$$slots: { default: true }
												});
												$$renderer.push(`<!----> `);
												Button($$renderer, {
													type: "submit",
													disabled: !name.trim(),
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html("Create")}`);
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
									$$renderer.push(`</form>`);
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
//#region src/routes/god-mode/organizations/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let allowUserOrgCreation = run(() => data.instanceSettings?.allowUserOrgCreation ?? false);
		let saving = false;
		async function toggleOrgCreation(checked) {
			saving = true;
			try {
				const result = await instance.updateSettings({ allowUserOrgCreation: checked });
				if (result.success && result.data) allowUserOrgCreation = result.data.allowUserOrgCreation ?? false;
			} catch (error) {
				console.error("Failed to update instance settings:", error);
				allowUserOrgCreation = !checked;
			} finally {
				saving = false;
			}
		}
		head("39xsce", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Organizations</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-8"><div class="hidden sm:block"><h2 class="text-xl font-semibold">Organizations on this instance</h2> <p class="text-muted-foreground text-sm">See all organizations and control who can create them.</p></div> <div><div class="mb-4 flex items-center justify-between"><h3 class="text-lg font-medium">In this instance <span class="text-muted-foreground ml-1">· ${escape_html(data.organizations.length)}</span></h3> `);
		CreateOrganization($$renderer, {});
		$$renderer.push(`<!----></div> `);
		OrganizationsList($$renderer, { orgs: data.organizations });
		$$renderer.push(`<!----></div> <div class="flex items-center justify-between rounded-lg border p-4"><div class="space-y-0.5">`);
		Label($$renderer, {
			for: "prevent-org-creation",
			class: "text-base font-medium",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Prevent anyone else from creating an organization.`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <p class="text-muted-foreground text-sm">Toggling this on will let only you create organizations. You will have to invite users to
				new organizations.</p></div> `);
		Switch($$renderer, {
			id: "prevent-org-creation",
			checked: !allowUserOrgCreation,
			onCheckedChange: (checked) => toggleOrgCreation(!checked),
			disabled: saving
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _page as default };
