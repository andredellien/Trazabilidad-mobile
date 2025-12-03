import { apiClient } from './client';
import { OrderProduct } from './orders.api';

export interface Customer {
  customer_id: number;
  business_name: string;
  trading_name?: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  active?: boolean;
}

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  order_number: string;
  creation_date?: string;
  delivery_date?: string;
  priority: number;
  description?: string;
  quantity?: number;
  observations?: string;
  status?: string;
  customer?: Customer;
  orderProducts?: OrderProduct[];
}

export interface CreateOrderPayload {
  customer_id: number;
  name: string;
  description?: string;
  priority: number;
  delivery_date?: string;
  products: {
    product_id: number;
    quantity: number;
    observations?: string;
  }[];
  destinations: {
    address: string;
    reference?: string;
    contact_name?: string;
    contact_phone?: string;
    delivery_instructions?: string;
    latitude?: number | null;
    longitude?: number | null;
    products: {
      order_product_index: number;
      quantity: number;
    }[];
  }[];
}

export const customersApi = {
  // Customers
  getCustomers: async () => {
    const response = await apiClient.get('/customers');
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

  createCustomerOrder: async (data: CreateOrderPayload) => {
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