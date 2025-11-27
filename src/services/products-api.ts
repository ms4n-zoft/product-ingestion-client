import apiClient from "./api-client";
import { Product } from "@/types";

export type SortOrder = "latest" | "oldest";

// Optimized for product listing pages and UI cards
export const fetchMinimalProducts = async (
  page: number = 1,
  pageSize: number = 10,
  sortBy: SortOrder = "latest"
): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products/minimal", {
      params: { page, pageSize, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching minimal products:", error);
    throw error;
  }
};

// Get product by MongoDB ObjectId
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Get product by slug - recommended for product detail pages
export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }
};

// Full product data with complete snapshot object
export const fetchFullProducts = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/products", {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching full products:", error);
    throw error;
  }
};
