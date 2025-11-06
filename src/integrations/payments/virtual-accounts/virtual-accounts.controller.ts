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

  // 🔐 Real Paystack Webhook Endpoint (safe & production-ready)
  @Post('webhook/paystack')
  @HttpCode(HttpStatus.OK)
  async paystackWebhook(
    @Req() req: Request & { rawBody?: string }, // rawBody added in main.ts
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';

    // ✅ Use rawBody if available, else fall back to JSON-stringified body
    const raw = req.rawBody || JSON.stringify(req.body) || '';

    if (!raw) {
      console.error('⚠️ Empty webhook body received');
      return { message: 'Invalid payload' };
    }

    // ✅ Safely compute signature
    const computed = crypto
      .createHmac('sha512', secret)
      .update(raw)
      .digest('hex');

    if (computed !== signature) {
      console.warn('⚠️ Invalid Paystack webhook signature');
      return { message: 'Invalid signature' };
    }

    const event = req.body;
    const data = event.data;

    if (event.event === 'charge.success') {
      const deposit = {
        accountNumber:
          data.authorization?.receiver_bank_account_number ||
          data.metadata?.account_number,
        amount: data.amount / 100, // Paystack sends in kobo
        currency: data.currency,
        reference: data.reference,
      };

      await this.virtualAccountsService.recordWebhookDeposit(deposit);
      console.log('✅ Recorded deposit for', deposit.accountNumber);
    }

    console.log('✅ Verified Paystack event:', event.event);
    return { message: 'Webhook processed successfully' };
  }
}
