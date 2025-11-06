import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { Transfer } from './transfers/transfers.entity';
import { VirtualAccount } from './virtual-accounts/virtual-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer, VirtualAccount]),
    VirtualAccountsModule,
  ],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class PaymentsModule {}
