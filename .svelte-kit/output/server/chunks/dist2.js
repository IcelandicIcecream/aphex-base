import { S as setContext, b as getContext } from "./server2.js";
import "./internal.js";
import "./navigation.js";
import { t as y } from "./dist3.js";
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.1_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_5196feba14d871d2b87bc80bb1ad8f58/node_modules/@aphexcms/visual-editing/dist/live-preview.svelte.js
var KEY = Symbol("aphex:live-preview");
var LivePreviewContext = class {
	current = null;
	currentType = null;
	currentId = null;
};
function setLivePreviewContext() {
	const ctx = new LivePreviewContext();
	setContext(KEY, ctx);
	return ctx;
}
/**
* Returns the live preview document context set by <AphexVisualOverlay>.
* `preview.current` is null until the CMS pushes data via postMessage.
* Use as: `const post = $derived(preview.current ?? data.post)`
*/
function getLivePreviewDocument() {
	return getContext(KEY) ?? new LivePreviewContext();
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.1_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_5196feba14d871d2b87bc80bb1ad8f58/node_modules/@aphexcms/visual-editing/dist/stega.js
/**
* Stamp a navigation payload onto a string as invisible stega characters.
*
* The CMS auto-encodes a document's own string fields, but values that aren't
* literally in the document — a resolved `reference` label, a denormalized
* title — have nothing to stamp. Encode those at render time so the overlay
* treats them like any other clickable field. Returns the value unchanged if
* it's empty.
*/
function stegaEncode(value, payload) {
	if (!value) return value;
	return y(value, payload);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.1_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_5196feba14d871d2b87bc80bb1ad8f58/node_modules/@aphexcms/visual-editing/dist/AphexVisualOverlay.svelte
function AphexVisualOverlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Whether to use stega encoding for auto-detecting fields.
		* Must match the setting in DocumentEditor / aphex.config.ts. Default: true.
		*/
		let { stega = true, children } = $$props;
		setLivePreviewContext();
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.1_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_5196feba14d871d2b87bc80bb1ad8f58/node_modules/@aphexcms/visual-editing/dist/merge-derived.js
/**
* Carrying server-derived data across the live-preview swap.
*
* ## The problem
*
* `usePreview().live(fallback)` hands the page the document the studio is
* holding, so an editor sees their keystrokes immediately. That document comes
* straight from the editor's form state: it has never been through a page load,
* and so it carries only what the schema declares.
*
* Real pages need more than that. Server-side loads routinely *derive* data and
* attach it to the document — the posts an archive block queries for, the form a
* form block embeds, a resolved reference, a computed URL. By convention those
* are underscore-prefixed (`_posts`, `_form`) precisely because they exist in no
* schema and are never written back.
*
* Swapping the whole document therefore drops all of it, and the block renders
* empty. That is the worst possible failure to show an author: an archive that
* says "no posts" in preview while the published page lists twelve, with nothing
* on screen to suggest the difference is preview itself.
*
* ## The rule
*
* Keep the live document, and restore only keys that are **underscore-prefixed**,
* **not structural**, and **absent from the live document**.
*
* Each condition is load-bearing:
*
* - *Underscore-prefixed* is what separates derived data from authored content.
*   An authored field is never underscore-prefixed, so clearing one in the editor
*   still clears it in preview — a naive "fill in whatever's missing" merge would
*   resurrect every value the author just deleted, which is a far worse bug than
*   the one being fixed.
* - *Not structural* excludes `_type`, `_key` and `_ref`, which describe the
*   document rather than decorate it. They're always present on the live document
*   anyway; excluding them explicitly means this can't quietly rewrite a block's
*   identity if that ever stops being true.
* - *Absent* means this only fills gaps. Once preview and load agree on a key,
*   the live value wins.
*
* Arrays are matched by `_key`, the stable per-item identity, so reordering,
* inserting and deleting rows all behave.
*
* Derived values are necessarily one load stale — change an archive's category
* filter and it keeps showing the previous query's posts until the page reloads.
* That is the right trade: stale-but-real content beats an empty grid, and every
* authored field around it still updates live.
*/
/** Structural keys: identity, not decoration. Never copied. */
var STRUCTURAL = /* @__PURE__ */ new Set([
	"_type",
	"_key",
	"_ref",
	"_id",
	"_rev"
]);
function isPlainObject(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function isDerivedKey(key) {
	return key.startsWith("_") && !STRUCTURAL.has(key);
}
function mergeArrays(live, fallback) {
	const byKey = /* @__PURE__ */ new Map();
	for (const item of fallback) if (isPlainObject(item) && typeof item._key === "string") byKey.set(item._key, item);
	return live.map((item, index) => {
		if (!isPlainObject(item)) return item;
		const match = (typeof item._key === "string" ? byKey.get(item._key) : void 0) ?? (live.length === fallback.length && isPlainObject(fallback[index]) ? fallback[index] : void 0);
		return match ? mergeNode(item, match) : item;
	});
}
function mergeNode(live, fallback) {
	let next = null;
	for (const key of Object.keys(fallback)) {
		if (!isDerivedKey(key)) continue;
		if (live[key] !== void 0) continue;
		next ??= { ...live };
		next[key] = fallback[key];
	}
	for (const key of Object.keys(live)) {
		const liveValue = live[key];
		const fallbackValue = fallback[key];
		if (Array.isArray(liveValue) && Array.isArray(fallbackValue)) {
			const merged = mergeArrays(liveValue, fallbackValue);
			if (merged.some((item, i) => item !== liveValue[i])) {
				next ??= { ...live };
				next[key] = merged;
			}
		} else if (isPlainObject(liveValue) && isPlainObject(fallbackValue)) {
			const merged = mergeNode(liveValue, fallbackValue);
			if (merged !== liveValue) {
				next ??= { ...live };
				next[key] = merged;
			}
		}
	}
	return next ?? live;
}
/**
* Merge server-derived data from `fallback` into the live document.
*
* Returns `live` unchanged (same identity) when there is nothing to restore.
*/
function mergeDerived(live, fallback) {
	if (!isPlainObject(live) || !isPlainObject(fallback)) return live;
	return mergeNode(live, fallback);
}
//#endregion
//#region ../../node_modules/.pnpm/@aphexcms+visual-editing@0.3.1_@sveltejs+kit@2.70.2_@opentelemetry+api@1.9.0_@sveltejs+_5196feba14d871d2b87bc80bb1ad8f58/node_modules/@aphexcms/visual-editing/dist/use-preview.svelte.js
var PT_FIELD_KEY = Symbol("aphex:pt-field");
/**
* One-call visual-editing helper for a page or component. Reads the context set by
* `<AphexVisualOverlay>` (and any Portable Text field context). Call once during init.
*
* @example
* const ve = usePreview();
* const post = $derived(ve.live(data.post));
* const cover = $derived(ve.image(post.coverImage));
* // <time datetime={ve.encode(post.postDate, { field: 'postDate' })}>
* // <img src={cover.src} alt={ve.encode(cover.alt, { field: 'coverImage' })} />
*/
function usePreview() {
	const ctx = getLivePreviewDocument();
	const ptField = getContext(PT_FIELD_KEY);
	return {
		get inPreview() {
			return ctx.current != null;
		},
		get document() {
			return ctx.current;
		},
		get documentType() {
			return ctx.currentType;
		},
		live(fallback, options = {}) {
			if (options.type && ctx.currentType !== options.type) return fallback;
			if (options.id && ctx.currentId !== options.id) return fallback;
			if (ctx.current == null) return fallback;
			return mergeDerived(ctx.current, fallback);
		},
		encode(value, payload = {}) {
			const raw = value ?? "";
			if (ctx.current == null) return raw;
			const field = payload.field ?? ptField?.();
			if (!field) return raw;
			return stegaEncode(raw || " ", {
				...payload,
				field
			});
		},
		edit(target) {
			const attrs = {};
			if (ctx.current == null) return attrs;
			attrs["data-aphex-field"] = target.field ?? "title";
			if (target.id && target.type) {
				attrs["data-aphex-document-id"] = target.id;
				attrs["data-aphex-document-type"] = target.type;
			}
			if (target.arrayIndex != null) attrs["data-aphex-array-index"] = String(target.arrayIndex);
			return attrs;
		},
		image(img) {
			return {
				src: img?.asset?.url ?? null,
				alt: img?.alt || img?.asset?.alt || ""
			};
		}
	};
}
//#endregion
export { AphexVisualOverlay as n, usePreview as t };
