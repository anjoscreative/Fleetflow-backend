import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private readonly driverRepo: Repository<Driver>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Create driver profile linked to an existing user
  async create(
    userId: string,
    data: { phone?: string; licenseNumber?: string },
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== 'driver')
      throw new ForbiddenException('User is not registered as a driver');

    const driver = this.driverRepo.create({
      user,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      status: 'available',
    });

    return await this.driverRepo.save(driver);
  }

  // Get all drivers
  async findAll() {
    return this.driverRepo.find({ relations: ['user'] });
  }

  // Update driver status
  async updateStatus(id: string, status: 'available' | 'on_trip' | 'offline') {
    const driver = await this.driverRepo.findOne({ where: { id } });
    if (!driver) throw new NotFoundException('Driver not found');
    driver.status = status;
    return await this.driverRepo.save(driver);
  }
}
