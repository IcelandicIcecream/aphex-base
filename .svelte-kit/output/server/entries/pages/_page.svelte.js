import { c as ensure_array_like, et as escape_html } from "../../chunks/dev.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<main class="svelte-1uha8ag"><div class="header svelte-1uha8ag"><h1 class="svelte-1uha8ag">Pages</h1> <a class="studio-btn svelte-1uha8ag" href="/admin">Go to Studio →</a></div> <p>Content read from the CMS via the Local API — see <code>src/routes/+page.server.ts</code>.</p> `);
		if (data.pages.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="empty svelte-1uha8ag"><p>No published pages yet.</p> <p>Go to <a href="/admin">/admin</a>, create a <code>page</code> document, and publish it — it'll
				show up here.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<ul class="svelte-1uha8ag"><!--[-->`);
			const each_array = ensure_array_like(data.pages);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let page = each_array[$$index];
				$$renderer.push(`<li class="svelte-1uha8ag"><h2 class="svelte-1uha8ag">${escape_html(page.title ?? "Untitled")}</h2> `);
				if (page.slug) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="slug svelte-1uha8ag">/${escape_html(page.slug)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (page.body) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p>${escape_html(page.body)}</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></main>`);
	});
}
//#endregion
export { _page as default };
