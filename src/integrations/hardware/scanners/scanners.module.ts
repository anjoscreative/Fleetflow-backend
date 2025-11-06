// src/hardware/scanners/scanners.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScannedItem } from './scanned-item.entity';
import { ScannersService } from '../scanners.service';
import { ScannersController } from '../scanners.controller';
import { SyncModule } from 'src/sync/sync.module';
import { SecurityModule } from 'src/integrations/security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScannedItem]), SyncModule, SecurityModule],
  providers: [ScannersService],
  controllers: [ScannersController],
  exports: [ScannersService], // 👈 export if you want HardwareModule to use it too
})
export class ScannersModule {}
