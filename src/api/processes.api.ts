import { apiClient } from './client';

export interface Process {
  process_id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export const processesApi = {
  getProcesses: async () => {
    try {
      const response = await apiClient.get('/processes');
      // Handle paginated response
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      console.error('getProcesses error:', error);
      throw error;
    }
  },

  getProcess: async (id: number) => {
    const response = await apiClient.get<Process>(`/processes/${id}`);
    return response.data;
  },

  createProcess: async (data: Partial<Process>) => {
    const response = await apiClient.post<Process>('/processes', data);
    return response.data;
  },

  updateProcess: async (id: number, data: Partial<Process>) => {
    const response = await apiClient.put<Process>(`/processes/${id}`, data);
    return response.data;
  },

  deleteProcess: async (id: number) => {
    const response = await apiClient.delete(`/processes/${id}`);
    return response.data;
  },
};
