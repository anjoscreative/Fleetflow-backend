import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import * as crypto from 'crypto';

@Injectable()
export class DeviceAuthGuard implements CanActivate {
  constructor(private readonly securityService: SecurityService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const apiKey = req.headers['x-device-key'] as string;
    const signature = req.headers['x-signature'] as string;

    // 🧩 Step 1: Ensure device key is present
    if (!apiKey) {
      throw new UnauthorizedException('Missing device key');
    }

    // ✅ Validate and attach the device
    const device = await this.securityService.validateKey(apiKey);
    req.device = device;

    // 🧩 Step 3: Validate request signature (HMAC)
    const bodyString = JSON.stringify(req.body || {});
    const computed = crypto
      .createHmac('sha256', apiKey)
      .update(bodyString)
      .digest('hex');

    if (signature && signature !== computed) {
      throw new UnauthorizedException('Invalid signature');
    }

    // ✅ If everything checks out
    return true;
  }
}
