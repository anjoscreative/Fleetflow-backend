// src/hardware/scanners/scanners.controller.ts
import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ScannersService } from './scanners.service';
import { DeviceAuthGuard } from '../device-auth.guard';

@Controller('hardware/scanners')
export class ScannersController {
  constructor(private readonly scannersService: ScannersService) {}

  // 🧾 Receive a scan (QR or Barcode)
@UseGuards(DeviceAuthGuard)
@Post('record')
async recordScan(@Body() body, @Req() req) {
  const sourceDevice = req.device?.name || 'Unknown Device';
  const result = await this.scannersService.recordScan({ ...body, sourceDevice });
  return { message: 'Scan recorded successfully', result };
}

  // 🔍 Fetch latest scans
  @Get('recent')
  async getRecent(@Query('limit') limit?: string) {
    return this.scannersService.getRecentScans(Number(limit) || 10);
  }
}
