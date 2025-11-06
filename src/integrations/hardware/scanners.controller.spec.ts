import { Test, TestingModule } from '@nestjs/testing';
import { ScannersController } from './scanners.controller';

describe('ScannersController', () => {
  let controller: ScannersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScannersController],
    }).compile();

    controller = module.get<ScannersController>(ScannersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
