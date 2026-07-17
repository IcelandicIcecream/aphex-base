import { c as cmsLogger } from "./date-utils.js";
const RESERVED_FIELD_NAMES = [
  "id",
  "type",
  "status",
  "organizationId",
  "createdBy",
  "updatedBy",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "draftData",
  "publishedData",
  "publishedHash"
];
function isReservedFieldName(fieldName) {
  return RESERVED_FIELD_NAMES.includes(fieldName);
}
const RESERVED_FIELDS = RESERVED_FIELD_NAMES;
const PRIMITIVE_FIELD_TYPES = [
  "string",
  "text",
  "number",
  "boolean",
  "slug",
  "url",
  "image",
  "file",
  "date",
  "datetime",
  "reference"
];
const VALID_FIELD_TYPES = [...PRIMITIVE_FIELD_TYPES, "array", "object"];
function validateSchemaReferences(schemas) {
  const schemaNames = new Set(schemas.map((schema) => schema.name));
  const errors = [];
  const nameCounts = /* @__PURE__ */ new Map();
  for (const schema of schemas)
    nameCounts.set(schema.name, (nameCounts.get(schema.name) ?? 0) + 1);
  for (const [name, count] of nameCounts) {
    if (count > 1) {
      errors.push(`Duplicate schema name "${name}" (defined ${count} times). Schema names must be unique across app and plugin schemas.`);
    }
  }
  const primitiveTypes = PRIMITIVE_FIELD_TYPES;
  const validFieldTypes = VALID_FIELD_TYPES;
  function validateField(field, parentSchema) {
    if (!field.type) {
      errors.push(`Schema "${parentSchema}" field "${field.name || "unknown"}" is missing required "type" property`);
      return;
    }
    if (!validFieldTypes.includes(field.type)) {
      errors.push(`Schema "${parentSchema}" field "${field.name}" has invalid type "${field.type}". Valid types: ${validFieldTypes.join(", ")}`);
    }
    if (isReservedFieldName(field.name)) {
      errors.push(`Schema "${parentSchema}" uses reserved field name "${field.name}". Reserved names: ${RESERVED_FIELD_NAMES.join(", ")}`);
    }
    if (field.type === "array" && field.of) {
      for (const arrayType of field.of) {
        if (arrayType.type === "reference") {
          const to = arrayType.to;
          if (!Array.isArray(to) || to.length === 0) {
            errors.push(`Schema "${parentSchema}" field "${field.name}" has a reference array item missing "to" — declare allowed target document types`);
          } else {
            for (const target of to) {
              if (!schemaNames.has(target.type)) {
                errors.push(`Schema "${parentSchema}" field "${field.name}" reference array item targets unknown document type "${target.type}"`);
              }
            }
          }
          continue;
        }
        if (primitiveTypes.includes(arrayType.type)) {
          continue;
        }
        if (arrayType.type === "block") {
          continue;
        }
        if (arrayType.fields) {
          continue;
        }
        if (!schemaNames.has(arrayType.type)) {
          errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown type "${arrayType.type}"`);
        }
      }
    }
    if (field.type === "object" && typeof field.fields === "string") {
      if (!schemaNames.has(field.fields)) {
        errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown object type "${field.fields}"`);
      }
    }
    if (field.type === "reference" && "to" in field && field.to) {
      for (const target of field.to) {
        if (!schemaNames.has(target.type)) {
          errors.push(`Schema "${parentSchema}" field "${field.name}" references unknown document type "${target.type}"`);
        }
      }
    }
    if ("fields" in field && Array.isArray(field.fields)) {
      for (const nestedField of field.fields) {
        validateField(nestedField, parentSchema);
      }
    }
  }
  for (const schema of schemas) {
    if (schema.type !== "document" && schema.type !== "object") {
      errors.push(`Schema "${schema.name}" has invalid type "${schema.type}". Must be "document" or "object"`);
    }
    if (schema.fields) {
      for (const field of schema.fields) {
        validateField(field, schema.name);
      }
    }
    if (schema.fields) {
      const groupNames = new Set((schema.groups ?? []).map((g) => g.name));
      for (const field of schema.fields) {
        if (!field.group)
          continue;
        const refs = Array.isArray(field.group) ? field.group : [field.group];
        for (const ref of refs) {
          if (!groupNames.has(ref)) {
            errors.push(`Schema "${schema.name}" field "${field.name}" references unknown group "${ref}". Declare it in schema.groups.`);
          }
        }
      }
    }
    if (schema.preview?.select) {
      const fieldNames = new Set(schema.fields?.map((f) => f.name) || []);
      const rootOf = (path) => path.split(".", 1)[0] ?? path;
      for (const [key, path] of Object.entries(schema.preview.select)) {
        if (typeof path !== "string" || !path)
          continue;
        if (!fieldNames.has(rootOf(path))) {
          errors.push(`Schema "${schema.name}" preview.select.${key} references unknown field "${path}"`);
        }
      }
    }
    if (schema.orderings && schema.orderings.length > 0) {
      const fieldNames = new Set(schema.fields?.map((f) => f.name) || []);
      fieldNames.add("createdAt");
      fieldNames.add("updatedAt");
      for (const ordering of schema.orderings) {
        if (!ordering.name) {
          errors.push(`Schema "${schema.name}" has an ordering without a "name" property`);
          continue;
        }
        if (!ordering.title) {
          errors.push(`Schema "${schema.name}" ordering "${ordering.name}" is missing required "title" property`);
        }
        if (!ordering.by || ordering.by.length === 0) {
          errors.push(`Schema "${schema.name}" ordering "${ordering.name}" is missing required "by" array`);
          continue;
        }
        for (const orderItem of ordering.by) {
          if (!orderItem.field) {
            errors.push(`Schema "${schema.name}" ordering "${ordering.name}" has an item without a "field" property`);
            continue;
          }
          if (!fieldNames.has(orderItem.field)) {
            errors.push(`Schema "${schema.name}" ordering "${ordering.name}" references unknown field "${orderItem.field}"`);
          }
          if (orderItem.direction && orderItem.direction !== "asc" && orderItem.direction !== "desc") {
            errors.push(`Schema "${schema.name}" ordering "${ordering.name}" field "${orderItem.field}" has invalid direction "${orderItem.direction}". Must be "asc" or "desc"`);
          }
        }
      }
    }
  }
  if (errors.length > 0) {
    cmsLogger.error("[Schema]", "Validation errors:");
    errors.forEach((error) => cmsLogger.error("[Schema]", error));
    throw new Error(errors.join("\n"));
  }
  cmsLogger.info("[Schema]", "Validation passed - all references are valid");
}
export {
  RESERVED_FIELDS as R,
  VALID_FIELD_TYPES as V,
  validateSchemaReferences as v
};
