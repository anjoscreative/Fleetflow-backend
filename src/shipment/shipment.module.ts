import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Shipment } from './shipment.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Driver } from '../driver/driver.entity';
// import { RedisModule } from 'src/redis/redis.module';
// import { ShipmentTrackingService } from './tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, Warehouse, Vehicle, Driver])],
  providers: [ShipmentService],
  controllers: [ShipmentController],
})
export class ShipmentModule {}
