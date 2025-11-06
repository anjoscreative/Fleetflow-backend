// src/integrations/security/security.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SyncService } from 'src/sync/sync.service';

@Controller('integrations/security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly syncService: SyncService, 
  ) {}

  // Register a new device
  @Post('register-device')
  async registerDevice(@Body('name') name: string) {
    return this.securityService.registerDevice(name);
  }

  //  Check the size of a Redis queue (e.g., scan-queue)
  @Get('queue-size')
  async getQueueSize(@Query('queue') queue: string) {
    const size = await this.syncService.queueSize(queue);
    return { queue, size };
  }
}
