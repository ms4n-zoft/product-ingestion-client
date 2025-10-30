import apiClient from "./api-client";

// Optimized for product listing pages and UI cards
export const fetchMinimalProducts = async (page = 1, pageSize = 10) => {
  try {
    const response = await apiClient.get("/products/minimal", {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching minimal products:", error);
    throw error;
  }
};

// Get product by MongoDB ObjectId
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Get product by slug - recommended for product detail pages
export const fetchProductBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }
};

// Full product data with complete snapshot object
export const fetchFullProducts = async (page = 1, pageSize = 10) => {
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
