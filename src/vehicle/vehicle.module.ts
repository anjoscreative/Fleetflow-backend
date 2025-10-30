import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Driver } from 'src/driver/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Driver])],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
