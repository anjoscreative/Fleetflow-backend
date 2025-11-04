import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualAccount } from './virtual-account.entity';
import { Transaction } from './transaction.entity';

@Injectable()
export class VirtualAccountsService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly virtualAccountRepo: Repository<VirtualAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly httpService: HttpService,
  ) {}

  // Create virtual account (simulate external call)
  async create(data: {
    customerName: string;
    email?: string;
    provider: string;
  }) {
    // 🔹 Simulate provider API call (Paystack style)
    // In real setup, this would be an HTTPS call with API key auth
    const accountNumber = '99' + Math.floor(Math.random() * 9000000 + 1000000);
    const bankName = 'Mock Bank (Sandbox)';

    const newAccount = this.virtualAccountRepo.create({
      provider: data.provider,
      accountNumber,
      bankName,
      customerName: data.customerName,
      reference: 'VA-' + Date.now(),
      isActive: true,
    });

    return this.virtualAccountRepo.save(newAccount);
  }

  async findAll() {
    return this.virtualAccountRepo.find();
  }

  async deactivate(id: string) {
    const account = await this.virtualAccountRepo.findOne({ where: { id } });
    if (!account) throw new Error('Account not found');
    account.isActive = false;
    return this.virtualAccountRepo.save(account);
  }

  // Simulate a deposit event (like Paystack webhook)
  async simulateDeposit(data: {
    accountNumber: string;
    amount: number;
    currency: string;
  }) {
    const account = await this.virtualAccountRepo.findOne({
      where: { accountNumber: data.accountNumber, isActive: true },
    });

    if (!account) throw new Error('Account not found or inactive');

    // Create transaction
    const transaction = this.transactionRepo.create({
      account,
      amount: data.amount,
      currency: data.currency,
      reference: 'TRX-' + Date.now(),
      status: 'successful',
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
