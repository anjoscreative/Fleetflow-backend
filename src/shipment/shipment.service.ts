import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Driver } from '../driver/driver.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  // Utility function to generate a unique reference code
  private generateReferenceCode(): string {
    return 'SHP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createShipment(data: {
    originId: string;
    destinationId: string;
    driverId: string;
    vehicleId: string;
    cargoDescription?: string;
    weight?: number;
  }) {
    const origin = await this.warehouseRepo.findOne({ where: { id: data.originId } });
    const destination = await this.warehouseRepo.findOne({ where: { id: data.destinationId } });
    const driver = await this.driverRepo.findOne({ where: { id: data.driverId }, relations: ['assignedVehicle'] });
    const vehicle = await this.vehicleRepo.findOne({ where: { id: data.vehicleId } });

    if (!origin || !destination) throw new NotFoundException('Invalid warehouses');
    if (!driver) throw new NotFoundException('Driver not found');
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (!driver.assignedVehicle || driver.assignedVehicle.id  !== vehicle.id)
      throw new BadRequestException('Driver not assigned to this vehicle');

    const shipment = this.shipmentRepo.create({
      referenceCode: this.generateReferenceCode(),
      origin,
      destination,
      driver,
      vehicle,
      cargoDescription: data.cargoDescription,
      weight: data.weight,
    });

    return await this.shipmentRepo.save(shipment);
  }

  async findAll() {
    return this.shipmentRepo.find();
  }

  async updateStatus(id: string, status: Shipment['status']) {
    const shipment = await this.shipmentRepo.findOne({ where: { id } });
    if (!shipment) throw new NotFoundException('Shipment not found');
    shipment.status = status;
    return await this.shipmentRepo.save(shipment);
  }
}
