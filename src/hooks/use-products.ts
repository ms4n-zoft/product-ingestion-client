import { useState, useEffect, useCallback } from "react";
import { fetchMinimalProducts } from "../services/products-api";
import { Product } from "@/types";

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseProductsResult {
  products: Product[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMinimalProducts(page, pageSize);

        if ((data as any).success) {
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
          setProducts((data as any).data);
          setPagination((data as any).pagination);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching products");
        console.error("useProducts error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
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
    isLoading,
    error,
    fetchProducts,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};

export default useProducts;
