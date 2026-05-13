'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi, type Account, type CreateAccountData } from '@/lib/accounts';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatAccountNumber, getAccountTypeColor, getStatusColor } from '@/lib/utils';
import { CreditCard, Plus, Loader2, X } from 'lucide-react';

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState<CreateAccountData>({
    accountType: 'CHECKING',
    currency: 'USD',
    initialDeposit: 0,
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setShowCreateModal(false);
      setNewAccount({ accountType: 'CHECKING', currency: 'USD', initialDeposit: 0 });
    },
  });

  const handleCreateAccount = () => {
    createMutation.mutate(newAccount);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your bank accounts
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts?.map((account: Account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                    {account.status}
                  </span>
                </div>
                <CardTitle className="mt-4">{formatAccountNumber(account.accountNumber)}</CardTitle>
                <CardDescription>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                    {account.accountType}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(account.availableBalance, account.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Balance</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">Currency: {account.currency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts && accounts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Create your first account to get started with banking
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Account</CardTitle>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CardDescription>Choose your account type and initial deposit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  value={newAccount.accountType}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, accountType: e.target.value as 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'CREDIT' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CHECKING">Checking</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="BUSINESS">Business</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={newAccount.currency}
                  onChange={(e) => setNewAccount({ ...newAccount, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <Input
                label="Initial Deposit (Optional)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newAccount.initialDeposit || ''}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, initialDeposit: parseFloat(e.target.value) || 0 })
                }
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAccount}
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>

              {createMutation.isError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  Failed to create account. Please try again.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
