import { apiClient } from './client';

export interface Machine {
  machine_id: number;
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  active: boolean;
}

export const machinesApi = {
  getMachines: async () => {
    try {
      const response = await apiClient.get('/machines');
      // Handle paginated response
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      console.error('getMachines error:', error);
      throw error;
    }
  },

  getMachine: async (id: number) => {
    const response = await apiClient.get<Machine>(`/machines/${id}`);
    return response.data;
  },

  createMachine: async (data: Partial<Machine>) => {
    const response = await apiClient.post<Machine>('/machines', data);
    return response.data;
  },

  updateMachine: async (id: number, data: Partial<Machine>) => {
    const response = await apiClient.put<Machine>(`/machines/${id}`, data);
    return response.data;
  },

  deleteMachine: async (id: number) => {
    const response = await apiClient.delete(`/machines/${id}`);
    return response.data;
  },
};
