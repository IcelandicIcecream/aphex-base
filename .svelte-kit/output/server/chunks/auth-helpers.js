import { c as cmsLogger, n as normalizeDateFields, R as Rule } from "./date-utils.js";
async function validateField(field, value, context = {}) {
  cmsLogger.debug("[validateField]", `Validating field "${field.name}"`, {
    type: field.type,
    value,
    hasValidation: !!field.validation
  });
  const allErrors = [];
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
export {
  authToContext as a,
  validateDocumentData as v
};
