//#region ../../node_modules/.pnpm/@better-auth+core@1.6.25_@better-auth+utils@0.4.2_@better-fetch+fetch@1.3.1_@openteleme_f2788d83a7ed857c01505eafe322ebe8/node_modules/@better-auth/core/dist/utils/string.mjs
function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
var WORD_PATTERN = /[\p{Ll}\d]+|\p{Lu}+(?!\p{Ll})|\p{Lu}[\p{Ll}\d]+|\p{Lo}+/gu;
var APOSTROPHE_PATTERN = /['\u2019]/g;
function splitWords(input) {
	return input.replace(APOSTROPHE_PATTERN, "").match(WORD_PATTERN) ?? [];
}
function toKebabCase(input) {
	return splitWords(input).map((word) => word.toLowerCase()).join("-");
}
//#endregion
export { toKebabCase as n, capitalizeFirstLetter as t };
