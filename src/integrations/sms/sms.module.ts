import { Module } from '@nestjs/common';
import { SmsService } from '../sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService], // 👈 allows use in other modules (like payments)
})
export class SmsModule {}
