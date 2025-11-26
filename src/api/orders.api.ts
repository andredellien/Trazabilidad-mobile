import { apiClient } from './client';

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  order_number: string;
  description: string;
  quantity: number;
  delivery_date?: string;
  status?: string;
  customer?: {
    customer_id: number;
    business_name: string;
    trading_name?: string;
  };
}

export const ordersApi = {
  getOrders: async () => {
    try {
      const response = await apiClient.get('/customer-orders');
      console.log('getOrders response:', response.data);
      const data = (response.data as any).data || response.data;
      console.log('Orders extracted:', data);
      return data;
    } catch (error: any) {
      console.log('getOrders error:', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getOrder: async (id: number) => {
    const response = await apiClient.get<CustomerOrder>(`/customer-orders/${id}`);
    return response.data;
  },

  createOrder: async (data: Partial<CustomerOrder>) => {
    const response = await apiClient.post<CustomerOrder>('/customer-orders', data);
    return response.data;
  },
};
