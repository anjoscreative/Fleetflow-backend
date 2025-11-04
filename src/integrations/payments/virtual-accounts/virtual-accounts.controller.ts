import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import * as crypto from 'crypto';
import { VirtualAccountsService } from './virtual-accounts.service';

@Controller('payments/virtual-accounts')
export class VirtualAccountsController {
  constructor(
    private readonly virtualAccountsService: VirtualAccountsService,
  ) {}

  // ✅ Create Virtual Account (Paystack or Mock)
  @Post()
  async create(
    @Body() body: { customerName: string; email?: string; provider: string },
  ) {
    return this.virtualAccountsService.create(body);
  }

  // ✅ Get all virtual accounts
  @Get()
  async findAll() {
    return this.virtualAccountsService.findAll();
  }

  // ✅ Deactivate a virtual account
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

  // 🔐 Real Paystack Webhook Endpoint
  @Post('webhook/paystack')
  @HttpCode(HttpStatus.OK)
  async paystackWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';

    const computed = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (computed !== signature) {
      console.warn('⚠️ Webhook signature mismatch');
      return { message: 'Invalid signature' };
    }

    const event = req.body;

    // Handle relevant Paystack events
    if (
      event.event === 'dedicatedaccount.assign.success' ||
      event.event === 'charge.success'
    ) {
      console.log('✅ Verified Paystack event:', event.event);

      // Example: Record a transaction
      // await this.virtualAccountsService.handlePaystackEvent(event);
    }

    return { message: 'Webhook received' };
  }
}
