//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/reference-walk.js
/**
* Collect all referenced document IDs from a doc's data. The `schema` and
* `registry` params are accepted for API compatibility but no longer used —
* the unified ref shape makes them unnecessary.
*/
function collectReferenceIds(data, _schema, _registry) {
	const ids = /* @__PURE__ */ new Set();
	walk(data, ids);
	return Array.from(ids);
}
function walk(value, ids) {
	if (value == null) return;
	if (Array.isArray(value)) {
		for (const item of value) walk(item, ids);
		return;
	}
	if (typeof value !== "object") return;
	const obj = value;
	if (obj._type === "reference" && typeof obj._ref === "string" && obj._ref) {
		ids.add(obj._ref);
		return;
	}
	if (obj._type === "image" || obj._type === "file") return;
	for (const key of Object.keys(obj)) {
		if (key.startsWith("_")) continue;
		walk(obj[key], ids);
	}
}
//#endregion
export { collectReferenceIds as t };
