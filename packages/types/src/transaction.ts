import {
  TransactionStatus,
  LedgerDirection,
  Currency,
  PaymentStatus,
} from './common';

export interface LedgerTransaction {
  id: string;
  reference: string;
  description: string;
  status: TransactionStatus;
  createdAt: Date;
  postedAt?: Date;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountId: string;
  direction: LedgerDirection;
  amount: string;
  currency: Currency;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  sourceAccountId: string;
  payeeName: string;
  payeeReference: string;
  amount: string;
  currency: Currency;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  bankName: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransferDto {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  description: string;
  currency: Currency;
}

export interface CreatePaymentDto {
  sourceAccountId: string;
  payeeName: string;
  payeeReference: string;
  amount: string;
  currency: Currency;
}

export interface TransactionWithEntries extends LedgerTransaction {
  entries: LedgerEntry[];
}
