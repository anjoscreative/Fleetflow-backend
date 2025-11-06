// src/hardware/hardware.module.ts
import { Module } from '@nestjs/common';
import { PrintersModule } from './printers/printers.module';
import { ScannersModule } from './scanners/scanners.module';
import { FaceModule } from './face/face.module';

@Module({
  imports: [PrintersModule, ScannersModule, FaceModule],
})
export class HardwareModule {}
