import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Admin creates vehicle
  @Post()
  @Roles('admin')
  async create(@Body() body: { plateNumber: string; model: string; capacityKg: number }) {
    return this.vehicleService.create(body);
  }

  // Admin fetches all vehicles
  @Get()
  @Roles('admin')
  async findAll() {
    return this.vehicleService.findAll();
  }

  // Admin assigns driver
  @Patch(':vehicleId/assign/:driverId')
  @Roles('admin')
  async assign(@Param('vehicleId') vehicleId: string, @Param('driverId') driverId: string) {
    return this.vehicleService.assignDriver(vehicleId, driverId);
  }

  // Admin unassigns driver
  @Patch(':vehicleId/unassign')
  @Roles('admin')
  async unassign(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.unassignDriver(vehicleId);
  }
}
