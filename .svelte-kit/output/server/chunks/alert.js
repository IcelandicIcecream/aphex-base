import { $ as clsx, a as bind_props, i as attributes } from "./dev.js";
import { t as cn } from "./utils3.js";
import { tv } from "tailwind-variants";
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/alert/alert.svelte
var alertVariants = tv({
	base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert",
			class: clsx(cn(alertVariants({ variant }), className)),
			...restProps,
			role: "alert"
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/alert/alert-description.svelte
function Alert_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-description",
			class: clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.18.1_@internationalized+date@3.12.2_@sveltejs+kit@2.59.1_@_edf5374d0cfee3716c8c36a617b516d5/node_modules/@aphexcms/ui/dist/components/ui/alert/alert-title.svelte
function Alert_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-title",
			class: clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
export { Alert_description as n, Alert as r, Alert_title as t };
