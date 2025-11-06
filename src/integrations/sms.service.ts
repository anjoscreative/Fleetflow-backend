import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly baseUrl = process.env.TERMII_BASE_URL!;
  private readonly apiKey = process.env.TERMII_API_KEY;
  private readonly senderId = process.env.TERMII_SENDER_ID;

  // 🔹 Reusable SMS sending method
  async sendSms(to: string, message: string) {
    try {
      const payload = {
        to,
        from: this.senderId,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: this.apiKey,
      };

      const response = await axios.post(this.baseUrl, payload);
      this.logger.log(`SMS sent to ${to}: ${response.data.message}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}`, error.response?.data || error.message);
      throw new Error('SMS sending failed');
    }
  }
}
