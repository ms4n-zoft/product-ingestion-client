import { ProductSnapshotSchema } from "@/schemas/product-schema";
import { z } from "zod";

export interface MissingField {
  path: string;
  label: string;
  type: string;
  isRequired: boolean;
}

/**
 * Recursively traverse a Zod schema and collect all field paths
 */
function collectFieldPaths(
  schema: z.ZodTypeAny,
  prefix: string = "",
  fields: MissingField[] = []
): MissingField[] {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    Object.entries(shape).forEach(([key, fieldSchema]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      
      // Check if field is optional or nullable
      const isOptional = fieldSchema instanceof z.ZodOptional;
      const isNullable = fieldSchema instanceof z.ZodNullable;
      const isRequired = !isOptional && !isNullable;

      // Get the underlying type
      let unwrappedSchema: z.ZodTypeAny = fieldSchema;
      if (fieldSchema instanceof z.ZodOptional || fieldSchema instanceof z.ZodNullable) {
        unwrappedSchema = (fieldSchema as any)._def.innerType;
      }
      if (unwrappedSchema instanceof z.ZodNullable || unwrappedSchema instanceof z.ZodOptional) {
        unwrappedSchema = (unwrappedSchema as any)._def.innerType;
      }

      // Determine field type
      let type = "string";
      if (unwrappedSchema instanceof z.ZodString) type = "string";
      else if (unwrappedSchema instanceof z.ZodNumber) type = "number";
      else if (unwrappedSchema instanceof z.ZodBoolean) type = "boolean";
      else if (unwrappedSchema instanceof z.ZodArray) type = "array";
      else if (unwrappedSchema instanceof z.ZodObject) type = "object";

      fields.push({ path, label, type, isRequired });

      // Recursively process nested objects
      if (unwrappedSchema instanceof z.ZodObject) {
        collectFieldPaths(unwrappedSchema, path, fields);
      } else if (unwrappedSchema instanceof z.ZodArray) {
        // For arrays, we check if items exist but don't traverse deeply
        const itemSchema = (unwrappedSchema as any)._def.type;
        if (itemSchema instanceof z.ZodObject) {
          // Note: We don't add array items as missing fields individually
          // We just check if the array itself is empty
        }
      }
    });
  }

  return fields;
}

/**
 * Get value at a nested path in an object
 */
function getValueAtPath(obj: any, path: string): unknown {
  const keys = path.split(".");
  let value = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[key];
  }
  
  return value;
}

/**
 * Check if a value is considered "missing" or "empty"
 */
function isMissingValue(value: unknown, type: string): boolean {
  if (value === null || value === undefined) return true;
  
  if (type === "string") {
    return typeof value === "string" && value.trim() === "";
  }
  
  if (type === "array") {
    return !Array.isArray(value) || value.length === 0;
  }
  
  if (type === "object") {
    if (typeof value !== "object") return true;
    // Check if object has any non-null values
    return Object.values(value).every((v) => v === null || v === undefined || v === "");
  }
  
  return false;
}

/**
 * Detect missing fields in a product by comparing against the schema
 */
export function detectMissingFields(product: unknown): MissingField[] {
  const allFields = collectFieldPaths(ProductSnapshotSchema);
  const missingFields: MissingField[] = [];

  allFields.forEach((field) => {
    const value = getValueAtPath(product, field.path);
    
    if (isMissingValue(value, field.type)) {
      missingFields.push(field);
    }
  });

  return missingFields;
}

/**
 * Group missing fields by their top-level category
 */
export function groupMissingFields(missingFields: MissingField[]): Record<string, MissingField[]> {
  const grouped: Record<string, MissingField[]> = {};

  missingFields.forEach((field) => {
    const topLevelKey = field.path.split(".")[0];
    const category = topLevelKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(field);
  });

  return grouped;
}

/**
 * Calculate completion percentage based on missing fields
 */
export function calculateCompletionPercentage(product: unknown): number {
  const allFields = collectFieldPaths(ProductSnapshotSchema);
  const missingFields = detectMissingFields(product);
  
  const filledFields = allFields.length - missingFields.length;
  return Math.round((filledFields / allFields.length) * 100);
}
