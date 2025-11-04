import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { MessagingModule } from './messaging/messaging.module';
import { HardwareModule } from './hardware/hardware.module';

@Module({
  imports: [PaymentsModule, MessagingModule, HardwareModule],
})
export class IntegrationsModule {}
