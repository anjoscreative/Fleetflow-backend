import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualAccount } from './virtual-account.entity';
import { Transaction } from './transaction.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VirtualAccountsService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly virtualAccountRepo: Repository<VirtualAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly httpService: HttpService,
  ) {}

  // ✅ Create a real Paystack Virtual Account
  async create(data: {
    customerName: string;
    email?: string;
    provider?: string;
  }) {
    // If provider is not Paystack, fallback to simulation
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

    // 🔹 If provider is Paystack, use live API
    const payload = {
      customer_name: data.customerName,
      customer_email: data.email,
      preferred_bank: 'wema-bank', // optional
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
      throw new BadRequestException(
        'Failed to create Paystack Virtual Account',
      );
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

  // ✅ Simulate a deposit (still useful for testing locally)
  async simulateDeposit(data: {
    accountNumber: string;
    amount: number;
    currency: string;
  }) {
    const account = await this.virtualAccountRepo.findOne({
      where: { accountNumber: data.accountNumber, isActive: true },
    });

    if (!account) {
      throw new Error('Account not found or inactive');
    }

    // ✅ Type-safe creation
    const transaction = this.transactionRepo.create({
      account, // this is a VirtualAccount entity, not an ID
      amount: data.amount,
      currency: data.currency,
      reference: 'TRX-' + Date.now(),
      status: 'successful' as 'successful', // or use 'as const'
    });

    return this.transactionRepo.save(transaction);
  }

  async getTransactions(accountId: string) {
    return this.transactionRepo.find({
      where: { account: { id: accountId } },
      order: { createdAt: 'DESC' },
    });
  }
}
