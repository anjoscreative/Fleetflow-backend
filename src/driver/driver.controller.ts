import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('driver')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // Create driver (only admin)
  @Post(':userId')
  @Roles('admin')
  async create(
    @Param('userId') userId: string,
    @Body() body: { phone?: string; licenseNumber?: string },
  ) {
    return this.driverService.create(userId, body);
  }

  // Get all drivers (admin)
  @Get()
  @Roles('admin')
  async getAll() {
    return this.driverService.findAll();
  }

  // Update driver status (driver themselves or admin)
  @Patch(':id/status')
  @Roles('admin', 'driver')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'available' | 'on_trip' | 'offline' },
  ) {
    return this.driverService.updateStatus(id, body.status);
  }
}
