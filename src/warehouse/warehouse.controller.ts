import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  // Create warehouse (Admin only)
  @Post()
  @Roles('admin')
  async create(@Body() body: { name: string; location: string }) {
    return this.warehouseService.create(body);
  }

  // Get all warehouses (Admin only)
  @Get()
  @Roles('admin')
  async findAll() {
    return this.warehouseService.findAll();
  }

  // Activate/deactivate warehouse
  @Patch(':id/status')
  @Roles('admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.warehouseService.updateStatus(id, body.isActive);
  }
}
