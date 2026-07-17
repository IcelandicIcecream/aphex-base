import { c as element, et as clsx, i as attributes, o as bind_props } from "./dev.js";
import { t as cn } from "./utils2.js";
import { tv } from "tailwind-variants";
//#region ../../node_modules/.pnpm/@aphexcms+ui@0.8.3_bits-ui@2.14.4_@internationalized+date@3.10.0_@sveltejs+kit@2.59.1_@_42b3eea7bb62976d68bdc1205b7cf50b/node_modules/@aphexcms/ui/dist/components/ui/badge/badge.svelte
var badgeVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
		secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
		destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
		outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, href, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		element($$renderer, href ? "a" : "span", () => {
			$$renderer.push(`${attributes({
				"data-slot": "badge",
				href,
				class: clsx(cn(badgeVariants({ variant }), className)),
				...restProps
			})}`);
		}, () => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		});
		bind_props($$props, { ref });
	});
}
//#endregion
export { Badge as t };
