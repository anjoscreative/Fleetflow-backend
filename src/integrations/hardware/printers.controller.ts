// src/hardware/printers/printers.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { DeviceAuthGuard } from '../device-auth.guard';

@Controller('hardware/printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @UseGuards(DeviceAuthGuard)
  @Post('generate')
  async generateReceipt(@Body() body) {
    const file = await this.printersService.generateReceipt(body);
    return { message: 'Receipt generated successfully', file };
  }
}
