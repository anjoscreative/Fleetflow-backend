import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
  ) {}

  // Create warehouse
  async create(data: { name: string; location: string }) {
    const warehouse = this.warehouseRepo.create(data);
    return await this.warehouseRepo.save(warehouse);
  }

  // Get all warehouses
  async findAll() {
    return this.warehouseRepo.find();
  }

  // Update warehouse status
  async updateStatus(id: string, isActive: boolean) {
    const warehouse = await this.warehouseRepo.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    warehouse.isActive = isActive;
    return await this.warehouseRepo.save(warehouse);
  }
}
