import { useState, useEffect } from "react";
import { fetchProductBySlug } from "../services/products-api";
import { Product } from "@/types";

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
        const data = await fetchProductBySlug(slug);

        // Same assumption about response structure
        if ((data as any).success && Array.isArray((data as any).data) && (data as any).data.length > 0) {
          setProduct((data as any).data[0]);
        } else if ((data as any).success && !Array.isArray((data as any).data) && (data as any).data) {
          setProduct((data as any).data);
        } else {
          setError("Failed to fetch product details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching product");
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
