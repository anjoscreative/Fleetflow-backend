import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
// import { ShipmentTrackingService } from './tracking.service';

@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShipmentController {
  constructor(
    private readonly shipmentService: ShipmentService,
  ) {}

  // Create a new shipment (Admin only)
  @Post()
  @Roles('admin')
  create(@Body() body: any) {
    return this.shipmentService.createShipment(body);
  }

  // List all shipments
  @Get()
  @Roles('admin')
  findAll() {
    return this.shipmentService.findAll();
  }

  // Update shipment status (Admin or Driver)
  @Patch(':id/status')
  @Roles('admin', 'driver')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.shipmentService.updateStatus(id, body.status as any);
  }

  // // DRIVER updates live location
  // @Patch(':id/location')
  // @Roles('driver')
  // async updateLocation(
  //   @Param('id') id: string,
  //   @Body() body: { lat: number; lng: number },
  // ) {
  //   return this.trackingService.updateLocation(id, body);
  // }

  // // DRIVER or ADMIN views live tracking
  // @Get(':id/tracking')
  // @Roles('admin', 'driver')
  // async getTracking(@Param('id') id: string) {
  //   return this.trackingService.getTracking(id);
  // }
}
