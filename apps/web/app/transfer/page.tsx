'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/lib/accounts';
import { transactionsApi } from '@/lib/transactions';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Loader2, CheckCircle } from 'lucide-react';

type TransactionType = 'deposit' | 'withdraw' | 'transfer';

export default function TransferPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TransactionType>('deposit');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [depositData, setDepositData] = useState({
    accountId: '',
    amount: '',
    description: '',
  });

  const [withdrawData, setWithdrawData] = useState({
    accountId: '',
    amount: '',
    description: '',
  });

  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const depositMutation = useMutation({
    mutationFn: transactionsApi.deposit,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccessMessage('Deposit successful!');
      setShowSuccess(true);
      setDepositData({ accountId: '', amount: '', description: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: transactionsApi.withdraw,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccessMessage('Withdrawal successful!');
      setShowSuccess(true);
      setWithdrawData({ accountId: '', amount: '', description: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const transferMutation = useMutation({
    mutationFn: transactionsApi.transfer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccessMessage('Transfer successful!');
      setShowSuccess(true);
      setTransferData({ fromAccountId: '', toAccountId: '', amount: '', description: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleDeposit = () => {
    depositMutation.mutate({
      accountId: depositData.accountId,
      amount: parseFloat(depositData.amount),
      description: depositData.description || undefined,
    });
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate({
      accountId: withdrawData.accountId,
      amount: parseFloat(withdrawData.amount),
      description: withdrawData.description || undefined,
    });
  };

  const handleTransfer = () => {
    transferMutation.mutate({
      fromAccountId: transferData.fromAccountId,
      toAccountId: transferData.toAccountId,
      amount: parseFloat(transferData.amount),
      description: transferData.description || undefined,
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Transfer Money</h1>
          <p className="mt-1 text-sm text-gray-500">
            Deposit, withdraw, or transfer between accounts
          </p>
        </div>

        {showSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'deposit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowDownCircle className="inline h-4 w-4 mr-2" />
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'withdraw'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowUpCircle className="inline h-4 w-4 mr-2" />
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'transfer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ArrowLeftRight className="inline h-4 w-4 mr-2" />
            Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'deposit' && 'Deposit Money'}
                  {activeTab === 'withdraw' && 'Withdraw Money'}
                  {activeTab === 'transfer' && 'Transfer Between Accounts'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'deposit' && 'Add money to your account'}
                  {activeTab === 'withdraw' && 'Remove money from your account'}
                  {activeTab === 'transfer' && 'Move money between your accounts'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTab === 'deposit' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Account
                      </label>
                      <select
                        value={depositData.accountId}
                        onChange={(e) => setDepositData({ ...depositData, accountId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose an account</option>
                        {accounts?.filter(a => a.status === 'ACTIVE').map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {account.accountType} ({formatCurrency(account.balance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={depositData.amount}
                      onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                    />

                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="e.g., Salary deposit"
                      value={depositData.description}
                      onChange={(e) => setDepositData({ ...depositData, description: e.target.value })}
                    />

                    <Button
                      onClick={handleDeposit}
                      disabled={!depositData.accountId || !depositData.amount || depositMutation.isPending}
                      className="w-full"
                    >
                      {depositMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Deposit Money'
                      )}
                    </Button>

                    {depositMutation.isError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        Deposit failed. Please try again.
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'withdraw' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Account
                      </label>
                      <select
                        value={withdrawData.accountId}
                        onChange={(e) => setWithdrawData({ ...withdrawData, accountId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose an account</option>
                        {accounts?.filter(a => a.status === 'ACTIVE').map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {account.accountType} ({formatCurrency(account.availableBalance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={withdrawData.amount}
                      onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                    />

                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="e.g., ATM withdrawal"
                      value={withdrawData.description}
                      onChange={(e) => setWithdrawData({ ...withdrawData, description: e.target.value })}
                    />

                    <Button
                      onClick={handleWithdraw}
                      disabled={!withdrawData.accountId || !withdrawData.amount || withdrawMutation.isPending}
                      className="w-full"
                    >
                      {withdrawMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Withdraw Money'
                      )}
                    </Button>

                    {withdrawMutation.isError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        Withdrawal failed. Please check your balance and try again.
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'transfer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Account
                      </label>
                      <select
                        value={transferData.fromAccountId}
                        onChange={(e) => setTransferData({ ...transferData, fromAccountId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose source account</option>
                        {accounts?.filter(a => a.status === 'ACTIVE').map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {account.accountType} ({formatCurrency(account.availableBalance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Account
                      </label>
                      <select
                        value={transferData.toAccountId}
                        onChange={(e) => setTransferData({ ...transferData, toAccountId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose destination account</option>
                        {accounts?.filter(a => a.status === 'ACTIVE' && a.id !== transferData.fromAccountId).map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {account.accountType} ({formatCurrency(account.balance, account.currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    />

                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="e.g., Savings transfer"
                      value={transferData.description}
                      onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    />

                    <Button
                      onClick={handleTransfer}
                      disabled={!transferData.fromAccountId || !transferData.toAccountId || !transferData.amount || transferMutation.isPending}
                      className="w-full"
                    >
                      {transferMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Transfer Money'
                      )}
                    </Button>

                    {transferMutation.isError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        Transfer failed. Please check your balance and account details.
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                {activeTab === 'deposit' && (
                  <>
                    <p>💡 Deposits are instant and reflect immediately in your account balance.</p>
                    <p>✅ You can deposit any amount with no limits.</p>
                    <p>📝 Adding a description helps you track your transactions.</p>
                  </>
                )}
                {activeTab === 'withdraw' && (
                  <>
                    <p>⚠️ Ensure you have sufficient balance before withdrawing.</p>
                    <p>🔒 Frozen or closed accounts cannot process withdrawals.</p>
                    <p>💰 Withdrawals are processed instantly.</p>
                  </>
                )}
                {activeTab === 'transfer' && (
                  <>
                    <p>🔄 Transfers between your accounts are instant.</p>
                    <p>💱 Both accounts must use the same currency.</p>
                    <p>✅ All transfers are atomic - they either complete fully or not at all.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
