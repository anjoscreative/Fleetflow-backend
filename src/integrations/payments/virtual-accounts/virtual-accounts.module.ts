import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualAccountsService } from './virtual-accounts.service';
import { VirtualAccountsController } from './virtual-accounts.controller';
import { VirtualAccount } from './virtual-account.entity';
import { HttpModule } from '@nestjs/axios';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualAccount, Transaction]), HttpModule],
  providers: [VirtualAccountsService],
  controllers: [VirtualAccountsController]
})
export class VirtualAccountsModule {}
