// src/hardware/face/face.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';
import { DeviceAuthGuard } from '../device-auth.guard';

@Controller('hardware/face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  // 🧍 Register a new user's face
  @UseGuards(DeviceAuthGuard)
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async registerFace(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    return this.faceService.registerFace(name, file);
  }

  // 🔍 Verify a scanned face
  @UseGuards(DeviceAuthGuard)
  @Post('verify')
  @UseInterceptors(FileInterceptor('image'))
  async verifyFace(@UploadedFile() file: Express.Multer.File) {
    return this.faceService.verifyFace(file);
  }
}
