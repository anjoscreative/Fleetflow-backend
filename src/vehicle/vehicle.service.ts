import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Driver } from 'src/driver/driver.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Driver) private readonly driverRepo: Repository<Driver>,
  ) {}

  // Create a new vehicle
  async create(data: {
    plateNumber: string;
    model: string;
    capacityKg: number;
  }) {
    const vehicle = this.vehicleRepo.create(data);
    return await this.vehicleRepo.save(vehicle);
  }

  // List all vehicles
  async findAll() {
    return this.vehicleRepo.find({
      relations: ['assignedDriver', 'assignedDriver.user'],
    });
  }

  // Assign a driver to a vehicle
  async assignDriver(vehicleId: string, driverId: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const driver = await this.driverRepo.findOne({
      where: { id: driverId },
      relations: ['assignedVehicle'],
    });
    if (!driver) throw new NotFoundException('Driver not found');

    vehicle.assignedDriver = driver;
    vehicle.isAvailable = false;
    return await this.vehicleRepo.save(vehicle);
  }

  // Unassign driver and mark vehicle as available
  async unassignDriver(vehicleId: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    vehicle.assignedDriver = null;
    vehicle.isAvailable = true;
    return await this.vehicleRepo.save(vehicle);
  }
}
