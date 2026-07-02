import { k as head, d as derived } from "../../../chunks/renderer.js";
import { g as goto } from "../../../chunks/client.js";
import { p as page } from "../../../chunks/index3.js";
import { B as Button } from "../../../chunks/button.js";
import { C as Card, a as Card_content } from "../../../chunks/card-content.js";
import { C as Card_description } from "../../../chunks/card-description.js";
import "clsx";
import { C as Card_header, a as Card_title } from "../../../chunks/card-title.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let callbackUrl = derived(() => page.url.searchParams.get("callbackUrl"));
    head("bbbx7h", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Aphex CMS - Email Verified</title>`);
      });
    });
    $$renderer2.push(`<div class="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12"><div class="w-full max-w-md">`);
    if (Card) {
      $$renderer2.push("<!--[-->");
      Card($$renderer2, {
        class: "shadow-lg",
        children: ($$renderer3) => {
          if (Card_header) {
            $$renderer3.push("<!--[-->");
            Card_header($$renderer3, {
              class: "space-y-1",
              children: ($$renderer4) => {
                if (Card_title) {
                  $$renderer4.push("<!--[-->");
                  Card_title($$renderer4, {
                    class: "text-center text-2xl font-bold",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Email Verified`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
                $$renderer4.push(` `);
                if (Card_description) {
                  $$renderer4.push("<!--[-->");
                  Card_description($$renderer4, {
                    class: "text-center",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Your email has been verified successfully`);
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
          $$renderer3.push(` `);
          if (Card_content) {
            $$renderer3.push("<!--[-->");
            Card_content($$renderer3, {
              children: ($$renderer4) => {
                $$renderer4.push(`<div class="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center"><p class="font-medium text-green-700 dark:text-green-400">Your email address has been verified. You can now sign in.</p></div> `);
                Button($$renderer4, {
                  class: "mt-6 w-full",
                  onclick: () => goto(callbackUrl() || "/login"),
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->Continue to Sign In`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        },
        $$slots: { default: true }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    $$renderer2.push(` <p class="text-muted-foreground mt-6 text-center text-xs">Aphex CMS - Built with SvelteKit</p></div></div>`);
  });
}
export {
  _page as default
};
