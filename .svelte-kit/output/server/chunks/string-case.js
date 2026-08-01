//#region ../../node_modules/.pnpm/@aphexcms+cms-core@9.8.1_5f1480b54aa9be386878aaf454b05f6d/node_modules/@aphexcms/cms-core/dist/utils/string-case.js
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
