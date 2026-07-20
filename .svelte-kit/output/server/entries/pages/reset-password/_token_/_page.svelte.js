import { et as escape_html, l as head } from "../../../../chunks/dev.js";
import { s as resolve, t as goto } from "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import "../../../../chunks/state.js";
import { O as Input, t as Label } from "../../../../chunks/label.js";
import { t as Button } from "../../../../chunks/button.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, t as Card_title } from "../../../../chunks/card.js";
import "../../../../chunks/auth-client.js";
//#region src/routes/reset-password/[token]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let newPassword = "";
		let confirmPassword = "";
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("6q8x5a", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Aphex CMS - Reset Password</title>`);
				});
				$$renderer.push(`<meta name="description" content="Reset your Aphex CMS account password securely."/>`);
			});
			$$renderer.push(`<div class="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12"><div class="w-full max-w-md">`);
			if (Card) {
				$$renderer.push("<!--[-->");
				Card($$renderer, {
					class: "shadow-lg",
					children: ($$renderer) => {
						if (Card_header) {
							$$renderer.push("<!--[-->");
							Card_header($$renderer, {
								class: "space-y-1",
								children: ($$renderer) => {
									if (Card_title) {
										$$renderer.push("<!--[-->");
										Card_title($$renderer, {
											class: "text-center text-2xl font-bold",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html("Reset Your Password")}`);
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
											class: "text-center",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html("Enter your new password")}`);
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
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<form class="space-y-4">`);
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div class="space-y-2">`);
									Label($$renderer, {
										for: "newPassword",
										children: ($$renderer) => {
											$$renderer.push(`<!---->New Password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "newPassword",
										type: "password",
										placeholder: "••••••••",
										required: true,
										autocomplete: "new-password",
										disabled: true,
										get value() {
											return newPassword;
										},
										set value($$value) {
											newPassword = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----> <p class="text-muted-foreground text-xs">Must be at least 8 characters long</p></div> <div class="space-y-2">`);
									Label($$renderer, {
										for: "confirmPassword",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Confirm Password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Input($$renderer, {
										id: "confirmPassword",
										type: "password",
										placeholder: "••••••••",
										required: true,
										autocomplete: "new-password",
										disabled: true,
										get value() {
											return confirmPassword;
										},
										set value($$value) {
											confirmPassword = $$value;
											$$settled = false;
										}
									});
									$$renderer.push(`<!----></div> `);
									Button($$renderer, {
										type: "submit",
										class: "w-full",
										disabled: true,
										children: ($$renderer) => {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--> Reset Password`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										type: "button",
										variant: "ghost",
										class: "w-full",
										onclick: () => goto(resolve("/login")),
										children: ($$renderer) => {
											$$renderer.push(`<!---->← Back to Login`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></form>`);
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
			$$renderer.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit &amp; Better Auth</p></div></div>`);
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
