import { apiClient } from './client';

export interface ProcessMachineVariable {
  variable_id?: number;
  standard_variable_id: number;
  min_value?: number;
  max_value?: number;
  target_value?: number;
  mandatory: boolean;
  standardVariable?: {
    variable_id: number;
    code: string;
    name: string;
    unit?: string;
  };
}

export interface ProcessMachine {
  process_machine_id: number;
  process_id: number;
  machine_id: number;
  step_order: number;
  name: string;
  description?: string;
  estimated_time?: number;
  machine?: {
    machine_id: number;
    name: string;
    code: string;
  };
  variables?: ProcessMachineVariable[];
}

export interface ProcessMachineRecord {
  record_id: number;
  batch_id: number;
  process_machine_id: number;
  operator_id: number;
  entered_variables: Record<string, number>;
  meets_standard: boolean;
  observations?: string;
  record_date: string;
}

export interface CreateProcessMachineRecordData {
  batch_id: number;
  process_machine_id: number;
  entered_variables: Record<string, number>;
  observations?: string;
}

export interface CertificationLog {
  machines: {
    step_number: number;
    machine_name: string;
    entered_variables: Record<string, number>;
    meets_standard: boolean;
    record_date: string;
  }[];
  final_result: {
    status: string;
    reason: string;
    evaluation_date: string;
    inspector: string;
  };
}

export const certificationApi = {
  // Get batches pending certification
  getPendingCertification: async () => {
    const response = await apiClient.get('/batches/pending-certification');
    return response.data;
  },

  // Assign process to batch
  assignProcess: async (batchId: number, processId: number) => {
    const response = await apiClient.post(`/batches/${batchId}/assign-process`, {
      process_id: processId,
    });
    return response.data;
  },

  // Get process machines for a batch
  getProcessMachines: async (batchId: number): Promise<{
    process_machines: ProcessMachine[];
    completed_records: number[];
    process_id: number;
  }> => {
    const response = await apiClient.get(`/batches/${batchId}/process-machines`);
    return response.data;
  },

  // Record variables for a machine step
  recordVariables: async (data: CreateProcessMachineRecordData): Promise<ProcessMachineRecord> => {
    const response = await apiClient.post('/process-machine-records', data);
    return response.data;
  },

  // Finalize certification
  finalizeCertification: async (batchId: number, observations?: string) => {
    const response = await apiClient.post(`/batches/${batchId}/finalize-certification`, {
      observations,
    });
    return response.data;
  },

  // Get certification log
  getCertificationLog: async (batchId: number): Promise<CertificationLog> => {
    const response = await apiClient.get(`/batches/${batchId}/certification-log`);
    return response.data;
  },
};
