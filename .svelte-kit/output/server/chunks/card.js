import { et as clsx, i as attributes, o as bind_props } from "./dev.js";
import { t as cn } from "./utils2.js";
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card.svelte
function Card($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card",
			class: clsx(cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card-content.svelte
function Card_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-content",
			class: clsx(cn("px-6", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card-description.svelte
function Card_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<p${attributes({
			"data-slot": "card-description",
			class: clsx(cn("text-muted-foreground text-sm", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></p>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card-footer.svelte
function Card_footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-footer",
			class: clsx(cn("flex items-center px-6 [.border-t]:pt-6", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card-header.svelte
function Card_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-header",
			class: clsx(cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/card/card-title.svelte
function Card_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-title",
			class: clsx(cn("leading-none font-semibold", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
export { Card_content as a, Card_description as i, Card_header as n, Card as o, Card_footer as r, Card_title as t };
