import { AccountStatus, AccountType, Currency } from './common';

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  currency: Currency;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountBalance {
  accountId: string;
  accountNumber: string;
  balance: string;
  currency: Currency;
  availableBalance: string;
}

export interface CreateAccountDto {
  userId: string;
  type: AccountType;
  currency: Currency;
}
