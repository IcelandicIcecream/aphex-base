import { c as ensure_array_like, et as escape_html, l as head, o as derived } from "../../../../../../chunks/dev.js";
import { F as Sheet_content, M as Sheet_description, N as Sheet_title, P as Sheet_header, R as Separator, Tt as usePermissions, f as Textarea, j as Root, k as toast, n as confirmDialog, p as Trash_2, v as Pencil } from "../../../../../../chunks/stega.js";
import { o as roles } from "../../../../../../chunks/api.js";
import { n as invalidateAll } from "../../../../../../chunks/client.js";
import "../../../../../../chunks/navigation.js";
import { O as Input, t as Label } from "../../../../../../chunks/label.js";
import { t as Checkbox } from "../../../../../../chunks/checkbox.js";
import { t as Button } from "../../../../../../chunks/button.js";
import { n as Plus, t as SettingsHeaderActions } from "../../../../../../chunks/SettingsHeaderActions.js";
import "../../../../../../chunks/ui.js";
import { t as Badge } from "../../../../../../chunks/badge.js";
import { a as Card_content, o as Card } from "../../../../../../chunks/card.js";
//#region src/routes/(protected)/admin/settings/roles/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const roles$1 = derived(() => data.roles);
		const activeOrganization = derived(() => data.activeOrganization);
		const perms = usePermissions();
		const canManageRoles = derived(() => perms.can("role.manage"));
		let editor = { kind: "closed" };
		let form = {
			name: "",
			description: "",
			capabilities: /* @__PURE__ */ new Set()
		};
		let saving = false;
		const catalog = derived(() => data.capabilityCatalog);
		derived(() => new Map(catalog().map((d) => [d.id, d])));
		const totalCapabilities = derived(() => catalog().length);
		function groupedCapabilities() {
			const groups = /* @__PURE__ */ new Map();
			for (const def of catalog()) {
				const title = def.group ?? "Other";
				(groups.get(title) ?? groups.set(title, []).get(title)).push(def);
			}
			return [...groups.entries()].map(([title, items]) => ({
				title,
				items
			}));
		}
		function roleMemberCount(roleName) {
			return activeOrganization()?.members?.filter((member) => member.role === roleName).length ?? 0;
		}
		function openCreate() {
			form = {
				name: "",
				description: "",
				capabilities: /* @__PURE__ */ new Set()
			};
			editor = { kind: "create" };
		}
		function openEdit(role) {
			form = {
				name: role.name,
				description: role.description ?? "",
				capabilities: new Set(role.capabilities)
			};
			editor = {
				kind: "edit",
				role
			};
		}
		function closeEditor() {
			editor = { kind: "closed" };
		}
		const READ_IMPLIED_BY = {
			"document.create": "document.read",
			"document.update": "document.read",
			"document.delete": "document.read",
			"document.publish": "document.read",
			"document.unpublish": "document.read",
			"asset.upload": "asset.read",
			"asset.delete": "asset.read"
		};
		const WRITES_NEEDING = Object.entries(READ_IMPLIED_BY).reduce((acc, [write, read]) => {
			(acc[read] ??= []).push(write);
			return acc;
		}, {});
		function toggleCapability(cap, next) {
			const updated = new Set(form.capabilities);
			if (next) {
				updated.add(cap);
				const implied = READ_IMPLIED_BY[cap];
				if (implied) updated.add(implied);
			} else {
				if ((WRITES_NEEDING[cap] ?? []).some((w) => updated.has(w))) return;
				updated.delete(cap);
			}
			form.capabilities = updated;
		}
		function isImpliedRead(cap) {
			return (WRITES_NEEDING[cap] ?? []).some((w) => form.capabilities.has(w));
		}
		async function save() {
			saving = true;
			try {
				const capabilities = Array.from(form.capabilities);
				if (editor.kind === "create") {
					if (!form.name.trim()) {
						toast.error("Name is required");
						return;
					}
					const result = await roles.create({
						name: form.name.trim(),
						description: form.description.trim() || null,
						capabilities
					});
					if (!result.success) throw new Error(result.error || "Failed to create role");
					toast.success(`Role "${form.name.trim()}" created`);
				} else if (editor.kind === "edit") {
					const result = await roles.update(editor.role.name, {
						description: form.description.trim() || null,
						capabilities
					});
					if (!result.success) throw new Error(result.error || "Failed to update role");
					toast.success(`Role "${editor.role.name}" updated`);
				}
				closeEditor();
				await invalidateAll();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to save role");
			} finally {
				saving = false;
			}
		}
		async function remove(role) {
			if (!await confirmDialog({
				title: `Delete role "${role.name}"?`,
				description: "This cannot be undone. Members and pending invitations using this role will block the deletion.",
				confirmText: "Delete",
				variant: "destructive"
			})) return;
			try {
				const result = await roles.remove(role.name);
				if (!result.success) throw new Error(result.error || "Failed to delete role");
				toast.success(`Role "${role.name}" deleted`);
				await invalidateAll();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to delete role");
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1qv5ab2", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Aphex CMS - Roles</title>`);
				});
			});
			if (canManageRoles()) {
				$$renderer.push("<!--[0-->");
				SettingsHeaderActions($$renderer, {
					children: ($$renderer) => {
						Button($$renderer, {
							onclick: openCreate,
							class: "shrink-0",
							children: ($$renderer) => {
								Plus($$renderer, { class: "mr-1 h-4 w-4" });
								$$renderer.push(`<!----> New role`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="grid gap-6"><div class="grid gap-4 xl:grid-cols-2"><!--[-->`);
			const each_array = ensure_array_like(roles$1());
			for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
				let role = each_array[$$index_2];
				if (Card) {
					$$renderer.push("<!--[-->");
					Card($$renderer, {
						class: "overflow-hidden",
						children: ($$renderer) => {
							if (Card_content) {
								$$renderer.push("<!--[-->");
								Card_content($$renderer, {
									class: "p-4",
									children: ($$renderer) => {
										$$renderer.push(`<div class="flex items-start justify-between gap-4"><div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h2 class="truncate text-lg font-semibold capitalize">${escape_html(role.name)}</h2> `);
										if (role.isBuiltIn) {
											$$renderer.push("<!--[0-->");
											Badge($$renderer, {
												variant: "secondary",
												class: "text-[10px]",
												children: ($$renderer) => {
													$$renderer.push(`<!---->System`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <span class="text-muted-foreground text-xs">${escape_html(roleMemberCount(role.name))} member${escape_html(roleMemberCount(role.name) === 1 ? "" : "s")}</span></div> `);
										if (role.description) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground mt-1 text-sm">${escape_html(role.description)}</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div> `);
										if (canManageRoles()) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="flex shrink-0 items-center gap-2">`);
											Button($$renderer, {
												variant: "outline",
												size: "sm",
												onclick: () => openEdit(role),
												children: ($$renderer) => {
													Pencil($$renderer, { class: "mr-1 h-3.5 w-3.5" });
													$$renderer.push(`<!----> Edit`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											if (!role.isBuiltIn) {
												$$renderer.push("<!--[0-->");
												Button($$renderer, {
													variant: "outline",
													size: "sm",
													onclick: () => remove(role),
													children: ($$renderer) => {
														Trash_2($$renderer, { class: "text-destructive h-3.5 w-3.5" });
														$$renderer.push(`<!----> <span class="sr-only">Delete</span>`);
													},
													$$slots: { default: true }
												});
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div> `);
										Separator($$renderer, { class: "my-4" });
										$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
										const each_array_1 = ensure_array_like(groupedCapabilities());
										for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
											let group = each_array_1[$$index_1];
											$$renderer.push(`<div class="space-y-2"><p class="text-muted-foreground text-xs font-medium">${escape_html(group.title)}</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
											const each_array_2 = ensure_array_like(group.items);
											for (let $$index = 0, $$length = each_array_2.length; $$index < $$length; $$index++) {
												let def = each_array_2[$$index];
												const enabled = role.capabilities.includes(def.id);
												Badge($$renderer, {
													variant: enabled ? "secondary" : "outline",
													class: enabled ? "bg-primary/10 text-primary border-primary/20 text-xs font-normal" : "bg-muted/20 text-muted-foreground/60 text-xs font-normal",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(def.title)}`);
													},
													$$slots: { default: true }
												});
											}
											$$renderer.push(`<!--]--></div></div>`);
										}
										$$renderer.push(`<!--]--></div>`);
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
			$$renderer.push(`<!--]--></div></div> `);
			if (Root) {
				$$renderer.push("<!--[-->");
				Root($$renderer, {
					open: editor.kind !== "closed",
					onOpenChange: (o) => {
						if (!o) closeEditor();
					},
					children: ($$renderer) => {
						if (Sheet_content) {
							$$renderer.push("<!--[-->");
							Sheet_content($$renderer, {
								class: "flex w-full flex-col gap-0 p-0 sm:max-w-lg",
								children: ($$renderer) => {
									if (Sheet_header) {
										$$renderer.push("<!--[-->");
										Sheet_header($$renderer, {
											class: "border-b p-6",
											children: ($$renderer) => {
												if (Sheet_title) {
													$$renderer.push("<!--[-->");
													Sheet_title($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->${escape_html(editor.kind === "create" ? "Create role" : `Edit "${editor.kind === "edit" ? editor.role.name : ""}"`)}`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Sheet_description) {
													$$renderer.push("<!--[-->");
													Sheet_description($$renderer, {
														children: ($$renderer) => {
															if (editor.kind === "edit" && editor.role.isBuiltIn) {
																$$renderer.push("<!--[0-->");
																$$renderer.push(`Built-in role. Capabilities can be tuned; the name is fixed.`);
															} else {
																$$renderer.push("<!--[-1-->");
																$$renderer.push(`Pick the capabilities this role grants. Members assigned to this role will gain every
					checked permission.`);
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
									$$renderer.push(` <div class="flex-1 space-y-6 overflow-y-auto p-6"><div class="space-y-2">`);
									Label($$renderer, {
										for: "role-name",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Name`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "role-name",
										disabled: editor.kind === "edit",
										placeholder: "e.g. translator",
										get value() {
											return form.name;
										},
										set value($$value) {
											form.name = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> `);
									if (editor.kind === "create") {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-muted-foreground text-xs">Letters, numbers, spaces, hyphens, or underscores. Used when assigning members.</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <div class="space-y-2">`);
									Label($$renderer, {
										for: "role-description",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Description`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Textarea($$renderer, {
										id: "role-description",
										placeholder: "What does this role do?",
										rows: 2,
										get value() {
											return form.description;
										},
										set value($$value) {
											form.description = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> `);
									Separator($$renderer, {});
									$$renderer.push(`<!----> <div class="space-y-4"><div class="flex items-center justify-between">`);
									Label($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Capabilities`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <span class="text-muted-foreground text-xs">${escape_html(form.capabilities.size)} of ${escape_html(totalCapabilities())} selected</span></div> <!--[-->`);
									const each_array_3 = ensure_array_like(groupedCapabilities());
									for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
										let group = each_array_3[$$index_4];
										$$renderer.push(`<div class="space-y-2"><p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">${escape_html(group.title)}</p> <div class="grid gap-2"><!--[-->`);
										const each_array_4 = ensure_array_like(group.items);
										for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
											let def = each_array_4[$$index_3];
											const implied = isImpliedRead(def.id);
											$$renderer.push(`<label class="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2">`);
											Checkbox($$renderer, {
												checked: form.capabilities.has(def.id),
												disabled: implied,
												onCheckedChange: (v) => toggleCapability(def.id, v === true)
											});
											$$renderer.push(`<!----> <div class="flex-1"><p class="text-sm font-medium">${escape_html(def.title)}</p> `);
											if (def.description) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground text-xs">${escape_html(def.description)}</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> <p class="text-muted-foreground/70 font-mono text-[10px]">${escape_html(def.id)}</p></div></label>`);
										}
										$$renderer.push(`<!--]--></div></div>`);
									}
									$$renderer.push(`<!--]--></div></div> <div class="flex items-center justify-end gap-2 border-t p-6">`);
									Button($$renderer, {
										variant: "outline",
										onclick: closeEditor,
										disabled: saving,
										children: ($$renderer) => {
											$$renderer.push(`<!---->Cancel`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										onclick: save,
										disabled: saving,
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(saving ? "Saving..." : editor.kind === "create" ? "Create role" : "Save changes")}`);
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
