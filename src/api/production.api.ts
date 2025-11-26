import { apiClient } from './client';

export interface ProductionBatch {
  batch_id: number;
  order_id: number;
  batch_code: string;
  name: string;
  creation_date: string;
  start_time?: string;
  end_time?: string;
  target_quantity?: number;
  produced_quantity?: number;
  observations?: string;
  customer_order?: {
    order_id: number;
    order_number: string;
    description?: string;
    customer?: {
      customer_id: number;
      business_name: string;
      trading_name?: string;
    };
  };
}

export interface BatchRawMaterial {
  batch_material_id: number;
  batch_id: number;
  raw_material_id: number;
  planned_quantity: number;
  used_quantity?: number;
  raw_material?: {
    raw_material_id: number;
    supplier_batch?: string;
    base?: {
      name: string;
    };
  };
}

export interface ProcessTransformation {
  production_batch_id: number;
  process_machine_id: number;
  operator_id: number;
  start_time: string;
  end_time?: string;
  variables: Record<string, any>;
  notes?: string;
}

export const productionApi = {
  // Production Batches
  getProductionBatches: async () => {
    try {
      console.log('Calling API:', apiClient.defaults.baseURL + '/production-batches');
      const response = await apiClient.get('/production-batches');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      // Handle paginated response - extract data array
      const batches = response.data.data || response.data;
      console.log('Extracted batches:', batches);
      return batches;
    } catch (error: any) {
      console.log('Production batches API error:', error.response?.status, error.response?.data);
      // Return empty array if no data found
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getProductionBatch: async (id: number) => {
    const response = await apiClient.get<ProductionBatch>(`/production-batches/${id}`);
    return response.data;
  },

  createProductionBatch: async (data: Partial<ProductionBatch>) => {
    const response = await apiClient.post<ProductionBatch>('/production-batches', data);
    return response.data;
  },

  updateProductionBatch: async (id: number, data: Partial<ProductionBatch>) => {
    const response = await apiClient.put<ProductionBatch>(`/production-batches/${id}`, data);
    return response.data;
  },

  deleteProductionBatch: async (id: number) => {
    const response = await apiClient.delete(`/production-batches/${id}`);
    return response.data;
  },

  // Batch Raw Materials
  getBatchRawMaterials: async () => {
    const response = await apiClient.get<BatchRawMaterial[]>('/batch-raw-materials');
    return response.data;
  },

  getBatchRawMaterial: async (id: number) => {
    const response = await apiClient.get<BatchRawMaterial>(`/batch-raw-materials/${id}`);
    return response.data;
  },

  createBatchRawMaterial: async (data: Partial<BatchRawMaterial>) => {
    const response = await apiClient.post<BatchRawMaterial>('/batch-raw-materials', data);
    return response.data;
  },

  updateBatchRawMaterial: async (id: number, data: Partial<BatchRawMaterial>) => {
    const response = await apiClient.put<BatchRawMaterial>(`/batch-raw-materials/${id}`, data);
    return response.data;
  },

  deleteBatchRawMaterial: async (id: number) => {
    const response = await apiClient.delete(`/batch-raw-materials/${id}`);
    return response.data;
  },

  // Process Transformation
  registerProcessTransformation: async (batchId: number, processMachineId: number, data: Partial<ProcessTransformation>) => {
    const response = await apiClient.post(`/process-transformation/batch/${batchId}/machine/${processMachineId}`, data);
    return response.data;
  },

  getProcessTransformationForm: async (batchId: number, processMachineId: number) => {
    const response = await apiClient.get(`/process-transformation/batch/${batchId}/machine/${processMachineId}`);
    return response.data;
  },

  getBatchProcess: async (batchId: number) => {
    const response = await apiClient.get(`/process-transformation/batch/${batchId}`);
    return response.data;
  },

  // Process Evaluation
  finalizeProcessEvaluation: async (batchId: number, data: any) => {
    const response = await apiClient.post(`/process-evaluation/finalize/${batchId}`, data);
    return response.data;
  },

  getProcessEvaluationLog: async (batchId: number) => {
    const response = await apiClient.get(`/process-evaluation/log/${batchId}`);
    return response.data;
  },

  // Legacy compatibility (keeping the old interface)
  getBatches: async () => {
    try {
      console.log('Fetching production batches...');
      const batches = await productionApi.getProductionBatches();
      console.log('Batches received:', batches?.length || 0);
      
      // Transform to old interface for backward compatibility
      return batches.map((batch: any) => ({
        batch_id: batch.batch_id,
        product_name: batch.order?.description || batch.name || 'Unknown Product',
        status: 'in_progress', // Default status since we don't have status mapping yet
        start_date: batch.start_time || batch.creation_date,
        end_date: batch.end_time,
        quantity: parseFloat(String(batch.target_quantity || 0)),
        operator_name: 'Production Team', // Default since we don't have operator relation yet
      }));
    } catch (error: any) {
      console.log('getBatches error:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },

  getBatch: async (id: number) => {
    try {
      console.log('Fetching batch with id:', id);
      const batch = await productionApi.getProductionBatch(id);
      console.log('Batch data received:', batch);
      
      // Transform to old interface for backward compatibility
      return {
        batch_id: batch.batch_id,
        product_name: batch.customer_order?.description || batch.name || 'Unknown Product',
        status: 'in_progress', // Default status
        start_date: batch.start_time || batch.creation_date,
        end_date: batch.end_time,
        quantity: parseFloat(String(batch.target_quantity || 0)),
        operator_name: 'Production Team', // Default since we don't have operator relation yet
      };
    } catch (error: any) {
      console.log('getBatch error:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },

  createBatch: async (data: any) => {
    console.log('createBatch called with:', data);
    const response = await apiClient.post('/production-batches', data);
    return response.data;
  },

  deleteBatch: async (id: number) => {
    try {
      console.log('Deleting batch with id:', id);
      const response = await productionApi.deleteProductionBatch(id);
      console.log('Delete response:', response);
      return response;
    } catch (error: any) {
      console.log('deleteBatch error:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },
};
