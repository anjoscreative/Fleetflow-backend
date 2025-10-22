import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  // simple endpoint for uptime checks
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
