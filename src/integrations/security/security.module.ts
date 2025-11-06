// src/security/security.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../device.entity'; 
import { SecurityService } from '../security.service';
import { SecurityController } from '../security.controller';
import { DeviceAuthGuard } from '../device-auth.guard';
import { SyncModule } from 'src/sync/sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), SyncModule],
  providers: [SecurityService, DeviceAuthGuard],
  controllers: [SecurityController],
  exports: [TypeOrmModule, SecurityService, DeviceAuthGuard], 
})
export class SecurityModule {}
