import { GraphQLError, Kind } from "graphql";
import { a as authToContext } from "./auth-helpers.js";
import { c as cmsLogger } from "./date-utils.js";
function capitalizeFirst$1(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function generateGraphQLField(field, schemaTypes, parentName = "") {
  const nullability = isFieldRequired(field) ? "!" : "";
  const fieldType = getGraphQLType(field, schemaTypes, parentName);
  return `  ${field.name}: ${fieldType}${nullability}`;
}
function getGraphQLType(field, schemaTypes, parentName = "") {
  switch (field.type) {
    case "string":
    case "text":
    case "slug":
      return "String";
    case "number":
      return "Float";
    case "boolean":
      return "Boolean";
    case "image":
      return "Image";
    case "file":
      return "FileAsset";
    case "array":
      return handleArrayField(field, schemaTypes, parentName);
    case "object":
      return handleObjectField(field, schemaTypes, parentName);
    case "reference":
      return handleReferenceField(field);
    default:
      return "String";
  }
}
function handleArrayField(field, schemaTypes, parentName = "") {
  if (!field.of || field.of.length === 0) {
    return "[JSON]";
  }
  if (field.of.some((item) => item.type === "block")) {
    return "[JSON]";
  }
  const refItems = field.of.filter((item) => item.type === "reference");
  if (refItems.length > 0) {
    const refItem = refItems[0];
    const to = refItem.to;
    if (to && to.length === 1) {
      return `[${capitalizeFirst$1(to[0].type)}]`;
    }
    return "[JSON]";
  }
  const validTypes = field.of.filter((item) => schemaTypes.find((s) => s.name === item.type));
  if (validTypes.length === 0) {
    return "[JSON]";
  }
  if (validTypes.length === 1) {
    const itemType = validTypes[0];
    return `[${capitalizeFirst$1(itemType.type)}]`;
  }
  const unionName = `${capitalizeFirst$1(parentName)}${capitalizeFirst$1(field.name)}Item`;
  return `[${unionName}]`;
}
function handleObjectField(field, _schemaTypes, parentName = "") {
  if (field.fields && field.fields.length > 0) {
    return capitalizeFirst$1(`${parentName}${field.name}Object`);
  }
  return "String";
}
function handleReferenceField(field) {
  if (field.to && field.to.length === 1) {
    return capitalizeFirst$1(field.to[0].type);
  }
  return "String";
}
function isFieldRequired(field) {
  if (!field.validation)
    return false;
  return field.validation.toString().includes("required");
}
function generateObjectType(schemaType, allSchemaTypes) {
  const typeName = capitalizeFirst$1(schemaType.name);
  const fields = schemaType.fields.map((field) => generateGraphQLField(field, allSchemaTypes, schemaType.name)).join("\n");
  return `type ${typeName} {
${fields}
}`;
}
function generateDocumentType(schemaType, allSchemaTypes) {
  const typeName = capitalizeFirst$1(schemaType.name);
  const customFields = schemaType.fields.map((field) => generateGraphQLField(field, allSchemaTypes, schemaType.name)).join("\n");
  return `type ${typeName} {
  id: ID!
  type: String!
  status: String!
  createdAt: String
  updatedAt: String
  publishedAt: String
${customFields}
}`;
}
function generateInlineObjectTypes(schemaTypes) {
  const inlineTypes = [];
  function processFields(fields, parentName) {
    fields.forEach((field) => {
      if (field.type === "object" && field.fields) {
        const objectField = field;
        const typeName = capitalizeFirst$1(`${parentName}${field.name}Object`);
        const fieldDefs = objectField.fields.map((f) => generateGraphQLField(f, schemaTypes, `${parentName}${field.name}`)).join("\n");
        inlineTypes.push(`type ${typeName} {
${fieldDefs}
}`);
        processFields(objectField.fields, `${parentName}${field.name}`);
      }
      if (field.type === "array") {
        const arrayField = field;
        if (arrayField.of && arrayField.of.length > 1) {
          const validTypes = arrayField.of.filter((item) => schemaTypes.find((s) => s.name === item.type));
          if (validTypes.length > 1) {
            const unionName = `${capitalizeFirst$1(parentName)}${capitalizeFirst$1(field.name)}Item`;
            const unionTypes = validTypes.map((item) => capitalizeFirst$1(item.type)).join(" | ");
            inlineTypes.push(`union ${unionName} = ${unionTypes}`);
          }
        }
      }
    });
  }
  schemaTypes.forEach((schemaType) => {
    processFields(schemaType.fields, schemaType.name);
  });
  return inlineTypes.join("\n\n");
}
function generateFilterInputTypes() {
  return `# Filter operators for string fields
input StringFilter {
  equals: String
  not_equals: String
  in: [String!]
  not_in: [String!]
  contains: String
  starts_with: String
  ends_with: String
  like: String
  exists: Boolean
}

# Filter operators for number fields
input NumberFilter {
  equals: Float
  not_equals: Float
  in: [Float!]
  not_in: [Float!]
  greater_than: Float
  greater_than_equal: Float
  less_than: Float
  less_than_equal: Float
  exists: Boolean
}

# Filter operators for boolean fields
input BooleanFilter {
  equals: Boolean
  not_equals: Boolean
  exists: Boolean
}

# Filter operators for ID fields
input IDFilter {
  equals: ID
  not_equals: ID
  in: [ID!]
  not_in: [ID!]
  exists: Boolean
}`;
}
function generateWhereInputType(schemaType, _allSchemaTypes) {
  const typeName = capitalizeFirst$1(schemaType.name);
  const whereTypeName = `${typeName}WhereInput`;
  const fieldFilters = [];
  schemaType.fields.forEach((field) => {
    const filterType = getFilterType(field);
    if (filterType) {
      fieldFilters.push(`  ${field.name}: ${filterType}`);
    }
  });
  fieldFilters.unshift("  id: IDFilter", "  type: StringFilter", "  status: StringFilter", "  createdAt: StringFilter", "  updatedAt: StringFilter", "  publishedAt: StringFilter");
  fieldFilters.push(`  AND: [${whereTypeName}!]`, `  OR: [${whereTypeName}!]`);
  return `input ${whereTypeName} {
${fieldFilters.join("\n")}
}`;
}
function getFilterType(field) {
  switch (field.type) {
    case "string":
    case "text":
    case "slug":
      return "StringFilter";
    case "number":
      return "NumberFilter";
    case "boolean":
      return "BooleanFilter";
    case "reference":
      return "StringFilter";
    // Reference IDs are strings
    // Arrays, objects, and images don't have direct filters in GraphQL
    default:
      return null;
  }
}
function generateDataInputType(schemaType, allSchemaTypes) {
  const typeName = capitalizeFirst$1(schemaType.name);
  const inputTypeName = `${typeName}DataInput`;
  const fields = [];
  schemaType.fields.forEach((field) => {
    const inputFieldType = getInputFieldType(field, allSchemaTypes, schemaType.name);
    if (inputFieldType) {
      const required = isFieldRequired(field) ? "!" : "";
      fields.push(`  ${field.name}: ${inputFieldType}${required}`);
    }
  });
  return `input ${inputTypeName} {
${fields.join("\n")}
}`;
}
function getInputFieldType(field, _schemaTypes, _parentName) {
  switch (field.type) {
    case "string":
    case "text":
    case "slug":
      return "String";
    case "number":
      return "Float";
    case "boolean":
      return "Boolean";
    case "reference":
      return "String";
    // Reference IDs
    case "image":
    case "file":
      return "JSON";
    // Complex asset references
    case "array":
      return "[JSON]";
    case "object":
      return "JSON";
    default:
      return "JSON";
  }
}
function generateQueryFields(schemaTypes) {
  const documentTypes = schemaTypes.filter((type) => type.type === "document");
  return documentTypes.map((schemaType) => {
    const typeName = capitalizeFirst$1(schemaType.name);
    if (schemaType.singleton) {
      return `  # Get the ${schemaType.name} singleton (lazy-creates an empty draft on first access)
  ${schemaType.name}(perspective: String, depth: Int): ${typeName}!`;
    }
    const whereInputType = `${typeName}WhereInput`;
    return `  # Get a single ${schemaType.name} by ID
  ${schemaType.name}(id: ID!, perspective: String, depth: Int): ${typeName}

  # Get all ${schemaType.name} documents with filtering
  all${typeName}(
    where: ${whereInputType}
    perspective: String
    limit: Int
    offset: Int
    sort: String
    depth: Int
  ): [${typeName}!]!`;
  }).join("\n\n");
}
function generateMutationFields(schemaTypes) {
  const documentTypes = schemaTypes.filter((type) => type.type === "document");
  return documentTypes.map((schemaType) => {
    const typeName = capitalizeFirst$1(schemaType.name);
    const dataInputType = `${typeName}DataInput`;
    if (schemaType.singleton) {
      return `  # Update the ${schemaType.name} singleton
  update${typeName}(data: JSON!, publish: Boolean): ${typeName}!

  # Publish the ${schemaType.name} singleton
  publish${typeName}: ${typeName}!

  # Unpublish the ${schemaType.name} singleton
  unpublish${typeName}: ${typeName}!`;
    }
    return `  # Create a new ${schemaType.name}
  create${typeName}(data: ${dataInputType}!, publish: Boolean): ${typeName}!

  # Update an existing ${schemaType.name}
  update${typeName}(id: ID!, data: JSON!, publish: Boolean): ${typeName}!

  # Delete a ${schemaType.name}
  delete${typeName}(id: ID!): DeleteResult!

  # Publish a ${schemaType.name}
  publish${typeName}(id: ID!): ${typeName}!

  # Unpublish a ${schemaType.name}
  unpublish${typeName}(id: ID!): ${typeName}!`;
  }).join("\n\n");
}
function generateGraphQLSchema(schemaTypes) {
  const documentTypes = schemaTypes.filter((type) => type.type === "document");
  if (documentTypes.length === 0) {
    return `scalar JSON

type Query {
  _empty: String
}`;
  }
  const objectTypes = schemaTypes.filter((type) => type.type === "object");
  const documentTypeDefs = documentTypes.map((schema) => generateDocumentType(schema, schemaTypes)).join("\n\n");
  const objectTypeDefs = objectTypes.map((schema) => generateObjectType(schema, schemaTypes)).join("\n\n");
  const inlineTypeDefs = generateInlineObjectTypes(schemaTypes);
  const filterInputTypes = generateFilterInputTypes();
  const whereInputTypes = documentTypes.map((schema) => generateWhereInputType(schema)).join("\n\n");
  const dataInputTypes = documentTypes.map((schema) => generateDataInputType(schema, schemaTypes)).join("\n\n");
  const queryFields = generateQueryFields(schemaTypes);
  const mutationFields = generateMutationFields(schemaTypes);
  const imageTypeDef = `type Image {
  _type: String!
  asset: ImageAsset
  url: String
}

type ImageAsset {
  _ref: String!
  _type: String!
}

type FileAsset {
  _type: String!
  asset: FileAssetRef
  url: String
}

type FileAssetRef {
  _ref: String!
  _type: String!
}`;
  const scalarDefs = `# JSON scalar for flexible data
scalar JSON`;
  const deleteResultType = `type DeleteResult {
  success: Boolean!
}`;
  const result = `
${scalarDefs}

type Query {
${queryFields}
}

type Mutation {
${mutationFields}
}

${deleteResultType}

${imageTypeDef}

${filterInputTypes}

${whereInputTypes}

${dataInputTypes}

${documentTypeDefs}

${objectTypeDefs}

${inlineTypeDefs}
`.trim();
  return result;
}
function getDefaultValueForFieldType(fieldType) {
  switch (fieldType) {
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "number":
      return null;
    default:
      return "";
  }
}
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function normalizeDocumentFields(data, schemaType, allSchemaTypes) {
  if (!data)
    return data;
  const normalized = { ...data };
  schemaType.fields.forEach((field) => {
    const fieldValue = normalized[field.name];
    if (fieldValue === null || fieldValue === void 0) {
      normalized[field.name] = getDefaultValueForFieldType(field.type);
    }
    if (field.type === "object" && normalized[field.name] && field.fields) {
      const syntheticSchema = {
        name: `${schemaType.name}_${field.name}`,
        fields: field.fields,
        title: field.title || field.name
      };
      normalized[field.name] = normalizeDocumentFields(normalized[field.name], syntheticSchema, allSchemaTypes);
    }
    if (field.type === "array" && Array.isArray(normalized[field.name]) && field.of) {
      normalized[field.name] = normalized[field.name].map((item) => {
        if (item && typeof item === "object" && item._type) {
          const itemSchema = allSchemaTypes.find((s) => s.name === item._type);
          if (itemSchema) {
            return normalizeDocumentFields(item, itemSchema, allSchemaTypes);
          }
        }
        return item;
      });
    }
  });
  return normalized;
}
function sanitizeInputData(data) {
  if (data === null)
    return void 0;
  if (typeof data !== "object")
    return data;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInputData(item));
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== null) {
      sanitized[key] = sanitizeInputData(value);
    }
  }
  return sanitized;
}
function parseWhereInput(where) {
  if (!where)
    return void 0;
  const parsed = {};
  Object.keys(where).forEach((key) => {
    const value = where[key];
    if (key === "AND" && Array.isArray(value)) {
      parsed.and = value.map((w) => parseWhereInput(w));
      return;
    }
    if (key === "OR" && Array.isArray(value)) {
      parsed.or = value.map((w) => parseWhereInput(w));
      return;
    }
    if (value && typeof value === "object") {
      parsed[key] = {};
      if ("equals" in value)
        parsed[key].equals = value.equals;
      if ("not_equals" in value)
        parsed[key].not_equals = value.not_equals;
      if ("in" in value)
        parsed[key].in = value.in;
      if ("not_in" in value)
        parsed[key].not_in = value.not_in;
      if ("contains" in value)
        parsed[key].contains = value.contains;
      if ("starts_with" in value)
        parsed[key].starts_with = value.starts_with;
      if ("ends_with" in value)
        parsed[key].ends_with = value.ends_with;
      if ("like" in value)
        parsed[key].like = value.like;
      if ("greater_than" in value)
        parsed[key].greater_than = value.greater_than;
      if ("greater_than_equal" in value)
        parsed[key].greater_than_equal = value.greater_than_equal;
      if ("less_than" in value)
        parsed[key].less_than = value.less_than;
      if ("less_than_equal" in value)
        parsed[key].less_than_equal = value.less_than_equal;
      if ("exists" in value)
        parsed[key].exists = value.exists;
    } else {
      parsed[key] = { equals: value };
    }
  });
  return parsed;
}
function createResolvers(cms, schemaTypes, defaultPerspective = "published") {
  const resolvers = {
    Query: {},
    Mutation: {},
    Image: {
      // Return the image object as-is for frontend urlFor() usage
      _type: (parent) => parent?._type || "image",
      asset: (parent) => parent?.asset || null,
      url: (parent) => {
        const assetRef = parent?.asset?._ref;
        return assetRef ? `/media/${assetRef}/image` : null;
      }
    }
  };
  function generateReferenceFieldResolvers() {
    schemaTypes.forEach((schemaType) => {
      const typeName = capitalizeFirst(schemaType.name);
      function processFields(fields, currentTypeName) {
        fields.forEach((field) => {
          if (field.type === "reference" && field.to && field.to.length > 0) {
            if (!resolvers[currentTypeName]) {
              resolvers[currentTypeName] = {};
            }
            resolvers[currentTypeName][field.name] = async (parent, _args, context) => {
              const raw = parent[field.name];
              const referenceId = raw && typeof raw === "object" && raw._type === "reference" ? raw._ref : typeof raw === "string" ? raw : null;
              if (!referenceId || typeof referenceId !== "string") {
                return null;
              }
              try {
                const { auth } = context;
                const apiContext = authToContext(auth);
                const perspective = parent.status || context?.perspective || defaultPerspective;
                const referencedDoc = await cms.databaseAdapter.findByDocIdAdvanced(apiContext.organizationId, referenceId);
                if (!referencedDoc) {
                  return null;
                }
                const data = perspective === "published" ? referencedDoc.publishedData : referencedDoc.draftData;
                if (!data)
                  return null;
                const refSchemaType = schemaTypes.find((s) => s.name === referencedDoc.type);
                const normalizedData = refSchemaType ? normalizeDocumentFields(data, refSchemaType, schemaTypes) : data;
                return {
                  id: referencedDoc.id,
                  type: referencedDoc.type,
                  status: perspective,
                  createdAt: referencedDoc.createdAt?.toISOString() || null,
                  updatedAt: referencedDoc.updatedAt?.toISOString() || null,
                  publishedAt: null,
                  ...normalizedData
                };
              } catch (error) {
                cmsLogger.error(`Failed to resolve reference ${field.name}:`, error);
                return null;
              }
            };
          }
          if (field.type === "array" && field.of) {
            const refOf = field.of.find((o) => o.type === "reference");
            if (refOf) {
              if (!resolvers[currentTypeName]) {
                resolvers[currentTypeName] = {};
              }
              resolvers[currentTypeName][field.name] = async (parent, _args, context) => {
                const items = parent[field.name];
                if (!Array.isArray(items))
                  return [];
                const { auth } = context;
                const apiContext = authToContext(auth);
                const perspective = parent.status || context?.perspective || defaultPerspective;
                return Promise.all(items.map(async (item) => {
                  const refId = item && typeof item === "object" && item._type === "reference" ? item._ref : typeof item === "string" ? item : null;
                  if (!refId)
                    return null;
                  try {
                    const doc = await cms.databaseAdapter.findByDocIdAdvanced(apiContext.organizationId, refId);
                    if (!doc)
                      return null;
                    const data = perspective === "published" ? doc.publishedData : doc.draftData;
                    if (!data)
                      return null;
                    const refSchemaType = schemaTypes.find((s) => s.name === doc.type);
                    const normalized = refSchemaType ? normalizeDocumentFields(data, refSchemaType, schemaTypes) : data;
                    return {
                      id: doc.id,
                      type: doc.type,
                      status: perspective,
                      createdAt: doc.createdAt?.toISOString() || null,
                      updatedAt: doc.updatedAt?.toISOString() || null,
                      publishedAt: null,
                      ...normalized
                    };
                  } catch {
                    return null;
                  }
                }));
              };
            }
          }
          if (field.type === "object" && field.fields) {
            const nestedTypeName = capitalizeFirst(`${schemaType.name}${field.name}Object`);
            processFields(field.fields, nestedTypeName);
          }
        });
      }
      processFields(schemaType.fields, typeName);
    });
  }
  generateReferenceFieldResolvers();
  function generateUnionResolvers() {
    schemaTypes.forEach((schemaType) => {
      function processFields(fields, parentName) {
        fields.forEach((field) => {
          if (field.type === "array" && field.of && field.of.length > 1) {
            const validTypes = field.of.filter((item) => schemaTypes.find((s) => s.name === item.type));
            if (validTypes.length > 1) {
              const unionName = `${capitalizeFirst(parentName)}${capitalizeFirst(field.name)}Item`;
              resolvers[unionName] = {
                __resolveType(obj) {
                  if (obj._type) {
                    return capitalizeFirst(obj._type);
                  }
                  return null;
                }
              };
            }
          }
          if (field.type === "object" && field.fields) {
            processFields(field.fields, `${parentName}${field.name}`);
          }
        });
      }
      processFields(schemaType.fields, schemaType.name);
    });
  }
  generateUnionResolvers();
  const documentTypes = schemaTypes.filter((type) => type.type === "document");
  documentTypes.forEach((schemaType) => {
    const typeName = capitalizeFirst(schemaType.name);
    if (schemaType.singleton) {
      const formatDoc = (doc, perspective) => {
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || doc.id,
          type: meta.type || schemaType.name,
          status: perspective,
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: meta.publishedAt?.toISOString() || null,
          ...normalizedData
        };
      };
      resolvers.Query[schemaType.name] = async (_, args, context) => {
        try {
          const { localAPI, auth } = context;
          const apiContext = authToContext(auth);
          const perspective = args.perspective || defaultPerspective;
          context.perspective = perspective;
          const collection = localAPI.collections[schemaType.name];
          if (!collection) {
            throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
              extensions: { code: "NOT_FOUND" }
            });
          }
          const doc = await collection.get(apiContext, { perspective, depth: args.depth || 0 });
          return formatDoc(doc, perspective);
        } catch (error) {
          if (error instanceof GraphQLError)
            throw error;
          throw new GraphQLError(error.message, {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
          });
        }
      };
      resolvers.Mutation[`update${typeName}`] = async (_, args, context) => {
        try {
          const { localAPI, auth } = context;
          const apiContext = authToContext(auth);
          const collection = localAPI.collections[schemaType.name];
          if (!collection) {
            throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
              extensions: { code: "NOT_FOUND" }
            });
          }
          const sanitizedData = sanitizeInputData(args.data);
          await collection.get(apiContext);
          const result = await collection.update(apiContext, collection.getSingletonId(apiContext), sanitizedData, {
            publish: args.publish || false
          });
          if (!result) {
            throw new GraphQLError("Singleton not found", { extensions: { code: "NOT_FOUND" } });
          }
          return formatDoc(result.document, args.publish ? "published" : "draft");
        } catch (error) {
          if (error instanceof GraphQLError)
            throw error;
          cmsLogger.error(`GraphQL mutation error:`, error);
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_REQUEST" }
          });
        }
      };
      resolvers.Mutation[`publish${typeName}`] = async (_, __, context) => {
        try {
          const { localAPI, auth } = context;
          const apiContext = authToContext(auth);
          const collection = localAPI.collections[schemaType.name];
          await collection.get(apiContext);
          const doc = await collection.publish(apiContext, collection.getSingletonId(apiContext));
          if (!doc) {
            throw new GraphQLError("Singleton not found", { extensions: { code: "NOT_FOUND" } });
          }
          return formatDoc(doc, "published");
        } catch (error) {
          if (error instanceof GraphQLError)
            throw error;
          cmsLogger.error(`GraphQL mutation error:`, error);
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_REQUEST" }
          });
        }
      };
      resolvers.Mutation[`unpublish${typeName}`] = async (_, __, context) => {
        try {
          const { localAPI, auth } = context;
          const apiContext = authToContext(auth);
          const collection = localAPI.collections[schemaType.name];
          await collection.get(apiContext);
          const doc = await collection.unpublish(apiContext, collection.getSingletonId(apiContext));
          if (!doc) {
            throw new GraphQLError("Singleton not found", { extensions: { code: "NOT_FOUND" } });
          }
          return formatDoc(doc, "draft");
        } catch (error) {
          if (error instanceof GraphQLError)
            throw error;
          cmsLogger.error(`GraphQL mutation error:`, error);
          throw new GraphQLError(error.message, {
            extensions: { code: "BAD_REQUEST" }
          });
        }
      };
      return;
    }
    resolvers.Query[schemaType.name] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const perspective = args.perspective || defaultPerspective;
        context.perspective = perspective;
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const doc = await collection.findByID(apiContext, args.id, {
          perspective,
          depth: args.depth || 0
        });
        if (!doc) {
          return null;
        }
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || args.id,
          type: meta.type || schemaType.name,
          status: perspective,
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: meta.publishedAt?.toISOString() || null,
          ...normalizedData
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(error.message, {
          extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
      }
    };
    resolvers.Query[`all${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const perspective = args.perspective || defaultPerspective;
        context.perspective = perspective;
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const where = parseWhereInput(args.where);
        const result = await collection.find(apiContext, {
          where,
          perspective,
          limit: args.limit || 50,
          offset: args.offset || 0,
          sort: args.sort || "-createdAt",
          depth: args.depth || 0
        });
        return result.docs.map((doc) => {
          const data = { ...doc };
          const meta = data._meta || {};
          delete data._meta;
          const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
          return {
            id: meta.id || doc.id,
            type: meta.type || schemaType.name,
            status: perspective,
            createdAt: meta.createdAt?.toISOString() || null,
            updatedAt: meta.updatedAt?.toISOString() || null,
            publishedAt: meta.publishedAt?.toISOString() || null,
            ...normalizedData
          };
        });
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError(error.message, {
          extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
      }
    };
    resolvers.Mutation[`create${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const sanitizedData = sanitizeInputData(args.data);
        const result = await collection.create(apiContext, sanitizedData, {
          publish: args.publish || false
        });
        const doc = result.document;
        const perspective = args.publish ? "published" : "draft";
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || doc.id,
          type: meta.type || schemaType.name,
          status: perspective,
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: meta.publishedAt?.toISOString() || null,
          ...normalizedData
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        cmsLogger.error(`GraphQL mutation error:`, error);
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_REQUEST" }
        });
      }
    };
    resolvers.Mutation[`update${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const sanitizedData = sanitizeInputData(args.data);
        const result = await collection.update(apiContext, args.id, sanitizedData, {
          publish: args.publish || false
        });
        if (!result) {
          throw new GraphQLError("Document not found", {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const doc = result.document;
        const perspective = args.publish ? "published" : "draft";
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || args.id,
          type: meta.type || schemaType.name,
          status: perspective,
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: meta.publishedAt?.toISOString() || null,
          ...normalizedData
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        cmsLogger.error(`GraphQL mutation error:`, error);
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_REQUEST" }
        });
      }
    };
    resolvers.Mutation[`delete${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const success = await collection.delete(apiContext, args.id);
        return { success };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        cmsLogger.error(`GraphQL mutation error:`, error);
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_REQUEST" }
        });
      }
    };
    resolvers.Mutation[`publish${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const doc = await collection.publish(apiContext, args.id);
        if (!doc) {
          throw new GraphQLError("Document not found", {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || args.id,
          type: meta.type || schemaType.name,
          status: "published",
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: meta.publishedAt?.toISOString() || null,
          ...normalizedData
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        cmsLogger.error(`GraphQL mutation error:`, error);
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_REQUEST" }
        });
      }
    };
    resolvers.Mutation[`unpublish${typeName}`] = async (_, args, context) => {
      try {
        const { localAPI, auth } = context;
        const apiContext = authToContext(auth);
        const collection = localAPI.collections[schemaType.name];
        if (!collection) {
          throw new GraphQLError(`Collection '${schemaType.name}' not found`, {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const doc = await collection.unpublish(apiContext, args.id);
        if (!doc) {
          throw new GraphQLError("Document not found", {
            extensions: { code: "NOT_FOUND" }
          });
        }
        const data = { ...doc };
        const meta = data._meta || {};
        delete data._meta;
        const normalizedData = normalizeDocumentFields(data, schemaType, schemaTypes);
        return {
          id: meta.id || args.id,
          type: meta.type || schemaType.name,
          status: "draft",
          createdAt: meta.createdAt?.toISOString() || null,
          updatedAt: meta.updatedAt?.toISOString() || null,
          publishedAt: null,
          ...normalizedData
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        cmsLogger.error(`GraphQL mutation error:`, error);
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_REQUEST" }
        });
      }
    };
  });
  return resolvers;
}
function depthLimit(maxDepth, options = {}) {
  return (validationContext) => {
    const { definitions } = validationContext.getDocument();
    const fragments = getFragments(definitions);
    const queries = getQueriesAndMutations(definitions);
    for (const name in queries) {
      determineDepth(queries[name], fragments, 0, maxDepth, validationContext, name, options);
    }
    return validationContext;
  };
}
function getFragments(definitions) {
  const map = {};
  for (const def of definitions) {
    if (def.kind === Kind.FRAGMENT_DEFINITION) {
      map[def.name.value] = def;
    }
  }
  return map;
}
function getQueriesAndMutations(definitions) {
  const map = {};
  for (const def of definitions) {
    if (def.kind === Kind.OPERATION_DEFINITION) {
      map[def.name ? def.name.value : ""] = def;
    }
  }
  return map;
}
function determineDepth(node, fragments, depthSoFar, maxDepth, context, operationName, options) {
  if (depthSoFar > maxDepth) {
    context.reportError(new GraphQLError(`'${operationName}' exceeds maximum operation depth of ${maxDepth}`, {
      nodes: [node]
    }));
    return depthSoFar;
  }
  switch (node.kind) {
    case Kind.FIELD: {
      const shouldIgnore = /^__/.test(node.name.value) || seeIfIgnored(node.name.value, options.ignore);
      if (shouldIgnore || !node.selectionSet) {
        return 0;
      }
      return 1 + Math.max(...node.selectionSet.selections.map((selection) => determineDepth(selection, fragments, depthSoFar + 1, maxDepth, context, operationName, options)));
    }
    case Kind.FRAGMENT_SPREAD: {
      const fragment = fragments[node.name.value];
      if (!fragment)
        return 0;
      return determineDepth(fragment, fragments, depthSoFar, maxDepth, context, operationName, options);
    }
    case Kind.INLINE_FRAGMENT:
    case Kind.FRAGMENT_DEFINITION:
    case Kind.OPERATION_DEFINITION:
      return Math.max(...node.selectionSet.selections.map((selection) => determineDepth(selection, fragments, depthSoFar, maxDepth, context, operationName, options)));
    default:
      throw new Error("Depth crawler cannot handle: " + node.kind);
  }
}
function seeIfIgnored(fieldName, ignore) {
  if (!ignore)
    return false;
  for (const rule of ignore) {
    if (typeof rule === "function") {
      if (rule(fieldName))
        return true;
    } else if (typeof rule === "string") {
      if (fieldName.match(rule))
        return true;
    } else if (rule instanceof RegExp) {
      if (rule.test(fieldName))
        return true;
    }
  }
  return false;
}
const MAX_QUERY_DEPTH = 10;
async function createGraphQLHandler(cms, schemaTypes, options = {}) {
  const rawPath = options.path ?? "/api/graphql";
  const endpoint = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const enableGraphiQL = options.enableGraphiQL ?? true;
  const defaultPerspective = options.defaultPerspective ?? "published";
  const [{ createYoga, createSchema }, { useGraphQlJit }, { renderGraphiQL }] = await Promise.all([
    import("graphql-yoga"),
    import("@envelop/graphql-jit"),
    import("@graphql-yoga/render-graphiql")
  ]);
  const typeDefs = generateGraphQLSchema(schemaTypes);
  const resolvers = createResolvers(cms, schemaTypes, defaultPerspective);
  const isProd = process.env.NODE_ENV === "production";
  const yogaApp = createYoga({
    logging: false,
    maskedErrors: isProd,
    schema: createSchema({
      typeDefs,
      resolvers
    }),
    plugins: [
      useGraphQlJit(),
      {
        onValidate({ addValidationRule }) {
          addValidationRule(depthLimit(MAX_QUERY_DEPTH));
        }
      }
    ],
    graphqlEndpoint: endpoint,
    renderGraphiQL,
    fetchAPI: { Response },
    context: async (event) => {
      const auth = event.locals.auth;
      const localAPI = event.locals.aphexCMS?.localAPI;
      if (!auth || auth.type === "partial_session") {
        throw new Error("Unauthorized: Authentication required for GraphQL");
      }
      if (!localAPI) {
        throw new Error("LocalAPI not initialized");
      }
      return {
        organizationId: auth.organizationId,
        auth,
        localAPI
      };
    },
    graphiql: enableGraphiQL ? {
      defaultQuery: options.defaultQuery || `# Welcome to Aphex GraphQL API
# Try these example queries:

# Get all documents of a type (replace 'page' with your document type)
{
  allPage(perspective: "draft") {
    id
    title
    createdAt
    updatedAt
  }
}

# Get a single document by ID
{
  page(id: "your-page-id", perspective: "draft") {
    id
    title
  }
}`
    } : false
  });
  cmsLogger.info("[GraphQL]", `Initialized at ${endpoint}`);
  return {
    handler: async (event) => {
      return yogaApp.fetch(event.request, event);
    },
    settings: {
      endpoint,
      enableGraphiQL
    }
  };
}
export {
  createGraphQLHandler
};
