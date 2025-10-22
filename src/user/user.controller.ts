import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create user
  @Post()
  async create(@Body() data: { name: string }) {
    const user = this.userRepo.create({ fullName: data.name });
    return await this.userRepo.save(user);
  }

  // Get all users
  @Get()
  async findAll() {
    return await this.userRepo.find();
  }
}
