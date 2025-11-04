import { Module } from '@nestjs/common';
import { VirtualAccountsModule } from './virtual-accounts/virtual-accounts.module';

@Module({
  imports: [VirtualAccountsModule]
})
export class PaymentsModule {}
