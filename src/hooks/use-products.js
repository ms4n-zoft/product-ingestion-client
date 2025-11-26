import { useState, useEffect, useCallback } from "react";
import { fetchMinimalProducts } from "../services/products-api";

const useProducts = (pageSize = 10) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMinimalProducts(page, pageSize);

        if (data.success) {
          setProducts(data.data);
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
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
    (page) => {
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
