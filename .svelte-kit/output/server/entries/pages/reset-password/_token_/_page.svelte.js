import { k as head, e as escape_html } from "../../../../chunks/renderer.js";
import "../../../../chunks/auth-client.js";
import { g as goto } from "../../../../chunks/client.js";
import { B as Button } from "../../../../chunks/button.js";
import { I as Input } from "../../../../chunks/input.js";
import { L as Label } from "../../../../chunks/label.js";
import { C as Card, a as Card_content } from "../../../../chunks/card-content.js";
import { C as Card_description } from "../../../../chunks/card-description.js";
import "clsx";
import { C as Card_header, a as Card_title } from "../../../../chunks/card-title.js";
import { r as resolve } from "../../../../chunks/server2.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let newPassword = "";
    let confirmPassword = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("6q8x5a", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Aphex CMS - Reset Password</title>`);
        });
        $$renderer4.push(`<meta name="description" content="Reset your Aphex CMS account password securely."/>`);
      });
      $$renderer3.push(`<div class="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12"><div class="w-full max-w-md">`);
      if (Card) {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          class: "shadow-lg",
          children: ($$renderer4) => {
            if (Card_header) {
              $$renderer4.push("<!--[-->");
              Card_header($$renderer4, {
                class: "space-y-1",
                children: ($$renderer5) => {
                  if (Card_title) {
                    $$renderer5.push("<!--[-->");
                    Card_title($$renderer5, {
                      class: "text-center text-2xl font-bold",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html("Reset Your Password")}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(` `);
                  if (Card_description) {
                    $$renderer5.push("<!--[-->");
                    Card_description($$renderer5, {
                      class: "text-center",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html("Enter your new password")}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
            $$renderer4.push(` `);
            if (Card_content) {
              $$renderer4.push("<!--[-->");
              Card_content($$renderer4, {
                children: ($$renderer5) => {
                  {
                    $$renderer5.push("<!--[-1-->");
                    $$renderer5.push(`<form class="space-y-4">`);
                    {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]--> <div class="space-y-2">`);
                    Label($$renderer5, {
                      for: "newPassword",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->New Password`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Input($$renderer5, {
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
                    $$renderer5.push(`<!----> <p class="text-muted-foreground text-xs">Must be at least 8 characters long</p></div> <div class="space-y-2">`);
                    Label($$renderer5, {
                      for: "confirmPassword",
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->Confirm Password`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Input($$renderer5, {
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
                    $$renderer5.push(`<!----></div> `);
                    Button($$renderer5, {
                      type: "submit",
                      class: "w-full",
                      disabled: true,
                      children: ($$renderer6) => {
                        {
                          $$renderer6.push("<!--[-1-->");
                        }
                        $$renderer6.push(`<!--]--> Reset Password`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----> `);
                    Button($$renderer5, {
                      type: "button",
                      variant: "ghost",
                      class: "w-full",
                      onclick: () => goto(resolve("/login")),
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->← Back to Login`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></form>`);
                  }
                  $$renderer5.push(`<!--]-->`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push("<!--]-->");
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push("<!--]-->");
            }
          },
          $$slots: { default: true }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit &amp; Better Auth</p></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
