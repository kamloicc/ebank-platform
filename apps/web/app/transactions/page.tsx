'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accountsApi, type Account } from '@/lib/accounts';
import { transactionsApi, type Transaction } from '@/lib/transactions';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, getTransactionTypeColor, getStatusColor } from '@/lib/utils';
import { History, TrendingUp, TrendingDown, ArrowRight, Loader2, Filter } from 'lucide-react';

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterAccount, setFilterAccount] = useState<string>('ALL');

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: allTransactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll(),
  });

  const transactions = allTransactions || [];

  const filteredTransactions = transactions.filter((t: Transaction) => {
    const typeMatch = filterType === 'ALL' || t.transactionType === filterType;
    const accountMatch =
      filterAccount === 'ALL' ||
      t.fromAccountId === filterAccount ||
      t.toAccountId === filterAccount;
    return typeMatch && accountMatch;
  });

  const stats = {
    total: transactions.length,
    deposits: transactions.filter((t: Transaction) => t.transactionType === 'DEPOSIT').length,
    withdrawals: transactions.filter((t: Transaction) => t.transactionType === 'WITHDRAWAL').length,
    transfers: transactions.filter((t: Transaction) => t.transactionType === 'TRANSFER').length,
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage your transaction history</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <History className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deposits</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deposits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdrawals</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withdrawals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transfers</CardTitle>
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transfers}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter transactions by type or account</CardDescription>
              </div>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="DEPOSIT">Deposits</option>
                  <option value="WITHDRAWAL">Withdrawals</option>
                  <option value="TRANSFER">Transfers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                <select
                  value={filterAccount}
                  onChange={(e) => setFilterAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Accounts</option>
                  {accounts?.map((account: Account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transaction(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction: Transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          transaction.transactionType === 'DEPOSIT'
                            ? 'bg-green-100'
                            : transaction.transactionType === 'WITHDRAWAL'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {transaction.transactionType === 'DEPOSIT' ? (
                          <TrendingUp
                            className={`h-6 w-6 ${getTransactionTypeColor(
                              transaction.transactionType
                            )}`}
                          />
                        ) : transaction.transactionType === 'WITHDRAWAL' ? (
                          <TrendingDown
                            className={`h-6 w-6 ${getTransactionTypeColor(
                              transaction.transactionType
                            )}`}
                          />
                        ) : (
                          <ArrowRight
                            className={`h-6 w-6 ${getTransactionTypeColor(
                              transaction.transactionType
                            )}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">
                            Ref: {transaction.reference}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`text-lg font-semibold ${getTransactionTypeColor(
                          transaction.transactionType
                        )}`}
                      >
                        {transaction.transactionType === 'WITHDRAWAL' ? '-' : '+'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Balance: {formatCurrency(transaction.balanceAfter, transaction.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <History className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
