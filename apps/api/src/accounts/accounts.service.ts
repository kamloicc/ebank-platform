import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAccountDto: CreateAccountDto) {
    const accountNumber = await this.generateAccountNumber(
      createAccountDto.accountType,
    );

    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        accountType: createAccountDto.accountType,
        currency: createAccountDto.currency || 'USD',
        balance: createAccountDto.initialDeposit || 0,
        availableBalance: createAccountDto.initialDeposit || 0,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return account;
  }

  async findAllByUser(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      include: {
        sentTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        receivedTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async getBalance(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      select: {
        id: true,
        accountNumber: true,
        accountType: true,
        balance: true,
        availableBalance: true,
        currency: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateStatus(
    id: string,
    userId: string,
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED',
  ) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.update({
      where: { id },
      data: { status },
    });
  }

  private async generateAccountNumber(accountType: string): Promise<string> {
    const prefix =
      {
        CHECKING: '1',
        SAVINGS: '2',
        BUSINESS: '3',
        CREDIT: '4',
      }[accountType] || '9';

    const random = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, '0');

    const accountNumber = prefix + random;

    const existing = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (existing) {
      return this.generateAccountNumber(accountType);
    }

    return accountNumber;
  }
}
