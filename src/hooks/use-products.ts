import { useState, useEffect, useCallback } from "react";
import { fetchMinimalProducts, SortOrder } from "../services/products-api";
import { Product, Pagination, ApiResponse, CompletionStats } from "@/types";

interface UseProductsResult {
  products: Product[];
  pagination: Pagination;
  completionStats: CompletionStats | null;
  isLoading: boolean;
  error: string | null;
  sortBy: SortOrder;
  setSortBy: (sort: SortOrder) => void;
  fetchProducts: (page?: number) => Promise<void>;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

const useProducts = (pageSize: number = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [completionStats, setCompletionStats] =
    useState<CompletionStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOrder>("latest");

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchMinimalProducts(page, pageSize, sortBy);
        const data = response as unknown as ApiResponse<Product[]>;

        if (data.success) {
          // Assuming the API response structure matches what was inferred or seen in JS
          // If fetchMinimalProducts returns the data directly (as per my previous edit), I might need to adjust.
          // Wait, in products-api.ts I returned response.data.
          // Let's check products-api.ts again.
          // It returns response.data.
          // The JS code used `data.success` and `data.data`.
          // So response.data contains { success: boolean, data: Product[], pagination: ... }
          // I should update products-api.ts return type to reflect this wrapper if needed, or cast here.
          // For now I'll cast to any to access properties, but ideally I should define an ApiResponse type.
          // I'll define ApiResponse in types/index.ts later or locally.
          setProducts(data.data);
          if (data.pagination) {
            setPagination(data.pagination);
          }
          if (data.completionStats) {
            setCompletionStats(data.completionStats);
          }
        } else {
          setError("Failed to fetch products");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching products";
        setError(errorMessage);
        console.error("useProducts error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, sortBy]
  );

  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchProducts(pagination.currentPage + 1);
    }
  }, [pagination, fetchProducts]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      fetchProducts(pagination.currentPage - 1);
    }
  }, [pagination, fetchProducts]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchProducts(page);
      }
    },
    [pagination.totalPages, fetchProducts]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return {
    products,
    pagination,
    completionStats,
    isLoading,
    error,
    sortBy,
    setSortBy,
    fetchProducts,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};

export default useProducts;
