import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { flattenFields, groupFields } from "@/lib/field-utils";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import ReviewApprovalUI from "./review-approval-ui";
import ReviewCommandMenu from "./review-command-menu";
import MissingFieldsPanel from "./missing-fields-panel";
import { Product } from "@/types";
import { fetchProductById } from "@/services/products-api";

export default function ReviewScreenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const minimalProduct = location.state as Product;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number | null>(0);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Fetch full product data when component mounts
  useEffect(() => {
    const loadFullProduct = async () => {
      if (!minimalProduct?._id) {
        navigate("/");
        return;
      }

      try {
        setIsLoadingProduct(true);
        const fullProduct = await fetchProductById(minimalProduct._id);
        setProduct(fullProduct);
      } catch (error) {
        console.error("Error loading full product:", error);
        // Fallback to minimal product if fetch fails
        setProduct(minimalProduct);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadFullProduct();
  }, [minimalProduct, navigate]);

  const fieldsToReview = useMemo(() => {
    if (!product) return [];
    return flattenFields(product);
  }, [product]);

  const groupedFields = useMemo(() => {
    if (!product) return [];
    return groupFields(fieldsToReview);
  }, [fieldsToReview]);

  const handleApprove = () => {
    if (currentFieldIndex !== null && fieldsToReview[currentFieldIndex]) {
      const field = fieldsToReview[currentFieldIndex];
      if (!reviewed.includes(field.key)) {
        setReviewed((prev) => [...prev, field.key]);
      }
      // Move to next field
      const nextIndex = currentFieldIndex + 1;
      if (nextIndex < fieldsToReview.length) {
        setCurrentFieldIndex(nextIndex);
      }
    }
  };

  const handleNext = () => {
    if (currentFieldIndex !== null && currentFieldIndex < fieldsToReview.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFieldIndex !== null && currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  useKeyboardShortcuts({
    onApprove: handleApprove,
    onNext: handleNext,
    onPrevious: handlePrevious,
    enabled: !commandMenuOpen,
  });

  // Show loading state while fetching full product
  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const progress = Math.round((reviewed.length / fieldsToReview.length) * 100);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">{product.product_name}</h1>
            <p className="text-xs text-muted-foreground">{product.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <div className="text-xs font-medium mb-1">
              Progress: {progress}% ({reviewed.length}/{fieldsToReview.length})
            </div>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setCommandMenuOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search Fields</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Finalize Review
          </Button>
        </div>
      </div>

      {/* Main Content - 60/40 Split */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Side - Review UI (60%) */}
        <div className="w-[60%] border-r h-full overflow-hidden">
          <ReviewApprovalUI
            reviewed={reviewed}
            fieldsToReview={fieldsToReview}
            groupedFields={groupedFields}
            setReviewed={setReviewed}
            currentFieldIndex={currentFieldIndex}
            setCurrentFieldIndex={setCurrentFieldIndex}
          />
        </div>

        {/* Right Side - Missing Fields (40%) */}
        <div className="w-[40%] h-full overflow-hidden">
          <MissingFieldsPanel product={product} />
        </div>
      </div>

      <ReviewCommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        fieldsToReview={fieldsToReview}
        groupedFields={groupedFields}
        reviewed={reviewed}
        onFieldSelect={setCurrentFieldIndex}
      />
    </div>
  );
}
