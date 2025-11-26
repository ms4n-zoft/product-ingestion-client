import ReviewApprovalUI from "./review-approval-ui";
import ReviewCommandMenu from "./review-command-menu";
import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useProductDetail from "../hooks/use-product-detail";
import useKeyboardShortcuts from "../hooks/use-keyboard-shortcuts";
import useCommandMenu from "../hooks/use-command-menu";
import { flattenObject, groupFieldsBySection } from "../lib/field-utils";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
  Keyboard,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviewed, setReviewed] = useState([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const sidebarSectionRefs = useRef({});

  const productFromState = location.state;
  const slug = productFromState?.product_slug;

  const { product, isLoading, error } = useProductDetail(slug);
  const currentProduct = product || productFromState;
  const [commandMenuOpen, setCommandMenuOpen] = useCommandMenu();

  const fieldsToReview = useMemo(() => {
    if (!currentProduct?.snapshot) return [];
    return flattenObject(currentProduct.snapshot);
  }, [currentProduct]);

  const groupedFields = useMemo(() => {
    return groupFieldsBySection(fieldsToReview);
  }, [fieldsToReview]);

  const progress = useMemo(() => {
    if (!fieldsToReview.length) return 0;
    return Math.round((reviewed.length / fieldsToReview.length) * 100);
  }, [reviewed, fieldsToReview.length]);

  const handleApprove = () => {
    if (currentFieldIndex !== null && fieldsToReview[currentFieldIndex]) {
      const currentField = fieldsToReview[currentFieldIndex];
      const isAlreadyReviewed = reviewed.includes(currentField.key);

      if (!isAlreadyReviewed) {
        setReviewed((prev) => [...prev, currentField.key]);

        const nextField = fieldsToReview
          .slice(currentFieldIndex + 1)
          .find((f) => !reviewed.includes(f.key));

        if (nextField) {
          const nextIndex = fieldsToReview.findIndex(
            (f) => f.key === nextField.key
          );
          setCurrentFieldIndex(nextIndex);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentFieldIndex < fieldsToReview.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  useKeyboardShortcuts({
    onApprove: handleApprove,
    onNext: handleNext,
    onPrevious: handlePrevious,
    enabled: !isLoading && fieldsToReview.length > 0,
  });

  useEffect(() => {
    if (currentFieldIndex !== null && fieldsToReview[currentFieldIndex]) {
      const currentField = fieldsToReview[currentFieldIndex];
      const topLevelKey = currentField.key.split(/[.\[]/)[0];
      const sectionElement = sidebarSectionRefs.current[topLevelKey];

      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [currentFieldIndex, fieldsToReview]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!currentProduct && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Product Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a product from the list to review
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ReviewCommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        fieldsToReview={fieldsToReview}
        groupedFields={groupedFields}
        reviewed={reviewed}
        onFieldSelect={setCurrentFieldIndex}
      />

      <aside className="w-60 bg-background border-r hidden md:flex flex-col h-screen">
        <div className="flex items-center gap-2 py-2.5 px-3 border-b flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">
              {currentProduct?.snapshot?.product_name ||
                currentProduct?.product_name ||
                "Product"}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {currentProduct?.snapshot?.company_name ||
                currentProduct?.company_name ||
                "Company"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Sections ({groupedFields.length})
            </h3>
            <nav className="flex flex-col space-y-1">
              {groupedFields.map((section) => {
                const reviewedInSection = section.fields.filter((field) =>
                  reviewed.includes(field.key)
                ).length;
                const totalInSection = section.fields.length;
                const isComplete = reviewedInSection === totalInSection;
                const progress = Math.round(
                  (reviewedInSection / totalInSection) * 100
                );

                const currentField = fieldsToReview[currentFieldIndex];
                const isSectionActive =
                  currentField && currentField.key.startsWith(section.key);

                const firstFieldIndex = fieldsToReview.findIndex((f) =>
                  f.key.startsWith(section.key)
                );

                return (
                  <button
                    key={section.key}
                    ref={(el) => (sidebarSectionRefs.current[section.key] = el)}
                    onClick={() =>
                      firstFieldIndex >= 0 &&
                      setCurrentFieldIndex(firstFieldIndex)
                    }
                    className={cn(
                      "px-2 py-2 rounded transition-all text-left w-full",
                      isSectionActive && "bg-muted",
                      isComplete && "bg-emerald-50",
                      "hover:bg-muted/50 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={cn(
                          "text-xs font-medium truncate",
                          isComplete ? "text-emerald-700" : "text-foreground"
                        )}
                      >
                        {section.name}
                      </h4>
                      {isComplete && (
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    {totalInSection > 1 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              isComplete ? "bg-emerald-500" : "bg-primary"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-medium whitespace-nowrap",
                            isComplete
                              ? "text-emerald-600"
                              : "text-muted-foreground"
                          )}
                        >
                          {reviewedInSection}/{totalInSection}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            isComplete
                              ? "text-emerald-600"
                              : "text-muted-foreground"
                          )}
                        >
                          {reviewedInSection}/{totalInSection}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="h-px bg-border my-2" />
          <div className="p-2 px-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Progress</span>
              <span className="font-medium text-foreground">
                {reviewed.length} / {fieldsToReview.length}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        <div className="border-b px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Back to Products"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-sm font-semibold">Review Fields</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setCommandMenuOpen(true)}
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-2"
            >
              <span>Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Badge variant="outline" className="text-xs font-normal">
              {reviewed.length} / {fieldsToReview.length}
            </Badge>
          </div>
        </div>

        <div className="border-b px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 bg-emerald-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap min-w-[3ch]">
              {progress}%
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="flex-1 overflow-y-auto relative">
            <ReviewApprovalUI
              reviewed={reviewed}
              setReviewed={setReviewed}
              fieldsToReview={fieldsToReview}
              groupedFields={groupedFields}
              currentFieldIndex={currentFieldIndex}
              setCurrentFieldIndex={setCurrentFieldIndex}
            />

            {fieldsToReview.length > 0 && (
              <>
                <div className="fixed bottom-6 right-5 z-40 min-w-[250px] border border-border bg-background/90 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm mb-2 font-semibold text-foreground/90">
                      Keyboard Shortcuts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {/* Search */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Search
                      </span>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          ⌘
                        </kbd>
                        <kbd className="px-1.5 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          K
                        </kbd>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Approve
                      </span>
                      <kbd className="px-2 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                        Space
                      </kbd>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Next
                      </span>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          J
                        </kbd>
                        <span className="text-[10px] text-muted-foreground/70">
                          or
                        </span>
                        <kbd className="px-1.5 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          ↓
                        </kbd>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Previous
                      </span>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          K
                        </kbd>
                        <span className="text-[10px] text-muted-foreground/70">
                          or
                        </span>
                        <kbd className="px-1.5 py-0.5 text-sm border rounded bg-muted/80 font-mono font-medium">
                          ↑
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewPage;
