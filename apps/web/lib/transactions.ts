import apiClient from './api-client';

export interface Transaction {
  id: string;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  fromAccountId?: string;
  toAccountId?: string;
  senderId?: string;
  receiverId?: string;
  balanceAfter: number;
  createdAt: string;
  processedAt?: string;
}

export interface DepositData {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawData {
  accountId: string;
  amount: number;
  description?: string;
}

export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export const transactionsApi = {
  getAll: async (accountId?: string): Promise<Transaction[]> => {
    const url = accountId ? `/transactions?accountId=${accountId}` : '/transactions';
    const response = await apiClient.get<Transaction[]>(url);
    return response.data;
  },

  getOne: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  deposit: async (data: DepositData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions/deposit', data);
    return response.data;
  },

  withdraw: async (data: WithdrawData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions/withdraw', data);
    return response.data;
  },

  transfer: async (data: TransferData): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions/transfer', data);
    return response.data;
  },
};
