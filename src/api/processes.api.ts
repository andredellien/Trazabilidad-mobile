import { apiClient } from './client';

export interface Machine {
  machine_id: number;
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  active: boolean;
}

export interface ProcessMachine {
  process_machine_id?: number;
  process_id?: number;
  machine_id: number;
  step_order: number;
  name: string;
  description?: string;
  estimated_time?: number;
  machine?: Machine;
}

export interface Process {
  process_id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  process_machines?: ProcessMachine[];
}

export interface CreateProcessData {
  name: string;
  description?: string;
  active?: boolean;
  process_machines?: Omit<ProcessMachine, 'process_machine_id' | 'process_id' | 'machine'>[];
}

export const processesApi = {
  getProcesses: async (includeMachines: boolean = false) => {
    try {
      const url = includeMachines ? '/processes?include=machines' : '/processes';
      const response = await apiClient.get(url);
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      console.error('getProcesses error:', error);
      throw error;
    }
  },

  getProcess: async (id: number): Promise<Process> => {
    const response = await apiClient.get<Process>(`/processes/${id}`);
    return response.data;
  },

  createProcess: async (data: CreateProcessData): Promise<Process> => {
    const response = await apiClient.post<Process>('/processes', data);
    return response.data;
  },

  updateProcess: async (id: number, data: Partial<CreateProcessData>): Promise<Process> => {
    const response = await apiClient.put<Process>(`/processes/${id}`, data);
    return response.data;
  },

  deleteProcess: async (id: number): Promise<void> => {
    await apiClient.delete(`/processes/${id}`);
  },
};
