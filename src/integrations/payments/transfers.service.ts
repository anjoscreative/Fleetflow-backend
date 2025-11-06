import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualAccount } from './virtual-accounts/virtual-account.entity';
import { Transfer } from './transfers/transfers.entity';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly accountRepo: Repository<VirtualAccount>,
    @InjectRepository(Transfer)
    private readonly transferRepo: Repository<Transfer>,
  ) {}

  async transferFunds(fromId: string, toId: string, amount: number) {
    const from = await this.accountRepo.findOne({ where: { id: fromId } });
    const to = await this.accountRepo.findOne({ where: { id: toId } });

    if (!from || !to) throw new BadRequestException('Account not found');
    if (from.balance < amount) throw new BadRequestException('Insufficient balance');

    from.balance -= amount;
    to.balance += amount;

    await this.accountRepo.save([from, to]);

    const transfer = this.transferRepo.create({
      fromAccount: from,
      toAccount: to,
      amount,
      status: 'successful',
    });

    return this.transferRepo.save(transfer);
  }
}
