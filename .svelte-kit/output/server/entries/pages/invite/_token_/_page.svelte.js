import { s as derived, tt as escape_html, u as head } from "../../../../chunks/dev.js";
import { t as goto } from "../../../../chunks/client2.js";
import "../../../../chunks/navigation.js";
import { t as page } from "../../../../chunks/state.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as Badge } from "../../../../chunks/badge.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, t as Card_title } from "../../../../chunks/card.js";
//#region src/routes/invite/[token]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const token = derived(() => page.params.token);
		head("12nwbd8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Invitation</title>`);
			});
		});
		$$renderer.push(`<div class="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12"><div class="w-full max-w-md">`);
		if (Card) {
			$$renderer.push("<!--[-->");
			Card($$renderer, {
				class: "shadow-lg",
				children: ($$renderer) => {
					if (data.error === "invalid") {
						$$renderer.push("<!--[0-->");
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
												$$renderer.push(`<!---->Invalid Invitation`);
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
									$$renderer.push(`<p class="text-muted-foreground text-center">This invitation link is invalid or has been revoked.</p> `);
									Button($$renderer, {
										class: "mt-6 w-full",
										onclick: () => goto("/login"),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Go to Sign In`);
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
					} else if (data.error === "expired") {
						$$renderer.push("<!--[1-->");
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
												$$renderer.push(`<!---->Invitation Expired`);
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
									$$renderer.push(`<p class="text-muted-foreground text-center">This invitation has expired. Please ask the organization admin to send a new one.</p> `);
									Button($$renderer, {
										class: "mt-6 w-full",
										onclick: () => goto("/login"),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Go to Sign In`);
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
					} else if (data.error === "already_accepted") {
						$$renderer.push("<!--[2-->");
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
												$$renderer.push(`<!---->Already Accepted`);
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
									$$renderer.push(`<p class="text-muted-foreground text-center">This invitation has already been accepted.</p> `);
									Button($$renderer, {
										class: "mt-6 w-full",
										onclick: () => goto("/admin"),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Go to Dashboard`);
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
					} else if (data.error === "email_mismatch") {
						$$renderer.push("<!--[3-->");
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
												$$renderer.push(`<!---->Wrong Account`);
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
									$$renderer.push(`<p class="text-muted-foreground text-center">This invitation was sent to <strong>${escape_html(data.invitation?.email)}</strong>. Please sign in
						with that email address to accept it.</p> `);
									Button($$renderer, {
										class: "mt-6 w-full",
										onclick: () => goto(`/login?callbackUrl=/invite/${token()}`),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Sign In with Different Account`);
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
					} else {
						$$renderer.push("<!--[-1-->");
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
												$$renderer.push(`<!---->You're Invited`);
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
												$$renderer.push(`<!---->Sign in to accept this invitation`);
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
									$$renderer.push(`<div class="space-y-4"><div class="bg-muted/50 rounded-lg p-4 text-center">`);
									if (data.organization) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<p class="text-lg font-semibold">${escape_html(data.organization.name)}</p> <p class="text-muted-foreground text-sm">/${escape_html(data.organization.slug)}</p>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> `);
									if (data.invitation) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											variant: "outline",
											class: "mt-2 capitalize",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(data.invitation.role)}`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></div> <p class="text-muted-foreground text-center text-sm">Create an account with <strong>${escape_html(data.invitation?.email)}</strong> to join this organization.</p> `);
									Button($$renderer, {
										class: "w-full",
										onclick: () => goto(`/login?mode=signup&email=${encodeURIComponent(data.invitation?.email ?? "")}&callbackUrl=/invite/${token()}`),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Create Account to Accept`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										variant: "outline",
										class: "w-full",
										onclick: () => goto(`/login?callbackUrl=/invite/${token()}`),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Already have an account? Sign In`);
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
		$$renderer.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit</p></div></div>`);
	});
}
//#endregion
export { _page as default };
