import { useState, useEffect } from "react";
import { fetchProductBySlug } from "../services/products-api";

const useProductDetail = (slug) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // API returns data as an array, get the first product
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          console.log("Product data from API:", data.data[0]);
          setProduct(data.data[0]);
        } else if (data.success && !Array.isArray(data.data) && data.data) {
          // Fallback for single object response
          console.log("Product data from API (single):", data.data);
          setProduct(data.data);
        } else {
          setError("Failed to fetch product details");
        }
      } catch (err) {
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
