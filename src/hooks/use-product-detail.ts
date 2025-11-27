import { useState, useEffect } from "react";
import { fetchProductBySlug } from "../services/products-api";
import { Product, ApiResponse } from "@/types";

interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

const useProductDetail = (slug: string | undefined): UseProductDetailResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchProductBySlug(slug);
        const data = response as unknown as ApiResponse<Product[] | Product>;

        // Same assumption about response structure
        if (data.success) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            setProduct(data.data[0]);
          } else if (!Array.isArray(data.data) && data.data) {
            setProduct(data.data as Product);
          } else {
             // Handle case where data is empty array or null but success is true
             setError("Product not found");
          }
        } else {
          setError("Failed to fetch product details");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching product";
        setError(errorMessage);
        console.error("useProductDetail error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return {
    product,
    isLoading,
    error,
  };
};

export default useProductDetail;
