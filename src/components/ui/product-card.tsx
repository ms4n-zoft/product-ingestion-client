import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import {
  getCompletionQuality,
  getQualityBadgeVariant,
} from "@/lib/completion-quality";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const qualityInfo = getCompletionQuality(product.completion_percentage || 0);

  // Get first letter of product name for fallback
  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div
      className="group border rounded-lg hover:border-primary/50 transition-all cursor-pointer bg-card overflow-hidden flex flex-col h-full"
      onClick={() => onClick(product)}
    >
      {/* Header with Logo and Badge */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-3 flex-shrink-0">
        {/* Logo or Fallback */}
        <div className="shrink-0">
          {product.logo_url ? (
            <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={product.logo_url}
                alt={`${product.product_name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    (
                      e.currentTarget.nextElementSibling as HTMLElement
                    ).style.display = "flex";
                  }
                }}
              />
              <div className="w-full h-full hidden items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
                {getInitial(product.product_name)}
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-md border bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {getInitial(product.product_name)}
              </span>
            </div>
          )}
        </div>

        {/* Title and Company */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground leading-tight mb-0.5 truncate text-sm">
            {product.product_name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {product.company_name}
          </p>
        </div>

        {/* Quality Badge */}
        <Badge
          variant={getQualityBadgeVariant(qualityInfo.level)}
          className="text-xs shrink-0"
        >
          {qualityInfo.label}
        </Badge>
      </div>

      {/* Description - Fixed height for 2 lines */}
      <div className="px-5 pb-4 flex-shrink-0 h-[56px] flex items-center">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.short_description || product.description}
        </p>
      </div>

      {/* Industry Tags - Fixed height for 2 lines max */}
      <div className="px-5 pb-4 flex-shrink-0 h-[60px] flex items-start">
        {product.industry && product.industry.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {product.industry.slice(0, 2).map((ind, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {ind}
              </Badge>
            ))}
            {product.industry.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{product.industry.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <div className="w-full" />
        )}
      </div>

      {/* Action Button - Pushes to bottom */}
      <div className="px-5 pb-5 mt-auto flex-shrink-0">
        <Button
          className="w-full gap-2"
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            onClick(product);
          }}
        >
          Review Product <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
