import { c as cmsLogger, n as normalizeDateFields, R as Rule } from "./date-utils.js";
function isFieldRequired(field) {
  if (!field.validation)
    return false;
  try {
    const validationFn = Array.isArray(field.validation) ? field.validation[0] : field.validation;
    if (!validationFn)
      return false;
    const rule = validationFn(new Rule());
    return rule.isRequired();
  } catch {
    return false;
  }
}
function describeValue(value) {
  if (Array.isArray(value))
    return "an array";
  if (value === null)
    return "null";
  if (typeof value === "object")
    return "an object";
  return `a ${typeof value}`;
}
const isPlainObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function validateValueShape(field, value) {
  if (value === null || value === void 0)
    return null;
  switch (field.type) {
    case "string":
    case "text":
    case "slug":
    case "url":
      return typeof value === "string" ? null : `expected a string, got ${describeValue(value)}`;
    case "reference":
      if (value === "")
        return null;
      return isPlainObject(value) && typeof value._ref === "string" ? null : `expected a reference object { _type: 'reference', _ref: '<documentId>' }, got ${describeValue(value)}`;
    case "image":
    case "file": {
      if (value === "")
        return null;
      if (!isPlainObject(value))
        return `expected an ${field.type} object { _type: '${field.type}', asset: { _type: 'reference', _ref: '<assetId>' } }, got ${describeValue(value)}`;
      if (value.asset === void 0 || value.asset === null)
        return null;
      return isPlainObject(value.asset) && typeof value.asset._ref === "string" ? null : `${field.type} asset must be { _type: 'reference', _ref: '<assetId>' }`;
    }
    case "array":
      return Array.isArray(value) ? null : `expected an array, got ${describeValue(value)}`;
    case "object":
      return isPlainObject(value) ? null : `expected an object, got ${describeValue(value)}`;
    default:
      return null;
  }
}
async function validateField(field, value, context = {}) {
  cmsLogger.debug("[validateField]", `Validating field "${field.name}"`, {
    type: field.type,
    value,
    hasValidation: !!field.validation
  });
  const allErrors = [];
  const shapeError = validateValueShape(field, value);
  if (shapeError) {
    return {
      isValid: false,
      errors: [{ level: "error", message: `Field "${field.name}" ${shapeError}` }]
    };
  }
  if (field.type === "date") {
    const dateField = field;
    const dateFormat = dateField.options?.dateFormat || "YYYY-MM-DD";
    cmsLogger.debug("[validateField]", `Adding automatic DATE validation for "${field.name}"`, {
      dateFormat
    });
    const autoRule = new Rule().date(dateFormat);
    const markers = await autoRule.validate(value, {
      path: [field.name],
      ...context
    });
    allErrors.push(...markers.map((marker) => ({
      level: marker.level,
      message: marker.message
    })));
  } else if (field.type === "datetime") {
    const dateTimeField = field;
    const dateFormat = dateTimeField.options?.dateFormat || "YYYY-MM-DD";
    const timeFormat = dateTimeField.options?.timeFormat || "HH:mm";
    cmsLogger.debug("[validateField]", `Adding automatic DATETIME validation for "${field.name}"`, {
      dateFormat,
      timeFormat
    });
    const autoRule = new Rule().datetime(dateFormat, timeFormat);
    const markers = await autoRule.validate(value, {
      path: [field.name],
      ...context
    });
    allErrors.push(...markers.map((marker) => ({
      level: marker.level,
      message: marker.message
    })));
  } else if (field.type === "url") {
    if (!field.validation) {
      cmsLogger.debug("[validateField]", `Adding automatic URL validation for "${field.name}"`);
      if (value && value !== "") {
        const autoRule = new Rule().uri();
        const markers = await autoRule.validate(value, {
          path: [field.name],
          ...context
        });
        allErrors.push(...markers.map((marker) => ({
          level: marker.level,
          message: marker.message
        })));
      }
    } else {
      cmsLogger.debug("[validateField]", `Skipping automatic URL validation for "${field.name}" (has custom validation)`);
    }
  }
  if (!field.validation) {
    cmsLogger.debug("[validateField]", `No custom validation rules for "${field.name}"`);
  } else {
    try {
      const validationFunctions = Array.isArray(field.validation) ? field.validation : [field.validation];
      cmsLogger.debug("[validateField]", `Field "${field.name}" has ${validationFunctions.length} custom validation function(s)`);
      for (const validationFn of validationFunctions) {
        const rule = validationFn(new Rule());
        if (!(rule instanceof Rule)) {
          cmsLogger.error(`Validation function for field "${field.name}" did not return a Rule object. Make sure you are chaining validation methods and returning the result.`);
          continue;
        }
        const markers = await rule.validate(value, {
          path: [field.name],
          ...context
        });
        allErrors.push(...markers.map((marker) => ({
          level: marker.level,
          message: marker.message
        })));
      }
    } catch (error) {
      cmsLogger.error("[validateField]", `Validation error for "${field.name}":`, error);
      allErrors.push({ level: "error", message: "Validation failed" });
    }
  }
  const isValid = allErrors.filter((e) => e.level === "error").length === 0;
  cmsLogger.debug("[validateField]", `Field "${field.name}" validation complete`, {
    isValid,
    errors: allErrors
  });
  return { isValid, errors: allErrors };
}
async function validateDocumentData(schema, data, context = {}) {
  cmsLogger.debug("[validateDocumentData]", "Starting validation", {
    schemaName: schema.name,
    data
  });
  const validationErrors = [];
  const { normalizedData, dataForValidation } = normalizeDateFields(data, schema);
  cmsLogger.debug("[validateDocumentData]", "After normalization", {
    normalizedData,
    dataForValidation
  });
  for (const field of schema.fields) {
    const value = dataForValidation[field.name];
    cmsLogger.debug("[validateDocumentData]", `Validating field "${field.name}"`, {
      type: field.type,
      value
    });
    const result = await validateField(field, value, { ...context, ...dataForValidation });
    cmsLogger.debug("[validateDocumentData]", `Field "${field.name}" validation result`, {
      isValid: result.isValid,
      errors: result.errors
    });
    if (!result.isValid) {
      const errorMessages = result.errors.filter((e) => e.level === "error").map((e) => e.message);
      if (errorMessages.length > 0) {
        validationErrors.push({
          field: field.name,
          errors: errorMessages
        });
      }
    }
  }
  cmsLogger.debug("[validateDocumentData]", "Final result", {
    isValid: validationErrors.length === 0,
    errors: validationErrors
  });
  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
    normalizedData
  };
}
function authToContext(auth) {
  if (!auth) {
    throw new Error("Authentication required");
  }
  if (auth.type === "session") {
    return {
      organizationId: auth.organizationId,
      user: auth.user,
      auth
      // Preserve full auth for custom permission logic
    };
  }
  if (auth.type === "api_key") {
    return {
      organizationId: auth.organizationId,
      user: {
        id: `apikey:${auth.keyId}`,
        email: `apikey-${auth.name}@system`,
        name: auth.name,
        // Map API key permissions to user roles for permission checking
        role: auth.permissions.includes("write") ? "editor" : "viewer"
      },
      auth
      // Preserve full auth for custom permission logic
    };
  }
  throw new Error("Unknown auth type");
}
function systemContext(organizationId) {
  return {
    organizationId,
    overrideAccess: true
  };
}
function detectMimeType(buffer) {
  if (buffer.length < 4)
    return null;
  if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) {
    return "application/pdf";
  }
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return "image/png";
  }
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return "image/jpeg";
  }
  if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 && (buffer[4] === 55 || buffer[4] === 57) && buffer[5] === 97) {
    return "image/gif";
  }
  if (buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80) {
    return "image/webp";
  }
  if (buffer.length >= 12) {
    const ftypStr = buffer.subarray(4, 8).toString("ascii");
    if (ftypStr === "ftyp") {
      const brand = buffer.subarray(8, 12).toString("ascii");
      if (brand === "avif")
        return "image/avif";
      if (brand === "heic" || brand === "heix")
        return "image/heic";
      if (brand.startsWith("mp4") || brand === "isom")
        return "video/mp4";
    }
  }
  const head = buffer.subarray(0, Math.min(buffer.length, 256)).toString("utf-8");
  if (head.trimStart().startsWith("<") && head.includes("<svg")) {
    return "image/svg+xml";
  }
  if (buffer[0] === 80 && buffer[1] === 75 && buffer[2] === 3 && buffer[3] === 4) {
    return detectZipFormat(buffer);
  }
  if (buffer[0] === 208 && buffer[1] === 207 && buffer[2] === 17 && buffer[3] === 224) {
    return "application/msword";
  }
  if (buffer[0] === 0 && buffer[1] === 97 && buffer[2] === 115 && buffer[3] === 109) {
    return "application/wasm";
  }
  if (buffer[0] === 127 && buffer[1] === 69 && buffer[2] === 76 && buffer[3] === 70) {
    return "application/x-executable";
  }
  if (buffer[0] === 207 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 206 && buffer[1] === 250 && buffer[2] === 237 && buffer[3] === 254 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 207 || buffer[0] === 254 && buffer[1] === 237 && buffer[2] === 250 && buffer[3] === 206) {
    return "application/x-executable";
  }
  if (buffer[0] === 77 && buffer[1] === 90) {
    return "application/x-executable";
  }
  if (buffer[0] === 35 && buffer[1] === 33) {
    return "application/x-shellscript";
  }
  return null;
}
function detectZipFormat(buffer) {
  const content = buffer.subarray(0, Math.min(buffer.length, 2e3)).toString("binary");
  if (content.includes("word/"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (content.includes("xl/"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (content.includes("ppt/"))
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  return "application/zip";
}
const BLOCKED_MIME_TYPES = /* @__PURE__ */ new Set([
  "application/x-executable",
  "application/x-shellscript",
  "application/wasm",
  "application/x-msdos-program",
  "application/x-msdownload",
  "text/html",
  "application/xhtml+xml",
  "text/xml",
  "application/xml"
]);
const BLOCKED_EXTENSIONS = /* @__PURE__ */ new Set([
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".scr",
  ".pif",
  ".sh",
  ".bash",
  ".zsh",
  ".csh",
  ".ksh",
  ".app",
  ".command",
  ".action",
  ".ps1",
  ".psm1",
  ".psd1",
  ".vbs",
  ".vbe",
  ".js",
  ".jse",
  ".wsf",
  ".wsh",
  ".reg",
  ".inf",
  ".hta",
  ".wasm",
  ".html",
  ".htm",
  ".xhtml",
  ".shtml",
  ".xml",
  ".xsl",
  ".mhtml"
]);
function validateFile(buffer, filename, clientMimeType, options = {}) {
  const lowerName = filename.toLowerCase();
  const ext = lowerName.substring(lowerName.lastIndexOf("."));
  const detectedMimeType = detectMimeType(buffer);
  const allExts = lowerName.match(/\.[^.]+/g) || [];
  for (const e of allExts) {
    if (BLOCKED_EXTENSIONS.has(e)) {
      return { valid: false, error: `File type "${e}" is not allowed`, detectedMimeType };
    }
  }
  if (detectedMimeType && BLOCKED_MIME_TYPES.has(detectedMimeType)) {
    return {
      valid: false,
      error: `File content detected as "${detectedMimeType}" which is not allowed`,
      detectedMimeType
    };
  }
  if (detectedMimeType && clientMimeType) {
    const detectedBase = detectedMimeType.split("/")[0];
    const clientBase = clientMimeType.split("/")[0];
    if (detectedMimeType === "application/x-executable" && clientBase !== "application") {
      return {
        valid: false,
        error: "File content does not match the declared type",
        detectedMimeType
      };
    }
    if (clientBase === "image" && detectedBase !== "image" && detectedMimeType !== null) {
      return {
        valid: false,
        error: `File content is "${detectedMimeType}" but was uploaded as an image`,
        detectedMimeType
      };
    }
  }
  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const mimeToCheck = detectedMimeType || clientMimeType;
    const isAllowed = options.allowedMimeTypes.some((allowed) => {
      if (allowed.endsWith("/*")) {
        const prefix = allowed.slice(0, -2);
        return mimeToCheck.startsWith(prefix);
      }
      if (allowed.startsWith(".")) {
        return ext === allowed.toLowerCase();
      }
      return mimeToCheck === allowed;
    });
    if (!isAllowed) {
      return {
        valid: false,
        error: `File type "${mimeToCheck}" is not allowed. Accepted: ${options.allowedMimeTypes.join(", ")}`,
        detectedMimeType
      };
    }
  }
  if (options.maxSize && buffer.length > options.maxSize) {
    const maxMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File exceeds maximum size of ${maxMB} MB`,
      detectedMimeType
    };
  }
  return { valid: true, detectedMimeType };
}
export {
  authToContext as a,
  validateFile as b,
  isFieldRequired as i,
  systemContext as s,
  validateDocumentData as v
};
