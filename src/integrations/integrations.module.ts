import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { MessagingModule } from './messaging/messaging.module';
import { HardwareModule } from './hardware/hardware.module';
import { SmsModule } from './sms/sms.module';
import { SmsService } from './sms.service';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { SyncModule } from 'src/sync/sync.module';

@Module({
  imports: [PaymentsModule, MessagingModule, HardwareModule, SmsModule, SecurityModule, SyncModule],
  providers: [SmsService, SecurityService],
  controllers: [SecurityController],
})
export class IntegrationsModule {}
