import { $ as attr, s as derived, tt as escape_html, u as head } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as page } from "../../../chunks/state.js";
import { t as Button } from "../../../chunks/button.js";
import { n as Label, t as Input } from "../../../chunks/input.js";
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
			$$renderer.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit</p> <div class="mt-2 flex justify-center opacity-20"><svg class="h-8 w-8 fill-black dark:fill-white" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0 C17.1474496 14.16905616 25.92496627 35.45820085 34.56640625 55.4140625 C35.34334316 57.19720923 36.12053079 58.98024674 36.89794922 60.76318359 C51.78722595 94.97195072 66.32335778 129.32882671 80.31640625 163.9140625 C80.6444928 164.72450012 80.97257935 165.53493774 81.31060791 166.36993408 C99.98913061 212.53216334 117.78569191 259.01293728 134.00390625 306.1015625 C134.36190811 307.13669983 134.36190811 307.13669983 134.72714233 308.19274902 C137.32766526 315.72906515 139.80262285 323.3004011 142.1171875 330.9296875 C142.43800545 331.95940926 142.43800545 331.95940926 142.76530457 333.00993347 C145.2565569 341.39135358 146.09964488 351.05219488 142.44140625 359.23046875 C139.92789443 362.992009 136.34564423 365.89944351 132.31640625 367.9140625 C124.8558052 368.61421121 118.36839373 368.62364314 112.31640625 363.9140625 C105.53664487 356.69699976 100.652558 348.68983785 95.94140625 340.0390625 C90.47619491 330.29913602 84.93335438 322.05287151 77.31640625 313.9140625 C75.27331056 311.57880549 73.26394666 309.2152832 71.25390625 306.8515625 C70.24519648 305.67152884 69.23608749 304.49183631 68.2265625 303.3125 C67.73816895 302.74112305 67.24977539 302.16974609 66.74658203 301.58105469 C65.40017275 300.01169952 64.04454028 298.45078423 62.6875 296.890625 C48.81582552 280.69615056 38.44623629 261.89870442 27.89111328 243.45849609 C-8.42360388 178.69858879 -8.42360388 178.69858879 -68.08203125 137.78515625 C-79.11186673 135.11741947 -89.899608 136.09230489 -99.68359375 141.9140625 C-115.46806791 152.47947666 -122.3076261 172.13261849 -126.43359375 189.7890625 C-126.73185059 191.06136719 -126.73185059 191.06136719 -127.03613281 192.359375 C-130.16760015 206.71148601 -131.06828893 221.08194412 -130.99609375 235.7265625 C-130.9939386 236.51966827 -130.99178345 237.31277405 -130.98956299 238.12991333 C-131.31394288 266.6844263 -131.31394288 266.6844263 -123.23828125 293.5859375 C-112.95312656 315.60340432 -111.26097095 345.34400812 -119.5 368.0390625 C-124.86779615 381.07766965 -132.78250397 390.79435644 -145.68359375 396.9140625 C-155.27731384 400.41943083 -164.20346687 401.56551213 -174.37109375 401.4140625 C-176.32958252 401.39702271 -176.32958252 401.39702271 -178.32763672 401.37963867 C-197.70054192 400.99323331 -215.16231823 397.0095896 -230.68359375 384.9140625 C-231.37066406 384.41519531 -232.05773437 383.91632813 -232.765625 383.40234375 C-244.80767188 373.97296976 -251.15090869 358.63090674 -253.68359375 343.9140625 C-253.9270261 339.66653687 -253.91464574 335.41789154 -253.93359375 331.1640625 C-253.96453125 329.45089844 -253.96453125 329.45089844 -253.99609375 327.703125 C-254.00125 326.58164062 -254.00640625 325.46015625 -254.01171875 324.3046875 C-254.02106445 323.29438477 -254.03041016 322.28408203 -254.04003906 321.24316406 C-253.25260131 313.88871121 -250.02140677 307.08532381 -247.0859375 300.359375 C-246.73986954 299.55749252 -246.39380157 298.75561005 -246.0372467 297.9294281 C-245.29136983 296.20150738 -244.54396437 294.47424582 -243.79516602 292.74758911 C-241.75797546 288.04789133 -239.73451175 283.34229198 -237.7109375 278.63671875 C-237.0834108 277.17808662 -237.0834108 277.17808662 -236.44320679 275.68998718 C-232.12759637 265.64489937 -227.89599701 255.56528394 -223.68359375 245.4765625 C-223.31303864 244.58933502 -222.94248352 243.70210754 -222.56069946 242.78799438 C-221.05624911 239.1852842 -219.55230259 235.58236459 -218.04930115 231.97904968 C-215.45620988 225.7624217 -212.85713855 219.54832537 -210.25390625 213.3359375 C-199.87599396 188.56875674 -189.53860671 163.78483086 -179.21582031 138.99462891 C-176.70326253 132.96093438 -174.18966694 126.92767262 -171.67578125 120.89453125 C-171.2632309 119.90436005 -170.85068054 118.91418884 -170.42562866 117.89401245 C-168.35461551 112.92351005 -166.28304289 107.95324201 -164.21044922 102.98339844 C-160.33953189 93.69973915 -156.47385511 84.41400336 -152.62658691 75.12051392 C-150.82992691 70.78139762 -149.03030349 66.44351312 -147.23046875 62.10571289 C-146.38199036 60.05847127 -145.53492768 58.01064218 -144.68945312 55.9621582 C-140.72547669 46.35880091 -136.72273166 36.78723512 -132.3203125 27.375 C-132.00310242 26.69433975 -131.68589233 26.0136795 -131.35906982 25.31239319 C-123.25124472 8.26154126 -109.39227096 -6.16254505 -91.68359375 -13.0859375 C-59.99340229 -22.6620319 -26.67593546 -20.59334511 0 0 Z " transform="translate(308.68359375,64.0859375)"></path><path d="M0 0 C18.24717952 9.79342293 31.4582424 26.28742033 37.6171875 45.97265625 C39.90862161 58.10790422 38.62948747 76.77026254 32.3125 87.5625 C31.23887442 89.06398132 30.13305826 90.54284625 29 92 C28.04867187 93.39798828 28.04867187 93.39798828 27.078125 94.82421875 C22.05477616 102.1158627 16.59613089 108.96607145 8 112 C-4.55244493 113.74100692 -12.66496084 107.03937869 -22.140625 99.87890625 C-25.14482573 97.61370274 -28.2068393 95.46853473 -31.33056641 93.37231445 C-44.35072813 84.61921656 -53.55106508 73.69367426 -57 58 C-59.27762162 41.63399726 -53.36243485 19.43955677 -44.1875 5.9375 C-32.8352893 -8.66127096 -15.43371672 -7.37348527 0 0 Z " transform="translate(254,240)"></path></svg></div></div></div>`);
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
