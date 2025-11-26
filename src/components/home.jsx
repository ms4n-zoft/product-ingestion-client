import { Search, ArrowRight, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useProducts from "../hooks/use-products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const Home = () => {
  const navigate = useNavigate();
  const {
    products,
    pagination,
    isLoading,
    error,
    goToNextPage,
    goToPreviousPage,
  } = useProducts(12);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Command menu keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleProductClick = (product) => {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Pending Product Reviews
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total Products: {pagination.totalItems}
            </p>
          </div>
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
        {!error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="border shadow-none hover:border-primary/50 transition-colors cursor-pointer flex flex-col"
                  onClick={() => handleProductClick(product)}
                >
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <h2 className="font-semibold text-foreground">
                        {product.product_name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {product.company_name}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.industry?.slice(0, 2).map((ind, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className="mt-auto w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      Review Product <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
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
