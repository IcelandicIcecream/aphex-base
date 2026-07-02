function collectReferenceIds(data, _schema, _registry) {
  const ids = /* @__PURE__ */ new Set();
  walk(data, ids);
  return Array.from(ids);
}
function walk(value, ids) {
  if (value == null)
    return;
  if (Array.isArray(value)) {
    for (const item of value)
      walk(item, ids);
    return;
  }
  if (typeof value !== "object")
    return;
  const obj = value;
  if (obj._type === "reference" && typeof obj._ref === "string" && obj._ref) {
    ids.add(obj._ref);
    return;
  }
  if (obj._type === "image" || obj._type === "file")
    return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("_"))
      continue;
    walk(obj[key], ids);
  }
}
export {
  collectReferenceIds as c
};
