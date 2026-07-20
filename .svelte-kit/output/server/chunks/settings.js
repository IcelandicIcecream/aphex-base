//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/schema-utils/settings.js
/**
* The select options for a settings field, normalized from `StringField.list`'s
* loose shape (bare strings, or `{title, value}` objects) — empty when the field
* isn't a select.
*
* A `DependentList` yields no options: its valid values are a function of another
* field's value, which settings doesn't resolve. The panel renders such a field as a
* free-text input, so the validator must not treat it as a closed set either.
*/
function settingsListItems(field) {
	if (field.type !== "string") return [];
	const list = field.list;
	if (!Array.isArray(list)) return [];
	return list.map((item) => typeof item === "string" ? {
		title: item,
		value: item
	} : item);
}
//#endregion
export { settingsListItems as t };
