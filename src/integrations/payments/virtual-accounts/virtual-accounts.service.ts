import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualAccount } from './virtual-account.entity';
import { Transaction } from './transaction.entity';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { SmsService } from 'src/integrations/sms.service';

@Injectable()
export class VirtualAccountsService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly virtualAccountRepo: Repository<VirtualAccount>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    private readonly httpService: HttpService,
    private readonly smsService: SmsService,
  ) {}

  // ✅ Create Paystack or mock account
  async create(data: {
    customerName: string;
    email?: string;
    provider?: string;
  }) {
    if (!data.provider || data.provider === 'mock') {
      const accountNumber =
        '99' + Math.floor(Math.random() * 9000000 + 1000000);
      const bankName = 'Mock Bank (Sandbox)';

      const newAccount = this.virtualAccountRepo.create({
        provider: data.provider || 'mock',
        accountNumber,
        bankName,
        customerName: data.customerName,
        reference: 'VA-' + Date.now(),
        isActive: true,
      });

      return this.virtualAccountRepo.save(newAccount);
    }

    const payload = {
      customer_name: data.customerName,
      customer_email: data.email,
      preferred_bank: 'wema-bank',
    };

    const url = `${process.env.PAYSTACK_BASE_URL}/dedicated_account`;
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );
      const result = response.data.data;

      const account = this.virtualAccountRepo.create({
        provider: 'paystack',
        accountNumber: result.account_number,
        bankName: result.bank.name,
        customerName: result.customer.name,
        reference: result.reference,
        isActive: true,
      });

      return await this.virtualAccountRepo.save(account);
    } catch (error) {
      console.error('Paystack error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create Paystack Virtual Account');
    }
  }

  // ✅ Get all accounts
  async findAll() {
    return this.virtualAccountRepo.find();
  }

  // ✅ Deactivate account
  async deactivate(id: string) {
    const account = await this.virtualAccountRepo.findOne({ where: { id } });
    if (!account) throw new Error('Account not found');
    account.isActive = false;
    return this.virtualAccountRepo.save(account);
  }

  // ✅ Simulate deposit (auto-creates account if missing)
  async simulateDeposit(data: {
    accountNumber: string;
    amount: number;
    currency: string;
  }) {
    let account = await this.virtualAccountRepo.findOne({
      where: { accountNumber: data.accountNumber },
    });

    // Auto-create mock account for testing
    if (!account) {
      console.warn('⚠️ Account not found, creating mock account automatically');
      account = this.virtualAccountRepo.create({
        provider: 'mock',
        accountNumber: data.accountNumber,
        bankName: 'Mock Bank (Auto)',
        customerName: 'Test User',
        reference: 'VA-' + Date.now(),
        isActive: true,
      });
      await this.virtualAccountRepo.save(account);
    }

    if (!account.isActive)
      throw new Error('Account found but inactive. Reactivate first.');

    const transaction = this.transactionRepo.create({
      account,
      amount: data.amount,
      currency: data.currency,
      reference: 'TRX-' + Date.now(),
      status: 'successful' as const,
    });

    const savedTx = await this.transactionRepo.save(transaction);

    // ✅ Send SMS notification (skip if Termii unreachable)
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.smsService.sendSms(
          '+2348100000000',
          `Deposit of ₦${data.amount.toLocaleString()} received in your wallet. Ref: ${savedTx.reference}`,
        );
      } else {
        console.log(
          `📩 [DEV MODE] SMS skipped — would send: "Deposit of ₦${data.amount.toLocaleString()}"`
        );
      }
    } catch (err) {
      console.warn('⚠️ SMS sending failed (ignored in dev):', err.message);
    }

    return savedTx;
  }

  // ✅ Get transactions for account
  async getTransactions(accountId: string) {
    return this.transactionRepo.find({
      where: { account: { id: accountId } },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Handle Paystack webhook deposits
  async recordWebhookDeposit(data: {
    accountNumber?: string;
    amount: number;
    currency: string;
    reference: string;
  }) {
    try {
      if (!data.accountNumber) {
        console.warn('⚠️ Missing account number in webhook payload');
        return;
      }

      const account = await this.virtualAccountRepo.findOne({
        where: { accountNumber: data.accountNumber, isActive: true },
      });

      if (!account) {
        console.warn(`⚠️ Account ${data.accountNumber} not found or inactive`);
        return;
      }

      const transaction = this.transactionRepo.create({
        account,
        amount: data.amount,
        currency: data.currency,
        reference: data.reference,
        status: 'successful' as const,
      });

      const savedTx = await this.transactionRepo.save(transaction);
      console.log(`✅ Webhook deposit recorded for ${data.accountNumber}`);

      try {
        if (process.env.NODE_ENV === 'production') {
          await this.smsService.sendSms(
            '+2348100000000',
            `Deposit of ₦${data.amount.toLocaleString()} received in your wallet. Ref: ${data.reference}`,
          );
        } else {
          console.log('📩 [DEV MODE] Skipped SMS for webhook deposit');
        }
      } catch (err) {
        console.warn('⚠️ Failed to send SMS for webhook:', err.message);
      }

      return savedTx;
    } catch (error) {
      console.error('❌ Error recording webhook deposit:', (error as Error).message);
      throw error;
    }
  }

  // ✅ Reconcile a transaction
  async reconcileTransaction(reference: string) {
    const url = `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`;
    const headers = { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` };

    try {
      const res = await axios.get(url, { headers });
      const data = res.data.data;

      const tx = await this.transactionRepo.findOne({ where: { reference } });
      if (!tx) return 'Transaction not found in DB';

      tx.status = data.status === 'success' ? 'successful' : 'failed';
      await this.transactionRepo.save(tx);
      return `Transaction ${tx.status}`;
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw new BadRequestException('Failed to reconcile transaction');
    }
  }
}
