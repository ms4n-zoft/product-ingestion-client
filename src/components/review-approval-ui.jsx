import { useRef, useEffect, useState, useMemo } from "react";
import { CheckCircle2, Circle, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ReviewCard,
  ReviewCardContent,
  ReviewCardHeader,
  ReviewCardTitle,
} from "@/components/ui/review-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function ReviewApprovalUI({
  reviewed,
  fieldsToReview,
  groupedFields,
  setReviewed,
  currentFieldIndex,
  setCurrentFieldIndex,
}) {
  const fieldRefs = useRef({});

  // Scroll to current field when index changes - using "start" to avoid jump issues
  useEffect(() => {
    if (currentFieldIndex !== null && fieldsToReview[currentFieldIndex]) {
      const field = fieldsToReview[currentFieldIndex];
      const element = fieldRefs.current[field.key];

      if (element) {
        // Use "start" alignment so collapsing sections above don't affect scroll position
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentFieldIndex, fieldsToReview]);

  // Approve field - mark as reviewed and move to next
  const approveField = (key) => {
    setReviewed((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];

      if (!prev.includes(key)) {
        // Find next unreviewed field
        const currentIndex = fieldsToReview.findIndex((f) => f.key === key);
        const nextField = fieldsToReview
          .slice(currentIndex + 1)
          .find((f) => !updated.includes(f.key));

        if (nextField) {
          const nextIndex = fieldsToReview.findIndex(
            (f) => f.key === nextField.key
          );
          setCurrentFieldIndex(nextIndex);
        }
      }

      return updated;
    });
  };

  // Render field value based on type
  const renderFieldValue = (value, fieldKey) => {
    // Special handling for review strengths and weaknesses - show as bullet points
    const isReviewStrengthsOrWeakness =
      fieldKey?.includes("review_strengths") ||
      fieldKey?.includes("reviews_strengths") ||
      fieldKey?.includes("reviews_weakness") ||
      fieldKey?.includes("review_weakness");

    // Case 1: Array of objects
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <span className="text-muted-foreground italic">Empty Array</span>
        );
      }

      const isArrayOfObjects = value.every(
        (item) => typeof item === "object" && item !== null
      );

      if (isArrayOfObjects) {
        // Special rendering for pricing plans, features, social links, and options
        const isPricingPlans = fieldKey?.includes("pricing_plans");
        const isFeatures = fieldKey?.includes("features");
        const isSocialLinks =
          fieldKey?.includes("social_links") ||
          fieldKey?.includes("social_profiles");
        const isDeploymentOptions = fieldKey?.includes("deployment_options");
        const isSupportOptions = fieldKey?.includes("support_options");
        const isIntegrations = fieldKey?.includes("integrations");

        if (isPricingPlans) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {value.map((plan, idx) => (
                <Card
                  key={idx}
                  className="border-2 shadow-none hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {plan.plan || `Plan ${idx + 1}`}
                    </CardTitle>
                    {plan.entity && (
                      <p className="text-xs text-muted-foreground">
                        {plan.entity}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Price */}
                    {plan.amount && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">
                          {plan.amount}
                        </span>
                        {plan.currency && (
                          <span className="text-sm text-muted-foreground">
                            {plan.currency}
                          </span>
                        )}
                        {plan.period && (
                          <span className="text-sm text-muted-foreground">
                            / {plan.period}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Free badge */}
                    {plan.is_free && (
                      <Badge variant="default" className="bg-emerald-600">
                        Free
                      </Badge>
                    )}

                    {/* Description */}
                    {plan.description && Array.isArray(plan.description) && (
                      <ul className="space-y-2 text-sm">
                        {plan.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Other fields */}
                    {Object.entries(plan).map(([k, val]) => {
                      if (
                        [
                          "plan",
                          "entity",
                          "amount",
                          "currency",
                          "period",
                          "description",
                          "is_free",
                        ].includes(k)
                      ) {
                        return null;
                      }
                      return (
                        <div key={k} className="text-sm">
                          <span className="font-medium capitalize">
                            {k.replace(/_/g, " ")}:{" "}
                          </span>
                          <span className="text-muted-foreground">
                            {val?.toString?.() ?? "—"}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        }

        if (isFeatures) {
          return (
            <div className="space-y-2">
              {value.map((feature, idx) => (
                <Card key={idx} className="border shadow-none">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {feature.name}
                        </h4>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        }

        if (isSocialLinks) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {value.map((link, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-card">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-sm">{link.platform}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary hover:underline break-all leading-relaxed block"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (isDeploymentOptions || isSupportOptions) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {value.map((option, idx) => (
                <div key={idx} className="border rounded-lg p-2 bg-card">
                  <p className="font-medium text-xs">
                    {option.type || option.name}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        if (isIntegrations) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {value.map((integration, idx) => (
                <div key={idx} className="border rounded-lg p-2 bg-card">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs">{integration.name}</p>
                    {integration.website && (
                      <a
                        href={integration.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-muted-foreground hover:text-primary hover:underline break-all leading-tight block"
                      >
                        {integration.website}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        // Default rendering for other arrays of objects
        return (
          <div className="space-y-3">
            {value.map((obj, idx) => (
              <Card key={idx} className="border-muted shadow-none">
                <CardContent className="pt-4">
                  {Object.entries(obj)
                    .filter(([k, val]) => {
                      // Skip empty/null values
                      if (val === null || val === undefined || val === "")
                        return false;
                      // Skip logo field if it's empty or just a dash
                      if (k === "logo" && (!val || val === "—")) return false;
                      return true;
                    })
                    .map(([k, val]) => {
                      // Format label - capitalize normally, but make URL all caps
                      let label = k.replace(/_/g, " ");
                      if (label.toLowerCase() === "url") {
                        label = "URL";
                      } else {
                        label = label.replace(/\b\w/g, (c) => c.toUpperCase());
                      }

                      return (
                        <div
                          key={k}
                          className="flex items-start gap-3 text-sm mb-3 last:mb-0"
                        >
                          <span className="font-medium text-foreground min-w-32">
                            {label}:
                          </span>
                          <span className="text-muted-foreground flex-1">
                            {Array.isArray(val) ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {val.map((item, i) => (
                                  <li key={i}>{item?.toString?.() ?? "—"}</li>
                                ))}
                              </ul>
                            ) : typeof val === "object" && val !== null ? (
                              <pre className="whitespace-pre-wrap text-xs bg-muted border rounded p-2 overflow-x-auto">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            ) : (
                              val?.toString?.() ?? "—"
                            )}
                          </span>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      } else {
        // Array of primitives
        if (isReviewStrengthsOrWeakness) {
          // Show as bullet points for review strengths/weaknesses
          return (
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              {value.map((item, i) => (
                <li key={i} className="text-muted-foreground">
                  {item?.toString?.() ?? "—"}
                </li>
              ))}
            </ul>
          );
        }

        // Default: show as badges
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((item, i) => (
              <Badge key={i} variant="secondary">
                {item?.toString?.() ?? "—"}
              </Badge>
            ))}
          </div>
        );
      }
    }

    // Case 2: Object (non-array)
    if (typeof value === "object" && value !== null) {
      return (
        <pre className="whitespace-pre-wrap text-sm bg-muted border rounded-lg p-4 overflow-x-auto max-h-96">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    // Case 3: Primitives (string, number, boolean, null)
    if (typeof value === "string") {
      // Check if this is HTML content (for software_analysis fields)
      const isHTML =
        value.includes("<p>") ||
        value.includes("<ul>") ||
        value.includes("<li>") ||
        value.includes("<strong>");
      const isSoftwareAnalysis = fieldKey?.includes("software_analysis");

      if (isHTML && isSoftwareAnalysis) {
        // Render HTML content
        return (
          <div
            className="text-sm leading-relaxed prose prose-sm max-w-none
                       prose-p:my-2 prose-ul:my-2 prose-li:my-1
                       prose-strong:font-semibold prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        );
      }

      // Long text
      if (value.length > 200) {
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {value}
          </p>
        );
      }
    }

    return <p className="text-sm font-medium">{value?.toString?.() ?? "—"}</p>;
  };

  // Calculate section statistics
  const sectionStats = useMemo(() => {
    const stats = {};

    groupedFields.forEach((section) => {
      const reviewedCount = section.fields.filter((field) =>
        reviewed.includes(field.key)
      ).length;
      const totalCount = section.fields.length;

      stats[section.key] = {
        reviewed: reviewedCount,
        total: totalCount,
        progress: Math.round((reviewedCount / totalCount) * 100),
      };
    });

    return stats;
  }, [groupedFields, reviewed]);

  // Determine which sections should be open by default (sections with current field)
  const currentSection = useMemo(() => {
    if (currentFieldIndex === null || !fieldsToReview[currentFieldIndex])
      return null;
    const currentField = fieldsToReview[currentFieldIndex];
    const topLevelKey = currentField.key.split(/[\.\[]/)[0];
    return topLevelKey;
  }, [currentFieldIndex, fieldsToReview]);

  // Track which sections are open
  const [openSections, setOpenSections] = useState(() =>
    groupedFields.map((section) => section.key)
  );

  // Ensure current section is always open
  useEffect(() => {
    if (currentSection && !openSections.includes(currentSection)) {
      setOpenSections((prev) => [...prev, currentSection]);
    }
  }, [currentSection]);

  // Update open sections when groupedFields changes (on initial load)
  useEffect(() => {
    setOpenSections(groupedFields.map((section) => section.key));
  }, [groupedFields.length]);

  // Auto-collapse sections when all fields are approved
  useEffect(() => {
    const completedSections = groupedFields
      .filter((section) => {
        const allFieldsReviewed = section.fields.every((field) =>
          reviewed.includes(field.key)
        );
        return allFieldsReviewed && section.fields.length > 0;
      })
      .map((section) => section.key);

    if (completedSections.length > 0) {
      setOpenSections((prev) =>
        prev.filter((key) => !completedSections.includes(key))
      );
    }
  }, [reviewed, groupedFields]);

  // Render individual field card
  const renderFieldCard = (field, index, isOnlyFieldInSection = false) => {
    const isReviewed = reviewed.includes(field.key);
    const isCurrent = currentFieldIndex === index;

    return (
      <ReviewCard
        key={field.key}
        ref={(el) => (fieldRefs.current[field.key] = el)}
        onClick={() => setCurrentFieldIndex(index)}
        className={cn(
          "transition-all duration-200 cursor-pointer",
          isReviewed && "opacity-50 bg-emerald-50/50 border-emerald-200",
          isCurrent &&
            !isReviewed &&
            "border-amber-500 border-2 bg-amber-50/30",
          !isCurrent && !isReviewed && "border-border"
        )}
      >
        {/* Header with Approve Button - only show if NOT the only field in section */}
        {!isOnlyFieldInSection && (
          <ReviewCardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <ReviewCardTitle className="text-sm flex items-center gap-2">
                  {field.label}
                  {isCurrent && !isReviewed && (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      Current
                    </Badge>
                  )}
                </ReviewCardTitle>
                {isReviewed && (
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                  </p>
                )}
              </div>
              <Button
                onClick={() => approveField(field.key)}
                variant={isReviewed ? "outline" : "default"}
                size="sm"
                className={cn(
                  "flex-shrink-0 gap-1.5 h-7 text-xs",
                  isReviewed &&
                    "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                )}
              >
                {isReviewed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    Approve
                  </>
                )}
              </Button>
            </div>
          </ReviewCardHeader>
        )}

        {/* For single-field sections, show status badges at top */}
        {isOnlyFieldInSection && (
          <div className="p-3 pb-2">
            {isCurrent && !isReviewed && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                Current
              </Badge>
            )}
            {isReviewed && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Approved
              </p>
            )}
          </div>
        )}

        {/* Field Value */}
        <ReviewCardContent
          className={
            isOnlyFieldInSection && !isCurrent && !isReviewed ? "pt-3" : ""
          }
        >
          {renderFieldValue(field.value, field.key)}
        </ReviewCardContent>

        {/* For single-field sections, show approve button at bottom-right */}
        {isOnlyFieldInSection && (
          <div className="px-3 pb-3 flex justify-end">
            <Button
              onClick={() => approveField(field.key)}
              variant={isReviewed ? "outline" : "default"}
              size="sm"
              className={cn(
                "gap-1.5 h-7 text-xs",
                isReviewed &&
                  "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              )}
            >
              {isReviewed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approved
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5" />
                  Approve
                </>
              )}
            </Button>
          </div>
        )}
      </ReviewCard>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4">
        {groupedFields.length > 0 ? (
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="space-y-4"
          >
            {groupedFields.map((section) => {
              const stats = sectionStats[section.key];
              const isComplete = stats.reviewed === stats.total;

              return (
                <AccordionItem
                  key={section.key}
                  value={section.key}
                  className="border rounded-lg bg-card shadow-none"
                >
                  <AccordionTrigger
                    value={section.key}
                    className={cn(
                      "hover:no-underline",
                      isComplete && "bg-emerald-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full pr-4">
                      <h3 className="text-base font-semibold text-foreground">
                        {section.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        {isComplete && (
                          <BadgeCheck className="w-5 h-5 text-emerald-600" />
                        )}
                        <Badge
                          variant={isComplete ? "default" : "secondary"}
                          className={cn(
                            "text-xs",
                            isComplete && "bg-emerald-600 hover:bg-emerald-700"
                          )}
                        >
                          {stats.reviewed} / {stats.total}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent value={section.key}>
                    <div className="px-4 space-y-3">
                      {section.fields.map((field) => {
                        const index = fieldsToReview.findIndex(
                          (f) => f.key === field.key
                        );
                        const isOnlyField = section.fields.length === 1;
                        return renderFieldCard(field, index, isOnlyField);
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                No fields to review
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
