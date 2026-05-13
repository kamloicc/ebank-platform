import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/request.interface';

import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into account' })
  deposit(
    @Request() req: AuthenticatedRequest,
    @Body() depositDto: DepositDto,
  ) {
    return this.transactionsService.deposit(req.user.userId, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from account' })
  withdraw(
    @Request() req: AuthenticatedRequest,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.transactionsService.withdraw(req.user.userId, withdrawDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  transfer(
    @Request() req: AuthenticatedRequest,
    @Body() transferDto: TransferDto,
  ) {
    return this.transactionsService.transfer(req.user.userId, transferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'accountId', required: false })
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('accountId') accountId?: string,
  ) {
    return this.transactionsService.findAll(req.user.userId, accountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details' })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.transactionsService.findOne(id, req.user.userId);
  }
}
