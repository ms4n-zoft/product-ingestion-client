export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

export interface Field {
  key: string;
  label: string;
  value: unknown;
}

export interface FieldGroup {
  key: string;
  name: string;
  fields: Field[];
}

export const flattenObject = (obj: Record<string, unknown>, parentKey: string = ""): Field[] => {
  const fields: Field[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (isEmpty(value)) {
      return;
    }

    if (!parentKey && (obj.pricing as any)) {
      if (key === "pricing_overview" && (obj.pricing as any).overview) {
        return;
      }
      if (key === "pricing_details_web_url" && (obj.pricing as any).pricing_url) {
        return;
      }
    }

    const skipFields = ["review_sources"];
    if (
      skipFields.includes(key) ||
      (parentKey && skipFields.some((f) => fullKey.includes(f)))
    ) {
      return;
    }

    if (Array.isArray(value)) {
      const isArrayOfObjects = value.every(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item)
      );

      const keepAsWhole = [
        "pricing_plans",
        "features",
        "integrations",
        "deployment_options",
        "support_options",
        "social_links",
      ];
      const shouldKeepWhole = keepAsWhole.some((pattern) =>
        fullKey.includes(pattern)
      );

      if (isArrayOfObjects && value.length > 0) {
        if (shouldKeepWhole) {
          fields.push({
            key: fullKey,
            label: fullKey
              .replace(/_/g, " ")
              .replace(/\./g, " > ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            value: value,
          });
        } else {
          value.forEach((item, index) => {
            const itemKey = `${fullKey}[${index}]`;
            const itemLabel = `${fullKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())} #${index + 1}`;

            Object.entries(item).forEach(([subKey, subValue]) => {
              if (isEmpty(subValue)) return;

              const subFullKey = `${itemKey}.${subKey}`;
              const subLabel = `${itemLabel} > ${subKey
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}`;

              if (Array.isArray(subValue)) {
                fields.push({
                  key: subFullKey,
                  label: subLabel,
                  value: subValue,
                });
              } else if (typeof subValue === "object" && subValue !== null) {
                fields.push(...flattenObject(subValue as Record<string, unknown>, subFullKey));
              } else {
                fields.push({
                  key: subFullKey,
                  label: subLabel,
                  value:
                    typeof subValue === "boolean"
                      ? subValue
                        ? "True"
                        : "False"
                      : subValue,
                });
              }
            });
          });
        }
      } else {
        fields.push({
          key: fullKey,
          label: fullKey
            .replace(/_/g, " ")
            .replace(/\./g, " > ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          value: value,
        });
      }
      return;
    }

    if (typeof value === "object") {
      fields.push(...flattenObject(value as Record<string, unknown>, fullKey));
      return;
    }

    let label = fullKey
      .replace(/_/g, " ")
      .replace(/\./g, " > ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    label = label.replace(/Software Analysis/g, "Zoftware Analysis");

    fields.push({
      key: fullKey,
      label: label,
      value: typeof value === "boolean" ? (value ? "True" : "False") : value,
    });
  });

  return fields;
};

export const groupFieldsBySection = (fields: Field[]): FieldGroup[] => {
  const groups: Record<string, FieldGroup> = {};
  const groupOrder: string[] = [];

  fields.forEach((field) => {
    const topLevelKey = field.key.split(/[.[]/)[0];

    const sectionName = topLevelKey
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (!groups[topLevelKey]) {
      groups[topLevelKey] = {
        key: topLevelKey,
        name: sectionName,
        fields: [],
      };
      groupOrder.push(topLevelKey);
    }

    groups[topLevelKey].fields.push(field);
  });

  return groupOrder.map((key) => groups[key]);
};

export const flattenFields = flattenObject;
export const groupFields = groupFieldsBySection;
