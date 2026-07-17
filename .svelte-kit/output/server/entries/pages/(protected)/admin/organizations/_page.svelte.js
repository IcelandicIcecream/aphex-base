import { p as spread_props, s as derived, tt as escape_html, u as head } from "../../../../../chunks/dev.js";
import { _ as Dialog_footer, f as Root, g as Dialog_header, h as Dialog_content, m as Dialog_description, p as Dialog_trigger, v as Dialog_title } from "../../../../../chunks/client.js";
import "../../../../../chunks/navigation.js";
import { t as page } from "../../../../../chunks/state.js";
import { t as Button } from "../../../../../chunks/button.js";
import { n as Label, t as Input } from "../../../../../chunks/input.js";
import { t as OrganizationsList } from "../../../../../chunks/OrganizationsList.js";
//#region src/routes/(protected)/admin/organizations/_components/CreateOrganization.svelte
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
//#region src/routes/(protected)/admin/organizations/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const userRole = derived(() => page.data?.sidebarData?.user?.role);
		const isSuperAdmin = derived(() => userRole() === "super_admin");
		head("2j3l05", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Organizations</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"><div class="mx-auto flex w-full max-w-6xl items-center justify-between"><div><h1 class="text-3xl font-semibold">Organizations</h1> <p class="text-muted-foreground">Manage your organizations</p></div> `);
		if (isSuperAdmin()) {
			$$renderer.push("<!--[0-->");
			CreateOrganization($$renderer, {});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="mx-auto grid w-full max-w-6xl gap-6">`);
		OrganizationsList($$renderer, { orgs: data.organizations });
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
export { _page as default };
