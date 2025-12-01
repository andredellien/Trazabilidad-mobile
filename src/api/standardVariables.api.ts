import { apiClient } from './client';

export interface StandardVariable {
  variable_id: number;
  code: string;
  name: string;
  unit?: string;
  description?: string;
  active: boolean;
}

export interface CreateStandardVariableData {
  name: string;
  unit?: string;
  description?: string;
  active?: boolean;
}

export const standardVariablesApi = {
  getStandardVariables: async (): Promise<StandardVariable[]> => {
    try {
      const response = await apiClient.get('/standard-variables');
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      console.error('getStandardVariables error:', error);
      throw error;
    }
  },

  getStandardVariable: async (id: number): Promise<StandardVariable> => {
    const response = await apiClient.get<StandardVariable>(`/standard-variables/${id}`);
    return response.data;
  },

  createStandardVariable: async (data: CreateStandardVariableData): Promise<StandardVariable> => {
    const response = await apiClient.post<StandardVariable>('/standard-variables', data);
    return response.data;
  },

  updateStandardVariable: async (id: number, data: Partial<CreateStandardVariableData>): Promise<StandardVariable> => {
    const response = await apiClient.put<StandardVariable>(`/standard-variables/${id}`, data);
    return response.data;
  },

  deleteStandardVariable: async (id: number): Promise<void> => {
    await apiClient.delete(`/standard-variables/${id}`);
  },
};
