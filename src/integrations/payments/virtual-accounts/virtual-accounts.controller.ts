import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { VirtualAccountsService } from './virtual-accounts.service';

@Controller('payments/virtual-accounts')
export class VirtualAccountsController {
  constructor(
    private readonly virtualAccountsService: VirtualAccountsService,
  ) {}

  @Post()
  async create(@Body() body: { customerName: string; provider: string }) {
    return this.virtualAccountsService.create(body);
  }

  @Get()
  async findAll() {
    return this.virtualAccountsService.findAll();
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.virtualAccountsService.deactivate(id);
  }

  // 🚀 Simulate Webhook (Deposit)
  @Post('simulate-deposit')
  async simulateDeposit(
    @Body() body: { accountNumber: string; amount: number; currency: string },
  ) {
    return this.virtualAccountsService.simulateDeposit(body);
  }

  // 🧾 Get transactions for a specific account
  @Get(':id/transactions')
  async getTransactions(@Param('id') id: string) {
    return this.virtualAccountsService.getTransactions(id);
  }
}
