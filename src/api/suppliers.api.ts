import { apiClient } from './client';

export interface Supplier {
  supplier_id: number;
  business_name: string;
  trading_name?: string;
  tax_id?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  active: boolean;
}

export const suppliersApi = {
  getSuppliers: async () => {
    try {
      const response = await apiClient.get('/suppliers');
      // Handle paginated response
      return response.data.data || response.data;
    } catch (error: any) {
      console.log('getSuppliers error:', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getSupplier: async (id: number) => {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data: Partial<Supplier>) => {
    const response = await apiClient.post<Supplier>('/suppliers', data);
    return response.data;
  },

  updateSupplier: async (id: number, data: Partial<Supplier>) => {
    const response = await apiClient.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id: number) => {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data;
  },
};
