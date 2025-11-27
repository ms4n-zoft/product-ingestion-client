import {
  Search,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useProducts from "../hooks/use-products";
import useCommandMenu from "../hooks/use-command-menu";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Product, CompletionQuality } from "@/types";
import { getCompletionQuality } from "@/lib/completion-quality";

const FILTER_STORAGE_KEY = "product-completion-filter";

export const Home = () => {
  const navigate = useNavigate();

  // Load filter from localStorage
  const [selectedFilters, setSelectedFilters] = useState<
    Set<CompletionQuality>
  >(() => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CompletionQuality[];
        return new Set(parsed);
      }
    } catch (error) {
      console.error("Failed to load filter from localStorage:", error);
    }
    return new Set();
  });
  const {
    products,
    pagination,
    completionStats,
    isLoading,
    error,
    sortBy,
    setSortBy,
    goToNextPage,
    goToPreviousPage,
  } = useProducts(12);
  const [commandMenuOpen, setCommandMenuOpen] = useCommandMenu();

  // Save filter to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify(Array.from(selectedFilters))
      );
    } catch (error) {
      console.error("Failed to save filter to localStorage:", error);
    }
  }, [selectedFilters]);

  // Filter products by quality level (OR logic - show if matches ANY selected filter)
  const filteredProducts =
    selectedFilters.size === 0
      ? products
      : products.filter((product) => {
          const quality = getCompletionQuality(
            product.completion_percentage || 0
          );
          return selectedFilters.has(quality.level);
        });

  const toggleFilter = (filter: CompletionQuality) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filter)) {
        newSet.delete(filter);
      } else {
        newSet.add(filter);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters(new Set());
  };

  const filterOptions = [
    { level: "high" as CompletionQuality, label: "High" },
    { level: "medium" as CompletionQuality, label: "Medium" },
    { level: "low" as CompletionQuality, label: "Low" },
  ];

  // Debug: Log completion_percentage values
  useEffect(() => {
    if (products.length > 0) {
      console.log("=== Completion Percentage Debug ===");
      console.log("Total products loaded:", products.length);

      const completionStats = products.map((p) => ({
        name: p.product_name,
        completion: p.completion_percentage,
        hasField: "completion_percentage" in p,
      }));

      console.log("First 5 products:", completionStats.slice(0, 5));

      const withCompletion = products.filter(
        (p) => p.completion_percentage > 0
      ).length;
      const withoutCompletion = products.filter(
        (p) => !p.completion_percentage || p.completion_percentage === 0
      ).length;

      console.log("Products with completion > 0:", withCompletion);
      console.log("Products with completion = 0 or null:", withoutCompletion);
      console.log("===================================");
    }
  }, [products]);

  const handleProductClick = (product: Product) => {
    navigate("/review", { state: product });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Command Menu */}
      <CommandDialog open={commandMenuOpen} onOpenChange={setCommandMenuOpen}>
        <CommandInput placeholder="Search products..." />
        <CommandList>
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product._id}
                onSelect={() => {
                  handleProductClick(product);
                  setCommandMenuOpen(false);
                }}
                className="flex items-center justify-between py-3"
              >
                <div className="flex-1">
                  <div className="font-medium">{product.product_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.company_name}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Pending Product Reviews
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Products: {pagination.totalItems}
                </p>
              </div>
              {/* Completion Statistics */}
              {completionStats && (
                <div className="flex gap-4 pl-6 border-l border-muted">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground leading-none">
                        High
                      </p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400 leading-none">
                        {completionStats.high}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground leading-none">
                        Medium
                      </p>
                      <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 leading-none">
                        {completionStats.medium}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground leading-none">
                        Low
                      </p>
                      <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-none">
                        {completionStats.low}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCommandMenuOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Search size={16} />
                <span>Search</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Filter by:
            </span>
            <div className="flex gap-2">
              {filterOptions.map((option) => {
                const isSelected = selectedFilters.has(option.level);
                let buttonClass = "";

                if (isSelected) {
                  if (option.level === "high") {
                    buttonClass =
                      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700";
                  } else if (option.level === "medium") {
                    buttonClass =
                      "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700";
                  } else if (option.level === "low") {
                    buttonClass =
                      "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60";
                  }
                }

                return (
                  <Button
                    key={option.level}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(option.level)}
                    className={`text-xs ${buttonClass}`}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
            {selectedFilters.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-2 h-8 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium text-foreground">
              Sort by:
            </span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "latest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("latest")}
                className="text-xs"
              >
                Latest
              </Button>
              <Button
                variant={sortBy === "oldest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("oldest")}
                className="text-xs"
              >
                Oldest
              </Button>
            </div>
          </div>
        </div>

        {/* Initial Loading State */}
        {isLoading && products.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="text-destructive" size={20} />
            <div>
              <p className="font-semibold text-destructive">
                Error loading products
              </p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products available
            </p>
          </div>
        )}

        {/* Product Cards */}
        {!error && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between py-8 border-t">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={goToPreviousPage}
                  disabled={!pagination.hasPreviousPage || isLoading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <Button
                  onClick={goToNextPage}
                  disabled={!pagination.hasNextPage || isLoading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
