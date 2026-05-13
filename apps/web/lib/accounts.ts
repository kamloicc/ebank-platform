import apiClient from './api-client';

export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'CREDIT';
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountData {
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'CREDIT';
  currency?: string;
  initialDeposit?: number;
}

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  getOne: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },

  getBalance: async (id: string): Promise<{ balance: number; availableBalance: number }> => {
    const response = await apiClient.get<{ balance: number; availableBalance: number }>(`/accounts/${id}/balance`);
    return response.data;
  },

  updateStatus: async (id: string, status: 'ACTIVE' | 'FROZEN' | 'CLOSED'): Promise<Account> => {
    const response = await apiClient.patch<Account>(`/accounts/${id}/status`, { status });
    return response.data;
  },
};
