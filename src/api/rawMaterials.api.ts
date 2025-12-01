import { apiClient } from './client';

export interface RawMaterialBase {
  material_id: number;
  category_id: number;
  unit_id: number;
  code: string;
  name: string;
  description?: string;
  available_quantity: number;
  minimum_stock: number;
  maximum_stock?: number;
  image_url?: string;
  active: boolean;
  category?: {
    category_id: number;
    name: string;
  };
  unit?: {
    unit_id: number;
    code: string;
    name: string;
    abbreviation?: string;
  };
}

export interface RawMaterial {
  raw_material_id: number;
  material_id: number;
  supplier_id: number;
  supplier_batch?: string;
  invoice_number?: string;
  receipt_date: string;
  expiration_date?: string;
  quantity: number;
  available_quantity: number;
  receipt_conformity?: boolean;
  observations?: string;
  material_base?: RawMaterialBase;
  supplier?: {
    supplier_id: number;
    business_name: string;
    trading_name?: string;
  };
}

export interface RawMaterialCategory {
  category_id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export const rawMaterialsApi = {
  // Raw Material Bases
  getRawMaterialBases: async () => {
    const response = await apiClient.get('/raw-material-bases');
    console.log('getRawMaterialBases response:', response.data);
    // Handle paginated response
    const data = (response.data as any).data || response.data;
    console.log('Material bases extracted:', data);
    return data;
  },

  getRawMaterialBase: async (id: number) => {
    const response = await apiClient.get<RawMaterialBase>(`/raw-material-bases/${id}`);
    return response.data;
  },

  createRawMaterialBase: async (data: Partial<RawMaterialBase>) => {
    const response = await apiClient.post<RawMaterialBase>('/raw-material-bases', data);
    return response.data;
  },

  updateRawMaterialBase: async (id: number, data: Partial<RawMaterialBase>) => {
    const response = await apiClient.put<RawMaterialBase>(`/raw-material-bases/${id}`, data);
    return response.data;
  },

  deleteRawMaterialBase: async (id: number) => {
    const response = await apiClient.delete(`/raw-material-bases/${id}`);
    return response.data;
  },

  // Raw Materials
  getRawMaterials: async () => {
    try {
      console.log('Fetching raw materials...');
      const response = await apiClient.get('/raw-materials');
      console.log('Raw materials API response:', response.data);
      
      // Handle paginated response - extract data array
      const materials = response.data.data || response.data;
      console.log('Raw materials received:', materials?.length || 0);
      console.log('Materials data:', materials);
      return materials || [];
    } catch (error: any) {
      console.log('getRawMaterials error:', error.response?.status, error.response?.data || error.message);
      // Return empty array if no data found
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getRawMaterial: async (id: number) => {
    const response = await apiClient.get<RawMaterial>(`/raw-materials/${id}`);
    return response.data;
  },

  createRawMaterial: async (data: Partial<RawMaterial>) => {
    const response = await apiClient.post<RawMaterial>('/raw-materials', data);
    return response.data;
  },

  updateRawMaterial: async (id: number, data: Partial<RawMaterial>) => {
    const response = await apiClient.put<RawMaterial>(`/raw-materials/${id}`, data);
    return response.data;
  },

  deleteRawMaterial: async (id: number) => {
    const response = await apiClient.delete(`/raw-materials/${id}`);
    return response.data;
  },

  // Raw Material Categories
  getRawMaterialCategories: async () => {
    const response = await apiClient.get<RawMaterialCategory[]>('/raw-material-categories');
    return response.data;
  },

  getRawMaterialCategory: async (id: number) => {
    const response = await apiClient.get<RawMaterialCategory>(`/raw-material-categories/${id}`);
    return response.data;
  },

  createRawMaterialCategory: async (data: Partial<RawMaterialCategory>) => {
    const response = await apiClient.post<RawMaterialCategory>('/raw-material-categories', data);
    return response.data;
  },

  updateRawMaterialCategory: async (id: number, data: Partial<RawMaterialCategory>) => {
    const response = await apiClient.put<RawMaterialCategory>(`/raw-material-categories/${id}`, data);
    return response.data;
  },

  deleteRawMaterialCategory: async (id: number) => {
    const response = await apiClient.delete(`/raw-material-categories/${id}`);
    return response.data;
  },
};