import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async registerDevice(name: string) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const device = this.deviceRepo.create({ name, apiKey });
    return this.deviceRepo.save(device);
  }

  async validateKey(apiKey: string) {
    const device = await this.deviceRepo.findOne({ where: { apiKey } });
    if (!device) {
      throw new UnauthorizedException('Invalid device key');
    }
    return device; // ✅ return the whole device object
  }
}
