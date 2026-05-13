import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: string, depositDto: DepositDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: depositDto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.status !== 'ACTIVE') {
      throw new BadRequestException('Account is not active');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'DEPOSIT',
          amount: depositDto.amount,
          currency: account.currency,
          description: depositDto.description || 'Deposit',
          reference: this.generateReference(),
          status: 'COMPLETED',
          toAccountId: depositDto.accountId,
          receiverId: userId,
          balanceAfter: account.balance.toNumber() + depositDto.amount,
          processedAt: new Date(),
        },
      });

      await tx.account.update({
        where: { id: depositDto.accountId },
        data: {
          balance: { increment: depositDto.amount },
          availableBalance: { increment: depositDto.amount },
        },
      });

      return transaction;
    });

    return result;
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: withdrawDto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.status !== 'ACTIVE') {
      throw new BadRequestException('Account is not active');
    }

    if (account.availableBalance.toNumber() < withdrawDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'WITHDRAWAL',
          amount: withdrawDto.amount,
          currency: account.currency,
          description: withdrawDto.description || 'Withdrawal',
          reference: this.generateReference(),
          status: 'COMPLETED',
          fromAccountId: withdrawDto.accountId,
          senderId: userId,
          balanceAfter: account.balance.toNumber() - withdrawDto.amount,
          processedAt: new Date(),
        },
      });

      await tx.account.update({
        where: { id: withdrawDto.accountId },
        data: {
          balance: { decrement: withdrawDto.amount },
          availableBalance: { decrement: withdrawDto.amount },
        },
      });

      return transaction;
    });

    return result;
  }

  async transfer(userId: string, transferDto: TransferDto) {
    const fromAccount = await this.prisma.account.findFirst({
      where: { id: transferDto.fromAccountId, userId },
    });

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    const toAccount = await this.prisma.account.findUnique({
      where: { id: transferDto.toAccountId },
      include: { user: true },
    });

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (fromAccount.status !== 'ACTIVE' || toAccount.status !== 'ACTIVE') {
      throw new BadRequestException('One or both accounts are not active');
    }

    if (fromAccount.availableBalance.toNumber() < transferDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    if (fromAccount.currency !== toAccount.currency) {
      throw new BadRequestException('Currency mismatch');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'TRANSFER',
          amount: transferDto.amount,
          currency: fromAccount.currency,
          description: transferDto.description || 'Transfer',
          reference: this.generateReference(),
          status: 'COMPLETED',
          fromAccountId: transferDto.fromAccountId,
          toAccountId: transferDto.toAccountId,
          senderId: userId,
          receiverId: toAccount.userId,
          balanceAfter: fromAccount.balance.toNumber() - transferDto.amount,
          processedAt: new Date(),
        },
      });

      await tx.account.update({
        where: { id: transferDto.fromAccountId },
        data: {
          balance: { decrement: transferDto.amount },
          availableBalance: { decrement: transferDto.amount },
        },
      });

      await tx.account.update({
        where: { id: transferDto.toAccountId },
        data: {
          balance: { increment: transferDto.amount },
          availableBalance: { increment: transferDto.amount },
        },
      });

      return transaction;
    });

    return result;
  }

  async findAll(userId: string, accountId?: string) {
    const where = accountId
      ? {
          OR: [
            { fromAccountId: accountId, senderId: userId },
            { toAccountId: accountId, receiverId: userId },
          ],
        }
      : {
          OR: [{ senderId: userId }, { receiverId: userId }],
        };

    return this.prisma.transaction.findMany({
      where,
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  }
}
