import { apiClient } from './client';

export interface Customer {
  customer_id: number;
  business_name: string;
  trading_name?: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  active: boolean;
}

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  order_number: string;
  creation_date: string;
  delivery_date?: string;
  priority: number;
  description?: string;
  observations?: string;
  customer?: Customer;
}

export const customersApi = {
  // Customers
  getCustomers: async () => {
    const response = await apiClient.get<Customer[]>('/customers');
    return response.data;
  },

  getCustomer: async (id: number) => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (data: Partial<Customer>) => {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },

  updateCustomer: async (id: number, data: Partial<Customer>) => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: number) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  },

  // Customer Orders
  getCustomerOrders: async () => {
    try {
      console.log('Fetching customer orders...');
      const response = await apiClient.get('/customer-orders');
      console.log('Customer orders API response:', response.data);
      
      // Handle paginated response - extract data array
      const orders = response.data.data || response.data;
      console.log('Customer orders received:', orders?.length || 0);
      console.log('Orders data:', orders);
      return orders || [];
    } catch (error: any) {
      console.log('getCustomerOrders error:', error.response?.status, error.response?.data || error.message);
      // Return empty array if no data found
      if (error.response?.status === 404 || error.response?.status === 500) {
        return [];
      }
      throw error;
    }
  },

  getCustomerOrder: async (id: number) => {
    const response = await apiClient.get<CustomerOrder>(`/customer-orders/${id}`);
    return response.data;
  },

  createCustomerOrder: async (data: Partial<CustomerOrder>) => {
    const response = await apiClient.post<CustomerOrder>('/customer-orders', data);
    return response.data;
  },

  updateCustomerOrder: async (id: number, data: Partial<CustomerOrder>) => {
    const response = await apiClient.put<CustomerOrder>(`/customer-orders/${id}`, data);
    return response.data;
  },

  deleteCustomerOrder: async (id: number) => {
    const response = await apiClient.delete(`/customer-orders/${id}`);
    return response.data;
  },
};