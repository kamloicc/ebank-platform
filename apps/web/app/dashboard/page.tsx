'use client';

import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '@/lib/accounts';
import { transactionsApi } from '@/lib/transactions';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, formatAccountNumber, getAccountTypeColor, getTransactionTypeColor } from '@/lib/utils';
import { CreditCard, TrendingUp, TrendingDown, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.getAll(),
  });

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const recentTransactions = transactions?.slice(0, 5) || [];

  if (accountsLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's an overview of your accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accounts?.filter(a => a.status === 'ACTIVE').length || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total: {accounts?.length || 0} accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Accounts</CardTitle>
                <Link 
                  href="/accounts" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <CardDescription>Overview of your bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {accounts && accounts.length > 0 ? (
                <div className="space-y-4">
                  {accounts.slice(0, 3).map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatAccountNumber(account.accountNumber)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                              {account.accountType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(account.balance, account.currency)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{account.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No accounts yet</p>
                  <Link href="/accounts" className="text-sm text-blue-600 hover:text-blue-500 mt-2 inline-block">
                    Create your first account
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Link 
                  href="/transactions" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          transaction.transactionType === 'DEPOSIT' ? 'bg-green-100' :
                          transaction.transactionType === 'WITHDRAWAL' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {transaction.transactionType === 'DEPOSIT' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : transaction.transactionType === 'WITHDRAWAL' ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${getTransactionTypeColor(transaction.transactionType)}`}>
                          {transaction.transactionType === 'WITHDRAWAL' ? '-' : '+'} 
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingDown className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
