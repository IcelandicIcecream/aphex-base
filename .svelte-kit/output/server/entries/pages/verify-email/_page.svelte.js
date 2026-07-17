import { s as derived, u as head } from "../../../chunks/dev.js";
import { t as goto } from "../../../chunks/client2.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
import { t as Button } from "../../../chunks/button.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, t as Card_title } from "../../../chunks/card.js";
//#region src/routes/verify-email/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let callbackUrl = derived(() => page.url.searchParams.get("callbackUrl"));
		head("bbbx7h", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Aphex CMS - Email Verified</title>`);
			});
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
											$$renderer.push(`<!---->Email Verified`);
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
											$$renderer.push(`<!---->Your email has been verified successfully`);
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
								$$renderer.push(`<div class="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center"><p class="font-medium text-green-700 dark:text-green-400">Your email address has been verified. You can now sign in.</p></div> `);
								Button($$renderer, {
									class: "mt-6 w-full",
									onclick: () => goto(callbackUrl() || "/login"),
									children: ($$renderer) => {
										$$renderer.push(`<!---->Continue to Sign In`);
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
		$$renderer.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit</p></div></div>`);
	});
}
//#endregion
export { _page as default };
