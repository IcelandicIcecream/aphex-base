function toPascalCase(str) {
  return str.replace(/(^|[-_])(\w)/g, (_, _sep, c) => c.toUpperCase());
}
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
export {
  toCamelCase as a,
  toPascalCase as t
};
