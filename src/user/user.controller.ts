import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create user
  @Post()
  @Roles('admin')
  async create(@Body() data: { name: string }) {
    const user = this.userRepo.create({ fullName: data.name });
    return await this.userRepo.save(user);
  }

  // Get all users
  @Get()
  @Roles('admin')
  async findAll() {
    return await this.userRepo.find();
  }
}
