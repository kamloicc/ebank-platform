import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function getAccountTypeColor(type: string): string {
  const colors: Record<string, string> = {
    CHECKING: 'bg-blue-100 text-blue-800',
    SAVINGS: 'bg-green-100 text-green-800',
    BUSINESS: 'bg-purple-100 text-purple-800',
    CREDIT: 'bg-orange-100 text-orange-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    DEPOSIT: 'text-green-600',
    WITHDRAWAL: 'text-red-600',
    TRANSFER: 'text-blue-600',
  };
  return colors[type] || 'text-gray-600';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    FROZEN: 'bg-yellow-100 text-yellow-800',
    CLOSED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
