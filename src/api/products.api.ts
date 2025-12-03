import { apiClient } from './client';

export interface Product {
  product_id: number;
  name: string;
  description?: string;
  type: string;
  weight: number;
  unit_id: number;
  unit?: {
    unit_id: number;
    name: string;
    abbreviation: string;
  };
  active: boolean;
}

export const productsApi = {
  getProducts: async () => {
    const response = await apiClient.get('/products');
    // Handle potential pagination or direct array response
    return response.data.data || response.data;
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};
