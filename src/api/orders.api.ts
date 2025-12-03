import { apiClient } from './client';

export interface OrderProduct {
  order_product_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  rejection_reason?: string;
  observations?: string;
  product?: {
    product_id: number;
    name: string;
    code: string;
    unit?: {
      name: string;
      abbreviation: string;
    };
  };
}

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  order_number: string;
  creation_date?: string;
  description: string;
  quantity: number;
  delivery_date?: string;
  priority: number;
  status?: string;
  customer?: {
    customer_id: number;
    business_name: string;
    trading_name?: string;
    contact_person?: string;
  };
  orderProducts?: OrderProduct[];
  approver?: {
    id: number;
    name: string;
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

  cancelOrder: async (id: number) => {
    const response = await apiClient.post(`/customer-orders/${id}/cancel`);
    return response.data;
  },

  // Order Approval Methods
  getPendingOrders: async () => {
    try {
      const response = await apiClient.get('/order-approval/pending');
      const data = (response.data as any).data || response.data;
      return data;
    } catch (error: any) {
      console.log('getPendingOrders error:', error.response?.status);
      return [];
    }
  },

  getOrderApproval: async (id: number) => {
    const response = await apiClient.get<CustomerOrder>(`/order-approval/${id}`);
    return response.data;
  },

  approveOrder: async (id: number) => {
    const response = await apiClient.post(`/order-approval/${id}/approve`);
    return response.data;
  },

  approveProduct: async (orderId: number, productId: number, observations?: string) => {
    const response = await apiClient.post(`/order-approval/${orderId}/product/${productId}/approve`, {
      observations
    });
    return response.data;
  },

  rejectProduct: async (orderId: number, productId: number, reason: string) => {
    const response = await apiClient.post(`/order-approval/${orderId}/product/${productId}/reject`, {
      rejection_reason: reason
    });
    return response.data;
  },
};
