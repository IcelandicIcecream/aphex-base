import { D as attr, a as derived, c as head, k as escape_html } from "../../../chunks/server2.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
import { O as Input, t as Label } from "../../../chunks/label.js";
import { t as Button } from "../../../chunks/button.js";
import { a as Card_content, i as Card_description, n as Card_header, o as Card, r as Card_footer, t as Card_title } from "../../../chunks/card.js";
import { t as authClient } from "../../../chunks/auth-client.js";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const initialMode = page.url.searchParams.get("mode") === "signup" ? "signup" : "signin";
		const prefilledEmail = page.url.searchParams.get("email") ?? "";
		const emailLocked = prefilledEmail.length > 0 && initialMode === "signup";
		let email = prefilledEmail;
		let password = "";
		let error = "";
		let loading = false;
		let mode = initialMode;
		let resetSuccess = "";
		let signupSuccess = false;
		let unverifiedEmail = "";
		let resendLoading = false;
		let resendMessage = "";
		let resendCooldown = 0;
		const RESEND_COOLDOWN_SECONDS = 60;
		derived(() => page.url.searchParams.get("callbackUrl"));
		function setMode(newMode) {
			mode = newMode;
			error = "";
			resetSuccess = "";
			resendMessage = "";
			unverifiedEmail = "";
		}
		async function handleResendVerification(targetEmail) {
			if (!targetEmail || resendCooldown > 0) return;
			resendLoading = true;
			resendMessage = "";
			try {
				const result = await authClient.sendVerificationEmail({
					email: targetEmail,
					callbackURL: "/admin"
				});
				if (result.error) resendMessage = result.error.message || "Failed to resend verification email";
				else resendMessage = `Verification email sent to ${targetEmail}.`;
			} catch (err) {
				resendMessage = err instanceof Error ? err.message : "Failed to resend verification email";
			} finally {
				resendLoading = false;
				startResendCooldown();
			}
		}
		function startResendCooldown() {
			resendCooldown = RESEND_COOLDOWN_SECONDS;
			const interval = setInterval(() => {
				resendCooldown -= 1;
				if (resendCooldown <= 0) {
					clearInterval(interval);
					resendCooldown = 0;
				}
			}, 1e3);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1x05zx6", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(mode === "signin" ? "Aphex CMS - Sign In" : "Aphex CMS - Sign Up")}</title>`);
				});
				$$renderer.push(`<meta name="description"${attr("content", mode === "signin" ? "Sign in to your Aphex CMS dashboard to manage your content and organizations." : "Create a new account to get started with Aphex CMS and manage your content.")}/>`);
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
												$$renderer.push(`<!---->${escape_html(mode === "reset-password" ? "Reset Password" : mode === "signin" ? "Sign In" : "Create Account")}`);
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
												$$renderer.push(`<!---->${escape_html(mode === "reset-password" ? "Enter your email to receive a reset link" : mode === "signin" ? "Access your CMS dashboard" : "Get started with Aphex CMS")}`);
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
									if (signupSuccess) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="space-y-4"><div class="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center"><p class="font-medium text-green-700 dark:text-green-400">Account created! Check your email to verify your address.</p> <p class="text-muted-foreground mt-2 text-sm">We sent a verification link to <strong>${escape_html(email)}</strong></p></div> `);
										if (resendMessage) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="bg-muted/50 rounded-lg border p-3"><p class="text-muted-foreground text-sm">${escape_html(resendMessage)}</p></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										Button($$renderer, {
											type: "button",
											variant: "outline",
											class: "w-full",
											disabled: resendLoading || resendCooldown > 0,
											onclick: () => handleResendVerification(email),
											children: ($$renderer) => {
												if (resendLoading) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`Sending…`);
												} else if (resendCooldown > 0) {
													$$renderer.push("<!--[1-->");
													$$renderer.push(`Resend in ${escape_html(resendCooldown)}s`);
												} else {
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`Didn't get the email? Resend`);
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Button($$renderer, {
											variant: "ghost",
											class: "w-full",
											onclick: () => {
												signupSuccess = false;
												setMode("signin");
											},
											children: ($$renderer) => {
												$$renderer.push(`<!---->Back to Sign In`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----></div>`);
									} else {
										$$renderer.push("<!--[-1-->");
										$$renderer.push(`<form class="space-y-4">`);
										if (resetSuccess) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="rounded-lg border border-green-500/50 bg-green-500/10 p-3"><p class="text-sm font-medium text-green-700 dark:text-green-400">${escape_html(resetSuccess)}</p></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (error) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="border-destructive/50 bg-destructive/10 space-y-2 rounded-lg border p-3"><p class="text-destructive text-sm font-medium">${escape_html(error)}</p> `);
											if (unverifiedEmail) {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<button type="button" class="text-primary text-xs font-medium hover:underline disabled:opacity-50"${attr("disabled", resendLoading || resendCooldown > 0, true)}>`);
												if (resendLoading) {
													$$renderer.push("<!--[0-->");
													$$renderer.push(`Sending…`);
												} else if (resendCooldown > 0) {
													$$renderer.push("<!--[1-->");
													$$renderer.push(`Resend in ${escape_html(resendCooldown)}s`);
												} else {
													$$renderer.push("<!--[-1-->");
													$$renderer.push(`Resend verification email`);
												}
												$$renderer.push(`<!--]--></button>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										if (resendMessage) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="bg-muted/50 rounded-lg border p-3"><p class="text-muted-foreground text-sm">${escape_html(resendMessage)}</p></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> <div class="space-y-2">`);
										Label($$renderer, {
											for: "email",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Email`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										Input($$renderer, {
											id: "email",
											type: "email",
											placeholder: "you@example.com",
											required: true,
											autocomplete: "email",
											readonly: emailLocked,
											get value() {
												return email;
											},
											set value($$value) {
												email = $$value;
												$$settled = false;
											}
										});
										$$renderer.push(`<!----> `);
										if (emailLocked) {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<p class="text-muted-foreground text-xs">Locked to match your invitation.</p>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></div> `);
										if (mode !== "reset-password") {
											$$renderer.push("<!--[0-->");
											$$renderer.push(`<div class="space-y-2"><div class="flex items-center justify-between">`);
											Label($$renderer, {
												for: "password",
												children: ($$renderer) => {
													$$renderer.push(`<!---->Password`);
												},
												$$slots: { default: true }
											});
											$$renderer.push(`<!----> `);
											if (mode === "signin") {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<button type="button" class="text-primary text-xs hover:underline">Forgot password?</button>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div> `);
											Input($$renderer, {
												id: "password",
												type: "password",
												placeholder: "••••••••",
												required: true,
												autocomplete: mode === "signin" ? "current-password" : "new-password",
												get value() {
													return password;
												},
												set value($$value) {
													password = $$value;
													$$settled = false;
												}
											});
											$$renderer.push(`<!----> `);
											if (mode === "signup") {
												$$renderer.push("<!--[0-->");
												$$renderer.push(`<p class="text-muted-foreground text-xs">Must be at least 8 characters long</p>`);
											} else $$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--]--></div>`);
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--> `);
										Button($$renderer, {
											type: "submit",
											class: "w-full",
											disabled: loading,
											children: ($$renderer) => {
												$$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]-->${escape_html(mode === "reset-password" ? "Send Reset Link" : mode === "signin" ? "Sign In" : "Sign Up")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> `);
										if (mode === "reset-password") {
											$$renderer.push("<!--[0-->");
											Button($$renderer, {
												type: "button",
												variant: "ghost",
												class: "w-full",
												onclick: () => setMode("signin"),
												children: ($$renderer) => {
													$$renderer.push(`<!---->← Back to Sign In`);
												},
												$$slots: { default: true }
											});
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]--></form>`);
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
						$$renderer.push(` `);
						if (Card_footer) {
							$$renderer.push("<!--[-->");
							Card_footer($$renderer, {
								class: "flex flex-col space-y-4",
								children: ($$renderer) => {
									if (!signupSuccess && mode !== "reset-password") {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<div class="relative"><div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div> <div class="relative flex justify-center text-xs uppercase"><span class="bg-card text-muted-foreground px-2">${escape_html(mode === "signin" ? "New to Aphex?" : "Already have an account?")}</span></div></div> `);
										Button($$renderer, {
											type: "button",
											variant: "outline",
											class: "w-full",
											onclick: () => setMode(mode === "signin" ? "signup" : "signin"),
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(mode === "signin" ? "Create an account" : "Sign in instead")}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!---->`);
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
			$$renderer.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit</p> <div class="mt-2 flex justify-center"><img src="/favicon.svg" alt="Aphex CMS" class="h-8 w-8"/></div></div></div>`);
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
