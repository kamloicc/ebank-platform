import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/request.interface';

import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(req.user.userId, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user accounts' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.accountsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details' })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.accountsService.findOne(id, req.user.userId);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  getBalance(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.accountsService.getBalance(id, req.user.userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update account status' })
  updateStatus(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.accountsService.updateStatus(
      id,
      req.user.userId,
      updateStatusDto.status,
    );
  }
}
