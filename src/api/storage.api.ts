import { apiClient } from './client';

export interface Storage {
  storage_id: number;
  production_batch_id: number;
  location: string;
  storage_date: string;
  quantity: number;
  unit_of_measure_id: number;
  status_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  production_batch?: {
    production_batch_id: number;
    customer_order?: {
      product_name: string;
      customer?: {
        name: string;
      };
    };
  };
  unit_of_measure?: {
    unit_of_measure_id: number;
    name: string;
    abbreviation: string;
  };
  status?: {
    status_id: number;
    name: string;
  };
}

export interface MaterialMovementLog {
  material_movement_log_id: number;
  raw_material_id: number;
  movement_type_id: number;
  quantity: number;
  movement_date: string;
  operator_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  raw_material?: {
    raw_material_id: number;
    lot_number: string;
    base?: {
      name: string;
    };
    supplier?: {
      name: string;
    };
  };
  movement_type?: {
    movement_type_id: number;
    name: string;
    description?: string;
  };
  operator?: {
    operator_id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
}

export interface MaterialRequest {
  material_request_id: number;
  operator_id: number;
  raw_material_base_id: number;
  quantity_requested: number;
  unit_of_measure_id: number;
  status_id: number;
  request_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  operator?: {
    operator_id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  raw_material_base?: {
    raw_material_base_id: number;
    name: string;
    category?: {
      name: string;
    };
  };
  unit_of_measure?: {
    unit_of_measure_id: number;
    name: string;
    abbreviation: string;
  };
  status?: {
    status_id: number;
    name: string;
  };
}

export interface MaterialRequestDetail {
  material_request_detail_id: number;
  material_request_id: number;
  raw_material_id?: number;
  quantity_provided: number;
  provided_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  material_request?: MaterialRequest;
  raw_material?: {
    raw_material_id: number;
    lot_number: string;
    base?: {
      name: string;
    };
  };
}

export const storageApi = {
  // Storage
  getStorages: async () => {
    const response = await apiClient.get<Storage[]>('/storages');
    return response.data;
  },

  getStorage: async (id: number) => {
    const response = await apiClient.get<Storage>(`/storages/${id}`);
    return response.data;
  },

  getStoragesByBatch: async (batchId: number) => {
    const response = await apiClient.get<Storage[]>(`/storages/batch/${batchId}`);
    return response.data;
  },

  createStorage: async (data: Partial<Storage>) => {
    const response = await apiClient.post<Storage>('/storages', data);
    return response.data;
  },

  updateStorage: async (id: number, data: Partial<Storage>) => {
    const response = await apiClient.put<Storage>(`/storages/${id}`, data);
    return response.data;
  },

  deleteStorage: async (id: number) => {
    const response = await apiClient.delete(`/storages/${id}`);
    return response.data;
  },

  // Material Movement Logs
  getMaterialMovementLogs: async () => {
    const response = await apiClient.get<MaterialMovementLog[]>('/material-movement-logs');
    return response.data;
  },

  getMaterialMovementLog: async (id: number) => {
    const response = await apiClient.get<MaterialMovementLog>(`/material-movement-logs/${id}`);
    return response.data;
  },

  getMaterialMovementLogsByMaterial: async (materialId: number) => {
    const response = await apiClient.get<MaterialMovementLog[]>(`/material-movement-logs/material/${materialId}`);
    return response.data;
  },

  createMaterialMovementLog: async (data: Partial<MaterialMovementLog>) => {
    const response = await apiClient.post<MaterialMovementLog>('/material-movement-logs', data);
    return response.data;
  },

  updateMaterialMovementLog: async (id: number, data: Partial<MaterialMovementLog>) => {
    const response = await apiClient.put<MaterialMovementLog>(`/material-movement-logs/${id}`, data);
    return response.data;
  },

  deleteMaterialMovementLog: async (id: number) => {
    const response = await apiClient.delete(`/material-movement-logs/${id}`);
    return response.data;
  },

  // Material Requests
  getMaterialRequests: async () => {
    const response = await apiClient.get<MaterialRequest[]>('/material-requests');
    return response.data;
  },

  getMaterialRequest: async (id: number) => {
    const response = await apiClient.get<MaterialRequest>(`/material-requests/${id}`);
    return response.data;
  },

  createMaterialRequest: async (data: Partial<MaterialRequest>) => {
    const response = await apiClient.post<MaterialRequest>('/material-requests', data);
    return response.data;
  },

  updateMaterialRequest: async (id: number, data: Partial<MaterialRequest>) => {
    const response = await apiClient.put<MaterialRequest>(`/material-requests/${id}`, data);
    return response.data;
  },

  deleteMaterialRequest: async (id: number) => {
    const response = await apiClient.delete(`/material-requests/${id}`);
    return response.data;
  },

  // Material Request Details
  getMaterialRequestDetails: async () => {
    const response = await apiClient.get<MaterialRequestDetail[]>('/material-request-details');
    return response.data;
  },

  getMaterialRequestDetail: async (id: number) => {
    const response = await apiClient.get<MaterialRequestDetail>(`/material-request-details/${id}`);
    return response.data;
  },

  createMaterialRequestDetail: async (data: Partial<MaterialRequestDetail>) => {
    const response = await apiClient.post<MaterialRequestDetail>('/material-request-details', data);
    return response.data;
  },

  updateMaterialRequestDetail: async (id: number, data: Partial<MaterialRequestDetail>) => {
    const response = await apiClient.put<MaterialRequestDetail>(`/material-request-details/${id}`, data);
    return response.data;
  },

  deleteMaterialRequestDetail: async (id: number) => {
    const response = await apiClient.delete(`/material-request-details/${id}`);
    return response.data;
  },
};