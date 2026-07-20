//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.7.0_2a96c5f672201fc4c4a56830edff7fe4/node_modules/@aphexcms/cms-core/dist/utils/string-case.js
/**
* Convert a string to PascalCase.
* Handles hyphens, underscores, and camelCase boundaries.
*
* @example
* toPascalCase('type-name')        // 'TypeName'
* toPascalCase('my_field')         // 'MyField'
* toPascalCase('parentName')       // 'ParentName'
*/
function toPascalCase(str) {
	return str.replace(/(^|[-_])(\w)/g, (_, _sep, c) => c.toUpperCase());
}
/**
* Convert a string to camelCase.
* Handles hyphens, underscores, and existing casing.
*
* @example
* toCamelCase('type-name')         // 'typeName'
* toCamelCase('my_field')          // 'myField'
* toCamelCase('alreadyCamel')      // 'alreadyCamel'
*/
function toCamelCase(str) {
	const pascal = toPascalCase(str);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
//#endregion
export { toPascalCase as n, toCamelCase as t };
